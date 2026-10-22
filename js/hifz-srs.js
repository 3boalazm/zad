/* ═══════════════════════════════════════════════════════════════════════════
   زاد — الورد الذكي (تكرار متباعد)  ·  js/hifz-srs.js
   ─────────────────────────────────────────────────────────────────────────
   المشكلة: الورد كان عدّادًا — تقرأ وتُغلق، ثم تنسى. لا يعرف التطبيق أن آيةً
   تعثّرت فيها مرّتين ولا أن أخرى أتقنتها ثلاثًا.

   الحل: جدول مراجعة مرتكز على الآية، بلا خادم:
     • «تعثّرت»  → ترجع غدًا (وفورًا تخفض الفاصل).
     • «أتقنت»   → الفاصل: ١ → ٣ → ٧ → ١٦ … يومًا (SM-2 مبسّط).
     • «سهلة»    → قفزة أكبر.
   كل آية تُخزَّن بمفتاح «سورة:آية»، ويُحتفظ بآخر ٤٠٠ آية فقط.

   يُستخدم من: tasmee.html (تصحيح التلاوة) · mushaf.html (الورد) ·
              mushaf-quran.html (بطاقة «مراجعة اليوم»).
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window.ZadSRS && window.ZadSRS._inited) return;

  var KEY = 'zad_srs_v1';
  var MAX = 400;
  var DAY = 86400000;

  function today() { var d = new Date(); return d.toISOString().slice(0, 10); }
  function dayNum(iso) { return Math.round(new Date(iso + 'T00:00:00').getTime() / DAY); }

  function read() {
    var raw;
    try { raw = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { raw = null; }
    if (!raw || typeof raw !== 'object') raw = { items: {}, meta: { added: 0, reviews: 0 } };
    raw.items = raw.items || {};
    raw.meta = raw.meta || { added: 0, reviews: 0 };
    return raw;
  }
  function write(db) {
    /* حماية من التضخّم: نحتفظ بالأقرب استحقاقًا */
    var keys = Object.keys(db.items);
    if (keys.length > MAX) {
      keys.sort(function (a, b) { return (db.items[a].due || '') < (db.items[b].due || '') ? -1 : 1; });
      keys.slice(0, keys.length - MAX).forEach(function (k) { delete db.items[k]; });
    }
    try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) {}
  }

  /* ── التقييم ──────────────────────────────────────────────────────────────
     q: 0 = تعثّرت · 3 = أتقنت بصعوبة · 5 = سهلة
     الإرجاع: العنصر بعد التحديث. */
  function gradeKey(key, q, name) {
    var db = read();
    var now = new Date();
    var it = db.items[key] || {
      k: key, n: name || '', ef: 2.5, ivl: 1, reps: 0, lapses: 0,
      due: today(), first: today(), last: null, ok: 0, bad: 0
    };
    it.last = today();
    if (q < 3) {
      it.reps = 0;
      it.ivl = 1;
      it.ef = Math.max(1.3, it.ef - 0.2);
      it.lapses++;
      it.bad++;
    } else {
      it.reps++;
      it.ok++;
      if (it.reps === 1) it.ivl = 3;
      else if (it.reps === 2) it.ivl = 7;
      else if (it.reps === 3) it.ivl = 16;
      else it.ivl = Math.round(it.ivl * it.ef);
      it.ef = Math.min(2.9, it.ef + (q === 5 ? 0.12 : 0.02));
      if (q === 5 && it.reps === 1) it.ivl = 7;   /* «سهلة» من أول مرة */
    }
    it.ivl = Math.max(1, Math.min(180, it.ivl));
    var next = new Date(now.getTime() + it.ivl * DAY);
    it.due = next.toISOString().slice(0, 10);
    db.items[key] = it;
    db.meta.reviews++;
    if (!db.meta.added || !db.items[key].first || it.reps === 1 && it.ok === 1 && !it._counted) { db.meta.added++; it._counted = 1; }
    write(db);
    emit();
    return it;
  }

  function add(surah, ayah, name) {
    var key = surah + ':' + ayah;
    var db = read();
    if (db.items[key]) return db.items[key];
    db.items[key] = {
      k: key, n: name || '', ef: 2.5, ivl: 1, reps: 0, lapses: 0,
      due: today(), first: today(), last: null, ok: 0, bad: 0
    };
    db.meta.added++;
    write(db);
    emit();
    return db.items[key];
  }

  function dueList(dateIso) {
    var db = read();
    var d = dateIso || today();
    return Object.keys(db.items)
      .map(function (k) { return db.items[k]; })
      .filter(function (it) { return (it.due || '') <= d; })
      .sort(function (a, b) {
        if (a.due > b.due) return 1;
        if (a.due < b.due) return -1;
        return (a.ivl || 1) - (b.ivl || 1);
      });
  }

  function stats() {
    var db = read();
    var all = Object.keys(db.items).map(function (k) { return db.items[k]; });
    var d = today();
    var due = all.filter(function (i) { return (i.due || '') <= d; });
    var tomorrow = new Date(Date.now() + DAY).toISOString().slice(0, 10);
    var soon = all.filter(function (i) { return i.due === tomorrow; });
    var weak = all.filter(function (i) { return (i.lapses || 0) > 0 && (i.reps || 0) < 2; });
    return { total: all.length, due: due.length, tomorrow: soon.length, weak: weak.length, reviews: db.meta.reviews || 0 };
  }

  function link(it) {
    if (!it) return 'mushaf-quran.html';
    var parts = String(it.k).split(':');
    return 'mushaf-quran.html?surah=' + parts[0] + '&ayah=' + parts[1];
  }

  /* ── الحدث ────────────────────────────────────────────────────────────── */
  var subs = [];
  function emit() { subs.forEach(function (f) { try { f(); } catch (e) {} }); }

  /* ── واجهة البطاقة (تُحقن في mushaf.html / mushaf-quran.html) ─────────── */
  var CSS = ''
    + '.srs-card{background:var(--card);border:1.5px solid var(--border);border-radius:16px;padding:15px 16px;margin:0 0 16px;box-shadow:var(--shadow-sm)}'
    + '.srs-h{display:flex;align-items:center;gap:9px;margin-bottom:4px}'
    + '.srs-h b{font-size:14px;font-weight:900;color:var(--green-deep);font-family:"ThmanyahSans",sans-serif}'
    + 'html[data-theme="dark"] .srs-h b,html[data-theme="oled"] .srs-h b{color:var(--sys-green)}'
    + '.srs-h .n{margin-inline-start:auto;font-size:10.5px;font-weight:800;color:var(--muted);background:var(--sand);border:1px solid var(--border);border-radius:99px;padding:3px 9px}'
    + '.srs-sub{font-size:11.5px;color:var(--muted);line-height:1.8;margin-bottom:10px}'
    + '.srs-item{display:flex;align-items:center;gap:8px;padding:9px 10px;border:1px solid var(--border);border-radius:11px;background:var(--sand);margin-bottom:6px;flex-wrap:wrap}'
    + '.srs-k{flex:1;min-width:120px;font-size:12px;font-weight:800;color:var(--ink)}'
    + '.srs-k small{display:block;font-size:10px;color:var(--muted);font-weight:600;margin-top:1px}'
    + '.srs-b{border:1.5px solid var(--border);background:var(--card);color:var(--ink);border-radius:9px;padding:6px 10px;font-family:inherit;font-size:11px;font-weight:800;cursor:pointer;white-space:nowrap}'
    + '.srs-b.ok{border-color:rgba(42,122,95,.4);color:var(--green-deep)}'
    + '.srs-b.bad{border-color:rgba(168,68,47,.35);color:#8f3a27}'
    + 'html[data-theme="dark"] .srs-b.ok,html[data-theme="oled"] .srs-b.ok{color:var(--sys-green);border-color:#1e4433}'
    + 'html[data-theme="dark"] .srs-b.bad,html[data-theme="oled"] .srs-b.bad{color:#ff9a80;border-color:#5c2e26}'
    + '.srs-b:active{transform:scale(.96)}'
    + '.srs-empty{font-size:11.5px;color:var(--muted);line-height:1.8;background:var(--sand);border:1px dashed var(--border);border-radius:10px;padding:11px 13px}'
    + '.srs-foot{display:flex;gap:8px;flex-wrap:wrap;margin-top:9px}'
    + '.srs-link{font-size:11px;font-weight:800;color:var(--green-deep);text-decoration:none;border:1.5px solid var(--border);border-radius:9px;padding:7px 11px}'
    + 'html[data-theme="dark"] .srs-link,html[data-theme="oled"] .srs-link{color:var(--sys-green)}';

  function injectCSS() {
    if (document.getElementById('zad-srs-css')) return;
    var st = document.createElement('style');
    st.id = 'zad-srs-css'; st.textContent = CSS;
    document.head.appendChild(st);
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function ar(n) { return String(n).replace(/\d/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }); }

  /* mount(el, opts) — يبني بطاقة المراجعة ويتحدّث تلقائيًا */
  function mount(el, opts) {
    if (!el) return;
    injectCSS();
    el.classList.add('srs-card');
    var o = opts || {};
    function draw() {
      var s = stats();
      var due = dueList().slice(0, o.limit || 5);
      var rows = due.map(function (it) {
        return '<div class="srs-item">'
          + '<div class="srs-k">' + esc(it.n || ('آية ' + it.k)) + '<small>مستحقّة اليوم · تكرّرت ' + ar(it.reps || 0) + ' مرة</small></div>'
          + '<a class="srs-b" href="' + link(it) + '" style="text-decoration:none">افتح</a>'
          + '<button class="srs-b bad" data-k="' + esc(it.k) + '" data-q="2">تعثّرت</button>'
          + '<button class="srs-b ok" data-k="' + esc(it.k) + '" data-q="4">أتقنت</button>'
          + '</div>';
      }).join('');
      el.innerHTML =
        '<div class="srs-h">🧠 <b>مراجعة اليوم</b><span class="n">' + (s.due ? ar(s.due) + ' مستحقّة' : 'لا شيء مستحق') + '</span></div>'
        + '<div class="srs-sub">التكرار المتباعد: ما تعثّرت فيه يعود غدًا، وما أتقنته يعود بعد ٣ ثم ٧ ثم ١٦ يومًا. '
        + 'المحفوظ عندك: <b>' + ar(s.total) + '</b> آية' + (s.tomorrow ? ' · غدًا: ' + ar(s.tomorrow) : '') + '.</div>'
        + (rows || '<div class="srs-empty">لا شيء مستحقّ اليوم — اقرأ وردك، وما تتعثّر فيه سيُضاف تلقائيًا من صفحة التسميع.</div>')
        + '<div class="srs-foot"><a class="srs-link" href="tasmee.html">🎙️ تسميع لآية جديدة</a>'
        + '<a class="srs-link" href="mushaf-quran.html">🕋 المصحف</a></div>';
      el.querySelectorAll('[data-k]').forEach(function (btn) {
        btn.onclick = function () {
          gradeKey(btn.getAttribute('data-k'), +btn.getAttribute('data-q'));
          if (navigator.vibrate) navigator.vibrate(15);
          draw();
        };
      });
    }
    draw();
    subs.push(draw);
  }

  window.ZadSRS = {
    _inited: true,
    read: read,
    add: add,
    grade: gradeKey,
    due: dueList,
    stats: stats,
    link: link,
    mount: mount,
    today: today,
    onUpdate: function (f) { subs.push(f); },
    clear: function () { try { localStorage.removeItem(KEY); } catch (e) {} emit(); }
  };
})();
