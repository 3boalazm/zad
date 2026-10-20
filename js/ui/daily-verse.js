/* ═══════════════════════════════════════════════════════════════════════════
   زاد — محرّك «آية اليوم»
   ─────────────────────────────────────────────────────────────────────────
   المشكلة التي يحلّها: كانت الصفحة تختار من ٤ آيات فقط للصباح و٤ للمساء،
   والاختيار كان `new Date().getDate() % 4` أي أنه يعيد نفس الآية في نفس
   اليوم من كل شهر، ومن نفس المجموعة الصغيرة.

   الحل: مصرف من ١٧٧ آية (js/data/verses.js) نصّها مأخوذ حرفيًا من المصحف،
   والاختيار تابع لليوم نفسه:
     • ثابت طول اليوم — لا تتغيّر الآية لو حدّثت الصفحة أو رجعت لها.
     • متغيّر كل يوم — معامل مختلف في كل يوم عبر دالة توزيع بسيطة.
     • الصباح يفضّل آيات الصباح/أي وقت، والمساء يفضّل آيات المساء/أي وقت.
   ولا يعتمد على localStorage إطلاقًا، فالمستخدم الجديد يرى آية اليوم لا فراغًا.
   ═══════════════════════════════════════════════════════════════════════════ */
window.ZadVerse = (function () {
  'use strict';

  /* احتياط أخير لو لم يُحمَّل ملف البيانات لأي سبب */
  var FALLBACK = [
    { s: 2, a: 286, t: 'تخفيف', n: 'a', x: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا' },
    { s: 94, a: 6, t: 'يُسر', n: 'a', x: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا' },
    { s: 13, a: 28, t: 'طمأنينة', n: 'a', x: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ' },
    { s: 39, a: 53, t: 'رحمة', n: 'a', x: 'قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ' }
  ];

  var SURAHS = window.ZAD_SURAHS || {};

  function lib() {
    var v = window.ZAD_VERSES;
    return (v && v.length) ? v : FALLBACK;
  }

  /* رقم اليوم منذ 1970 بتوقيت المستخدم (لا UTC، حتى لا يتغيّر قبل منتصفه) */
  function dayNumber(d) {
    d = d || new Date();
    return Math.floor((d.getFullYear() * 372 + (d.getMonth() + 1) * 31 + d.getDate()));
  }

  /* خطوة أولية متوافقة مع طول المصرف: GCD(step, len)=1
     فتمرّ الآيات كلها دورةً كاملة قبل أن تعود الأولى، بلا تكرار مبكر. */
  var STEPS = [7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
  function stride(len) {
    for (var i = 0; i < STEPS.length; i++) {
      if (len % STEPS[i] !== 0) return STEPS[i];
    }
    return 1;
  }

  /* الفترة: صباح من ٤ إلى ١٦، وما بعدها مساء */
  function part(d) {
    var h = (d || new Date()).getHours();
    return (h >= 4 && h < 16) ? 'm' : 'e';
  }

  function pool(p) {
    var all = lib();
    var pick = all.filter(function (v) { return v.n === p; });
    var any = all.filter(function (v) { return v.n === 'a'; });
    /* آيات الفترة أولًا ثم آيات «أي وقت» — الاثنان مرشّحان */
    return pick.concat(any);
  }

  function choose(list, day, salt) {
    if (!list.length) return FALLBACK[0];
    var len = list.length;
    var idx = ((day % len) * stride(len) + salt) % len;
    return list[idx];
  }

  /**
   * آية اليوم — ثابتة طول اليوم، متغيّرة كل يوم.
   * @param {Date}  [date]
   * @param {string}[forcePart] 'm' أو 'e' لتجاوز الساعة
   */
  function today(date, forcePart) {
    var d = date || new Date();
    var p = forcePart || part(d);
    var v = choose(pool(p), dayNumber(d), p === 'm' ? 7 : 13);
    return describe(v, p, d);
  }

  /** آية أخرى (زر «آية أخرى») — عشوائية حقيقية، لا تمسّ آية اليوم */
  function another(current, date, forcePart) {
    var d = date || new Date();
    var p = forcePart || part(d);
    var list = pool(p);
    if (list.length < 2) return describe(FALLBACK[0], p, d);
    var v, guard = 0;
    do { v = list[Math.floor(Math.random() * list.length)]; }
    while (current && v.x === current.text && ++guard < 12);
    return describe(v, p, d);
  }

  /** تهيئة الشكل النهائي للعرض */
  function describe(v, p, d) {
    var surahName = SURAHS[v.s] || ('سورة ' + v.s);
    return {
      ref: v.s + ':' + v.a,
      surah: surahName,
      ayah: v.a,
      text: v.x,
      theme: v.t,
      part: p,
      eyebrow: p === 'm' ? '☀️ آية الصباح' : '🌙 آية المساء',
      source: '﴿ ' + surahName + ': ' + toArabicDigits(v.a) + ' ﴾',
      citation: surahName + ' — الآية ' + toArabicDigits(v.a),
      share: (p === 'm' ? '☀️ آية الصباح' : '🌙 آية المساء') + '\n\n' + v.x
             + '\n﴿ ' + surahName + ': ' + toArabicDigits(v.a) + ' ﴾\n\nزاد'
    };
  }

  function toArabicDigits(n) {
    return String(n).replace(/[0-9]/g, function (c) { return '٠١٢٣٤٥٦٧٨٩'[+c]; });
  }

  /** إحصاءات تُعرض في المكتبة */
  function stats() {
    var all = lib();
    var byTheme = {};
    all.forEach(function (v) { byTheme[v.t] = (byTheme[v.t] || 0) + 1; });
    return {
      total: all.length,
      morning: all.filter(function (v) { return v.n === 'm'; }).length,
      evening: all.filter(function (v) { return v.n === 'e'; }).length,
      anytime: all.filter(function (v) { return v.n === 'a'; }).length,
      themes: Object.keys(byTheme).length,
      byTheme: byTheme
    };
  }

  /** كل الآيات — لصفحة استعراض/بحث */
  function all() {
    return lib().map(function (v) { return describe(v, v.n, new Date()); });
  }

  return { today: today, another: another, part: part, stats: stats, all: all, dayNumber: dayNumber };
})();
