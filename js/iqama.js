/* ═══════════════════════════════════════════════════════════════════════════
   زاد — مواقيت المسجد (الإقامة)  ·  js/iqama.js
   ─────────────────────────────────────────────────────────────────────────
   أعلى قيمة يومية بأقل عمل: كل مسجد يُقيم بعد الأذان بفارق ثابت (٥–٢٠ دقيقة).
   التطبيق كان يعرض الأذان فقط، فيخرج المستخدم من التطبيق ليحسبها بنفسه.

   هنا:
     • إعداد لكل صلاة (والجمعة) يُحفظ على الجهاز.
     • الإقامة تظهر داخل بطاقة الصلاة نفسها وفي «الصلاة القادمة».
     • عدّاد تنازلي للإقامة بين الأذان والإقامة.
     • إشعار إقامة اختياري (عبر Service Worker) إن كانت إشعارات الأذان مفعّلة.
   كل الحساب محلي: الإقامة = وقت الأذان المحسوب + الفارق.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window.ZadIqama && window.ZadIqama._inited) return;

  var KEY = 'zad_iqama_v1';
  var PRAYERS = [
    { id: 'fajr', label: 'الفجر', def: 20 },
    { id: 'dhuhr', label: 'الظهر', def: 12 },
    { id: 'asr', label: 'العصر', def: 12 },
    { id: 'maghrib', label: 'المغرب', def: 6 },
    { id: 'isha', label: 'العشاء', def: 12 },
  ];
  var DEF = {
    enabled: true,
    mosque: '',
    offsets: { fajr: 20, dhuhr: 12, asr: 12, maghrib: 6, isha: 12 },
    jumuah: 12,      /* خطبة الجمعة: فارق الإقامة عن أذان الظهر */
    notify: false,   /* إشعار عند الإقامة (يحتاج إذن الإشعارات) */
  };

  function read() {
    var raw = {};
    try { raw = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { raw = {}; }
    return {
      enabled: raw.enabled !== false,
      mosque: typeof raw.mosque === 'string' ? raw.mosque : '',
      offsets: Object.assign({}, DEF.offsets, raw.offsets || {}),
      jumuah: clamp(raw.jumuah, 5, 60, DEF.jumuah),
      notify: raw.notify === true,
    };
  }
  function clamp(v, min, max, def) {
    v = Number(v);
    if (!isFinite(v)) return def;
    return Math.max(min, Math.min(max, Math.round(v)));
  }
  function write(patch) {
    var next = read();
    if (patch) {
      if (patch.offsets) next.offsets = Object.assign(next.offsets, patch.offsets);
      Object.keys(patch).forEach(function (k) { if (k !== 'offsets') next[k] = patch[k]; });
    }
    next.jumuah = clamp(next.jumuah, 5, 60, DEF.jumuah);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch (e) {}
    render();
    scheduleIqama();
    return next;
  }

  /* ── الحساب ────────────────────────────────────────────────────────────── */
  function offsetFor(id, dateObj) {
    var s = read();
    if (!s.enabled) return 0;
    if (id === 'dhuhr' && dateObj && dateObj.getDay() === 5) return s.jumuah;
    return Number(s.offsets[id] || 0);
  }
  /* timings: { Fajr:'04:12', ... } بصيغة 24 ساعة */
  function timeOf(timings, id) {
    var map = { fajr: 'Fajr', dhuhr: 'Dhuhr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Isha' };
    var raw = timings && timings[map[id]];
    if (!raw) return null;
    var m = /^(\d{1,2}):(\d{2})/.exec(String(raw).trim());
    if (!m) return null;
    var d = new Date();
    d.setHours(+m[1], +m[2], 0, 0);
    return d;
  }
  function iqamaTime(timings, id, dateObj) {
    var base = timeOf(timings, id);
    if (!base) return null;
    var off = offsetFor(id, dateObj || base);
    return off ? new Date(base.getTime() + off * 60000) : base;
  }
  function fmt(d) {
    if (!d) return '--:--';
    return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
  }
  function fmt12(d) {
    if (!d) return '';
    var h = d.getHours(), m = d.getMinutes();
    var suffix = h < 12 ? 'ص' : 'م';
    var hh = h % 12; if (hh === 0) hh = 12;
    return hh + ':' + ('0' + m).slice(-2) + ' ' + suffix;
  }
  function ar(n) { return String(n).replace(/\d/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }); }

  /* ── العرض داخل بطاقات الصلاة ─────────────────────────────────────────── */
  var GRID_ORDER = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

  function renderGrid() {
    var grid = document.getElementById('prayers-grid');
    if (!grid || !window.__zadTimings) return;
    var timings = window.__zadTimings;
    var s = read();
    var cards = grid.querySelectorAll('.prayer-card');
    cards.forEach(function (card, i) {
      var id = GRID_ORDER[i];
      if (!id) return;
      var line = card.querySelector('.pc-iq');
      if (!s.enabled || id === 'sunrise' || !offsetFor(id, new Date())) {
        if (line) line.remove();
        return;
      }
      var at = iqamaTime(timings, id);
      if (!at) return;
      if (!line) {
        line = document.createElement('div');
        line.className = 'pc-iq';
        card.appendChild(line);
      }
      line.innerHTML = '<span class="pc-iq-l">إقامة</span><b>' + fmt(at) + '</b>';
    });
  }

  function renderHero() {
    var hero = document.getElementById('next-prayer-hero');
    if (!hero || !window.__zadTimings) return;
    var s = read();
    var box = hero.querySelector('.next-iq');
    if (!s.enabled) { if (box) box.remove(); return; }
    if (!box) {
      box = document.createElement('div');
      box.className = 'next-iq';
      hero.appendChild(box);
    }
    var now = new Date();
    /* هل نحن بين أذان وإقامة صلاةٍ ما الآن؟ */
    var live = null;
    PRAYERS.forEach(function (p) {
      var a = timeOf(window.__zadTimings, p.id);
      var i = iqamaTime(window.__zadTimings, p.id);
      if (a && i && now >= a && now < i) live = { p: p, at: i, adhan: a };
    });
    if (live) {
      box.className = 'next-iq live';
      box.innerHTML = '🕌 إقامة ' + live.p.label + ' <b>' + fmt12(live.at) + '</b> · بعد <b id="iq-cd">—</b>';
      startCountdown(live.at);
    } else {
      box.className = 'next-iq';
      var nextId = (hero.querySelector('#np-name') || {}).textContent || '';
      var match = PRAYERS.filter(function (p) { return nextId.indexOf(p.label) >= 0; })[0] || PRAYERS[0];
      var at = iqamaTime(window.__zadTimings, match.id);
      var off = offsetFor(match.id, new Date());
      box.innerHTML = off
        ? '🕌 بإقامة مسجدك: <b>' + fmt12(at) + '</b> (بعد الأذان ' + ar(off) + ' د)'
        : '🕌 الإقامة مع الأذان';
      var cd = document.getElementById('iq-cd');
      if (cd) cd.textContent = '—';
      stopCountdown();
    }
  }

  var _cdTimer = null;
  function stopCountdown() { if (_cdTimer) { clearInterval(_cdTimer); _cdTimer = null; } }
  function startCountdown(target) {
    stopCountdown();
    function tick() {
      var el = document.getElementById('iq-cd');
      if (!el) { stopCountdown(); return; }
      var diff = target - new Date();
      if (diff <= 0) { el.textContent = 'حان الآن'; stopCountdown(); return; }
      var m = Math.floor(diff / 60000), sec = Math.floor((diff % 60000) / 1000);
      el.textContent = ar(m) + ':' + ('0' + sec).slice(-2);
    }
    tick();
    _cdTimer = setInterval(tick, 1000);
  }

  /* ── إشعار الإقامة ────────────────────────────────────────────────────── */
  var _timers = [];
  function clearTimers() { _timers.forEach(clearTimeout); _timers = []; }
  function scheduleIqama() {
    clearTimers();
    var s = read();
    if (!s.enabled || !s.notify) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    if (typeof window.calcPrayerTimes !== 'function') return;
    var loc = null;
    try { loc = JSON.parse(localStorage.getItem('zad_saved_location') || 'null'); } catch (e) {}
    if (!loc) return;
    var now = Date.now();
    [0, 1].forEach(function (dayOffset) {
      var day = new Date(); day.setDate(day.getDate() + dayOffset);
      Promise.resolve(window.calcPrayerTimes(loc.lat, loc.lng, day, {})).then(function (times) {
        PRAYERS.forEach(function (p) {
          var t = times && times[p.id] && times[p.id].time;
          if (!(t instanceof Date)) return;
          var off = offsetFor(p.id, t);
          if (!off) return;
          var at = t.getTime() + off * 60000;
          var delay = at - Date.now();
          if (delay <= 0 || delay > 26 * 3600 * 1000) return;
          _timers.push(setTimeout(function () { deliver(p, off); }, delay));
        });
      }).catch(function () {});
    });
  }

  async function deliver(p, off) {
    var body = 'أقيمت الصلاة في مسجدك' + (read().mosque ? ' — ' + read().mosque : '') + ' · بعد الأذان ' + ar(off) + ' دقيقة — حيّ على الصلاة';
    var payload = {
      body: body, icon: './icons/icon.png', badge: './icons/icon.png', dir: 'rtl', lang: 'ar',
      tag: 'zad-iqama-' + p.id, vibrate: [200, 100, 200], data: { url: 'prayers.html', prayer: p.id, kind: 'iqama' },
    };
    try {
      if (navigator.serviceWorker && navigator.serviceWorker.getRegistration) {
        var reg = await navigator.serviceWorker.getRegistration();
        if (reg && reg.showNotification) { await reg.showNotification('🕌 إقامة ' + p.label, payload); return; }
      }
    } catch (e) {}
    try { if (Notification.permission === 'granted') new Notification('🕌 إقامة ' + p.label, payload); } catch (e) {}
  }

  /* ── لوحة الإعداد (تُحقن في صفحة المواقيت) ────────────────────────────── */
  var CSS = ''
    + '.iq-card{background:var(--card);border:1.5px solid var(--border);border-radius:16px;padding:14px 15px;margin:10px 0 14px}'
    + '.iq-head{display:flex;align-items:center;gap:10px}'
    + '.iq-head .t{flex:1;min-width:0}'
    + '.iq-head .t b{display:block;font-size:13px;font-weight:800;color:var(--ink)}'
    + '.iq-head .t small{font-size:11px;color:var(--muted);line-height:1.6;display:block}'
    + '.iq-sw{flex:0 0 auto;width:44px;height:25px;border-radius:99px;border:1.5px solid var(--border);background:var(--sand);position:relative;cursor:pointer;transition:.18s}'
    + '.iq-sw::after{content:"";position:absolute;top:2.5px;inset-inline-start:3px;width:17px;height:17px;border-radius:50%;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.25);transition:.18s}'
    + '.iq-sw.on{background:var(--green-soft);border-color:var(--green-soft)}'
    + '.iq-sw.on::after{inset-inline-start:22px}'
    + '.iq-body{display:none;margin-top:12px;border-top:1px solid var(--border);padding-top:12px}'
    + '.iq-card.open .iq-body{display:block}'
    + '.iq-name{width:100%;padding:9px 11px;border:1.5px solid var(--border);border-radius:10px;background:var(--sand);color:var(--ink);font-family:inherit;font-size:12.5px;font-weight:700;margin-bottom:10px}'
    + '.iq-rows{display:grid;grid-template-columns:repeat(auto-fit,minmax(94px,1fr));gap:7px}'
    + '@media(max-width:560px){.iq-rows{grid-template-columns:repeat(3,1fr)}}'
    + '.iq-r label{display:block;font-size:10.5px;color:var(--muted);font-weight:700;margin-bottom:4px;text-align:center}'
    + '.iq-r input{width:100%;padding:8px 4px;border:1.5px solid var(--border);border-radius:9px;background:var(--sand);color:var(--ink);font-family:inherit;font-size:13px;font-weight:800;text-align:center;-moz-appearance:textfield}'
    + '.iq-r input::-webkit-outer-spin-button,.iq-r input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}'
    + '.iq-r input:focus{outline:none;border-color:var(--green-soft);background:var(--card)}'
    + '.iq-note{font-size:10.5px;color:var(--muted);line-height:1.7;margin-top:9px}'
    + '.iq-toolbar{display:flex;gap:6px;flex-wrap:wrap;margin-top:9px}'
    + '.iq-chip{border:1px solid var(--border);background:var(--sand);color:var(--muted);border-radius:99px;padding:5px 10px;font-family:inherit;font-size:10.5px;font-weight:700;cursor:pointer}'
    + '.iq-chip:hover{border-color:var(--green-soft);color:var(--green-deep)}'
    + '.pc-iq{margin-top:6px;padding-top:5px;border-top:1px dashed var(--border);font-size:10.5px;color:var(--muted);display:flex;align-items:center;justify-content:center;gap:4px}'
    + '.pc-iq b{font-size:11.5px;font-weight:900;color:var(--green-deep);font-variant-numeric:tabular-nums;direction:ltr}'
    + 'html[data-theme="dark"] .pc-iq b,html[data-theme="oled"] .pc-iq b{color:var(--sys-green)}'
    + '.pc-iq-l{opacity:.8}'
    + '.next-iq{margin-top:10px;font-size:11.5px;color:rgba(255,255,255,.85);background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.16);border-radius:99px;padding:6px 13px;display:inline-block}'
    + '.next-iq b{color:#f6e0a6;font-weight:900;direction:ltr;display:inline-block}'
    + '.next-iq.live{background:rgba(230,201,122,.16);border-color:rgba(230,201,122,.4)}';

  function injectCSS() {
    if (document.getElementById('zad-iqama-css')) return;
    var st = document.createElement('style'); st.id = 'zad-iqama-css'; st.textContent = CSS;
    document.head.appendChild(st);
  }

  function mountSettings() {
    if (document.getElementById('iq-card')) return;
    var anchor = document.getElementById('pt-notif-bar');
    if (!anchor) return;
    injectCSS();
    var s = read();
    var card = document.createElement('div');
    card.className = 'iq-card' + (s.offsets.fajr === DEF.offsets.fajr && !s.mosque ? '' : ' open');
    card.id = 'iq-card';
    card.innerHTML =
      '<div class="iq-head"><div class="t"><b>🕌 مسجدي بيقيم بعد الأذان</b>'
      + '<small>أدخل فارق الإقامة في مسجدك — تظهر مع كل صلاة وتُنبّهك عند الإقامة.</small></div>'
      + '<button class="iq-sw ' + (s.enabled ? 'on' : '') + '" id="iq-toggle" role="switch" aria-checked="' + s.enabled + '" aria-label="تفعيل مواقيت المسجد"></button></div>'
      + '<div class="iq-body">'
      + '<input class="iq-name" id="iq-mosque" placeholder="اسم المسجد (اختياري)" value="' + (s.mosque || '').replace(/"/g, '&quot;') + '">'
      + '<div class="iq-rows">'
      + PRAYERS.map(function (p) {
        return '<div class="iq-r"><label for="iq-' + p.id + '">' + p.label + '</label>'
          + '<input id="iq-' + p.id + '" data-iq="' + p.id + '" type="number" min="0" max="60" inputmode="numeric" value="' + s.offsets[p.id] + '"></div>';
      }).join('')
      + '<div class="iq-r"><label for="iq-jumuah">الجمعة</label><input id="iq-jumuah" type="number" min="5" max="60" inputmode="numeric" value="' + s.jumuah + '"></div>'
      + '</div>'
      + '<div class="iq-toolbar"><button class="iq-chip" data-preset="5">٥ د</button><button class="iq-chip" data-preset="10">١٠ د</button><button class="iq-chip" data-preset="15">١٥ د</button><button class="iq-chip" data-preset="20">٢٠ د</button></div>'
      + '<label style="display:flex;align-items:center;gap:8px;margin-top:11px;font-size:11.5px;color:var(--ink);font-weight:700">'
      + '<input type="checkbox" id="iq-notify" ' + (s.notify ? 'checked' : '') + ' style="width:16px;height:16px;accent-color:var(--green-deep)"> نبّهني عند الإقامة (لا عند الأذان فقط)</label>'
      + '<div class="iq-note">الفارق يُضاف لوقت الأذان المحسوب على جهازك؛ لا يُرسل شيء لأي خدمة. '
      + 'الإشعار يحتاج إذن الإشعارات مفعّلًا من زرّ الأذان بالأعلى.</div>'
      + '</div>';
    anchor.parentNode.insertBefore(card, anchor.nextSibling);

    card.querySelector('#iq-toggle').onclick = function () {
      var on = !read().enabled;
      write({ enabled: on });
      this.classList.toggle('on', on);
      this.setAttribute('aria-checked', String(on));
      card.classList.toggle('open', on);
    };
    card.querySelectorAll('[data-iq]').forEach(function (inp) {
      inp.oninput = function () {
        var o = {}; o[inp.getAttribute('data-iq')] = clamp(inp.value, 0, 60, 0);
        write({ offsets: o, enabled: true });
      };
    });
    card.querySelector('#iq-jumuah').oninput = function () { write({ jumuah: clamp(this.value, 5, 60, 12) }); };
    card.querySelector('#iq-mosque').oninput = function () { write({ mosque: this.value.slice(0, 40) }); };
    card.querySelector('#iq-notify').onchange = function () {
      var on = this.checked;
      if (on && 'Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission().then(function (p) {
          if (p !== 'granted') { document.getElementById('iq-notify').checked = false; write({ notify: false }); }
          else { write({ notify: true }); }
        });
        return;
      }
      write({ notify: on });
    };
    card.querySelectorAll('[data-preset]').forEach(function (b) {
      b.onclick = function () {
        var v = +b.getAttribute('data-preset');
        var o = {}; PRAYERS.forEach(function (p) { o[p.id] = p.id === 'maghrib' ? Math.max(3, Math.round(v / 2)) : v; });
        write({ offsets: o });
        card.querySelectorAll('[data-iq]').forEach(function (inp) {
          var id = inp.getAttribute('data-iq');
          inp.value = o[id];
        });
      };
    });
  }

  function render() {
    renderGrid();
    renderHero();
    var sw = document.getElementById('iq-toggle');
    if (sw) { var on = read().enabled; sw.classList.toggle('on', on); sw.setAttribute('aria-checked', String(on)); }
  }

  function boot() {
    injectCSS();
    mountSettings();
    render();
    /* بطاقات الصلاة تُعاد بناؤها كل تحديث — نراقبها بدل تعديل كود الصفحة */
    var grid = document.getElementById('prayers-grid');
    if (grid && window.MutationObserver) {
      new MutationObserver(function () { renderGrid(); }).observe(grid, { childList: true });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();

  window.ZadIqama = {
    _inited: true,
    read: read, write: write,
    offsetFor: offsetFor, iqamaTime: iqamaTime,
    PRAYERS: PRAYERS,
    render: render,
    schedule: scheduleIqama,
  };
})();
