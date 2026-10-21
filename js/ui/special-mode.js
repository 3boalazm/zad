/* ══════════════════════════════════════════════════════════════════
   الوضع الخاص (وضع العذر) — مصدر واحد للحقيقة
   ──────────────────────────────────────────────────────────────────
   • يُخزَّن في zad_v2: excuseMode (bool) · excused (map) · excuseSince (YYYY-MM-DD)
   • لا يلمس worship إطلاقًا: العبادات المعذورة تُستبعَد من المقام (العدّاد)
     بدل ما تُسجَّل كـ«مُنفَّذة» — ده كان بيحرّف الإحصاءات ويضيّع سجلها.
   • يضبط data-excuse="on" على <html> (ثيم وردي موجود في style.css/min.css)
   • يوزّع حدث zad:special على document عند أي تغيير
   • يضيف شريطًا صغيرًا قابلًا للإخفاء في الصفحات الأخرى للتذكير
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var KEY = 'zad_v2';
  var DEFAULT_KEYS = ['fajr', 'zuhr', 'asr', 'maghrib', 'isha', 'rawatib', 'duha', 'qiyam', 'fasting'];

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; }
  }

  /* كتابة مزدوجة: localStorage مباشرة (للقراءة الفورية) + zadPatchState
     (عشان STATE في app.min.js ما يمسحهاش عند الحفظ التالي) */
  function write(patch) {
    var s = read();
    for (var k in patch) {
      if (Object.prototype.hasOwnProperty.call(patch, k)) s[k] = patch[k];
    }
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
    if (window.zadPatchState) { try { window.zadPatchState(patch); } catch (e) {} }
  }

  function localISO(d) {
    d = d || new Date();
    var m = ('0' + (d.getMonth() + 1)).slice(-2);
    var day = ('0' + d.getDate()).slice(-2);
    return d.getFullYear() + '-' + m + '-' + day;
  }

  var S = {
    keys: DEFAULT_KEYS.slice(),
    localISO: localISO,

    state: function () {
      var s = read();
      return {
        on: !!s.excuseMode,
        since: s.excuseSince || null,
        keys: (s.excused && Object.keys(s.excused)) || []
      };
    },

    isOn: function () { return !!read().excuseMode; },

    isExcused: function (k) {
      var s = read();
      return !!s.excuseMode && !!(s.excused && s.excused[k]);
    },

    /* المفاتيح المطلوبة بعد استبعاد المعذورة (للمقامات/النِسب) */
    required: function (list) {
      return (list || []).filter(function (k) { return !S.isExcused(k); });
    },

    /* عدد أيام الوضع الحالي (١ لو بدأ النهارده) */
    days: function () {
      var s = read();
      if (!s.excuseSince) return 0;
      var a = new Date(s.excuseSince + 'T00:00:00');
      var b = new Date();
      var d = Math.floor((b - a) / 86400000) + 1;
      return d > 0 ? d : 1;
    },

    set: function (on) {
      var excused = {};
      if (on) {
        DEFAULT_KEYS.forEach(function (k) { excused[k] = 1; });
      }
      write({
        excuseMode: !!on,
        excused: excused,
        excuseSince: on ? (read().excuseSince || localISO()) : null
      });
      S.apply();
      try { document.dispatchEvent(new CustomEvent('zad:special', { detail: S.state() })); } catch (e) {}
      return S.state();
    },

    apply: function () {
      var on = S.isOn();
      /* شفاء ذاتي: وضع مفعّل من نسخة قديمة بلا قائمة excused ⇒ استكملها */
      if (on) {
        var st = read();
        if (!st.excused || !Object.keys(st.excused).length) {
          var heal = {};
          DEFAULT_KEYS.forEach(function (k) { heal[k] = 1; });
          write({ excused: heal, excuseSince: st.excuseSince || localISO() });
        }
      }
      document.documentElement.setAttribute('data-excuse', on ? 'on' : 'off');
      if (document.body) document.body.classList.toggle('zad-excused', on);
      var sw = document.getElementById('zh-switch');
      if (sw) sw.checked = on;
    },

    /* شريط تذكير صغير في الصفحات الأخرى — قابل للإخفاء لهذه الجلسة */
    injectBanner: function () {
      if (!S.isOn()) return;
      if (document.getElementById('zad-excuse-pill')) return;
      try { if (sessionStorage.getItem('zad_excuse_pill_off') === '1') return; } catch (e) {}
      var b = document.createElement('a');
      b.id = 'zad-excuse-pill';
      b.href = 'zahra.html';
      b.innerHTML = '<span aria-hidden="true">🌸</span> الوضع الخاص مُفعّل';
      b.title = 'الصلاة والصيام معذورة اليوم — اضغطي للإدارة';
      b.style.cssText = 'position:fixed;bottom:calc(env(safe-area-inset-bottom,0px) + 78px);inset-inline-start:14px;z-index:8800;' +
        'background:linear-gradient(135deg,#d4789f,#a84d77);color:#fff;font-size:12px;font-weight:800;' +
        'padding:9px 14px;border-radius:999px;text-decoration:none;box-shadow:0 10px 28px -10px rgba(168,77,119,.75);' +
        'display:flex;align-items:center;gap:6px;max-width:78vw';
      var x = document.createElement('span');
      x.textContent = '✕';
      x.setAttribute('role', 'button');
      x.setAttribute('aria-label', 'إخفاء التذكير');
      x.style.cssText = 'margin-inline-start:6px;opacity:.85;font-size:11px;padding:0 2px';
      x.addEventListener('click', function (ev) {
        ev.preventDefault(); ev.stopPropagation();
        try { sessionStorage.setItem('zad_excuse_pill_off', '1'); } catch (e) {}
        b.remove();
      });
      b.appendChild(x);
      document.body.appendChild(b);
    }
  };

  window.ZadSpecial = S;

  /* تطبيق فوري (السكربت defer فالصفحة جاهزة) */
  S.apply();
  if (document.body) S.injectBanner();
  else document.addEventListener('DOMContentLoaded', S.injectBanner);

  /* أي تغيير من تاب آخر */
  window.addEventListener('storage', function (e) {
    if (e.key === KEY) { S.apply(); S.injectBanner(); }
  });
})();
