/* ═══════════════════════════════════════════════════════════════════════════
   زاد — قارئ المصحف (الواجهة)
   ─────────────────────────────────────────────────────────────────────────
   ثلاث طرق للقراءة على نفس البيانات المحلية:
     • مصحف  : صفحة كاملة بنصّ عثماني متّصل ووردة رقم الآية.
     • آية   : بطاقة لكل آية — أوضح على الموبايل وأسهل في الحفظ.
     • تفسير : الآية + التفسير الميسّر تحتها مباشرة.

   كل شيء يعمل أوفلاين بعد أول تحميل، والمصدر داخل الموقع نفسه
   (js/data/quran, js/data/tafsir) — لا API ولا حساب ولا تتبّع.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var QS = window.QuranStore;
  var AR = function (n) { return String(n).replace(/\d/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }); };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ── تفضيلات ─────────────────────────────────────────────────────────── */
  var PREFS_KEY = 'zad_quran_prefs';
  var PREFS = (function () {
    var def = { size: 26, lh: 2.55, mode: 'mushaf', night: false };
    try {
      var v = JSON.parse(localStorage.getItem(PREFS_KEY) || 'null');
      if (v && typeof v === 'object') return Object.assign(def, v);
    } catch (e) {}
    return def;
  })();
  function savePrefs() {
    try { localStorage.setItem(PREFS_KEY, JSON.stringify(PREFS)); } catch (e) {}
  }

  var state = {
    page: 1, data: null, meta: null, mode: PREFS.mode || 'mushaf',
    busy: false, wird: null, tafsirCache: {}, searchLoaded: false,
    searchIndex: null, searchNorm: null
  };

  var els = {};
  function cacheEls() {
    els.stage = $('#mq-stage');
    els.surah = $('#mq-loc-surah');
    els.juz = $('#mq-loc-juz');
    els.page = $('#mq-pp');
    els.prev = $('#mq-prev');
    els.next = $('#mq-next');
    els.wird = $('#mq-wird');
    els.wirdFill = $('#mq-wird-fill');
    els.wirdTxt = $('#mq-wird-txt');
    els.resume = $('#mq-resume');
    els.sheet = $('#mq-sheet');
    els.sheetBody = $('#mq-sheet-body');
    els.sheetTitle = $('#mq-sheet-title');
    els.sheetSub = $('#mq-sheet-sub');
    els.toast = $('#mq-toast');
    els.modes = $$('.mq-mode');
    els.player = $('#mq-player');
    els.plRef = $('#mq-pl-ref');
    els.plRec = $('#mq-pl-rec');
    els.plLoop = $('#mq-pl-loop');
    els.plProg = $('#mq-pl-prog');
  }

  /* ── أدوات صغيرة ─────────────────────────────────────────────────────── */
  var _toastTimer = null;
  function toast(msg) {
    if (!els.toast) return;
    els.toast.textContent = msg;
    els.toast.classList.add('on');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(function () { els.toast.classList.remove('on'); }, 2200);
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function copyText(txt) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(txt).then(function () { return true; }).catch(function () { return legacyCopy(txt); });
    }
    return Promise.resolve(legacyCopy(txt));
  }
  function legacyCopy(txt) {
    var ta = document.createElement('textarea');
    ta.value = txt;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:-9999px;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    return ok;
  }

  function share(text) {
    var data = { title: 'القرآن الكريم — زاد', text: text };
    if (navigator.share) {
      return navigator.share(data).then(function () { return true; }).catch(function (e) {
        if (e && e.name === 'AbortError') return true;
        return copyText(text).then(function () { toast('نُسخت الآية'); return true; });
      });
    }
    return copyText(text).then(function () { toast('نُسخت الآية — شاركها حيث تشاء'); return true; });
  }

  function surahName(n) {
    var s = state.meta && state.meta.surahs[n - 1];
    return s ? s.name : '';
  }

  function isSajda(s, a) {
    if (!state.meta || !state.meta.sajda) return false;
    for (var i = 0; i < state.meta.sajda.length; i++) {
      var p = state.meta.sajda[i];
      if (p[0] === s && p[1] === a) return true;
    }
    return false;
  }

  /* ── الرسم ───────────────────────────────────────────────────────────── */
  function pageCard(inner, pageNo, head) {
    return '<article class="mq-paper" data-page="' + pageNo + '">' +
      '<div class="mq-runhead">' + head + '</div>' +
      inner +
      '<div class="mq-seal-line"><span class="mq-seal" aria-label="صفحة ' + AR(pageNo) + '">' + AR(pageNo) + '</span></div>' +
      '</article>';
  }

  function runHead(groups, pageNo) {
    var first = groups[0];
    var starts = first.rows[0][1] === 1;
    var juz = state.data ? state.data.juz : 1;
    var right = starts ? ('الجزء ' + AR(juz)) : ('سُورَةُ ' + esc(surahName(first.s)));
    return '<span class="mq-run-surah">' + right + '</span>' +
      '<span class="mq-run-mid" aria-hidden="true">❖</span>' +
      '<span class="mq-run-juz">صفحة ' + AR(pageNo) + '</span>';
  }

  function surahBand(meta) {
    return '<div class="mq-band">' +
      '<div class="mq-band-name">سُورَةُ ' + esc(meta.name) + '</div>' +
      '<div class="mq-band-meta">' + esc(meta.type) + ' · ' + AR(meta.ayahs) + ' آية</div>' +
      '</div>';
  }

  function basmala() {
    return '<div class="mq-basmala" aria-label="بسم الله الرحمن الرحيم"><span class="mq-b-orn" aria-hidden="true"></span>' +
      'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ' +
      '<span class="mq-b-orn" aria-hidden="true"></span></div>';
  }

  function rosette(n) {
    return '<span class="mq-rose" aria-hidden="true">' + AR(n) + '</span>';
  }

  function ayahSpan(row) {
    var s = row[0], a = row[1], t = row[3];
    return '<span class="mq-a" data-s="' + s + '" data-a="' + a + '" tabindex="0" role="button" ' +
      'aria-label="الآية ' + a + ' من سورة ' + surahName(s) + '">' +
      t + ' ' + rosette(a) + (isSajda(s, a) ? '<span class="mq-sajda" title="آية سجدة">۩</span>' : '') +
      ' </span>';
  }

  function groupBySurah(ayahs) {
    var out = [], cur = null;
    ayahs.forEach(function (r) {
      if (!cur || cur.s !== r[0]) { cur = { s: r[0], rows: [] }; out.push(cur); }
      cur.rows.push(r);
    });
    return out;
  }

  function renderMushaf() {
    var d = state.data;
    var groups = groupBySurah(d.ayahs);
    var body = groups.map(function (g) {
      var meta = state.meta.surahs[g.s - 1];
      var html = '';
      if (g.rows[0][1] === 1) {
        html += surahBand(meta);
        if (g.s !== 1 && g.s !== 9) html += basmala();
      }
      html += '<div class="mq-flow">' + g.rows.map(ayahSpan).join('') + '</div>';
      return html;
    }).join('');
    return pageCard(body, d.page, runHead(groups, d.page));
  }

  function renderAyahCards(withTafsir) {
    var d = state.data;
    var groups = groupBySurah(d.ayahs);
    var body = '';
    groups.forEach(function (g) {
      var meta = state.meta.surahs[g.s - 1];
      if (g.rows[0][1] === 1) body += surahBand(meta);
      body += g.rows.map(function (r) {
        return '<article class="mq-card" data-s="' + r[0] + '" data-a="' + r[1] + '" tabindex="0" role="button" ' +
          'aria-label="الآية ' + r[1] + ' من سورة ' + esc(meta.name) + '">' +
          '<header class="mq-card-hd"><span class="mq-cnum">' + AR(r[1]) + '</span>' +
          '<span class="mq-csurah">' + esc(meta.name) + '</span>' +
          (isSajda(r[0], r[1]) ? '<span class="mq-ctag">سجدة</span>' : '') +
          '<span class="mq-cpage">ص ' + AR(r[2]) + '</span>' +
          '<button class="mq-play" data-act="play-ayah" data-s="' + r[0] + '" data-a="' + r[1] + '" aria-label="تشغيل الآية"></button></header>' +
          '<p class="mq-ctext">' + wordify(r[3], r[0], r[1]) + '</p>' +
          (withTafsir ? '<div class="mq-taf" data-need="' + r[0] + '" data-ayah="' + r[1] + '">' +
            '<div class="mq-skel"><i></i><i></i><i></i></div></div>' : '') +
          '</article>';
      }).join('');
    });
    return pageCard(body, d.page, runHead(groups, d.page));
  }

  function render() {
    if (!state.data) return;
    var html;
    if (state.mode === 'mushaf') html = renderMushaf();
    else if (state.mode === 'ayah') html = renderAyahCards(false);
    else html = renderAyahCards(true);

    els.stage.innerHTML = html;
    els.stage.classList.remove('mq-enter');
    void els.stage.offsetWidth;
    els.stage.classList.add('mq-enter');

    var seen = [], ayahs = state.data.ayahs;
    for (var i = 0; i < ayahs.length; i++) {
      var nm = surahName(ayahs[i][0]);
      if (seen.indexOf(nm) < 0) seen.push(nm);
    }
    els.surah.textContent = seen.length > 2 ? seen[0] + ' …' : seen.join(' · ');
    els.juz.textContent = 'الجزء ' + AR(state.data.juz);
    els.page.textContent = AR(state.data.page);
    els.prev.disabled = state.data.page <= 1;
    els.next.disabled = state.data.page >= 604;

    if (state.mode === 'tafsir') fillTafsir();
    updateWird();
  }

  /* ── التفسير ─────────────────────────────────────────────────────────── */
  function tafsirFor(s) {
    if (state.tafsirCache[s]) return Promise.resolve(state.tafsirCache[s]);
    return QS.tafsir(s).then(function (t) { state.tafsirCache[s] = t; return t; });
  }

  function fillTafsir() {
    var needs = {};
    $$('.mq-taf[data-need]', els.stage).forEach(function (el) { needs[el.getAttribute('data-need')] = true; });
    Object.keys(needs).forEach(function (s) {
      tafsirFor(+s).then(function (t) {
        $$('.mq-taf[data-need="' + s + '"]', els.stage).forEach(function (el) {
          var a = el.getAttribute('data-ayah');
          var txt = (t.a && t.a[a]) || '';
          if (!txt) { el.innerHTML = '<div class="mq-taf-empty">لا يوجد تفسير لهذه الآية في الميسّر.</div>'; return; }
          el.innerHTML = '<div class="mq-taf-hd"><span class="mq-taf-src">التفسير الميسّر</span></div>' +
            '<div class="mq-taf-txt">' + tafHTML(txt) + '</div>';
        });
      }).catch(function () {
        $$('.mq-taf[data-need="' + s + '"]', els.stage).forEach(function (el) {
          el.innerHTML = '<div class="mq-taf-empty">التفسير غير محمّل. <button class="mq-link" data-act="open-lib">حمّله من المكتبة</button></div>';
        });
      });
    });
  }

  /* ﴿...﴾ → آية مقتبسة بتنسيق ذهبي، والأسطر الجديدة فقرات */
  function tafHTML(t) {
    var out = esc(t).replace(/﴿([^﴾]*)﴾/g, '<span class="mq-quote">﴿$1﴾</span>');
    return out.split(/\n{2,}/).map(function (p) { return '<p>' + p.replace(/\n/g, '<br>') + '</p>'; }).join('');
  }

  /* ── التنقّل ─────────────────────────────────────────────────────────── */
  function goPage(p, opts) {
    opts = opts || {};
    p = Math.max(1, Math.min(604, parseInt(p, 10) || 1));
    if (state.busy && !opts.force) return Promise.resolve();
    state.page = p;
    state.busy = true;
    els.stage.innerHTML = skeleton();
    els.stage.classList.remove('mq-enter');

    return QS.page(p).then(function (d) {
      if (!state.meta) state.meta = d.meta;
      state.data = d;
      state.busy = false;
      render();
      if (opts.scroll !== false) {
        var scr = document.scrollingElement || document.documentElement;
        if (scr) window.scrollTo({ top: 0, behavior: opts.initial ? 'auto' : 'smooth' });
      }
      saveLastRead(d);
      if (opts.history !== false) {
        try {
          var url = location.pathname + '?page=' + p;
          history.replaceState(null, '', url);
        } catch (e) {}
      }
      /* تحميل مسبق للجزء المجاور — تنقّل فوري */
      if (!opts.initial) {
        setTimeout(function () {
          var j = d.juz;
          QS.juz(j + 1).catch(function () {});
          if (j > 1) QS.juz(j - 1).catch(function () {});
        }, 600);
      }
      return d;
    }).catch(function (err) {
      state.busy = false;
      renderError(err);
    });
  }

  function skeleton() {
    var lines = '';
    for (var i = 0; i < 8; i++) lines += '<span style="width:' + (72 + ((i * 7) % 26)) + '%"></span>';
    return '<div class="mq-paper mq-skel-paper"><div class="mq-runhead"><span class="mq-run-surah">…</span></div>' +
      '<div class="mq-skel-lines">' + lines + '</div></div>';
  }

  function renderError(err) {
    var offline = !navigator.onLine;
    els.stage.innerHTML =
      '<div class="mq-paper mq-errcard">' +
      '<div class="mq-err-ico">' + (offline ? '<i class="mq-mi" data-i="offline" aria-hidden="true"></i>' : '<i class="mq-mi" data-i="warn" aria-hidden="true"></i>') + '</div>' +
      '<h3>' + (offline ? 'هذه الصفحة غير محمّلة على جهازك' : 'تعذّر تحميل الصفحة') + '</h3>' +
      '<p>' + (offline ? 'نزّل نصّ القرآن كاملًا مرة واحدة (١٫٤ م.ب) واقرأ في أي مكان.' : 'تحقّق من الاتصال ثم أعد المحاولة — أو حمّل النص للقراءة دائمًا بلا إنترنت.') + '</p>' +
      '<div class="mq-err-acts">' +
      '<button class="mq-btn solid" data-act="retry">إعادة المحاولة</button>' +
      '<button class="mq-btn" data-act="open-lib">المكتبة</button>' +
      '</div></div>';
  }

  /* ── آخر قراءة ──────────────────────────────────────────────────────── */
  var LAST_KEY = 'zad_quran_last';
  function saveLastRead(d) {
    if (!d || !d.ayahs.length) return;
    var f = d.ayahs[0];
    try {
      localStorage.setItem(LAST_KEY, JSON.stringify({ s: f[0], a: f[1], p: d.page, ts: Date.now() }));
    } catch (e) {}
  }
  function lastRead() {
    try { return JSON.parse(localStorage.getItem(LAST_KEY) || 'null'); } catch (e) { return null; }
  }
  function showResume() {
    var lr = lastRead();
    if (!lr || !els.resume) return;
    if (state.page === lr.p) return;
    els.resume.hidden = false;
    els.resume.innerHTML = '<button class="mq-resume-btn" data-act="resume">' +
      '<span class="mq-resume-ico">↩</span>' +
      '<span><b>كمّل من حيث وقفت</b><small>' + esc(surahName(lr.s)) + ' · صفحة ' + AR(lr.p) + '</small></span>' +
      '<span class="mq-resume-go">فتح</span></button>';
  }
  function hideResume() { if (els.resume) { els.resume.hidden = true; els.resume.innerHTML = ''; } }

  /* ── الورد ──────────────────────────────────────────────────────────── */
  function updateWird() {
    if (!state.wird || !els.wird) return;
    var w = state.wird, p = state.page;
    if (p < w.from || p > w.to) { els.wird.hidden = true; return; }
    els.wird.hidden = false;
    var pct = Math.round((p - w.from + 1) / (w.to - w.from + 1) * 100);
    els.wirdFill.style.width = Math.max(4, pct) + '%';
    els.wirdTxt.textContent = 'ورد اليوم · ' + AR(pct) + '٪ · صفحة ' + AR(p) + ' من ' + AR(w.to);
  }

  /* ── الشيت (لوحة سفلية) ─────────────────────────────────────────────── */
  var sheetStack = [];
  function openSheet(opts) {
    var html = typeof opts === 'string' ? opts : opts.html;
    var title = typeof opts === 'string' ? '' : (opts.title || '');
    var sub = typeof opts === 'string' ? '' : (opts.sub || '');
    els.sheetTitle.innerHTML = title;
    els.sheetSub.textContent = sub;
    els.sheetTitle.parentNode.style.display = title ? '' : 'none';
    els.sheetBody.innerHTML = html;
    els.sheet.classList.add('on');
    els.sheet.setAttribute('aria-hidden', 'false');
    document.body.classList.add('mq-lock');
    els.sheet.querySelector('.mq-sheet-in').scrollTop = 0;
    setTimeout(function () {
      var f = els.sheetBody.querySelector('[autofocus], input, button');
      if (f) { try { f.focus({ preventScroll: true }); } catch (e) {} }
    }, 60);
    if (opts.push !== false) sheetStack.push(opts.id || 'x');
  }
  function closeSheet() {
    els.sheet.classList.remove('on');
    els.sheet.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('mq-lock');
    sheetStack = [];
  }
  function sheetOpen() { return els.sheet.classList.contains('on'); }

  /* ── آية: النسخة الكاملة ───────────────────────────────────────────── */
  function ayahRow(s, a) {
    var ayahs = state.data ? state.data.ayahs : [];
    for (var i = 0; i < ayahs.length; i++) if (ayahs[i][0] === s && ayahs[i][1] === a) return ayahs[i];
    return null;
  }

  /* ══ التلاوة ═══════════════════════════════════════════════════════ */
  var QA = window.QuranAudio;

  function pageList() {
    return (state.data ? state.data.ayahs : []).map(function (r) { return [r[0], r[1]]; });
  }

  function playAyah(s, a) {
    if (!QA) { toast('المشغّل غير متاح'); return; }
    var list = pageList();
    var inPage = false;
    for (var i = 0; i < list.length; i++) if (list[i][0] === s && list[i][1] === a) inPage = true;
    QA.play(s, a, inPage ? list : [[s, a]]);
  }

  function markPlaying(s, a) {
    $$('.mq-a.is-playing, .mq-card.is-playing').forEach(function (e) { e.classList.remove('is-playing'); });
    if (!s) return;
    var el = document.querySelector('.mq-a[data-s="' + s + '"][data-a="' + a + '"]') ||
      document.querySelector('.mq-card[data-s="' + s + '"][data-a="' + a + '"]');
    if (!el) return;
    el.classList.add('is-playing');
    try { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) {}
  }

  function playerState(st) {
    if (!els.player) return;
    var on = !!(st.playing || st.loading || st.active);
    els.player.hidden = !on;
    els.player.classList.toggle('is-playing', !!st.playing);
    document.body.classList.toggle('mq-player-on', on);
    if (!on) {
      if (els.plProg) els.plProg.style.width = '0';
      markPlaying(0, 0);
      return;
    }
    if (els.plRef) els.plRef.textContent = 'الآية ' + AR(st.a) + ' · ' + surahName(st.s);
    if (els.plRec) els.plRec.textContent = st.reciterName + (st.count > 1 ? ' · ' + AR(st.index + 1) + '/' + AR(st.count) : '');
    var lp = $('.mq-loop-row');
    if (lp) { lp.classList.toggle('on', !!st.loop); lp.setAttribute('aria-pressed', st.loop ? 'true' : 'false'); }
    var tg = $('#mq-pl-toggle');
    if (tg) tg.setAttribute('aria-label', st.playing ? 'إيقاف مؤقت' : 'تشغيل');
  }

  function audioEnd() {
    if (state.page >= 604) { toast('تمّت تلاوة الصفحة'); return; }
    goPage(state.page + 1).then(function () {
      var list = pageList();
      if (list.length && QA) QA.playList(list);
    });
  }

  function openAudio() {
    if (!QA) return;
    var st = QA.state();
    var chips = QA.RECITERS.map(function (r) {
      return '<button class="mq-rec' + (r.id === st.reciter ? ' on' : '') + '" data-act="rec" data-rec="' + r.id + '">' +
        esc(r.name) + '</button>';
    }).join('');
    var html =
      '<div class="mq-lbl">القارئ</div><div class="mq-recs">' + chips + '</div>' +
      '<div class="mq-lbl">التشغيل</div>' +
      '<button class="mq-loop-row' + (st.loop ? ' on' : '') + '" data-act="loop" aria-pressed="' + (st.loop ? 'true' : 'false') + '">' +
        '<span>تكرار الآية الحالية</span><i class="mq-sw" aria-hidden="true"></i></button>' +
      '<div class="mq-lbl">الصوت على جهازك</div>' +
      '<div class="mq-audio-box">' +
        '<b>صوت الصفحة الحالية</b>' +
        '<small id="mq-aud-info">جارٍ الحساب…</small>' +
      '</div>' +
      '<div class="mq-acts mq-acts-3">' +
        '<button class="mq-act" data-act="dl-audio"><i class="mq-ai" aria-hidden="true"></i>تحميل</button>' +
        '<button class="mq-act" data-act="stop-audio"><i class="mq-ai" aria-hidden="true"></i>إيقاف</button>' +
        '<button class="mq-act" data-act="wipe-audio"><i class="mq-ai" aria-hidden="true"></i>مسح</button>' +
      '</div>' +
      '<div class="mq-libnote">كل آية تسمعها تُحفظ تلقائيًا وتعمل بلا إنترنت. «تحميل» ينزّل صوت الصفحة الحالية كاملة.</div>';
    openSheet({ id: 'audio', title: 'التلاوة', sub: 'صوت الآيات — يعمل أوفلاين', html: html });
    refreshAudioInfo();
  }

  function refreshAudioInfo() {
    var box = $('#mq-aud-info');
    if (!box || !QA) return;
    QA.stats().then(function (s) {
      box.textContent = s.count ? (AR(s.count) + ' آية محفوظة' + (s.bytes ? ' · ' + fmtSize(s.bytes) : '')) : 'لا صوتيات محفوظة بعد';
    });
  }

  /* ══ كلمة بكلمة ═════════════════════════════════════════════════════ */
  var wordsIndex = null, wordsPromise = null;

  function loadWords() {
    if (wordsIndex) return Promise.resolve(wordsIndex);
    if (wordsPromise) return wordsPromise;
    wordsPromise = fetch('js/data/quran/words.json').then(function (r) { return r.json(); })
      .then(function (d) { wordsIndex = d.w || {}; return wordsIndex; });
    return wordsPromise;
  }

  function wordify(text, s, a) {
    return String(text).split(/\s+/).filter(Boolean).map(function (w) {
      return '<span class="mq-w" role="button" tabindex="0" data-w="' + esc(norm(w)) + '" data-s="' + s + '" data-a="' + a + '">' + w + '</span>';
    }).join(' ');
  }

  function openWord(w, s, a) {
    if (!w) return;
    var raw = '';
    var row = ayahRow(s, a);
    if (row) {
      var parts = row[3].split(/\s+/);
      for (var i = 0; i < parts.length; i++) if (norm(parts[i]) === w) { raw = parts[i]; break; }
    }
    var html =
      '<div class="mq-word"><b>' + esc(raw || w) + '</b><small>سورة ' + esc(surahName(s)) + ' · الآية ' + AR(a) + '</small></div>' +
      '<div class="mq-stats" id="mq-word-stats">' +
        '<div class="mq-stat"><b>…</b><small>مرة في القرآن</small></div>' +
        '<div class="mq-stat"><b>…</b><small>أول موضع</small></div>' +
      '</div>' +
      '<div class="mq-acts">' +
        '<button class="mq-act" data-act="word-play"><i class="mq-ai" aria-hidden="true"></i>اسمع</button>' +
        '<button class="mq-act" data-act="word-search" data-q="' + esc(w) + '"><i class="mq-ai" aria-hidden="true"></i>ابحث</button>' +
        '<button class="mq-act" data-act="word-copy" data-q="' + esc(raw || w) + '"><i class="mq-ai" aria-hidden="true"></i>نسخ</button>' +
        '<button class="mq-act" data-act="word-back"><i class="mq-ai" aria-hidden="true"></i>رجوع</button>' +
      '</div>' +
      '<div class="mq-libnote">اضغط أي كلمة في الآيات لمعرفة تكرارها وموضعها الأول.</div>';
    openSheet({ id: 'word', title: 'كلمة', sub: surahName(s) + ' · ' + AR(a), html: html });
    els.sheetBody.setAttribute('data-s', s);
    els.sheetBody.setAttribute('data-a', a);

    loadWords().then(function (idx) {
      var rec = idx[w];
      var box = $('#mq-word-stats');
      if (!box) return;
      if (!rec) {
        box.innerHTML = '<div class="mq-stat" style="grid-column:1/-1"><b>—</b><small>ليست في فهرس الكلمات</small></div>';
        return;
      }
      box.innerHTML =
        '<div class="mq-stat"><b>' + AR(rec[0]) + '</b><small>مرة في القرآن</small></div>' +
        '<div class="mq-stat"><b>' + esc(surahName(rec[1])) + ' ' + AR(rec[2]) + '</b><small>أول موضع</small></div>';
    }).catch(function () {
      var box = $('#mq-word-stats');
      if (box) box.innerHTML = '<div class="mq-stat" style="grid-column:1/-1"><b>—</b><small>تعذّر تحميل الفهرس</small></div>';
    });
  }

  function openAyah(s, a) {
    var row = ayahRow(s, a);
    var text = row ? row[3] : '';
    var saved = isAyahSaved(s, a);
    var html =
      '<div class="mq-verse">' + (text ? wordify(text, s, a) : '…') + ' ' + rosette(a) + '</div>' +
      '<div class="mq-acts">' +
      '<button class="mq-act" data-act="play-ayah" data-s="' + s + '" data-a="' + a + '"><i class="mq-ai" aria-hidden="true"></i>تشغيل</button>' +
      '<button class="mq-act" data-act="copy"><i class="mq-ai" aria-hidden="true"></i>نسخ</button>' +
      '<button class="mq-act" data-act="share"><i class="mq-ai" aria-hidden="true"></i>مشاركة</button>' +
      '<button class="mq-act' + (saved ? ' on' : '') + '" data-act="bm-ayah"><i class="mq-ai" aria-hidden="true"></i>' + (saved ? 'محفوظة' : 'حفظ') + '</button>' +
      '<button class="mq-act" data-act="open-page"><i class="mq-ai" aria-hidden="true"></i>الصفحة</button>' +
      '</div>' +
      '<div class="mq-tafwrap" id="mq-sh-taf"><div class="mq-skel"><i></i><i></i><i></i><i></i></div></div>';

    openSheet({
      id: 'ayah',
      title: 'الآية ' + AR(a) + ' · سورة ' + esc(surahName(s)),
      sub: 'التفسير الميسّر',
      html: html
    });
    els.sheetBody.setAttribute('data-s', s);
    els.sheetBody.setAttribute('data-a', a);

    tafsirFor(s).then(function (t) {
      var box = $('#mq-sh-taf');
      if (!box) return;
      var txt = (t.a && t.a[a]) || '';
      var intro = (a === 1 && t.intro) ? '<details class="mq-intro"><summary>تعريف السورة</summary><div class="mq-taf-txt">' + tafHTML(t.intro) + '</div></details>' : '';
      box.innerHTML = intro + (txt
        ? '<div class="mq-taf-hd"><span class="mq-taf-src">الميسّر</span><span class="mq-taf-note">تفسير معتمد — بلا تصرّف</span></div><div class="mq-taf-txt">' + tafHTML(txt) + '</div>'
        : '<div class="mq-taf-empty">لا يوجد تفسير لهذه الآية.</div>');
    }).catch(function () {
      var box = $('#mq-sh-taf');
      if (box) box.innerHTML = '<div class="mq-taf-empty">التفسير غير محمّل — يحتاج اتصالًا أول مرة.<br><button class="mq-link" data-act="open-lib">افتح المكتبة</button></div>';
    });
  }

  /* ── المحفوظات ──────────────────────────────────────────────────────── */
  var BM_KEY = 'zad_quran_bm';
  var BM_PAGE_KEY = 'zad_mushaf_bm';
  function bookmarks() {
    try { return JSON.parse(localStorage.getItem(BM_KEY) || '[]') || []; } catch (e) { return []; }
  }
  function setBookmarks(list) {
    try { localStorage.setItem(BM_KEY, JSON.stringify(list)); } catch (e) {}
    syncBmBtn();
  }
  function isAyahSaved(s, a) {
    return bookmarks().some(function (b) { return b.s === s && b.a === a; });
  }
  function toggleAyahBm(s, a) {
    var list = bookmarks();
    var i = list.findIndex(function (b) { return b.s === s && b.a === a; });
    if (i > -1) { list.splice(i, 1); toast('أُزيلت من المحفوظات'); }
    else {
      var row = ayahRow(s, a);
      list.unshift({ s: s, a: a, p: state.page, t: row ? row[3] : '', ts: Date.now() });
      toast('حُفظت الآية');
    }
    setBookmarks(list);
    return i === -1;
  }
  function pageBookmarks() {
    try { return JSON.parse(localStorage.getItem(BM_PAGE_KEY) || '[]') || []; } catch (e) { return []; }
  }
  function togglePageBm() {
    var list = pageBookmarks();
    var i = list.findIndex(function (b) { return b.p === state.page; });
    if (i > -1) { list.splice(i, 1); toast('أُزيلت الإشارة'); }
    else { list.unshift({ p: state.page, s: surahName(state.data.ayahs[0][0]), j: state.data.juz, d: new Date().toLocaleDateString('ar-EG') }); toast('أُشير إلى الصفحة'); }
    try { localStorage.setItem(BM_PAGE_KEY, JSON.stringify(list)); } catch (e) {}
    syncBmBtn();
  }
  function syncBmBtn() {
    var on = pageBookmarks().some(function (b) { return b.p === state.page; });
    var btn = $('#mq-bm');
    if (btn) btn.classList.toggle('on', on);
  }

  function openBookmarks() {
    var ay = bookmarks();
    var pg = pageBookmarks();
    var html = '';
    if (!ay.length && !pg.length) {
      html = '<div class="mq-empty"><div class="mq-empty-ico"><i class="mq-mi" data-i="bookmark" aria-hidden="true"></i></div><p>لا محفوظات بعد.</p>' +
        '<small>اضغط على أي آية ثم «حفظ»، أو زر الإشارة لحفظ الصفحة.</small></div>';
    } else {
      if (ay.length) {
        html += '<div class="mq-sec-title">آيات محفوظة <span>' + AR(ay.length) + '</span></div>';
        html += ay.map(function (b) {
          return '<button class="mq-row mq-row-ayah" data-act="goto-ayah" data-s="' + b.s + '" data-a="' + b.a + '">' +
            '<span class="mq-row-num">' + AR(b.a) + '</span>' +
            '<span class="mq-row-main"><b>' + esc(surahName(b.s)) + '</b><small>' + esc((b.t || '').slice(0, 70)) + '…</small></span>' +
            '<span class="mq-row-side">ص ' + AR(b.p) + '</span></button>';
        }).join('');
      }
      if (pg.length) {
        html += '<div class="mq-sec-title">صفحات مُشارة <span>' + AR(pg.length) + '</span></div>';
        html += pg.map(function (b) {
          return '<button class="mq-row" data-act="goto-page" data-p="' + b.p + '">' +
            '<span class="mq-row-num">' + AR(b.p) + '</span>' +
            '<span class="mq-row-main"><b>' + esc(b.s || '') + '</b><small>الجزء ' + AR(b.j || 1) + '</small></span>' +
            '<span class="mq-row-side">فتح</span></button>';
        }).join('');
      }
    }
    openSheet({ id: 'bm', title: 'المحفوظات', sub: 'آيات وصفحات', html: html });
  }

  /* ── فهرس السور ─────────────────────────────────────────────────────── */
  function openIndex() {
    var html = '<div class="mq-searchbox"><input id="mq-idx-q" type="search" placeholder="ابحث باسم السورة أو رقمها…" autofocus aria-label="ابحث عن سورة"></div>' +
      '<div class="mq-idx" id="mq-idx-list"></div>';
    openSheet({ id: 'index', title: 'فهرس السور', sub: '١١٤ سورة', html: html });
    renderIndex('');
    var inp = $('#mq-idx-q');
    if (inp) inp.addEventListener('input', function () { renderIndex(this.value); });
  }

  function renderIndex(q) {
    var box = $('#mq-idx-list');
    if (!box || !state.meta) return;
    q = (q || '').trim();
    var norm = function (x) { return x.replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي'); };
    var rows = state.meta.surahs.filter(function (s) {
      if (!q) return true;
      return norm(s.name).indexOf(norm(q)) > -1 || String(s.n) === q || AR(s.n) === q;
    });
    if (!rows.length) { box.innerHTML = '<div class="mq-empty small">لا سورة بهذا الاسم.</div>'; return; }
    box.innerHTML = rows.map(function (s) {
      return '<button class="mq-srow" data-act="goto-surah" data-n="' + s.n + '">' +
        '<span class="mq-snum">' + AR(s.n) + '</span>' +
        '<span class="mq-smain"><b>سورة ' + esc(s.name) + '</b>' +
        '<small>' + esc(s.type) + ' · ' + AR(s.ayahs) + ' آية</small></span>' +
        '<span class="mq-smeta">ص ' + AR(s.page) + '</span></button>';
    }).join('');
  }

  /* ── الأجزاء ────────────────────────────────────────────────────────── */
  function openJuz() {
    var html = '<div class="mq-juzgrid">';
    for (var j = 1; j <= 30; j++) {
      html += '<button class="mq-juzcell" data-act="goto-juz" data-j="' + j + '"><b>' + AR(j) + '</b><small>الجزء</small></button>';
    }
    html += '</div>';
    openSheet({ id: 'juz', title: 'الأجزاء', sub: '٣٠ جزءًا', html: html });
  }

  /* ── البحث ──────────────────────────────────────────────────────────── */
  var DIAC = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g;
  function norm(t) {
    return t.replace(DIAC, '')
      .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
      .replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').replace(/ء/g, '')
      .replace(/\s+/g, ' ').trim();
  }
  function flexRe(q) {
    var words = q.trim().split(/\s+/).filter(Boolean);
    var parts = words.map(function (w) {
      var out = '';
      for (var i = 0; i < w.length; i++) {
        var ch = w[i], cls;
        if ('اأإآٱ'.indexOf(ch) > -1) cls = '[اأإآٱ]';
        else if (ch === 'ى' || ch === 'ي') cls = '[ىي]';
        else if (ch === 'ة' || ch === 'ه') cls = '[ةه]';
        else if (ch === 'ؤ') cls = '[ؤو]';
        else if (ch === 'ئ') cls = '[ئي]';
        else cls = ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        out += cls + '[\\u0610-\\u061A\\u064B-\\u065F\\u0670\\u06D6-\\u06ED\\u0640]*';
      }
      return out;
    });
    try { return new RegExp('(' + parts.join('\\s+') + ')', 'g'); } catch (e) { return null; }
  }

  function openSearch(prefill) {
    var html = '<div class="mq-searchbox"><input id="mq-s-q" type="search" placeholder="ابحث في القرآن كلّه…" autofocus aria-label="ابحث في القرآن">' +
      '<button class="mq-search-go" data-act="do-search">بحث</button></div>' +
      '<div class="mq-search-state" id="mq-s-state">جارٍ تجهيز الفهرس…</div>' +
      '<div class="mq-results" id="mq-s-res"></div>';
    openSheet({ id: 'search', title: 'بحث في القرآن', sub: '٦٢٣٦ آية — أوفلاين', html: html });

    var s = $('#mq-s-state');
    QS.searchIndex().then(function (idx) {
      state.searchIndex = idx;
      if (!state.searchNorm) state.searchNorm = idx.map(function (r) { return norm(r[3]); });
      state.searchLoaded = true;
      s.textContent = 'اكتب كلمة أو أكثر — النتائج فورية.';
      s.classList.add('ok');
      if (prefill) doSearch(prefill);
    }).catch(function () {
      s.textContent = 'تعذّر تحميل فهرس البحث — يحتاج اتصالًا أول مرة (١٫٤ م.ب).';
    });

    var inp = $('#mq-s-q');
    if (prefill) inp.value = prefill;
    var timer = null;
    inp.addEventListener('input', function () {
      clearTimeout(timer);
      var v = this.value;
      timer = setTimeout(function () { doSearch(v); }, 240);
    });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); doSearch(this.value); } });
  }

  function doSearch(qRaw) {
    var q = (qRaw || '').trim();
    var res = $('#mq-s-res'), st = $('#mq-s-state');
    if (!res) return;
    if (q.length < 2) { res.innerHTML = ''; if (st) st.textContent = 'اكتب حرفين على الأقل.'; return; }
    if (!state.searchLoaded) { if (st) st.textContent = 'الفهرس لسه بيتحمّل… لحظة.'; return; }

    var nq = norm(q);
    var re = flexRe(nq);
    var hits = [];
    for (var i = 0; i < state.searchNorm.length; i++) {
      if (state.searchNorm[i].indexOf(nq) > -1) {
        hits.push(state.searchIndex[i]);
        if (hits.length >= 60) break;
      }
    }
    if (st) st.textContent = hits.length ? (hits.length + ' نتيجة') : 'لا نتائج — جرّب كلمة أخرى.';
    if (!hits.length) { res.innerHTML = ''; return; }

    res.innerHTML = hits.map(function (r) {
      var t = r[3];
      var hl = t;
      if (re) {
        hl = t.replace(re, '<mark>$1</mark>');
        if (hl === t) hl = t;
      }
      return '<button class="mq-hit" data-act="goto-ayah" data-s="' + r[0] + '" data-a="' + r[1] + '" data-p="' + r[2] + '">' +
        '<span class="mq-hit-top"><b>' + esc(surahName(r[0])) + '</b><span>آية ' + AR(r[1]) + ' · ص ' + AR(r[2]) + '</span></span>' +
        '<span class="mq-hit-txt">' + hl + '</span></button>';
    }).join('');
  }

  /* ── المكتبة (تحميل أوفلاين) ────────────────────────────────────────── */
  function fmtSize(b) {
    if (!b) return '٠';
    if (b < 1024) return AR(b) + ' بايت';
    if (b < 1048576) return AR(Math.round(b / 1024)) + ' ك.ب';
    return AR((b / 1048576).toFixed(1)).replace('.', '٫') + ' م.ب';
  }

  function openLibrary() {
    var html = '<div class="mq-lib">' +
      '<div class="mq-libcard" data-kind="text">' +
      '<div class="mq-libhd"><span class="mq-libico"><i class="mq-mi" data-i="book" aria-hidden="true"></i></span><div><b>نصّ القرآن كامل</b><small>٣٠ جزءًا · يُحفظ على جهازك</small></div></div>' +
      '<div class="mq-libbar"><i id="mq-libbar-text"></i></div>' +
      '<div class="mq-libfoot"><span id="mq-libtxt-text">جارٍ الحساب…</span>' +
      '<button class="mq-btn solid" data-act="dl" data-kind="text">تحميل</button></div>' +
      '</div>' +
      '<div class="mq-libcard" data-kind="tafsir">' +
      '<div class="mq-libhd"><span class="mq-libico"><i class="mq-mi" data-i="books" aria-hidden="true"></i></span><div><b>التفسير الميسّر</b><small>١١٤ سورة · يفتح مع الآية</small></div></div>' +
      '<div class="mq-libbar"><i id="mq-libbar-tafsir"></i></div>' +
      '<div class="mq-libfoot"><span id="mq-libtxt-tafsir">جارٍ الحساب…</span>' +
      '<button class="mq-btn solid" data-act="dl" data-kind="tafsir">تحميل</button></div>' +
      '</div>' +
      '<div class="mq-libcard" data-kind="audio">' +
      '<div class="mq-libhd"><span class="mq-libico"><i class="mq-mi" data-i="book" aria-hidden="true"></i></span><div><b>التلاوة الصوتية</b><small>٦ قرّاء · الآيات التي تسمعها تُحفظ أوفلاين</small></div></div>' +
      '<div class="mq-libfoot"><span id="mq-libtxt-audio">جارٍ الحساب…</span>' +
      '<button class="mq-btn solid" data-act="audio-lib">فتح</button></div>' +
      '</div>' +
      '<div class="mq-libnote">التحميل مرة واحدة، وبعدها كل شيء يعمل بلا إنترنت — بلا حساب وبلا سيرفر. ' +
      'نصّ المصحف برواية حفص عن عاصم (الطبعـة المدنية)، والتفسير «الميسّر» © مجمع الملك فهد لطباعة المصحف الشريف — يُوزَّع مجانًا بشرط عدم التعديل.</div>' +
      '<button class="mq-btn danger wide" data-act="wipe">مسح البيانات المحمّلة</button>' +
      '</div>';
    openSheet({ id: 'lib', title: 'المكتبة', sub: 'القراءة بلا إنترنت', html: html });
    refreshLibrary();
  }

  function refreshLibrary() {
    QS.stats().then(function (st) {
      var tTxt = $('#mq-libtxt-text'), tBar = $('#mq-libbar-text');
      var fTxt = $('#mq-libtxt-tafsir'), fBar = $('#mq-libbar-tafsir');
      if (tTxt) tTxt.textContent = AR(st.juz) + ' / ٣٠ جزءًا · ' + fmtSize(st.bytes);
      if (tBar) tBar.style.width = (st.juz / 30 * 100) + '%';
      if (fTxt) fTxt.textContent = AR(st.tafsir) + ' / ١١٤ سورة';
      if (fBar) fBar.style.width = (st.tafsir / 114 * 100) + '%';
      if (QA && window.caches) QA.stats().then(function (a) {
        var el = $('#mq-libtxt-audio');
        if (el) el.textContent = a.count ? (AR(a.count) + ' آية · ' + fmtSize(a.bytes)) : 'لم تُحفظ آيات بعد';
      });
    });
  }

  function startDownload(kind) {
    var card = $('.mq-libcard[data-kind="' + kind + '"]');
    var btn = card ? card.querySelector('[data-act="dl"]') : null;
    var bar = $('#mq-libbar-' + kind);
    var txt = $('#mq-libtxt-' + kind);
    if (btn) { btn.disabled = true; btn.textContent = '…'; }
    QS.download(kind, function (done, total) {
      if (bar) bar.style.width = (done / total * 100) + '%';
      if (txt) txt.textContent = AR(done) + ' / ' + AR(total);
    }).then(function (r) {
      if (btn) { btn.disabled = false; btn.textContent = 'محمّل ✓'; btn.classList.add('done'); }
      toast(r.failed.length ? 'اكتمل مع بعض الملفات الفاشلة — أعد المحاولة' : 'تم التحميل — اقرأ بلا إنترنت الآن');
      refreshLibrary();
      if (state.mode === 'tafsir') fillTafsir();
    }).catch(function () {
      if (btn) { btn.disabled = false; btn.textContent = 'إعادة'; }
      toast('تعذّر التحميل — تحقّق من الاتصال');
    });
  }

  /* ── الإعدادات ──────────────────────────────────────────────────────── */
  function openSettings() {
    var html = '<div class="mq-set">' +
      '<label class="mq-lbl">حجم خطّ المصحف <output id="mq-o-size">' + AR(PREFS.size) + '</output></label>' +
      '<input id="mq-s-size" class="mq-range" type="range" min="18" max="42" step="1" value="' + PREFS.size + '">' +
      '<label class="mq-lbl">تباعد الأسطر <output id="mq-o-lh">' + AR(String(PREFS.lh).replace('.', '٫')) + '</output></label>' +
      '<input id="mq-s-lh" class="mq-range" type="range" min="18" max="34" step="1" value="' + Math.round(PREFS.lh * 10) + '">' +
      '<div class="mq-switchrow"><span>وضع القراءة الليلي</span>' +
      '<button class="mq-switch' + (PREFS.night ? ' on' : '') + '" id="mq-night" role="switch" aria-checked="' + (PREFS.night ? 'true' : 'false') + '"><i></i></button></div>' +
      '<div class="mq-set-note">إعداداتك محفوظة على جهازك وحده.</div>' +
      '<button class="mq-btn wide" data-act="reset-prefs">استعادة الافتراضي</button>' +
      '</div>';
    openSheet({ id: 'set', title: 'إعدادات القراءة', sub: 'الخط والتباعد والوضع', html: html });

    var size = $('#mq-s-size'), lh = $('#mq-s-lh');
    size.addEventListener('input', function () {
      PREFS.size = +this.value;
      $('#mq-o-size').textContent = AR(PREFS.size);
      applyPrefs(); savePrefs();
    });
    lh.addEventListener('input', function () {
      PREFS.lh = +this.value / 10;
      $('#mq-o-lh').textContent = AR(String(PREFS.lh).replace('.', '٫'));
      applyPrefs(); savePrefs();
    });
    $('#mq-night').addEventListener('click', function () {
      PREFS.night = !PREFS.night;
      this.classList.toggle('on', PREFS.night);
      this.setAttribute('aria-checked', PREFS.night ? 'true' : 'false');
      applyPrefs(); savePrefs();
    });
  }

  function applyPrefs() {
    var root = document.documentElement;
    root.style.setProperty('--mq-size', PREFS.size + 'px');
    root.style.setProperty('--mq-lh', PREFS.lh);
    root.style.setProperty('--qf-size', PREFS.size + 'px');
    document.body.classList.toggle('mq-night', !!PREFS.night);
    try { localStorage.setItem('zad_mfont', String(PREFS.size)); } catch (e) {}
  }

  function setMode(m) {
    if (['mushaf', 'ayah', 'tafsir'].indexOf(m) < 0) m = 'mushaf';
    state.mode = m;
    PREFS.mode = m;
    savePrefs();
    els.modes.forEach(function (b) {
      var on = b.getAttribute('data-mode') === m;
      b.classList.toggle('on', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    render();
  }

  /* ── الأحداث ────────────────────────────────────────────────────────── */
  function wire() {
    els.prev.addEventListener('click', function () { if (state.page > 1) goPage(state.page - 1); });
    els.next.addEventListener('click', function () { if (state.page < 604) goPage(state.page + 1); });
    els.page.addEventListener('click', openJuz);

    $('#mq-index').addEventListener('click', openIndex);
    $('#mq-bm').addEventListener('click', function () { togglePageBm(); });
    $('#mq-bmlist').addEventListener('click', openBookmarks);
    $('#mq-search').addEventListener('click', openSearch);
    $('#mq-set').addEventListener('click', openSettings);
    $('#mq-lib').addEventListener('click', openLibrary);

    els.modes.forEach(function (b) {
      b.addEventListener('click', function () { setMode(b.getAttribute('data-mode')); });
    });

    /* مشغّل التلاوة */
    var pl = function (id) { return $('#' + id); };
    if (pl('mq-pl-toggle')) {
      pl('mq-pl-toggle').addEventListener('click', function () { if (window.QuranAudio) window.QuranAudio.toggle(); });
      pl('mq-pl-prev').addEventListener('click', function () { if (window.QuranAudio) window.QuranAudio.prev(); });
      pl('mq-pl-next').addEventListener('click', function () { if (window.QuranAudio) window.QuranAudio.next(); });
      pl('mq-pl-x').addEventListener('click', function () { if (window.QuranAudio) window.QuranAudio.stop(); });
      pl('mq-pl-more').addEventListener('click', openAudio);
      if (pl('mq-pl-loop')) pl('mq-pl-loop').addEventListener('click', function () {
        if (!window.QuranAudio) return;
        var st = window.QuranAudio.state();
        window.QuranAudio.setLoop(!st.loop);
      });
    }

    /* الأحداث المفوّضة داخل الصفحة */
    document.addEventListener('click', function (e) {
      var wEl = e.target.closest('.mq-w');
      if (wEl) {
        e.preventDefault();
        openWord(wEl.getAttribute('data-w'), +wEl.getAttribute('data-s'), +wEl.getAttribute('data-a'));
        return;
      }
      var t = e.target.closest('[data-act]');
      if (!t) return;
      var act = t.getAttribute('data-act');

      if (act === 'play-ayah') {
        playAyah(+t.getAttribute('data-s'), +t.getAttribute('data-a'));
        return;
      }
      if (act === 'word-play') {
        playAyah(+els.sheetBody.getAttribute('data-s'), +els.sheetBody.getAttribute('data-a'));
        return;
      }
      if (act === 'word-search') { var wq = t.getAttribute('data-q'); closeSheet(); openSearch(wq); return; }
      if (act === 'word-copy') { copyText(t.getAttribute('data-q')).then(function () { toast('نُسخت الكلمة'); }); return; }
      if (act === 'word-back') {
        openAyah(+els.sheetBody.getAttribute('data-s'), +els.sheetBody.getAttribute('data-a'));
        return;
      }
      if (act === 'loop') { if (window.QuranAudio) window.QuranAudio.setLoop(!window.QuranAudio.state().loop); return; }
      if (act === 'rec') { if (window.QuranAudio) { window.QuranAudio.setReciter(t.getAttribute('data-rec')); openAudio(); } return; }
      if (act === 'audio-lib') { openAudio(); return; }
      if (act === 'stop-audio') { if (window.QuranAudio) window.QuranAudio.stop(); closeSheet(); return; }
      if (act === 'dl-audio') {
        if (!window.QuranAudio) return;
        var list = pageList();
        t.disabled = true;
        var label = t.innerHTML;
        t.innerHTML = 'جارٍ…';
        window.QuranAudio.cacheList(list, function (d, tot) {
          t.innerHTML = AR(d) + '/' + AR(tot);
        }).then(function (r) {
          t.disabled = false;
          t.innerHTML = label;
          toast(r.failed.length ? ('تمّ ' + AR(r.ok) + ' — فشل ' + AR(r.failed.length)) : ('حُفظ صوت ' + AR(r.ok) + ' آية'));
          refreshAudioInfo();
        });
        return;
      }
      if (act === 'wipe-audio') {
        if (!window.QuranAudio) return;
        window.QuranAudio.clear().then(function () { toast('مُسح الصوت المحفوظ'); refreshAudioInfo(); });
        return;
      }

      if (act === 'copy') {
        var s = +els.sheetBody.getAttribute('data-s'), a = +els.sheetBody.getAttribute('data-a');
        var row = ayahRow(s, a);
        if (row) copyText(row[3] + ' ﴿' + s + ':' + a + '﴾').then(function () { toast('نُسخت الآية'); });
      } else if (act === 'share') {
        var s2 = +els.sheetBody.getAttribute('data-s'), a2 = +els.sheetBody.getAttribute('data-a');
        var row2 = ayahRow(s2, a2);
        if (row2) share(row2[3] + '\n\n— سورة ' + surahName(s2) + '، الآية ' + a2 + '\nزاد · zad.codeandcanvas.net');
      } else if (act === 'bm-ayah') {
        var s3 = +els.sheetBody.getAttribute('data-s'), a3 = +els.sheetBody.getAttribute('data-a');
        var now = toggleAyahBm(s3, a3);
        t.classList.toggle('on', now);
        t.innerHTML = '<i class="mq-ai" aria-hidden="true"></i>' + (now ? 'محفوظة' : 'حفظ');
      } else if (act === 'open-page') { closeSheet(); }
      else if (act === 'goto-ayah') {
        var ss = +t.getAttribute('data-s'), aa = +t.getAttribute('data-a');
        var pp = t.getAttribute('data-p');
        closeSheet();
        (pp ? goPage(+pp, { force: true }) : QS.pageOfAyah(ss, aa).then(function (p) { return goPage(p || 1, { force: true }); }))
          .then(function () { setTimeout(function () { flashAyah(ss, aa); }, 120); });
      } else if (act === 'goto-page') {
        closeSheet(); goPage(+t.getAttribute('data-p'), { force: true });
      } else if (act === 'goto-surah') {
        var n = +t.getAttribute('data-n');
        var meta = state.meta.surahs[n - 1];
        closeSheet(); goPage(meta.page, { force: true });
      } else if (act === 'goto-juz') {
        var j = +t.getAttribute('data-j');
        closeSheet();
        startJuz(j);
      } else if (act === 'resume') {
        var lr = lastRead();
        if (lr) { hideResume(); goPage(lr.p, { force: true }); }
      } else if (act === 'retry') {
        goPage(state.page, { force: true });
      } else if (act === 'open-lib') {
        closeSheet(); openLibrary();
      } else if (act === 'do-search') {
        doSearch($('#mq-s-q') && $('#mq-s-q').value);
      } else if (act === 'dl') {
        startDownload(t.getAttribute('data-kind'));
      } else if (act === 'wipe') {
        QS.clear().then(function () { toast('مُسحت البيانات المحمّلة'); refreshLibrary(); });
      } else if (act === 'reset-prefs') {
        PREFS.size = 26; PREFS.lh = 2.55; PREFS.night = false;
        applyPrefs(); savePrefs(); closeSheet(); openSettings();
        toast('استُعيد الافتراضي');
      }
    });

    /* نقر الآية داخل المصحف/البطاقات */
    els.stage.addEventListener('click', function (e) {
      if (e.target.closest('.mq-w, .mq-play')) return;
      var a = e.target.closest('.mq-a, .mq-card');
      if (!a) return;
      openAyah(+a.getAttribute('data-s'), +a.getAttribute('data-a'));
    });
    els.stage.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var a = e.target.closest('.mq-a, .mq-card');
      if (!a) return;
      e.preventDefault();
      openAyah(+a.getAttribute('data-s'), +a.getAttribute('data-a'));
    });

    /* إغلاق الشيت */
    els.sheet.addEventListener('click', function (e) {
      if (e.target === els.sheet || e.target.closest('[data-close]')) closeSheet();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { if (sheetOpen()) closeSheet(); return; }
      if (sheetOpen()) return;
      if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); if (state.page < 604) goPage(state.page + 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); if (state.page > 1) goPage(state.page - 1); }
    });

    /* سحب */
    var tx = 0, ty = 0;
    els.stage.addEventListener('touchstart', function (e) {
      tx = e.touches[0].clientX; ty = e.touches[0].clientY;
    }, { passive: true });
    els.stage.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - tx;
      var dy = e.changedTouches[0].clientY - ty;
      if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.6) {
        if (dx > 0) { if (state.page > 1) goPage(state.page - 1); }
        else if (state.page < 604) goPage(state.page + 1);
      }
    }, { passive: true });

    window.addEventListener('online', function () { toast('عاد الاتصال'); });
  }

  function startJuz(j) {
    QS.meta().then(function (m) {
      /* أول صفحة في الجزء: أقل صفحة في بيانات الجزء */
      QS.juz(j).then(function (d) {
        var min = 604;
        d.ayahs.forEach(function (r) { if (r[2] < min) min = r[2]; });
        goPage(min, { force: true });
      });
    });
  }

  function flashAyah(s, a) {
    var el = els.stage.querySelector('.mq-a[data-s="' + s + '"][data-a="' + a + '"], .mq-card[data-s="' + s + '"][data-a="' + a + '"]');
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.add('is-flash');
    setTimeout(function () { el.classList.remove('is-flash'); }, 2400);
  }

  /* ── الإقلاع ────────────────────────────────────────────────────────── */
  function syncTopbar() {
    var tb = document.querySelector('.topbar');
    if (!tb) return;
    var h = Math.round(tb.getBoundingClientRect().height);
    if (h > 0) document.documentElement.style.setProperty('--tb-h', h + 'px');
  }

  function boot() {
    cacheEls();
    applyPrefs();
    syncTopbar();
    if (window.QuranAudio) {
      window.QuranAudio.init({
        onState: playerState,
        onAyah: function (o) { markPlaying(o.s, o.a); },
        onProgress: function (p) { if (els.plProg) els.plProg.style.width = Math.min(100, Math.round(p * 100)) + '%'; },
        onEnd: audioEnd,
        onError: function () { toast('تعذّر تشغيل الصوت — جرّب قارئًا آخر أو تحقّق من الاتصال'); }
      });
    }
    window.addEventListener('resize', syncTopbar, { passive: true });
    wire();
    setMode(state.mode);

    var params = new URLSearchParams(location.search);
    var pageParam = parseInt(params.get('page') || '0', 10);
    var surahParam = parseInt(params.get('surah') || '0', 10);
    var to = parseInt(params.get('to') || '0', 10);
    if (pageParam && to) state.wird = { from: pageParam, to: to };

    var lr = lastRead();
    var start = pageParam || (lr && lr.p) || 1;

    QS.meta().then(function (m) {
      state.meta = m;
      if (window.QuranAudio) window.QuranAudio.setMeta(m);
      if (surahParam >= 1 && surahParam <= 114) start = m.surahs[surahParam - 1].page;
      goPage(start, { initial: true }).then(function () {
        if (!pageParam) showResume();
        syncBmBtn();
      });
    }).catch(function (e) {
      renderError(e);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
