/* ═══════════════════════════════════════════════════════════════════════════
   زاد — تحميل خطوط الويب بيدك  ·  js/web-fonts.js
   ─────────────────────────────────────────────────────────────────────────
   قبل هذا الملف كانت كل صفحة تحمل وسمًا مباشرًا إلى fonts.googleapis.com،
   فيخرج الطلب لمجرّد فتح الصفحة — قبل أن يستطيع أي كود أن يسألك.

   الآن: الوسم صار <script src="js/web-fonts.js" data-f="Family:wght@400;700">
   وهذا الملف يقرأ السياسة أولًا:
     • مفتوحة  → يُحقن رابط الخط بنفس أسلوب media=print/onload (بلا حجب للرسم)
     • مغلقة   → لا يُحقن شيء، ويعود النص لخط النظام
   النتيجة: يمكن إيقاف خطوط Google فعليًا، لا «نظريًا».
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var FAMILIES = (document.currentScript && document.currentScript.getAttribute('data-f')) || '';
  var allow = true;
  try {
    var p = JSON.parse(localStorage.getItem('zad_net_policy') || '{}') || {};
    if (p.googleFonts === false) allow = false;
  } catch (e) {}

  if (!allow) {
    document.documentElement.setAttribute('data-web-fonts', 'system');
    return;
  }
  if (!FAMILIES) return;

  try {
    /* preconnect مبكر لهذا الطلب فقط، احترامًا للسياسة */
    ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'].forEach(function (h, i) {
      var pre = document.createElement('link');
      pre.rel = 'preconnect'; pre.href = h;
      if (i === 1) pre.crossOrigin = 'anonymous';
      document.head.appendChild(pre);
    });
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=' + FAMILIES + '&display=swap';
    l.media = 'print';
    l.onload = function () { try { this.media = 'all'; } catch (e) {} };
    document.head.appendChild(l);
  } catch (e) {}
})();
