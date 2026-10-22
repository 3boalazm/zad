/* ═══════════════════════════════════════════════════════════════════════════
   زاد — الختمة العائلية  ·  js/khatma-share.js
   ─────────────────────────────────────────────────────────────────────────
   الفكرة: المجموعة موجودة أصلًا في التطبيق (groups.html / ZadGroups)، فلماذا
   نبني «شبكة اجتماعية» لنوزّع ٣٠ جزءًا؟ نوزّعها على أفراد المجموعة الحالية.

   كيف تعمل بلا خادم:
     • تقسيم ٦٠٤ صفحة (٣٠ جزءًا) على عدد الأفراد → نصيب كل فرد محسوب بدقة.
     • كل فرد يأخذ جزأه على جهازه (رابط مباشر للمصحف على أول صفحة جزئه).
     • «ختمتُ جزئي» يُحفظ محليًا، والعدّاد ينتقل عبر مجموعة كانت متزامنة أصلًا.
   الواجهة بطاقة واحدة تُحقن في mushaf.html ومجموعة groups.html.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window.ZadKhatma && window.ZadKhatma._inited) return;

  var KEY = 'zad_khatma_v1';
  var TOTAL_PAGES = 604;
  var JUZ_PAGES = 20;   /* تقدير عملي: ٣٠ جزءًا × ٢٠ صفحة تقريبًا */

  function read() {
    var raw = {};
    try { raw = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { raw = {}; }
    raw.members = Array.isArray(raw.members) ? raw.members : [];
    raw.done = raw.done || {};
    raw.groupId = raw.groupId || '';
    raw.startedAt = raw.startedAt || null;
    return raw;
  }
  function write(next) {
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch (e) {}
    emit();
  }
  function ar(n) { return String(n).replace(/\d/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }); }

  /* ── التوزيع ────────────────────────────────────────────────────────────── */
  function plan(count) {
    count = Math.max(1, Math.min(60, Math.round(count || 1)));
    var base = Math.floor(TOTAL_PAGES / count);
    var rest = TOTAL_PAGES % count;
    var out = [];
    var from = 1;
    for (var i = 0; i < count; i++) {
      var n = base + (i < rest ? 1 : 0);
      var to = from + n - 1;
      out.push({
        i: i + 1, from: from, to: to, pages: n,
        juzFrom: Math.min(30, Math.floor((from - 1) / JUZ_PAGES) + 1),
        juzTo: Math.min(30, Math.floor((to - 1) / JUZ_PAGES) + 1),
        share: Math.round(n / TOTAL_PAGES * 1000) / 10
      });
      from = to + 1;
    }
    return out;
  }

  /* يقرأ أسماء أفراد مجموعة ZadGroups إن وُجدت، وإلا أسماء يدوية */
  function pullFromGroups() {
    try {
      var G = window.ZadGroups || (window.Groups);
      if (!G || !G.listGroups) return null;
      return Promise.resolve(G.listGroups()).then(function (list) {
        var g = (list && list[0]) || null;
        if (!g) return null;
        var names = (g.members || []).filter(function (m) { return !m.demo; }).map(function (m) {
          return m.alias || m.name || (m.isMe ? 'أنا' : 'فرد');
        });
        return { groupId: g.id || g.code || '', name: g.name || 'مجموعتي', members: names };
      }).catch(function () { return null; });
    } catch (e) { return null; }
  }

  var subs = [];
  function emit() { subs.forEach(function (f) { try { f(); } catch (e) {} }); }

  /* ── الواجهة ────────────────────────────────────────────────────────────── */
  var CSS = ''
    + '.kh-card{background:var(--card);border:1.5px solid var(--border);border-radius:16px;padding:15px 16px;margin:0 0 16px;box-shadow:var(--shadow-sm)}'
    + '.kh-h{display:flex;align-items:center;gap:9px;margin-bottom:5px}'
    + '.kh-h b{font-size:14px;font-weight:900;color:var(--green-deep);font-family:"ThmanyahSans",sans-serif}'
    + 'html[data-theme="dark"] .kh-h b,html[data-theme="oled"] .kh-h b{color:var(--sys-green)}'
    + '.kh-h .p{margin-inline-start:auto;font-size:10.5px;font-weight:800;color:var(--muted);background:var(--sand);border:1px solid var(--border);border-radius:99px;padding:3px 9px}'
    + '.kh-sub{font-size:11.5px;color:var(--muted);line-height:1.8;margin-bottom:11px}'
    + '.kh-row{display:flex;gap:7px;align-items:center;flex-wrap:wrap;margin-bottom:9px}'
    + '.kh-row input{width:64px;padding:8px;border:1.5px solid var(--border);border-radius:9px;background:var(--sand);color:var(--ink);font-family:inherit;font-size:13px;font-weight:800;text-align:center}'
    + '.kh-row .lb{font-size:11.5px;color:var(--muted);font-weight:700}'
    + '.kh-btn{border:1.5px solid var(--border);background:var(--sand);color:var(--ink);border-radius:10px;padding:8px 12px;font-family:inherit;font-size:11.5px;font-weight:800;cursor:pointer}'
    + '.kh-btn.primary{background:var(--green-deep);border-color:var(--green-deep);color:#fff}'
    + 'html[data-theme="dark"] .kh-btn.primary,html[data-theme="oled"] .kh-btn.primary{background:var(--sys-green);border-color:var(--sys-green);color:#06251b}'
    + '.kh-m{border:1px solid var(--border);border-radius:11px;background:var(--sand);padding:9px 11px;margin-bottom:6px;display:flex;align-items:center;gap:9px;flex-wrap:wrap}'
    + '.kh-n{flex:1;min-width:96px;font-size:12px;font-weight:800;color:var(--ink)}'
    + '.kh-n small{display:block;font-size:10px;color:var(--muted);font-weight:600;margin-top:1px}'
    + '.kh-pg{font-size:10.5px;font-weight:800;color:var(--muted);background:var(--card);border:1px solid var(--border);border-radius:8px;padding:4px 8px;white-space:nowrap}'
    + '.kh-go{font-size:11px;font-weight:800;color:var(--green-deep);text-decoration:none;border:1.5px solid var(--border);border-radius:9px;padding:6px 10px;white-space:nowrap}'
    + 'html[data-theme="dark"] .kh-go,html[data-theme="oled"] .kh-go{color:var(--sys-green)}'
    + '.kh-ck{width:28px;height:28px;border-radius:9px;border:1.5px solid var(--border);background:var(--card);cursor:pointer;display:grid;place-items:center;font-size:13px;color:transparent;flex:0 0 auto}'
    + '.kh-ck.on{background:var(--green-soft);border-color:var(--green-soft);color:#fff}'
    + 'html[data-theme="dark"] .kh-ck.on,html[data-theme="oled"] .kh-ck.on{background:var(--sys-green);color:#06251b}'
    + '.kh-bar{height:7px;border-radius:99px;background:var(--border);overflow:hidden;margin:10px 0 4px}'
    + '.kh-bar i{display:block;height:100%;background:linear-gradient(90deg,var(--gold),var(--green-soft));border-radius:99px;transition:width .4s}'
    + '.kh-foot{font-size:10.5px;color:var(--muted);line-height:1.7;display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap}';

  function injectCSS() {
    if (document.getElementById('zad-kh-css')) return;
    var st = document.createElement('style'); st.id = 'zad-kh-css'; st.textContent = CSS;
    document.head.appendChild(st);
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function mount(el, opts) {
    if (!el) return;
    injectCSS();
    el.classList.add('kh-card');
    var o = opts || {};

    function draw() {
      var s = read();
      var count = s.members.length || (o.defaultCount || 5);
      var p = plan(count);
      var doneCount = s.members.filter(function (m, i) { return s.done[i] || s.done[m]; }).length;
      var pct = s.members.length ? Math.round(doneCount / s.members.length * 100) : 0;
      var members = p.map(function (row, i) {
        var name = s.members[i] || ('الفرد ' + ar(i + 1));
        var isDone = !!s.done[i];
        return '<div class="kh-m">'
          + '<button class="kh-ck ' + (isDone ? 'on' : '') + '" data-i="' + i + '" role="checkbox" aria-checked="' + isDone + '" aria-label="ختم ' + esc(name) + '">✓</button>'
          + '<div class="kh-n">' + esc(name) + '<small>الجزء ' + ar(row.juzFrom) + (row.juzTo !== row.juzFrom ? '–' + ar(row.juzTo) : '') + ' · ' + ar(row.pages) + ' صفحة</small></div>'
          + '<span class="kh-pg">' + ar(row.from) + '–' + ar(row.to) + '</span>'
          + '<a class="kh-go" href="mushaf-quran.html?page=' + row.from + '">افتح ←</a>'
          + '</div>';
      }).join('');

      el.innerHTML =
        '<div class="kh-h">👨‍👩‍👧 <b>الختمة العائلية</b><span class="p">' + (doneCount ? ar(doneCount) + ' / ' + ar(s.members.length) : ar(count) + ' أفراد') + '</span></div>'
        + '<div class="kh-sub">وزّع ٦٠٤ صفحة على من في مجموعتك — كل واحد يقرأ جزأه ويرجع يعلّم «تم». بلا شبكة اجتماعية، بلا حساب.</div>'
        + '<div class="kh-row"><span class="lb">عدد الأفراد</span><input id="kh-count" type="number" min="1" max="60" value="' + count + '">'
        + (o.withGroup ? '<button class="kh-btn" id="kh-pull">↧ من مجموعتي</button>' : '')
        + '<button class="kh-btn" id="kh-shuffle">⇄ إعادة التوزيع</button>'
        + '<button class="kh-btn primary" id="kh-share">📤 شارك الخطة</button></div>'
        + members
        + '<div class="kh-bar"><i style="width:' + pct + '%"></i></div>'
        + '<div class="kh-foot"><span>' + (s.members.length === count ? 'كل فرد يعرف نصيبه بالصفحة والجزء' : 'اضغط «إعادة التوزيع» لتثبيت الخطة') + '</span>'
        + '<span>' + ar(pct) + '٪ مكتمل</span></div>';

      var inp = el.querySelector('#kh-count');
      inp.oninput = function () {
        var n = Math.max(1, Math.min(60, +inp.value || 1));
        var s2 = read();
        s2.members = plan(n).map(function (r, i) { return s2.members[i] || ('الفرد ' + (i + 1)); });
        write(s2);
        draw();
      };
      var shuffle = el.querySelector('#kh-shuffle');
      shuffle.onclick = function () {
        var n = Math.max(1, Math.min(60, +inp.value || 1));
        var s2 = read();
        s2.members = plan(n).map(function (r, i) { return s2.members[i] || ('الفرد ' + (i + 1)); });
        s2.startedAt = s2.startedAt || new Date().toISOString();
        write(s2); draw();
      };
      var share = el.querySelector('#kh-share');
      share.onclick = function () {
        var s2 = read();
        var lines = plan(s2.members.length || count).map(function (r, i) {
          return '• ' + (s2.members[i] || ('الفرد ' + (i + 1))) + ': الجزء ' + r.juzFrom + (r.juzTo !== r.juzFrom ? '–' + r.juzTo : '') + ' (ص ' + r.from + '–' + r.to + ')';
        });
        var text = 'ختمة عائلتنا على زاد 🌿\n' + lines.join('\n') + '\n\nzad.codeandcanvas.net/mushaf.html';
        if (navigator.share) navigator.share({ title: 'الختمة العائلية — زاد', text: text }).catch(function () {});
        else if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () {
          share.textContent = '✓ نُسخت';
          setTimeout(function () { share.textContent = '📤 شارك الخطة'; }, 1700);
        });
      };
      var pull = el.querySelector('#kh-pull');
      if (pull) pull.onclick = function () {
        pullFromGroups().then(function (res) {
          if (!res || !res.members.length) {
            pull.textContent = 'لا توجد مجموعة';
            return;
          }
          var s2 = read();
          s2.groupId = res.groupId;
          s2.members = res.members.slice(0, 60);
          write(s2);
          draw();
        });
      };
      el.querySelectorAll('.kh-ck').forEach(function (b) {
        b.onclick = function () {
          var i = +b.getAttribute('data-i');
          var s2 = read();
          s2.done[i] = !s2.done[i];
          write(s2);
          draw();
        };
      });
    }
    draw();
    subs.push(draw);
  }

  window.ZadKhatma = {
    _inited: true,
    plan: plan,
    read: read,
    write: write,
    mount: mount,
    pullFromGroups: pullFromGroups,
    TOTAL_PAGES: TOTAL_PAGES
  };
})();
