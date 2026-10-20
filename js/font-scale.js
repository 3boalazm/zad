/* ═══════════════════════════════════════════════════════════════════════
   زاد — مقياس الخط الموحّد  ·  js/font-scale.js
   ─────────────────────────────────────────────────────────────────────
   كان المنطق نفسه منسوخًا حرفيًا في 45 صفحة (635 بايت لكل صفحة)،
   و11 صفحة كانت تضبط --font-scale ولا تستهلكه أبدًا، وصفحة واحدة
   (profile.html) كانت تستهلكه ولا تضبطه. هنا مصدر واحد:

     • يقرأ zad_font_size (small | medium | large | system | null)
     • يستشعر حجم خط النظام عند الغياب أو عند 'system'
     • يحقن قاعدة الاستهلاك (body → --font-scale) بنفسه، فلا تحتاج
       أي صفحة أن تكرّرها في <style> خاص بها
     • يوفّر window.zadFontScale.set('large') للتغيير الحيّ من الإعدادات
       ويُطلق حدث zad:fontscale لأي مستمع

   الترتيب مهم: الملف يُحمَّل في <head> بلا defer حتى يُطبَّق المقياس
   قبل أول رسم (بلا وميض FOUC).
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var KEY = 'zad_font_size';
  var MAP = { small: 0.875, medium: 1, large: 1.15 };
  var root = document.documentElement;

  /* ── قاعدة الاستهلاك: تُحقَن هنا بدل 45 نسخة في <style> ── */
  try {
    if (!document.getElementById('zad-font-scale-base')) {
      var st = document.createElement('style');
      st.id = 'zad-font-scale-base';
      st.textContent = 'html{--font-scale:1}body{font-size:calc(1rem * var(--font-scale))}';
      (document.head || root).appendChild(st);
    }
  } catch (e) {}

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  /* استشعار حجم خط النظام: 1rem الفعلي ≤14px ⇒ صغير، ≥18px ⇒ كبير */
  function systemScale() {
    var scale = 1;
    try {
      var p = document.createElement('div');
      p.style.cssText = 'position:absolute;visibility:hidden;font-size:1rem;width:1rem;height:1rem';
      (document.head || root).appendChild(p);
      var rem = parseFloat(getComputedStyle(p).width) || 16;
      (document.head || root).removeChild(p);
      scale = rem <= 14 ? 0.875 : rem >= 18 ? 1.15 : 1;
    } catch (e) {}
    return scale;
  }

  function resolve(v) {
    return (!v || v === 'system') ? systemScale() : (MAP[v] || 1);
  }

  function apply(s) {
    try { root.style.setProperty('--font-scale', String(s)); } catch (e) {}
  }

  function current() { return resolve(read()); }

  /* set('small'|'medium'|'large'|'system'|null) — أو بلا وسيط لإعادة القراءة */
  function set(value) {
    var v = value === undefined ? read() : value;
    try {
      if (v === null || v === 'system') localStorage.setItem(KEY, 'system');
      else localStorage.setItem(KEY, v);
    } catch (e) {}
    var s = resolve(v);
    apply(s);
    try {
      window.dispatchEvent(new CustomEvent('zad:fontscale', { detail: { scale: s, value: v } }));
    } catch (e) {}
    return s;
  }

  /* auto: يمسح التفضيل ويعود لاستشعار النظام */
  function auto() {
    try { localStorage.removeItem(KEY); } catch (e) {}
    var s = systemScale();
    apply(s);
    try { window.dispatchEvent(new CustomEvent('zad:fontscale', { detail: { scale: s, value: 'system' } })); } catch (e) {}
    return s;
  }

  apply(current());

  /* مزامنة بين التبويبات/النوافذ المفتوحة في الوقت نفسه */
  try {
    window.addEventListener('storage', function (e) {
      if (e.key === KEY) apply(current());
    });
  } catch (e) {}

  window.zadFontScale = { get: current, set: set, auto: auto, apply: apply, map: MAP, key: KEY };
})();
