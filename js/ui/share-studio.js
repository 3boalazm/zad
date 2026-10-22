/* ═══════════════════════════════════════════════════════════════════════════
   زاد — استوديو المشاركة (Share Studio)
   ─────────────────────────────────────────────────────────────────────────
   محرّك تصميم بطاقات مشاركة على Canvas: يحوّل أي محتوى (آية · دعاء · حديث ·
   ذكر · اسم من أسماء الله · إنجاز · فيديو · تلاوة) إلى صورة جاهزة للنشر
   بهوية المستخدم وشعار التطبيق — بدل ما الصفحة تبعت نص خام في واتساب.

   واجهة الاستخدام (API):
     ZadStudio.open({ kind, eyebrow, title, body, source, note, emoji, stats, url })
     ZadStudio.render(opts)      → HTMLCanvasElement
     ZadStudio.toBlob(opts)      → Promise<Blob>
     ZadStudio.share(opts)       → Promise<void>   (Web Share مع ملف، أو تنزيل)
     ZadStudio.close()

   • كل الحالة تُحفظ محليًا: zad_share_prefs (التصميم) + zad_share_identity (الهوية).
   • نقش الخلفية: prefs.pattern = none | stars (إسلامي) | dots | arcs | waves | grid.
   • صفر اعتماد على شبكة أو مكتبات خارجية — الخطوط والأيقونات من داخل التطبيق.
   • يتدهور بأمان: لو Canvas غير مدعوم، يرجّع للمشاركة النصية القديمة.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  if (window.ZadStudio && window.ZadStudio.__ready) return;

  /* ── مسارات الخطوط (تُحسب من موضع السكربت نفسه) ───────────────────────── */
  var SELF = (document.currentScript && document.currentScript.src) || (location.origin + '/js/ui/share-studio.js');
  var FONT_DIR = SELF.replace(/js\/ui\/share-studio\.js.*$/, 'fonts/');
  var FONT_FACES = [
    ['ZadCardDisplay', 'thmanyahserifdisplay-Bold.woff2', '700'],
    ['ZadCardDisplay', 'thmanyahserifdisplay-Black.woff2', '900'],
    ['ZadCardDisplay', 'thmanyahserifdisplay-Medium.woff2', '500'],
    ['ZadCardSerif', 'thmanyahseriftext-Regular.woff2', '400'],
    ['ZadCardSerif', 'thmanyahseriftext-Medium.woff2', '500'],
    ['ZadCardSerif', 'thmanyahseriftext-Bold.woff2', '700'],
    ['ZadCardSans', 'thmanyahsans-Bold.woff2', '700'],
    ['ZadCardSans', 'thmanyahsans-Medium.woff2', '500']
  ];

  var APP_URL = 'https://zad.codeandcanvas.net';
  var APP_DOMAIN = 'zad.codeandcanvas.net';
  var BRAND = 'زاد';
  var TAGLINE = 'رفيق العبادة والخير';

  /* شعار التطبيق الحقيقي (icons/icon-512.svg) مضمَّنًا كـ SVG لا كـ <img>:
     الصفحات الثلاث عشرة تحمّل الاستوديو بمسارات نسبية مختلفة، وصورة
     بمسار «icons/…» كانت تتكسّر في كل صفحة داخل مجلد فرعي. */
  var LOGO_SVG = '<svg class="zst-logo" viewBox="0 0 512 512" role="img" aria-label="زاد" xmlns="http://www.w3.org/2000/svg">' +
    '<rect width="512" height="512" rx="171.82" ry="171.82" fill="#09231b"/>' +
    '<path fill="#fff" d="m153.92,331.54c14.52,0,40.42-4.55,58.64-13.38l11.39-25.05c16.22-35.86,9.68-58.35-5.98-79.41l5.98-11.1-40.99-27.33h-5.69l-14.52,50.95c31.31,15.66,54.65,31.31,63.19,48.96-16.22,1.14-48.67,2.56-62.62,2.56-34.44,0-32.16-8.54-36.43-23.63h-5.69c-1.14,15.09-2.28,33.87-2.28,41.27,0,25.05,12.52,36.15,35.01,36.15Z"/>' +
    '<path fill="#fff" d="m278.31,336.09l15.09-46.68c3.42-10.82,5.12-21.92,5.12-33.3v-72.3l9.96-11.67-15.37-56.93h-5.69l-24.48,30.17,9.68,190.71h5.69Z"/>' +
    '<path fill="#e8c274" d="m383.63,151.65c.28-.28.28-4.55,0-4.84l-27.61-27.61-27.89,27.89v4.27l27.89,27.89,27.61-27.61Z"/>' +
    '<path fill="#fff" d="m358.86,201.74h-5.69l-19.36,46.11c14.52,14.52,33.59,31.88,45.54,51.24-9.11,31.31-50.95,51.81-103.61,61.2v5.69l61.2,31.03c28.18-32.73,48.39-75.71,48.39-117.84,0-4.55-.28-9.39-1.14-14.23l9.11-20.78-34.44-42.41Z"/>' +
    '</svg>';

  /* ══ ١ · لوحات الألوان ═════════════════════════════════════════════════ */
  var PALETTES = {
    emerald: { label: 'زمردي', bg: ['#072019', '#0f3d2d', '#061a14'], ink: '#fbf5e4',
      soft: 'rgba(251,245,228,.70)', accent: '#dcb96f', accent2: '#8fd0b4',
      line: 'rgba(220,185,111,.40)', chip: 'rgba(220,185,111,.13)', glow: 'rgba(127,209,169,.22)', dark: true },
    midnight: { label: 'ليلي', bg: ['#050b16', '#0d2038', '#040912'], ink: '#f4f7ff',
      soft: 'rgba(244,247,255,.68)', accent: '#e3c37c', accent2: '#8fb7e8',
      line: 'rgba(227,195,124,.38)', chip: 'rgba(143,183,232,.13)', glow: 'rgba(80,130,220,.24)', dark: true },
    ivory: { label: 'ورقي', bg: ['#fdfaf2', '#f4ecd9', '#efe4cd'], ink: '#152a21',
      soft: 'rgba(21,42,33,.74)', accent: '#a47c2a', accent2: '#2f6b52',
      line: 'rgba(164,124,42,.35)', chip: 'rgba(164,124,42,.10)', glow: 'rgba(201,161,74,.20)', dark: false },
    rose: { label: 'وردي', bg: ['#2c0d1e', '#5b1f3c', '#240a18'], ink: '#fff3f7',
      soft: 'rgba(255,243,247,.70)', accent: '#f2c6a0', accent2: '#e79ac2',
      line: 'rgba(242,198,160,.40)', chip: 'rgba(231,154,194,.14)', glow: 'rgba(231,120,180,.24)', dark: true },
    sand: { label: 'رملي', bg: ['#241a0f', '#443120', '#1b130a'], ink: '#fbf1de',
      soft: 'rgba(251,241,222,.70)', accent: '#e8c487', accent2: '#c9a06a',
      line: 'rgba(232,196,135,.40)', chip: 'rgba(232,196,135,.13)', glow: 'rgba(214,160,90,.22)', dark: true },
    ink: { label: 'حِبري', bg: ['#0a0a0a', '#171717', '#050505'], ink: '#f7f4ee',
      soft: 'rgba(247,244,238,.64)', accent: '#c9a14a', accent2: '#9fb3a8',
      line: 'rgba(201,161,74,.36)', chip: 'rgba(201,161,74,.12)', glow: 'rgba(160,160,160,.16)', dark: true }
  };

  /* ══ ٢ · المقاسات ══════════════════════════════════════════════════════ */
  var FORMATS = {
    portrait: { label: 'بورتريه ٤:٥', w: 1080, h: 1350 },
    story:    { label: 'ستوري ٩:١٦', w: 1080, h: 1920 },
    square:   { label: 'مربع ١:١',    w: 1080, h: 1080 },
    wide:     { label: 'أفقي ١:١٫٩',  w: 1200, h: 630 }
  };

  /* القوالب: auto = يختار حسب نوع المحتوى */
  var TEMPLATES = [
    { id: 'auto',        label: 'تلقائي',  icon: '✨' },
    { id: 'verse',       label: 'آية',     icon: '۞' },
    { id: 'dua',         label: 'دعاء',    icon: '🤲' },
    { id: 'quote',       label: 'اقتباس',  icon: '❝' },
    { id: 'achievement', label: 'إنجاز',   icon: '📊' },
    { id: 'media',       label: 'وسائط',   icon: '▶️' },
    { id: 'app',         label: 'بطاقة تطبيق', icon: '📱' }
  ];

  var DEFAULT_BY_KIND = {
    verse: 'verse', dua: 'dua', dhikr: 'dua', hadith: 'quote', quote: 'quote',
    name: 'quote', achievement: 'achievement', video: 'media', audio: 'media', app: 'app'
  };

  /* ══ ٣ · الخطوط ═════════════════════════════════════════════════════════ */
  var fontsInjected = false;
  function injectFonts() {
    if (fontsInjected || !document.head) return;
    fontsInjected = true;
    var css = FONT_FACES.map(function (f) {
      return '@font-face{font-family:"' + f[0] + '";src:url("' + FONT_DIR + f[1] + '") format("woff2");' +
             'font-weight:' + f[2] + ';font-display:block;font-style:normal}';
    }).join('\n');
    var st = document.createElement('style');
    st.id = 'zst-fonts';
    st.textContent = css;
    document.head.appendChild(st);
  }

  var fontsReady = null;
  function ensureFonts() {
    injectFonts();
    if (fontsReady) return fontsReady;
    if (!document.fonts || !document.fonts.load) { fontsReady = Promise.resolve(); return fontsReady; }
    var jobs = [
      document.fonts.load('700 48px "ZadCardDisplay"', 'زاد'),
      document.fonts.load('900 48px "ZadCardDisplay"', 'زاد'),
      document.fonts.load('400 32px "ZadCardSerif"', 'بسم الله'),
      document.fonts.load('700 32px "ZadCardSerif"', 'بسم الله'),
      document.fonts.load('700 24px "ZadCardSans"', 'زاد')
    ];
    fontsReady = Promise.all(jobs.map(function (p) { return p.catch(function () {}); }))
      .then(function () { return document.fonts.ready; })
      .catch(function () {});
    return fontsReady;
  }

  function F(kind, size, weight) {
    var fam = kind === 'display' ? '"ZadCardDisplay", "ThmanyahDisplay", serif'
            : kind === 'serif'   ? '"ZadCardSerif", "Amiri", serif'
            : '"ZadCardSans", "ThmanyahSans", system-ui, sans-serif';
    return (weight || 400) + ' ' + size + 'px ' + fam;
  }

  /* ══ ٤ · التفضيلات والهوية (localStorage) ═══════════════════════════════ */
  var PREFS_KEY = 'zad_share_prefs';
  var IDENTITY_KEY = 'zad_share_identity';

  function profileIdentity() {
    var p = {};
    try { p = JSON.parse(localStorage.getItem('zad_profile') || '{}') || {}; } catch (e) {}
    return { name: p.name || '', handle: '', avatar: p.avatar || '🌙', logo: '', bg: '', scrim: 55 };
  }

  var identityMeta = { profileName: '' };

  function loadIdentity() {
    var base = profileIdentity();
    identityMeta.profileName = base.name || '';
    try {
      var saved = JSON.parse(localStorage.getItem(IDENTITY_KEY) || 'null');
      if (saved && typeof saved === 'object') {
        // الاسم: إن كتب المستخدم اسمًا مخصصًا للبطاقة نستخدمه،
        // وإلا نتبع اسم البروفايل (اللي بيتغيّر من الإعدادات).
        var custom = saved.name && saved.name !== saved.profileName;
        base.name = custom ? saved.name : (base.name || saved.name || '');
        base.handle = saved.handle || '';
        base.avatar = saved.avatar || base.avatar;
        base.logo = saved.logo || '';
        base.bg = saved.bg || '';
        if (typeof saved.scrim === 'number') base.scrim = saved.scrim;
      }
    } catch (e) {}
    return base;
  }

  var DEFAULT_PREFS = {
    template: 'auto', palette: 'emerald', format: 'portrait', pattern: 'stars',
    size: 1, align: 'center',
    showIdentity: true, showLogo: true, showSource: true, showDate: true,
    showFrame: true
  };

  function loadPrefs() {
    var p = Object.assign({}, DEFAULT_PREFS);
    try {
      var saved = JSON.parse(localStorage.getItem(PREFS_KEY) || 'null');
      if (saved && typeof saved === 'object') Object.keys(p).forEach(function (k) {
        if (saved[k] !== undefined) p[k] = saved[k];
      });
    } catch (e) {}
    if (!FORMATS[p.format]) p.format = 'portrait';
    if (!PALETTES[p.palette]) p.palette = 'emerald';
    if (!hasPattern(p.pattern)) p.pattern = 'stars';
    return p;
  }
  function savePrefs(p) { try { localStorage.setItem(PREFS_KEY, JSON.stringify(p)); } catch (e) {} }
  function saveIdentity(id) {
    try {
      localStorage.setItem(IDENTITY_KEY, JSON.stringify({
        name: id.name, handle: id.handle, avatar: id.avatar,
        logo: id.logo, bg: id.bg, scrim: id.scrim,
        profileName: identityMeta.profileName || ''
      }));
    } catch (e) { /* الحصة ممتلئة — الصورة تبقى في الذاكرة للجلسة الحالية */ }
  }

  /* ══ ٥ · أدوات رسم ══════════════════════════════════════════════════════ */
  function roundRect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    if (ctx.roundRect) { ctx.roundRect(x, y, w, h, r); return; }
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function glow(ctx, x, y, r, color) {
    var g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }

  /* ══ نقوش الخلفية: ٤ حديثة بسيطة + ١ إسلامي ══════════════════════════════
     كلها تُرسم بأشكال أوليّة (خطوط/دوائر) لا بـ createPattern(canvas) —
     @napi-rs/canvas (المستخدم في توليد العيّنات) لا يدعمها، وكذلك بعض
     المتصفحات القديمة. الشفافية منخفضة جدًا حتى يبقى النص هو البطل. */
  var PATTERNS = [
    { id: 'none',  label: 'بدون' },
    { id: 'stars', label: 'نجوم إسلامية' },
    { id: 'dots',  label: 'نقاط' },
    { id: 'arcs',  label: 'أقواس' },
    { id: 'waves', label: 'موج' },
    { id: 'grid',  label: 'شبكة' }
  ];
  function hasPattern(id) {
    for (var i = 0; i < PATTERNS.length; i++) if (PATTERNS[i].id === id) return true;
    return false;
  }
  function patInk(P, a) {
    return P.dark ? 'rgba(255,255,255,' + a + ')' : 'rgba(21,42,33,' + a + ')';
  }

  /* إسلامي: شبكة نجوم ثمانية + معيّن صغير في القلب */
  function patStars(ctx, W, H, P, u) {
    var step = Math.round(78 * u);
    ctx.save();
    ctx.strokeStyle = P.accent;
    ctx.globalAlpha = P.dark ? 0.085 : 0.13;
    ctx.lineWidth = Math.max(1, 1.05 * u);
    ctx.lineJoin = 'round';
    for (var y = -step; y < H + step; y += step) {
      for (var x = -step; x < W + step; x += step) {
        var cx = x + (Math.floor(y / step) % 2 ? step / 2 : 0), cy = y;
        ctx.beginPath();
        for (var i = 0; i < 8; i++) {
          var a = (Math.PI / 4) * i - Math.PI / 2;
          var r = i % 2 ? step * 0.17 : step * 0.31;
          var px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r;
          i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
        }
        ctx.closePath(); ctx.stroke();

        ctx.beginPath();
        var d = step * 0.075;
        ctx.moveTo(cx, cy - d); ctx.lineTo(cx + d, cy); ctx.lineTo(cx, cy + d); ctx.lineTo(cx - d, cy);
        ctx.closePath(); ctx.stroke();
      }
    }
    ctx.restore();
  }

  /* حديث ١: نقاط متبادلة الإزاحة */
  function patDots(ctx, W, H, P, u) {
    var step = Math.round(46 * u), r = Math.max(1.3, 2.1 * u);
    ctx.save();
    ctx.fillStyle = patInk(P, P.dark ? 0.09 : 0.11);
    for (var row = 0, y = step * 0.5; y < H + step; row++, y += step) {
      var off = row % 2 ? step / 2 : 0;
      for (var x = step * 0.5; x < W + step; x += step) {
        ctx.beginPath(); ctx.arc(x + off, y, r, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.restore();
  }

  /* حديث ٢: أقواس متراكزة تنبت من أسفل اللوحة */
  function patArcs(ctx, W, H, P, u) {
    var gap = Math.round(98 * u), maxR = Math.sqrt(W * W + H * H);
    ctx.save();
    ctx.lineWidth = Math.max(1, 1.25 * u);
    for (var i = 1, r = gap; r < maxR; i++, r += gap) {
      if (i % 4 === 0) { ctx.strokeStyle = P.accent; ctx.globalAlpha = P.dark ? 0.10 : 0.15; }
      else { ctx.strokeStyle = patInk(P, 1); ctx.globalAlpha = P.dark ? 0.06 : 0.075; }
      ctx.beginPath();
      ctx.arc(W * 0.5, H * 1.06, r, Math.PI * 1.02, Math.PI * 1.98);
      ctx.stroke();
    }
    ctx.restore();
  }

  /* حديث ٣: موجات أفقية هادئة */
  function patWaves(ctx, W, H, P, u) {
    var gap = Math.round(60 * u), amp = 24 * u, len = Math.max(1, 330 * u),
        stepX = Math.max(4, 7 * u);
    ctx.save();
    ctx.strokeStyle = patInk(P, P.dark ? 0.065 : 0.08);
    ctx.lineWidth = Math.max(1, 1.2 * u);
    for (var y = gap * 0.5; y < H + gap; y += gap) {
      ctx.beginPath();
      for (var x = 0; x <= W + stepX; x += stepX) {
        var yy = y + Math.sin((x / len) * Math.PI * 2) * amp;
        x ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  /* حديث ٤: شبكة معمارية + مربّعات ذهبية متباعدة */
  function patGrid(ctx, W, H, P, u) {
    var step = Math.round(90 * u), k = 5 * u;
    ctx.save();
    ctx.strokeStyle = patInk(P, P.dark ? 0.055 : 0.07);
    ctx.lineWidth = Math.max(1, 1 * u);
    ctx.beginPath();
    for (var x = step; x < W; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
    for (var y = step; y < H; y += step) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
    ctx.stroke();
    ctx.fillStyle = P.accent;
    ctx.globalAlpha = P.dark ? 0.11 : 0.15;
    for (var gy = step; gy < H; gy += step * 4) {
      for (var gx = step; gx < W; gx += step * 4) ctx.fillRect(gx - k, gy - k, k * 2, k * 2);
    }
    ctx.restore();
  }

  var PAT_DRAW = { stars: patStars, dots: patDots, arcs: patArcs, waves: patWaves, grid: patGrid };

  function pattern(ctx, W, H, P, u, id) {
    if (id === 'none') return;
    var fn = PAT_DRAW[id] || PAT_DRAW.stars;
    fn(ctx, W, H, P, u || 1);
  }

  /* مصغّرة النقش داخل البانل — نفس دالة الرسم حتى لا تختلف عن البطاقة */
  function paintPatternPreview(canvas, P, id) {
    var w = 240, h = 168, dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    var ctx = canvas.getContext && canvas.getContext('2d');
    if (!ctx) return canvas;
    ctx.scale(dpr, dpr);
    var g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, P.bg[0]); g.addColorStop(0.55, P.bg[1]); g.addColorStop(1, P.bg[2]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    if (id !== 'none') pattern(ctx, w, h, P, w / 340, id);
    else {
      ctx.strokeStyle = patInk(P, 0.18);
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(w * 0.30, h * 0.62); ctx.lineTo(w * 0.70, h * 0.38); ctx.stroke();
    }
    return canvas;
  }

  /* ۞ مَصحفية متجهية — خطوط التطبيق لا تحتوي الرمز، فكان يُرسم مربعًا فارغًا */
  function rubElHizb(ctx, cx, cy, r, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha == null ? 1 : alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(1.2, r * 0.055);
    ctx.lineJoin = 'round';

    /* المربّعان المتقاطعان */
    for (var k = 0; k < 2; k++) {
      var a0 = Math.PI / 4 * k;
      ctx.beginPath();
      for (var i = 0; i < 4; i++) {
        var a = a0 + (Math.PI / 2) * i;
        var px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r;
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }
    /* النقطة المركزية */
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(1, r * 0.10), 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    /* نقاط الأطراف */
    for (var j = 0; j < 4; j++) {
      var ang = Math.PI / 2 * j;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(ang) * r * 1.16, cy + Math.sin(ang) * r * 1.16, Math.max(1, r * 0.075), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  /* زخرفة زاوية (مثل زخارف المصاحف) */
  function cornerOrn(ctx, x, y, dx, dy, size, color, lw) {
    ctx.save();
    ctx.strokeStyle = color; ctx.fillStyle = color;
    ctx.lineWidth = lw || 2; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y + dy * size);
    ctx.lineTo(x, y);
    ctx.lineTo(x + dx * size, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + dx * size * 0.34, y + dy * size * 0.18);
    ctx.quadraticCurveTo(x + dx * size * 0.34, y + dy * size * 0.34, x + dx * size * 0.14, y + dy * size * 0.34);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + dx * size * 0.52, y + dy * size * 0.52, lw ? lw * 1.6 : 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /* قوس المحراب — إطار علوي مميز لقالب الآية */
  function archFrame(ctx, x, y, w, h, color, lw) {
    var r = w / 2;
    ctx.save();
    ctx.strokeStyle = color; ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x, y + r * 0.92);
    ctx.quadraticCurveTo(x, y + r * 0.18, x + w / 2, y);
    ctx.quadraticCurveTo(x + w, y + r * 0.18, x + w, y + r * 0.92);
    ctx.lineTo(x + w, y + h);
    ctx.stroke();
    ctx.restore();
  }

  /* حبيبات ورقية خفيفة تكسر التدرّج الرقمي */
  function grain(ctx, W, H, opacity) {
    if (!grainTile) grainTile = makeGrainTile();
    if (!grainTile) return;
    try {
      ctx.save();
      ctx.globalAlpha = opacity == null ? 0.05 : opacity;
      ctx.globalCompositeOperation = 'overlay';
      var pat = ctx.createPattern(grainTile, 'repeat');
      if (pat) { ctx.fillStyle = pat; ctx.fillRect(0, 0, W, H); }
      ctx.restore();
    } catch (e) { /* بعض المحرّكات لا تقبل canvas كمصدر للنمط — الحبيبات تحسينية */ }
  }
  var grainTile = null;
  function makeGrainTile() {
    try {
      var c = document.createElement('canvas'); c.width = c.height = 128;
      var x = c.getContext('2d'); if (!x) return null;
      var img = x.createImageData(128, 128), d = img.data;
      for (var i = 0; i < d.length; i += 4) {
        var v = 120 + Math.random() * 80;
        d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255;
      }
      x.putImageData(img, 0, 0);
      return c;
    } catch (e) { return null; }
  }

  /* ── الشعار الحقيقي للتطبيق (icons/icon-512.svg) كمسارات متجهية ────────
     بدل صورة: نفس الخطوط تُرسم على Canvas فتكبر مع أي مقاس بلا فقد جودة،
     وتشتغل في المتصفح وفي @napi-rs/canvas (توليد العيّنات) سواء. */
  var LOGO_PATHS = [
    { f: '#fdfaf2', d: 'm153.92,331.54c14.52,0,40.42-4.55,58.64-13.38l11.39-25.05c16.22-35.86,9.68-58.35-5.98-79.41l5.98-11.1-40.99-27.33h-5.69l-14.52,50.95c31.31,15.66,54.65,31.31,63.19,48.96-16.22,1.14-48.67,2.56-62.62,2.56-34.44,0-32.16-8.54-36.43-23.63h-5.69c-1.14,15.09-2.28,33.87-2.28,41.27,0,25.05,12.52,36.15,35.01,36.15Z' },
    { f: '#fdfaf2', d: 'm278.31,336.09l15.09-46.68c3.42-10.82,5.12-21.92,5.12-33.3v-72.3l9.96-11.67-15.37-56.93h-5.69l-24.48,30.17,9.68,190.71h5.69Z' },
    { f: '#e8c274', d: 'm383.63,151.65c.28-.28.28-4.55,0-4.84l-27.61-27.61-27.89,27.89v4.27l27.89,27.89,27.61-27.61Z' },
    { f: '#fdfaf2', d: 'm358.86,201.74h-5.69l-19.36,46.11c14.52,14.52,33.59,31.88,45.54,51.24-9.11,31.31-50.95,51.81-103.61,61.2v5.69l61.2,31.03c28.18-32.73,48.39-75.71,48.39-117.84,0-4.55-.28-9.39-1.14-14.23l9.11-20.78-34.44-42.41Z' }
  ];
  var LOGO_BOX = { x0: 153.9, y0: 151.6, x1: 383.7, y1: 336.2 };  /* حدود الحروف داخل viewBox ٥١٢ */

  /* مفسّر مسارات مبسّط: M/m · L/l · H/h · V/v · C/c · Z — كافي لشعار زاد */
  function tracePath(ctx, d, k, ox, oy) {
    var tk = d.match(/[MmLlHhVvCcZz]|-?(?:\d+\.?\d*|\.\d+)/g) || [];
    var i = 0, cmd = '', cx = 0, cy = 0, sx = 0, sy = 0;
    function n() { return parseFloat(tk[i++]); }
    function X(v) { return ox + v * k; }
    function Y(v) { return oy + v * k; }
    while (i < tk.length) {
      if (!/^-?(?:\d)/.test(tk[i])) cmd = tk[i++];
      if (!/[MmLlHhVvCcZz]/.test(cmd)) break;
      if (cmd === 'Z' || cmd === 'z') { ctx.closePath(); cx = sx; cy = sy; continue; }
      if (cmd === 'M' || cmd === 'm') {
        if (cmd === 'm') { cx += n(); cy += n(); } else { cx = n(); cy = n(); }
        sx = cx; sy = cy; ctx.moveTo(X(cx), Y(cy));
        cmd = cmd === 'm' ? 'l' : 'L'; continue;
      }
      if (cmd === 'L' || cmd === 'l') {
        if (cmd === 'l') { cx += n(); cy += n(); } else { cx = n(); cy = n(); }
        ctx.lineTo(X(cx), Y(cy)); continue;
      }
      if (cmd === 'H' || cmd === 'h') { cx = cmd === 'h' ? cx + n() : n(); ctx.lineTo(X(cx), Y(cy)); continue; }
      if (cmd === 'V' || cmd === 'v') { cy = cmd === 'v' ? cy + n() : n(); ctx.lineTo(X(cx), Y(cy)); continue; }
      if (cmd === 'C' || cmd === 'c') {
        var rel = cmd === 'c';
        var x1 = (rel ? cx : 0) + n(), y1 = (rel ? cy : 0) + n();
        var x2 = (rel ? cx : 0) + n(), y2 = (rel ? cy : 0) + n();
        var x3 = (rel ? cx : 0) + n(), y3 = (rel ? cy : 0) + n();
        ctx.bezierCurveTo(X(x1), Y(y1), X(x2), Y(y2), X(x3), Y(y3));
        cx = x3; cy = y3; continue;
      }
    }
  }

  /* يرسم حروف «زاد» داخل مستطيل (بلا خلفية) مع ملء الأكبر مساحة ممكنة */
  function drawAppGlyph(ctx, bx, by, bw, bh) {
    var gw = LOGO_BOX.x1 - LOGO_BOX.x0, gh = LOGO_BOX.y1 - LOGO_BOX.y0;
    var k = Math.min(bw / gw, bh / gh);
    var ox = bx + (bw - gw * k) / 2 - LOGO_BOX.x0 * k;
    var oy = by + (bh - gh * k) / 2 - LOGO_BOX.y0 * k;
    ctx.save();
    LOGO_PATHS.forEach(function (p) {
      ctx.beginPath();
      tracePath(ctx, p.d, k, ox, oy);
      ctx.fillStyle = p.f;
      ctx.fill();
    });
    ctx.restore();
  }

  /* شعار التطبيق: مربّع بحواف دائرية + حروف «زاد» الحقيقية */
  function drawMark(ctx, x, y, size, P, opts) {
    opts = opts || {};
    var r = size * 0.30;
    var g = ctx.createLinearGradient(x, y, x + size, y + size);
    g.addColorStop(0, opts.solid || '#0b2a20');
    g.addColorStop(1, opts.solid2 || '#123f30');
    ctx.save();
    roundRect(ctx, x, y, size, size, r);
    ctx.fillStyle = g; ctx.fill();
    ctx.lineWidth = Math.max(1, size * 0.014);
    ctx.strokeStyle = P.accent; ctx.globalAlpha = 0.55; ctx.stroke();
    ctx.globalAlpha = 1;

    /* حروف الشعار داخل المربّع — الرمز بقى شعار التطبيق نفسه لا هلالًا عامًا */
    drawAppGlyph(ctx, x + size * 0.175, y + size * 0.175, size * 0.65, size * 0.65);
    ctx.restore();
  }

  /* هوية التطبيق: الشعار على اليمين والنص على شماله — ترتيب عربي صحيح.
     (كان النص مرسومًا يمينًا فوق الشعار فيتداخل معه.) */
  function drawLockup(ctx, x, y, size, P) {
    drawMark(ctx, x, y, size, P);
    var right = x - size * 0.34;
    ctx.save();
    ctx.direction = 'rtl'; ctx.textAlign = 'right';
    ctx.fillStyle = P.ink;
    ctx.font = F('display', size * 0.56, 700);
    ctx.fillText(BRAND, right, y + size * 0.55);
    ctx.fillStyle = P.soft;
    ctx.font = F('sans', size * 0.22, 500);
    ctx.fillText(TAGLINE, right, y + size * 0.92);
    ctx.restore();
  }

  /* التفاف نص عربي على Canvas */
  function wrapLines(ctx, text, maxW) {
    if (!text) return [];
    var paras = String(text).split(/\n+/);
    var out = [];
    paras.forEach(function (para) {
      var words = para.split(/\s+/).filter(Boolean);
      if (!words.length) { out.push(''); return; }
      var line = '';
      words.forEach(function (w) {
        var test = line ? line + ' ' + w : w;
        if (ctx.measureText(test).width > maxW && line) { out.push(line); line = w; }
        else line = test;
      });
      if (line) out.push(line);
    });
    return out;
  }

  /* يبحث عن أكبر حجم خط يحقّق حدّ الأسطر والمساحة */
  function fitText(ctx, text, maxW, maxH, maxLines, family, weight, startSize, minSize) {
    var size = startSize;
    while (size > minSize) {
      ctx.font = F(family, size, weight);
      var lines = wrapLines(ctx, text, maxW);
      var lh = size * (family === 'serif' ? 1.85 : 1.6);
      if (lines.length <= maxLines && lines.length * lh <= maxH) {
        return { size: size, lines: lines, lh: lh };
      }
      size -= Math.max(2, Math.round(size * 0.045));
    }
    ctx.font = F(family, minSize, weight);
    var finalLines = wrapLines(ctx, text, maxW);
    if (finalLines.length > maxLines) {
      finalLines = finalLines.slice(0, maxLines);
      finalLines[maxLines - 1] = finalLines[maxLines - 1].replace(/\s+\S*$/, '') + '…';
    }
    return { size: minSize, lines: finalLines, lh: minSize * (family === 'serif' ? 1.85 : 1.6) };
  }

  function drawLines(ctx, lines, x, y, lh, align) {
    ctx.textAlign = align === 'right' ? 'right' : align === 'left' ? 'left' : 'center';
    lines.forEach(function (l, i) { ctx.fillText(l, x, y + i * lh); });
  }

  function arabicNumber(n) {
    try { return Number(n).toLocaleString('ar-EG'); } catch (e) { return String(n); }
  }

  function hijriToday() {
    try {
      var s = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
        day: 'numeric', month: 'long', year: 'numeric'
      }).format(new Date());
      /* بعض إصدارات ICU بتضيف «هـ» بنفسها — منع التكرار */
      return /ه(\u0640)?\s*$/.test(s) ? s : s + ' هـ';
    } catch (e) { return ''; }
  }

  /* ══ ٦ · المحرّك: يرسم البطاقة ══════════════════════════════════════════ */
  function resolveTemplate(o, p) {
    if (p.template && p.template !== 'auto') return p.template;
    return DEFAULT_BY_KIND[o.kind] || 'quote';
  }

  function paint(canvas, o, p, identity) {
    var fmt = FORMATS[p.format] || FORMATS.portrait;
    var W = fmt.w, H = fmt.h;
    canvas.width = W; canvas.height = H;
    var ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    var P = PALETTES[p.palette] || PALETTES.emerald;
    var tpl = resolveTemplate(o, p);
    var u = W / 1080;                    /* معامل القياس */
    var pad = Math.round(52 * u);
    var wide = W / H > 1.25;
    /* معامل الطول: الستوري ٩:١٦ والمربع مش زي البورتريه —
       من غيره كان النص بيفضل بنفس الحجم ويسيب فراغ كبير. */
    var ratio = H / W;
    var tallK = ratio > 1.55 ? 1.42 : ratio > 1.15 ? 1.08 : ratio > 0.95 ? 0.94 : 0.82;
    B_STATE.tallK = tallK;

    ctx.direction = 'rtl';
    ctx.textBaseline = 'alphabetic';

    /* ── خلفية ── */
    var bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, P.bg[0]); bg.addColorStop(0.52, P.bg[1]); bg.addColorStop(1, P.bg[2]);
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    if (identity.bg && photoCache.src === identity.bg && photoCache.img) {
      drawCover(ctx, photoCache.img, W, H);
      var scrim = (identity.scrim == null ? 55 : identity.scrim) / 100;
      var sg = ctx.createLinearGradient(0, 0, 0, H);
      sg.addColorStop(0, 'rgba(4,14,11,' + (0.35 + scrim * 0.45) + ')');
      sg.addColorStop(0.5, 'rgba(4,14,11,' + (0.25 + scrim * 0.55) + ')');
      sg.addColorStop(1, 'rgba(4,14,11,' + (0.55 + scrim * 0.40) + ')');
      ctx.fillStyle = sg; ctx.fillRect(0, 0, W, H);
    }

    glow(ctx, W * 0.86, H * 0.08, W * (P.dark ? 0.55 : 0.42), P.glow);
    if (P.dark) glow(ctx, W * 0.08, H * 0.94, W * 0.45, 'rgba(30,107,82,.30)');
    pattern(ctx, W, H, P, u, p.pattern);

    if (p.showFrame) {
      frame(ctx, W, H, pad, P, u);
    }

    /* ── الترويسة ── (تبدأ تحت زخرفة الزاوية 46u حتى لا تتراكب معها) */
    var headY = pad + Math.round(58 * u);
    var headSize = Math.round(56 * u);
    if (p.showLogo) {
      drawLockup(ctx, W - pad - Math.round(16 * u) - headSize, headY, headSize, P);
    }
    if (o.eyebrow) {
      var chipFont = F('sans', Math.round(23 * u), 700);
      ctx.font = chipFont;
      var tw = ctx.measureText(o.eyebrow).width;
      var chW = tw + Math.round(46 * u), chH = Math.round(46 * u);
      var chX = pad + Math.round(14 * u), chY = headY + Math.round(6 * u);
      roundRect(ctx, chX, chY, chW, chH, chH / 2);
      ctx.fillStyle = P.chip; ctx.fill();
      ctx.strokeStyle = P.line; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = P.accent; ctx.textAlign = 'center';
      ctx.fillText(o.eyebrow, chX + chW / 2, chY + chH * 0.66);
    }

    var topY = headY + Math.round((wide ? 56 : 128) * u);
    var bottomReserve = Math.round((p.showIdentity ? (wide ? 122 : 188) : 96) * u) + pad;
    var contentBottom = H - bottomReserve;

    /* ── المحتوى ── */
    if (tpl === 'achievement') {
      drawAchievement(ctx, o, p, P, { W: W, H: H, u: u, pad: pad, top: topY, bottom: contentBottom });
    } else if (tpl === 'media') {
      drawMedia(ctx, o, p, P, { W: W, H: H, u: u, pad: pad, top: topY, bottom: contentBottom });
    } else if (tpl === 'app') {
      drawAppCard(ctx, o, p, P, { W: W, H: H, u: u, pad: pad, top: topY, bottom: contentBottom });
    } else if (tpl === 'verse') {
      drawVerse(ctx, o, p, P, { W: W, H: H, u: u, pad: pad, top: topY, bottom: contentBottom });
    } else if (tpl === 'dua') {
      drawDua(ctx, o, p, P, { W: W, H: H, u: u, pad: pad, top: topY, bottom: contentBottom });
    } else {
      drawQuote(ctx, o, p, P, { W: W, H: H, u: u, pad: pad, top: topY, bottom: contentBottom });
    }

    /* ── التذييل: الهوية + الرابط ── */
    var footY = H - pad - Math.round(34 * u);
    if (p.showIdentity) {
      drawIdentity(ctx, identity, p, P, W, footY, pad, u);
    } else {
      ctx.strokeStyle = P.line; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad, footY - Math.round(40 * u)); ctx.lineTo(W - pad, footY - Math.round(40 * u)); ctx.stroke();
    }

    /* خط علوي للتذييل + الرابط — LTR صريح للنطاق وRTL صريح للتاريخ */
    var urlY = footY + Math.round(2 * u);
    ctx.save();
    ctx.font = F('sans', Math.round(19 * u), 500);
    ctx.fillStyle = P.soft;
    ctx.direction = 'ltr'; ctx.textAlign = 'left';
    ctx.fillText(APP_DOMAIN, pad + Math.round(58 * u), urlY);
    ctx.restore();

    if (p.showDate) {
      var hj = hijriToday();
      if (hj) {
        ctx.save();
        ctx.font = F('sans', Math.round(19 * u), 500);
        ctx.fillStyle = P.soft;
        ctx.direction = 'rtl'; ctx.textAlign = 'right';
        ctx.fillText(hj, W - pad - Math.round(58 * u), urlY);
        ctx.restore();
      }
    }

    grain(ctx, W, H, P.dark ? 0.055 : 0.035);
    return canvas;
  }

  function frame(ctx, W, H, pad, P, u) {
    ctx.save();
    ctx.strokeStyle = P.line;
    ctx.lineWidth = Math.max(1, 2 * u);
    roundRect(ctx, pad * 0.56, pad * 0.56, W - pad * 1.12, H - pad * 1.12, 26 * u);
    ctx.stroke();
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = Math.max(0.6, 1 * u);
    roundRect(ctx, pad * 0.80, pad * 0.80, W - pad * 1.60, H - pad * 1.60, 20 * u);
    ctx.stroke();
    ctx.globalAlpha = 1;
    var s = 46 * u;
    cornerOrn(ctx, pad * 1.05, pad * 1.05, 1, 1, s, P.accent, 2 * u);
    cornerOrn(ctx, W - pad * 1.05, pad * 1.05, -1, 1, s, P.accent, 2 * u);
    cornerOrn(ctx, pad * 1.05, H - pad * 1.05, 1, -1, s, P.accent, 2 * u);
    cornerOrn(ctx, W - pad * 1.05, H - pad * 1.05, -1, -1, s, P.accent, 2 * u);
    ctx.restore();
  }

  function drawCover(ctx, img, W, H) {
    var ir = img.width / img.height, cr = W / H, sw, sh, sx, sy;
    if (ir > cr) { sh = img.height; sw = sh * cr; sx = (img.width - sw) / 2; sy = 0; }
    else { sw = img.width; sh = sw / cr; sx = 0; sy = (img.height - sh) / 2; }
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
  }

  /* ── تخطيط موحّد: كل قالب يقيس كتلته ثم تُركَّز رأسيًا ──────────────
     كان كل قالب يثبّت النص أعلى المساحة ويترك فراغًا أسفلها، فالبطاقة
     تبدو مائلة. الآن: نقيس الكتلة (عنوان + نص + مصدر) ونضعها في منتصف
     المساحة الفعلية بين الترويسة والتذييل. */
  var B_STATE = { tallK: 1 };

  function blockTop(B, blockH) {
    return B.top + Math.max(0, (B.bottom - B.top - blockH) / 2);
  }

  /* نص أحادي الاتجاه: يعزل المقاطع اللاتينية عن العربية قبل الرسم
     (Canvas لا يملك خوارزمية bidi كاملة على كل المحرّكات). */
  function dirOf(text) {
    if (/[\u0600-\u06FF]/.test(text)) return 'rtl';
    if (/[A-Za-z0-9]/.test(text)) return 'ltr';
    return 'rtl';
  }

  function drawRun(ctx, text, x, y, align, P) {
    ctx.save();
    ctx.direction = dirOf(text);
    ctx.textAlign = align || (ctx.direction === 'rtl' ? 'right' : 'left');
    ctx.fillStyle = P || ctx.fillStyle;
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  /* ── قالب الآية: محراب يملأ البطاقة والنص في قلبه ────────────────
     الإصدار الأول كان يرسم القوس بحجم النص فقط فيترك نصف البطاقة فارغًا.
     الآن القوس يأخذ المساحة بين الترويسة والتذييل، والنص يُركَّز داخله. */
  function drawVerse(ctx, o, p, P, B) {
    var u = B.u, W = B.W;
    var hasSrc = !!(o.source && p.showSource);

    /* المحراب يحتضن النص: ارتفاعه = ارتفاع الكتلة + هامش تنفّس،
       ثم تُركَّز المجموعة (محراب + نص) رأسيًا. القوس الممتد على الصفحة
       كلها كان يترك نصف البطاقة فارغًا. */
    var innerW = W - (B.pad + Math.round(180 * u)) * 2;
    var fit = fitText(ctx, o.body || '', innerW, (B.bottom - B.top) * 0.62, 12,
      'serif', 400, Math.round(68 * u * p.size * B_STATE.tallK), Math.round(28 * u));

    var blockH = fit.lines.length * fit.lh;
    var chipSpace = hasSrc ? Math.round(130 * u) : 0;
    var innerTotal = blockH + chipSpace;

    var arcX = B.pad + Math.round(30 * u);
    var arcW = W - arcX * 2;
    /* في المقاسات الطويلة (ستوري) نمدّ المحراب ليأخذ نصف المساحة
       على الأقل، بدل ما يبقى شريطًا صغيرًا وسط صفحة فاضية. */
    var span = B.bottom - B.top;
    var arcH = Math.min(span, Math.max(innerTotal + Math.round(300 * u), span * 0.52));
    var arcY = B.top + Math.max(0, ((B.bottom - B.top) - arcH) / 2);

    /* الكتلة في وسط المحراب، مع إزاحة صغيرة لأسفل لتعويض انحناء القوس */
    var top = arcY + (arcH - innerTotal) / 2 + arcH * 0.05;

    if (p.showFrame) {
      archFrame(ctx, arcX, arcY, arcW, arcH, P.line, Math.max(1, 1.6 * u));
      /* خط قاعدة المحراب */
      ctx.save();
      ctx.strokeStyle = P.line; ctx.globalAlpha = 0.6; ctx.lineWidth = Math.max(1, 1.2 * u);
      ctx.beginPath();
      ctx.moveTo(arcX + Math.round(26 * u), arcY + arcH);
      ctx.lineTo(arcX + arcW - Math.round(26 * u), arcY + arcH);
      ctx.stroke();
      ctx.restore();
    }

    rubElHizb(ctx, W / 2, top - Math.round(44 * u), Math.round(15 * u), P.accent, 0.85);

    var textTop = top + fit.size * 0.94;
    ctx.fillStyle = P.ink;
    ctx.font = F('serif', fit.size, 400);
    drawLines(ctx, fit.lines, W / 2, textTop, fit.lh, 'center');

    var afterText = textTop + blockH;
    if (hasSrc) {
      chipLine(ctx, o.source, W / 2, afterText + Math.round(78 * u), P, u, 'center');
    } else {
      rubElHizb(ctx, W / 2, afterText + Math.round(40 * u), Math.round(12 * u), P.accent, 0.7);
    }
  }

  /* ── قالب الدعاء: علامة اقتباس + نص + آمين ── */
  function drawDua(ctx, o, p, P, B) {
    var u = B.u, W = B.W;
    var innerW = W - (B.pad + Math.round(80 * u)) * 2;
    var hasSrc = !!(o.source && p.showSource);

    var titleFit = o.title ? fitText(ctx, o.title, W - B.pad * 3, Math.round(150 * u), 2,
      'display', 700, Math.round(50 * u * Math.min(p.size, 1.15)), Math.round(28 * u)) : null;

    var fit = fitText(ctx, o.body || '', innerW,
      (B.bottom - B.top) * 0.74, 11, 'serif', 400,
      Math.round(62 * u * p.size * B_STATE.tallK), Math.round(28 * u));

    var titleH = titleFit ? titleFit.lines.length * titleFit.lh + Math.round(34 * u) : 0;
    var blockH = fit.lines.length * fit.lh;
    var tailH = Math.round(96 * u);              /* آمين */
    var srcH = hasSrc ? Math.round(132 * u) : 0;   /* شريحة قد تلفّ سطرين */
    var total = titleH + blockH + tailH + srcH;
    var top = blockTop(B, total);

    /* علامة اقتباس شفافة فوق العنوان — كانت على يمين النص المتمركز فبتتراكب معه */
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = P.accent;
    roundRect(ctx, W - B.pad - Math.round(84 * u), top - Math.round(58 * u), Math.round(6 * u), Math.round(48 * u), 3 * u);
    ctx.fill();
    ctx.globalAlpha = 0.10;
    ctx.beginPath(); ctx.arc(W - B.pad - Math.round(40 * u), top - Math.round(30 * u), Math.round(12 * u), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    var y = top;
    if (titleFit) {
      ctx.fillStyle = P.accent;
      ctx.font = F('display', titleFit.size, 700);
      drawLines(ctx, titleFit.lines, W / 2, y + titleFit.size * 0.9, titleFit.lh, 'center');
      y += titleH;
    }

    var textTop = y + fit.size * 0.94;
    ctx.fillStyle = P.ink;
    ctx.font = F('serif', fit.size, 400);
    drawLines(ctx, fit.lines, W / 2, textTop, fit.lh, 'center');
    y = textTop + blockH;

    if (o.kind === 'dua' || !o.kind) {
      ctx.font = F('display', Math.round(30 * u), 500);
      ctx.fillStyle = P.soft; ctx.textAlign = 'center';
      ctx.fillText('آمِين', W / 2, y + Math.round(60 * u));
    }
    y += tailH;

    if (hasSrc) chipLine(ctx, o.source, W / 2, y + Math.round(40 * u), P, u, 'center');
  }

  /* ── قالب الاقتباس/الحديث: عنوان + قاعدة ذهبية + نص ── */
  function drawQuote(ctx, o, p, P, B) {
    var u = B.u, W = B.W;
    var innerW = W - (B.pad + Math.round(70 * u)) * 2;
    var hasSrc = !!(o.source && p.showSource);

    var titleFit = o.title ? fitText(ctx, o.title, innerW, Math.round(170 * u), 2,
      'display', 700, Math.round(52 * u * p.size), Math.round(28 * u)) : null;
    var fit = fitText(ctx, o.body || '', innerW, (B.bottom - B.top) * 0.74, 14,
      'serif', 400, Math.round(46 * u * p.size * B_STATE.tallK), Math.round(24 * u));

    var titleH = titleFit ? titleFit.lines.length * titleFit.lh + Math.round(30 * u) : 0;
    var blockH = fit.lines.length * fit.lh;
    var noteH = o.note ? Math.round(70 * u) : 0;
    var srcH = hasSrc ? Math.round(124 * u) : 0;
    var total = titleH + blockH + noteH + srcH;
    var top = blockTop(B, total);

    /* «تلقائي»: الاقتباس الطويل يمين، القصير وسط */
    var align = p.align === 'center' ? 'center'
              : p.align === 'right' ? 'right'
              : (fit.lines.length <= 3 ? 'center' : 'right');
    var anchorX = align === 'center' ? W / 2 : W - B.pad - Math.round(30 * u);

    var y = top;
    if (titleFit) {
      ctx.fillStyle = P.accent;
      ctx.font = F('display', titleFit.size, 700);
      drawLines(ctx, titleFit.lines, anchorX, y + titleFit.size * 0.9, titleFit.lh, align);
      y += titleH;
    }

    var textTop = y + fit.size * 0.94;
    if (align === 'right') {
      ctx.save();
      ctx.globalAlpha = 0.75;
      ctx.fillStyle = P.accent;
      roundRect(ctx, W - B.pad - Math.round(8 * u), textTop - fit.size * 0.92,
        Math.round(4 * u), blockH, 2 * u);
      ctx.fill();
      ctx.restore();
    }

    ctx.fillStyle = P.ink;
    ctx.font = F('serif', fit.size, 400);
    drawLines(ctx, fit.lines, anchorX, textTop, fit.lh, align);
    y = textTop + blockH;

    if (o.note) {
      ctx.font = F('sans', Math.round(23 * u), 500);
      ctx.fillStyle = P.soft;
      drawLines(ctx, [o.note], anchorX, y + Math.round(40 * u), 30 * u, align);
      y += noteH;
    }
    if (hasSrc) chipLine(ctx, o.source, W / 2, y + Math.round(44 * u), P, u, 'center');
  }

  /* ── قالب الإنجاز: رقم كبير + شبكة أرقام ── */
  function drawAchievement(ctx, o, p, P, B) {
    var u = B.u, W = B.W;
    var stats = (o.stats || []).slice(0, 4);
    var cols = stats.length > 2 ? 2 : Math.max(1, stats.length);
    var gap = Math.round(22 * u);
    var cw = (W - B.pad * 2 - gap * (cols - 1)) / cols;
    /* إحصائية واحدة أو اتنين كانت بتاخد عرض البطاقة كله كصندوق فاضي */
    cw = Math.min(cw, Math.round(420 * u));
    var ch = Math.round(150 * u);
    var gridH = stats.length ? Math.ceil(stats.length / cols) * (ch + gap) - gap + Math.round(40 * u) : 0;

    var titleSize = Math.round(56 * u * Math.min(p.size, 1.2));
    var bodyFit = o.body ? fitText(ctx, o.body, W - B.pad * 2.6, Math.round(180 * u), 3,
      'serif', 400, Math.round(32 * u), Math.round(20 * u)) : null;

    var emojiH = o.emoji ? Math.round(104 * u) : 0;
    var titleH = o.title ? titleSize * 1.5 : 0;
    var bodyH = bodyFit ? bodyFit.lines.length * bodyFit.lh + Math.round(14 * u) : 0;
    var srcH = (o.source && p.showSource) ? Math.round(124 * u) : 0;
    var total = emojiH + titleH + bodyH + gridH + srcH;
    var top = blockTop(B, total);

    var y = top;
    ctx.textAlign = 'center';
    if (o.emoji) {
      ctx.font = Math.round(84 * u) + 'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
      ctx.fillText(o.emoji, W / 2, y + Math.round(72 * u));
      y += emojiH;
    }
    if (o.title) {
      ctx.font = F('display', titleSize, 700);
      ctx.fillStyle = P.ink;
      ctx.fillText(o.title, W / 2, y + titleSize * 0.92);
      y += titleH;
    }
    if (bodyFit) {
      ctx.fillStyle = P.soft;
      ctx.font = F('serif', bodyFit.size, 400);
      drawLines(ctx, bodyFit.lines, W / 2, y + bodyFit.size * 0.9, bodyFit.lh, 'center');
      y += bodyH;
    }

    if (stats.length) {
      var startX = B.pad + (W - B.pad * 2 - (cw * cols + gap * (cols - 1))) / 2;
      stats.forEach(function (s, i) {
        var r2 = Math.floor(i / cols);
        var cx = startX + (i % cols) * (cw + gap);
        var cy = y + r2 * (ch + gap);
        roundRect(ctx, cx, cy, cw, ch, Math.round(26 * u));
        ctx.fillStyle = P.chip; ctx.fill();
        ctx.strokeStyle = P.line; ctx.lineWidth = 1; ctx.stroke();
        ctx.textAlign = 'center';
        ctx.font = F('display', Math.round(52 * u), 700);
        ctx.fillStyle = P.accent;
        ctx.fillText(s && s.value != null ? String(s.value) : '—', cx + cw / 2, cy + ch * 0.50);
        ctx.font = F('sans', Math.round(21 * u), 500);
        ctx.fillStyle = P.soft;
        if (s && s.label) ctx.fillText(String(s.label), cx + cw / 2, cy + ch * 0.80);
      });
      y += gridH;
    }
    if (o.source && p.showSource) chipLine(ctx, o.source, W / 2, y + Math.round(44 * u), P, u, 'center');
  }

  /* ── قالب وسائط: فيديو/تلاوة ── */
  function drawMedia(ctx, o, p, P, B) {
    var u = B.u, W = B.W;
    var hasSrc = !!(o.source && p.showSource);

    var titleFit = fitText(ctx, o.title || o.body || '', W - B.pad * 2.6,
      Math.round(320 * u), 3, 'display', 700, Math.round(52 * u * p.size), Math.round(26 * u));
    var bodyFit = (o.body && o.title) ? fitText(ctx, o.body, W - B.pad * 2.8,
      Math.round(200 * u), 3, 'serif', 400, Math.round(32 * u), Math.round(20 * u)) : null;

    var r = Math.round(92 * u);
    var titleH = titleFit.lines.length * titleFit.lh;
    var bodyH = bodyFit ? bodyFit.lines.length * bodyFit.lh + Math.round(16 * u) : 0;
    var srcH = hasSrc ? Math.round(124 * u) : 0;
    var total = r * 2 + Math.round(64 * u) + titleH + bodyH + srcH;
    var top = blockTop(B, total);

    var cx = W / 2, cy = top + r;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = P.chip; ctx.fill();
    ctx.strokeStyle = P.line; ctx.lineWidth = Math.round(1.5 * u); ctx.stroke();
    ctx.textAlign = 'center';
    ctx.font = Math.round(72 * u) + 'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
    ctx.fillStyle = P.accent;
    ctx.fillText(o.emoji || '▶', cx, cy + Math.round(24 * u));

    var y = cy + r + Math.round(64 * u);
    ctx.fillStyle = P.ink;
    ctx.font = F('display', titleFit.size, 700);
    drawLines(ctx, titleFit.lines, W / 2, y + titleFit.size * 0.9, titleFit.lh, 'center');
    y += titleH;

    if (bodyFit) {
      ctx.fillStyle = P.soft;
      ctx.font = F('serif', bodyFit.size, 400);
      drawLines(ctx, bodyFit.lines, W / 2, y + bodyFit.size * 0.9, bodyFit.lh, 'center');
      y += bodyH;
    }
    if (hasSrc) chipLine(ctx, o.source, W / 2, y + Math.round(44 * u), P, u, 'center');
  }

  /* ── قالب بطاقة التطبيق ── */
  function drawAppCard(ctx, o, p, P, B) {
    var u = B.u, W = B.W;
    var wideCard = (B.bottom - B.top) < 420 * u;      /* مقاس أفقي قصير */
    var size = Math.round((wideCard ? 84 : 150) * u);
    var titleSize = Math.round((wideCard ? 54 : 78) * u);
    var fit = o.body ? fitText(ctx, o.body, W - B.pad * (wideCard ? 4.4 : 3),
      Math.round((wideCard ? 96 : 280) * u), wideCard ? 2 : 4,
      'serif', 400, Math.round((wideCard ? 26 : 34) * u), Math.round(18 * u)) : null;
    var statsH = (o.stats && o.stats.length) ? Math.round(50 * u) : 0;
    var gapAfterMark = Math.round((wideCard ? 26 : 58) * u);
    var total = size + gapAfterMark + titleSize * (wideCard ? 1.2 : 1.45) +
      (fit ? fit.lines.length * fit.lh + Math.round(14 * u) : 0) + statsH;
    var top = blockTop(B, total);

    ctx.textAlign = 'center';
    drawMark(ctx, (W - size) / 2, top, size, P);
    var y = top + size + gapAfterMark;
    ctx.font = F('display', titleSize, 700);
    ctx.fillStyle = P.ink;
    ctx.fillText(o.title || BRAND, W / 2, y + titleSize * 0.9);
    y += titleSize * (wideCard ? 1.2 : 1.45);

    if (fit) {
      ctx.fillStyle = P.soft;
      ctx.font = F('serif', fit.size, 400);
      drawLines(ctx, fit.lines, W / 2, y + fit.size * 0.9, fit.lh, 'center');
      y += fit.lines.length * fit.lh + Math.round(20 * u);
    }
    if (o.stats && o.stats.length) {
      var line = o.stats.map(function (s) { return s.value + ' ' + s.label; }).join(' · ');
      ctx.font = F('sans', Math.round(24 * u), 500);
      ctx.fillStyle = P.accent; ctx.textAlign = 'center';
      ctx.fillText(line, W / 2, y + Math.round(26 * u));
    }
  }

  /* شريحة المصدر — تلفّ النص على سطرين كحد أقصى بدل ما تطلع عن الإطار */
  function chipLine(ctx, text, cx, y, P, u, align) {
    ctx.save();
    var maxW = Math.round(760 * u);
    var size = Math.round(23 * u);
    var minSize = Math.round(15 * u);
    ctx.font = F('sans', size, 700);

    /* ١) صغّر الخط لحد ما النص يدخل في سطر واحد
       ٢) ولو لسه طويل، لفّه على سطرين */
    while (size > minSize && ctx.measureText(text).width > maxW) {
      size -= 1;
      ctx.font = F('sans', size, 700);
    }

    var lines = [String(text)];
    if (ctx.measureText(text).width > maxW) {
      var wrapped = wrapLines(ctx, String(text), maxW);
      if (wrapped.length > 2) {
        wrapped = wrapped.slice(0, 2);
        wrapped[1] = wrapped[1].replace(/\s+\S*$/, '') + '…';
      }
      lines = wrapped;
    }

    var widest = Math.max.apply(null, lines.map(function (l) { return ctx.measureText(l).width; }));
    var w = widest + Math.round(58 * u);
    var lineH = size * 1.5;
    var h = Math.round(30 * u) + lineH * lines.length;
    var x = align === 'center' ? cx - w / 2 : cx;
    /* y هو خط الأساس المطلوب للنص؛ الصندوق يُرفَع فوقه بارتفاعه كاملًا */
    var boxY = y - h + Math.round(size * 0.55);

    roundRect(ctx, x, boxY, w, h, Math.min(h / 2, Math.round(26 * u)));
    ctx.fillStyle = P.chip; ctx.fill();
    ctx.strokeStyle = P.line; ctx.lineWidth = 1; ctx.stroke();

    ctx.fillStyle = P.accent; ctx.textAlign = 'center';
    lines.forEach(function (l, i) {
      ctx.fillText(l, x + w / 2, boxY + Math.round(15 * u) + lineH * (i + 0.78));
    });
    ctx.restore();
  }

  /* شريحة الهوية: أفاتار/لوجو + الاسم + المعرّف + isbn */
  function drawIdentity(ctx, id, p, P, W, footY, pad, u) {
    var y = footY - Math.round(52 * u);
    ctx.strokeStyle = P.line; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pad, y - Math.round(30 * u)); ctx.lineTo(W - pad, y - Math.round(30 * u)); ctx.stroke();

    var av = Math.round(58 * u);
    var ax = W - pad - Math.round(14 * u) - av, ay = y - av * 0.62;

    if (id.logo && logoCache.src === id.logo && logoCache.img) {
      ctx.save();
      ctx.beginPath(); ctx.arc(ax + av / 2, ay + av / 2, av / 2, 0, Math.PI * 2); ctx.clip();
      ctx.drawImage(logoCache.img, ax, ay, av, av);
      ctx.restore();
      ctx.beginPath(); ctx.arc(ax + av / 2, ay + av / 2, av / 2, 0, Math.PI * 2);
      ctx.strokeStyle = P.accent; ctx.lineWidth = Math.round(1.6 * u); ctx.stroke();
    } else {
      var ccx = ax + av / 2, ccy = ay + av / 2, cr = av / 2;
      ctx.beginPath(); ctx.arc(ccx, ccy, cr, 0, Math.PI * 2);
      ctx.fillStyle = P.dark ? 'rgba(255,255,255,.06)' : 'rgba(21,42,33,.05)'; ctx.fill();
      ctx.strokeStyle = P.line; ctx.lineWidth = 1; ctx.stroke();

      if (id.avatar && id.avatar !== '🌙') {
        /* إيموجي مختار: يُرسم في المنتصف */
        ctx.save();
        ctx.font = Math.round(av * 0.52) + 'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(id.avatar, ccx, ccy + av * 0.04);
        ctx.restore();
      } else {
        /* الهلال المتجهي — يظهر على كل الأجهزة مهما كانت خطوطها */
        var mr = av * 0.30;
        ctx.beginPath();
        ctx.arc(ccx - mr * 0.14, ccy, mr, 0, Math.PI * 2, false);
        ctx.arc(ccx + mr * 0.32, ccy - mr * 0.14, mr * 0.84, 0, Math.PI * 2, true);
        ctx.fillStyle = P.accent; ctx.fill();
      }
    }

    var name = (id.name || '').trim();
    if (name) {
      ctx.textAlign = 'right';
      ctx.font = F('sans', Math.round(26 * u), 700);
      ctx.fillStyle = P.ink;
      var nx = ax - Math.round(16 * u);
      ctx.fillText(name, nx, y - Math.round(2 * u));
      if (id.handle) {
        ctx.save();
        ctx.font = F('sans', Math.round(20 * u), 500);
        ctx.fillStyle = P.soft;
        ctx.direction = 'ltr';
        ctx.textAlign = 'right';
        ctx.fillText('@' + id.handle.replace(/^@/, ''), nx, y + Math.round(26 * u));
        ctx.restore();
      }
    } else {
      ctx.textAlign = 'right';
      ctx.font = F('sans', Math.round(24 * u), 500);
      ctx.fillStyle = P.soft;
      ctx.fillText(TAGLINE, ax - Math.round(16 * u), y + Math.round(8 * u));
    }
  }

  /* ══ ٧ · الواجهة ════════════════════════════════════════════════════════ */
  var CSS = '' +
  /* ── الغلاف ── */
  '.zst-ov{position:fixed;inset:0;z-index:9800;display:flex;align-items:center;justify-content:center;padding:14px;' +
  'background:rgba(4,14,11,.74);backdrop-filter:blur(8px) saturate(1.08);-webkit-backdrop-filter:blur(8px) saturate(1.08);' +
  'opacity:0;transition:opacity .22s ease}' +
  '.zst-ov.on{opacity:1}' +
  '.zst-panel{position:relative;width:100%;max-width:566px;max-height:min(94vh,880px);display:flex;flex-direction:column;' +
  'overflow:hidden;background:var(--card,#fff);border:1px solid var(--border,#e5e4de);border-radius:24px;color:var(--ink,#1a1a18);' +
  'font-family:\'Tajawal\',\'Segoe UI\',system-ui,sans-serif;' +
  'box-shadow:0 34px 90px -26px rgba(4,14,11,.62);transform:translateY(16px) scale(.985);' +
  'transition:transform .24s cubic-bezier(.2,.8,.25,1)}' +
  '.zst-ov.on .zst-panel{transform:none}' +
  /* ── الترويسة: أخضر زاد الثابت + اللوجو الحقيقي ── */
  '.zst-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 15px;' +
  'background:linear-gradient(135deg,var(--primitive-green-900,#0e3b2e) 0%,var(--primitive-green-700,#1a5d47) 62%,var(--primitive-green-500,#2a7a5f) 130%);' +
  'border-bottom:1px solid rgba(201,161,74,.34)}' +
  '.zst-brand{display:flex;align-items:center;gap:11px;min-width:0}' +
  '.zst-logo{display:block;width:38px;height:38px;flex:0 0 auto;border-radius:11px;' +
  'box-shadow:0 0 0 1px rgba(232,194,116,.45),0 7px 16px -8px rgba(0,0,0,.75)}' +
  '.zst-brand-t{display:flex;flex-direction:column;min-width:0;line-height:1.3}' +
  '.zst-brand-t b{font-family:\'ThmanyahSans\',\'IBM Plex Sans Arabic\',\'Tajawal\',sans-serif;font-size:15px;font-weight:900;' +
  'color:#fdfaf2;letter-spacing:.1px;white-space:nowrap}' +
  '.zst-brand-t span{font-size:10.5px;font-weight:500;color:rgba(253,250,242,.66);margin-top:1px;white-space:nowrap;' +
  'overflow:hidden;text-overflow:ellipsis}' +
  '.zst-x{width:34px;height:34px;flex:0 0 auto;display:grid;place-items:center;border-radius:11px;font-size:15px;line-height:1;' +
  'border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.09);color:#f4efe2;cursor:pointer;' +
  'transition:background .18s,border-color .18s,transform .15s}' +
  '.zst-x:hover{background:rgba(232,194,116,.22);border-color:rgba(232,194,116,.55)}' +
  '.zst-x:active{transform:scale(.94)}' +
  /* ── منطقة المعاينة ── */
  '.zst-stage{position:relative;flex:0 1 auto;min-height:0;padding:14px 14px 10px;display:flex;align-items:center;' +
  'justify-content:center;overflow:hidden;background:linear-gradient(160deg,var(--green-pale,#e8f4ef) 0%,var(--sand,#faf9f6) 62%,var(--card,#fff) 100%)}' +
  '.zst-stage::before{content:"";position:absolute;inset:0;z-index:0;pointer-events:none;opacity:.55;' +
  'background-image:linear-gradient(45deg,rgba(14,59,46,.045) 25%,transparent 25%,transparent 75%,rgba(14,59,46,.045) 75%),' +
  'linear-gradient(45deg,rgba(14,59,46,.045) 25%,transparent 25%,transparent 75%,rgba(14,59,46,.045) 75%);' +
  'background-size:18px 18px;background-position:0 0,9px 9px}' +
  '.zst-canvas{position:relative;z-index:1;display:block;max-width:100%;max-height:min(34vh,330px);border-radius:14px;' +
  'box-shadow:0 20px 46px -18px rgba(4,14,11,.55),0 0 0 1px rgba(14,59,46,.09)}' +
  /* ── التبويبات: سيجمنت iOS ── */
  '.zst-tabs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px;margin:12px 16px 0;padding:4px;' +
  'background:var(--sand,#faf9f6);border:1px solid var(--border,#e5e4de);border-radius:14px}' +
  '.zst-tab{min-width:0;padding:9px 4px;border-radius:10px;border:none;background:transparent;color:var(--muted,#757570);' +
  'font-family:\'ThmanyahSans\',\'Tajawal\',sans-serif;font-size:12.5px;font-weight:700;cursor:pointer;white-space:nowrap;' +
  'transition:background .18s,color .18s,box-shadow .18s}' +
  '.zst-tab:hover{color:var(--ink,#1a1a18)}' +
  '.zst-tab.on{background:var(--card,#fff);color:var(--green-deep,#0e3b2e);box-shadow:var(--shadow-sm,0 4px 14px -6px rgba(14,59,46,.16))}' +
  /* ── المحتوى ── */
  '.zst-body{flex:1 1 auto;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:12px 16px 8px;scrollbar-width:thin}' +
  '.zst-body::-webkit-scrollbar{width:6px}' +
  '.zst-body::-webkit-scrollbar-thumb{background:var(--border,#e5e4de);border-radius:99px}' +
  '.zst-row{margin-bottom:14px}' +
  '.zst-body label{display:block;font-size:11px;font-weight:800;color:var(--muted,#757570);margin-bottom:7px;letter-spacing:.3px}' +
  '.zst-chips{display:flex;flex-wrap:wrap;gap:7px}' +
  '.zst-chip{display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border-radius:11px;' +
  'border:1px solid var(--border,#e5e4de);background:var(--card,#fff);color:var(--ink,#1a1a18);font-family:inherit;' +
  'font-size:12px;font-weight:700;cursor:pointer;transition:background .16s,border-color .16s,color .16s,box-shadow .16s}' +
  '.zst-chip.on{background:var(--green-pale,#e8f4ef);color:var(--green-deep,#0e3b2e);border-color:var(--gold,#c9a14a);' +
  'box-shadow:0 0 0 3px rgba(201,161,74,.13)}' +
  /* لوحات الألوان */
  '.zst-swatches{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:7px}' +
  '.zst-sw{position:relative;height:54px;padding:0;border-radius:11px;overflow:hidden;cursor:pointer;' +
  'border:1px solid rgba(255,255,255,.18);box-shadow:inset 0 0 0 1px rgba(0,0,0,.06)}' +
  '.zst-sw.on{border-color:var(--gold,#c9a14a);box-shadow:0 0 0 3px rgba(201,161,74,.24)}' +
  '.zst-sw.on::after{content:"✓";position:absolute;top:4px;left:5px;font-size:10px;font-weight:900;color:#fff;' +
  'text-shadow:0 1px 3px rgba(0,0,0,.75)}' +
  '.zst-sw span{position:absolute;inset-inline:0;bottom:0;padding:8px 2px 4px;text-align:center;font-size:9px;' +
  'font-weight:800;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.55);background:linear-gradient(to top,rgba(0,0,0,.55),transparent)}' +
  /* النقوش */
  '.zst-pats{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:7px}' +
  '.zst-pat{display:flex;flex-direction:column;gap:4px;min-width:0;padding:4px 4px 5px;border-radius:11px;cursor:pointer;' +
  'border:1px solid var(--border,#e5e4de);background:var(--card,#fff);font-family:inherit;' +
  'transition:border-color .16s,box-shadow .16s,transform .15s}' +
  '.zst-pat:active{transform:scale(.97)}' +
  '.zst-pat canvas{display:block;width:100%;height:auto;border-radius:7px;background:var(--sand,#faf9f6)}' +
  '.zst-pat span{font-size:9px;font-weight:800;line-height:1.45;text-align:center;color:var(--muted,#757570);' +
  'white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
  '.zst-pat.on{border-color:var(--gold,#c9a14a);box-shadow:0 0 0 3px rgba(201,161,74,.16)}' +
  '.zst-pat.on span{color:var(--green-deep,#0e3b2e)}' +
  /* الحقول والمفاتيح */
  '.zst-field{width:100%;min-width:0;padding:10px 12px;border-radius:11px;border:1px solid var(--border,#e5e4de);' +
  'background:var(--card,#fff);color:var(--ink,#1a1a18);font-family:inherit;font-size:13px;box-sizing:border-box;' +
  'transition:border-color .16s,box-shadow .16s}' +
  '.zst-field::placeholder{color:var(--muted,#757570);opacity:.8}' +
  '.zst-field:focus{outline:none;border-color:var(--gold,#c9a14a);box-shadow:0 0 0 3px rgba(201,161,74,.16)}' +
  '.zst-two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}' +
  '.zst-toggle{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 0;' +
  'font-size:12.5px;color:var(--ink,#1a1a18);font-weight:600;border-bottom:1px solid var(--border,#e5e4de)}' +
  '.zst-toggle:last-child{border-bottom:none;padding-bottom:2px}' +
  '.zst-sw2{position:relative;flex:0 0 auto;width:42px;height:24px;border-radius:99px;border:none;cursor:pointer;' +
  'background:var(--border,#e5e4de);transition:background .18s}' +
  '.zst-sw2.on{background:linear-gradient(135deg,var(--primitive-green-500,#2a7a5f),var(--primitive-green-700,#1a5d47))}' +
  '.zst-sw2::after{content:"";position:absolute;top:3px;right:3px;width:18px;height:18px;border-radius:50%;background:#fff;' +
  'box-shadow:0 1px 3px rgba(0,0,0,.35);transition:transform .18s}' +
  '.zst-sw2.on::after{transform:translateX(-18px)}' +
  '.zst-range{width:100%;accent-color:var(--primitive-green-500,#2a7a5f);cursor:pointer}' +
  '.zst-avatars{display:flex;flex-wrap:wrap;gap:6px}' +
  '.zst-av{width:36px;height:36px;border-radius:11px;border:1px solid var(--border,#e5e4de);background:var(--sand,#faf9f6);' +
  'color:var(--ink,#1a1a18);cursor:pointer;font-size:18px;line-height:1;transition:border-color .16s,box-shadow .16s,background .16s}' +
  '.zst-av.on{border-color:var(--gold,#c9a14a);background:var(--gold-pale,#fdf5e0);box-shadow:0 0 0 3px rgba(201,161,74,.16)}' +
  '.zst-note{font-size:11px;color:var(--muted,#757570);line-height:1.7;margin-top:6px}' +
  /* ── شريط الإجراءات: شبكة ٤ خلايا لا تتزاحم ── */
  '.zst-actions{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;padding:12px 16px;' +
  'padding-bottom:calc(12px + env(safe-area-inset-bottom,0px));border-top:1px solid var(--border,#e5e4de);background:var(--card,#fff)}' +
  '.zst-btn{display:inline-flex;align-items:center;justify-content:center;gap:5px;min-width:0;padding:12px 8px;' +
  'border-radius:12px;border:1px solid var(--border,#e5e4de);background:var(--sand,#faf9f6);color:var(--ink,#1a1a18);' +
  'font-family:\'ThmanyahSans\',\'Tajawal\',sans-serif;font-size:12.5px;font-weight:700;white-space:nowrap;overflow:hidden;' +
  'cursor:pointer;transition:transform .14s,box-shadow .18s,background .18s}' +
  '.zst-btn:active{transform:scale(.97)}' +
  '.zst-btn.pri{background:linear-gradient(135deg,var(--primitive-green-900,#0e3b2e),var(--primitive-green-700,#1a5d47));' +
  'color:#fdfaf2;border-color:transparent;box-shadow:0 10px 22px -12px rgba(14,59,46,.8)}' +
  '.zst-btn.pri:hover{background:linear-gradient(135deg,var(--primitive-green-700,#1a5d47),var(--primitive-green-500,#2a7a5f))}' +
  '.zst-btn.gold{background:linear-gradient(135deg,var(--brand-gold-lt,#e6c97a),var(--brand-gold,#c9a14a));' +
  'color:#2b2108;border-color:transparent;box-shadow:0 10px 22px -12px rgba(201,161,74,.75)}' +
  '.zst-btn:disabled{opacity:.55;cursor:not-allowed;transform:none}' +
  /* ── التوست: فوق منطقة المعاينة، بعيدًا عن الأزرار ── */
  '.zst-flash{position:absolute;z-index:5;left:50%;bottom:12px;max-width:calc(100% - 28px);' +
  'transform:translateX(-50%) translateY(7px);background:linear-gradient(135deg,var(--primitive-green-900,#0e3b2e),var(--primitive-green-700,#1a5d47));' +
  'color:#fdfaf2;padding:9px 16px;border-radius:99px;font-size:12px;font-weight:700;white-space:nowrap;overflow:hidden;' +
  'text-overflow:ellipsis;box-shadow:0 12px 26px -10px rgba(0,0,0,.6),0 0 0 1px rgba(232,194,116,.32);' +
  'opacity:0;pointer-events:none;transition:opacity .22s,transform .22s}' +
  '.zst-flash.on{opacity:1;transform:translateX(-50%) translateY(0)}' +
  '.zst-flash.fix{position:fixed;bottom:24px;z-index:9900}' +
  /* ── الشاشات الصغيرة ── */
  '@media (max-width:430px){' +
  '.zst-panel{max-height:96dvh;border-radius:20px}' +
  '.zst-swatches{grid-template-columns:repeat(3,minmax(0,1fr))}' +
  '.zst-pats{grid-template-columns:repeat(3,minmax(0,1fr))}' +
  '.zst-canvas{max-height:30vh}' +
  '.zst-actions{grid-template-columns:repeat(2,minmax(0,1fr))}' +
  '.zst-brand-t span{display:none}' +
  '.zst-stage{padding:10px 10px 8px}' +
  '}' +
  '@media (max-width:360px){.zst-tab{font-size:11.5px}.zst-body{padding:10px 12px 6px}}' +
  '@media (prefers-reduced-motion:reduce){.zst-ov,.zst-panel,.zst-flash{transition:none}}';

  function injectCSS() {
    if (document.getElementById('zst-css')) return;
    var s = document.createElement('style');
    s.id = 'zst-css'; s.textContent = CSS;
    document.head.appendChild(s);
  }

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  /* التوست لازم يظهر فوق منطقة المعاينة داخل البانل — النسخة القديمة
     كانت fixed أسفل الشاشة فوق شريط الأزرار وتغطّي «حفظ/مشاركة». */
  var flashHost = null;
  function flash(msg) {
    var fixed = !flashHost;
    var t = el('div', 'zst-flash' + (fixed ? ' fix' : ''), msg);
    (flashHost || document.body).appendChild(t);
    requestAnimationFrame(function () { t.classList.add('on'); });
    setTimeout(function () { t.classList.remove('on'); }, 1750);
    setTimeout(function () { t.remove(); }, 2200);
  }

  var photoCache = { src: null, img: null };
  var logoCache = { src: null, img: null };

  function loadImage(src, cache) {
    return new Promise(function (resolve) {
      if (!src) return resolve(null);
      if (cache && cache.src === src && cache.img) return resolve(cache.img);
      var img = new Image();
      img.onload = function () { if (cache) { cache.src = src; cache.img = img; } resolve(img); };
      img.onerror = function () { resolve(null); };
      img.src = src;
    });
  }

  /* تصغير الصور المرفوعة قبل حفظها */
  function downscale(file, maxSide, quality) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        var img = new Image();
        img.onload = function () {
          var scale = Math.min(1, maxSide / Math.max(img.width, img.height));
          var c = document.createElement('canvas');
          c.width = Math.round(img.width * scale);
          c.height = Math.round(img.height * scale);
          var x = c.getContext('2d');
          if (!x) return reject(new Error('canvas'));
          x.drawImage(img, 0, 0, c.width, c.height);
          resolve(c.toDataURL('image/jpeg', quality || 0.82));
        };
        img.onerror = reject;
        img.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /* ══ ٨ · المكوّن الحيّ ═══════════════════════════════════════════════════ */
  var active = null;

  function open(opts) {
    opts = opts || {};
    ensureFonts();
    injectCSS();
    if (active) close();

    var prefs = loadPrefs();
    var identity = loadIdentity();

    /* قالب تلقائي مناسب لنوع المحتوى */
    if (!opts.template && prefs.template === 'auto' && DEFAULT_BY_KIND[opts.kind]) {
      /* يبقى auto — يُحلّ عند الرسم */
    }

    var ov = el('div', 'zst-ov');
    var panel = el('div', 'zst-panel');
    var head = el('div', 'zst-head');
    head.innerHTML =
      '<div class="zst-brand">' + LOGO_SVG +
        '<div class="zst-brand-t"><b>استوديو المشاركة</b><span>بطاقات جاهزة بهوية زاد</span></div>' +
      '</div>' +
      '<button class="zst-x" type="button" aria-label="إغلاق">✕</button>';
    var stage = el('div', 'zst-stage');
    var canvas = el('canvas', 'zst-canvas');
    stage.appendChild(canvas);
    flashHost = stage;
    var tabs = el('div', 'zst-tabs');
    var body = el('div', 'zst-body');
    var actions = el('div', 'zst-actions');

    panel.appendChild(head); panel.appendChild(stage); panel.appendChild(tabs);
    panel.appendChild(body); panel.appendChild(actions);
    ov.appendChild(panel);
    document.body.appendChild(ov);
    document.documentElement.style.overflow = 'hidden';

    var TABS = [
      { id: 'template', label: 'القالب' },
      { id: 'theme', label: 'الثيم' },
      { id: 'photo', label: 'الصورة' },
      { id: 'identity', label: 'هويتي' }
    ];
    var tab = 'template';

    function renderTabs() {
      tabs.innerHTML = '';
      TABS.forEach(function (t) {
        var b = el('button', 'zst-tab' + (tab === t.id ? ' on' : ''), t.label);
        b.type = 'button';
        b.onclick = function () { tab = t.id; renderTabs(); renderBody(); };
        tabs.appendChild(b);
      });
    }

    function row(label, node) {
      var r = el('div', 'zst-row');
      if (label) r.appendChild(el('label', null, label));
      r.appendChild(node);
      return r;
    }

    function chips(items, current, onPick, icon) {
      var w = el('div', 'zst-chips');
      items.forEach(function (it) {
        var b = el('button', 'zst-chip' + (it.id === current ? ' on' : ''),
          (icon && it.icon ? it.icon + ' ' : '') + it.label);
        b.type = 'button';
        b.onclick = function () { onPick(it.id); };
        w.appendChild(b);
      });
      return w;
    }

    function toggle(label, key) {
      var w = el('div', 'zst-toggle');
      w.appendChild(el('span', null, label));
      var b = el('button', 'zst-sw2' + (prefs[key] ? ' on' : ''));
      b.type = 'button';
      b.setAttribute('aria-pressed', prefs[key] ? 'true' : 'false');
      b.onclick = function () {
        prefs[key] = !prefs[key];
        b.classList.toggle('on', prefs[key]);
        b.setAttribute('aria-pressed', prefs[key] ? 'true' : 'false');
        update();
      };
      w.appendChild(b);
      return w;
    }

    var idTimer = null;
    function saveIdentitySoon() {
      clearTimeout(idTimer);
      idTimer = setTimeout(function () { saveIdentity(identity); }, 400);
    }

    function renderBody() {
      body.innerHTML = '';

      if (tab === 'template') {
        body.appendChild(row('القالب', chips(TEMPLATES, prefs.template, function (id) {
          prefs.template = id; renderBody(); update();
        }, true)));

        body.appendChild(row('المقاس', chips(Object.keys(FORMATS).map(function (k) {
          return { id: k, label: FORMATS[k].label };
        }), prefs.format, function (id) { prefs.format = id; renderBody(); update(); })));

        var sizeWrap = el('div');
        var sizeLabel = el('label', null, 'حجم الخط · ' + Math.round(prefs.size * 100) + '%');
        var range = document.createElement('input');
        range.type = 'range'; range.min = '70'; range.max = '135'; range.step = '5';
        range.value = String(Math.round(prefs.size * 100));
        range.className = 'zst-range';
        range.oninput = function () {
          prefs.size = Number(range.value) / 100;
          sizeLabel.textContent = 'حجم الخط · ' + range.value + '%';
          update();
        };
        sizeWrap.appendChild(sizeLabel); sizeWrap.appendChild(range);
        body.appendChild(sizeWrap);

        body.appendChild(row('محاذاة النص', chips([
          { id: 'center', label: 'وسط' }, { id: 'right', label: 'يمين' }
        ], prefs.align, function (id) { prefs.align = id; renderBody(); update(); })));

        body.appendChild(toggle('إظهار المصدر', 'showSource'));
        body.appendChild(toggle('إظهار التاريخ الهجري', 'showDate'));
        body.appendChild(toggle('إظهار شعار زاد', 'showLogo'));
        body.appendChild(toggle('إظهار الإطار المزخرف', 'showFrame'));
      }

      if (tab === 'theme') {
        var wrap = el('div', 'zst-swatches');
        Object.keys(PALETTES).forEach(function (k) {
          var P = PALETTES[k];
          var b = el('button', 'zst-sw' + (prefs.palette === k ? ' on' : ''));
          b.type = 'button';
          b.style.background = 'linear-gradient(135deg,' + P.bg[0] + ',' + P.bg[1] + ')';
          b.title = P.label;
          b.appendChild(el('span', null, P.label));
          b.onclick = function () { prefs.palette = k; renderBody(); update(); };
          wrap.appendChild(b);
        });
        body.appendChild(row('لوحة الألوان', wrap));

        /* النقوش: معاينة حقيقية لكل نقش بنفس دالة رسم البطاقة */
        var curP = PALETTES[prefs.palette] || PALETTES.emerald;
        var pats = el('div', 'zst-pats');
        PATTERNS.forEach(function (pt) {
          var pb = el('button', 'zst-pat' + (prefs.pattern === pt.id ? ' on' : ''));
          pb.type = 'button';
          pb.title = pt.label;
          pb.setAttribute('aria-label', 'نقش ' + pt.label);
          pb.setAttribute('aria-pressed', prefs.pattern === pt.id ? 'true' : 'false');
          pb.appendChild(paintPatternPreview(document.createElement('canvas'), curP, pt.id));
          pb.appendChild(el('span', null, pt.label));
          pb.onclick = function () { prefs.pattern = pt.id; renderBody(); update(); };
          pats.appendChild(pb);
        });
        body.appendChild(row('النقش الخلفي', pats));

        body.appendChild(row('المقاس', chips(Object.keys(FORMATS).map(function (k) {
          return { id: k, label: FORMATS[k].label };
        }), prefs.format, function (id) { prefs.format = id; renderBody(); update(); })));
        body.appendChild(el('p', 'zst-note',
          'النقش الإسلامي هو «نجوم إسلامية»، ومعه أربعة نقوش حديثة بسيطة — ' +
          'كلها بشفافية خفيفة تفضل ورا النص. والألوان من هوية زاد: الأخضر العميق والذهبي.'));
      }

      if (tab === 'photo') {
        var up = el('div');
        var inp = document.createElement('input');
        inp.type = 'file'; inp.accept = 'image/*'; inp.style.display = 'none';
        var pick = el('button', 'zst-btn', '🖼️ اختيار صورة خلفية');
        pick.type = 'button';
        pick.onclick = function () { inp.click(); };
        inp.onchange = async function () {
          var f = inp.files && inp.files[0];
          if (!f) return;
          try {
            var data = await downscale(f, 1500, 0.82);
            identity.bg = data;
            await loadImage(data, photoCache);
            saveIdentity(identity);
            update(); flash('✅ تم تطبيق الصورة');
          } catch (e) { flash('⚠️ تعذّر قراءة الصورة'); }
        };
        up.appendChild(pick); up.appendChild(inp);
        body.appendChild(row('خلفية مخصّصة', up));

        var scrimWrap = el('div');
        var scrimLabel = el('label', null, 'تعتيم الصورة · ' + identity.scrim + '%');
        var sr = document.createElement('input');
        sr.type = 'range'; sr.min = '0'; sr.max = '90'; sr.step = '5';
        sr.value = String(identity.scrim);
        sr.className = 'zst-range';
        sr.oninput = function () {
          identity.scrim = Number(sr.value);
          scrimLabel.textContent = 'تعتيم الصورة · ' + sr.value + '%';
          update();
        };
        scrimWrap.appendChild(scrimLabel); scrimWrap.appendChild(sr);
        body.appendChild(scrimWrap);

        var rm = el('button', 'zst-btn', '🗑️ إزالة الصورة');
        rm.type = 'button';
        rm.onclick = async function () {
          identity.bg = ''; saveIdentity(identity);
          await loadImage('', photoCache);
          update(); renderBody(); flash('تمت الإزالة');
        };
        body.appendChild(rm);
        body.appendChild(el('p', 'zst-note',
          'الصورة تُصغَّر على جهازك وتُحفظ محليًا فقط — لا تُرفع لأي خادم.'));
      }

      if (tab === 'identity') {
        body.appendChild(toggle('إظهار هويتي على البطاقة', 'showIdentity'));

        var nameI = document.createElement('input');
        nameI.className = 'zst-field'; nameI.type = 'text';
        nameI.placeholder = 'اسمك (اختياري)';
        nameI.value = identity.name || '';
        nameI.maxLength = 40;
        nameI.oninput = function () { identity.name = nameI.value; saveIdentitySoon(); update(); };

        var handleI = document.createElement('input');
        handleI.className = 'zst-field'; handleI.type = 'text';
        handleI.placeholder = 'المعرّف @ (اختياري)';
        handleI.value = identity.handle || '';
        handleI.maxLength = 30;
        handleI.dir = 'ltr';
        handleI.oninput = function () { identity.handle = handleI.value.replace(/^@/, ''); saveIdentitySoon(); update(); };

        var two = el('div', 'zst-two');
        two.appendChild(nameI); two.appendChild(handleI);
        body.appendChild(row('الاسم والمعرّف', two));

        var avs = el('div', 'zst-avatars');
        ['🌙', '⭐', '🌿', '🕌', '🤲', '📖', '📿', '✨', '🌸', '🕋', '🦋', '🌕'].forEach(function (a) {
          var b = el('button', 'zst-av' + (identity.avatar === a ? ' on' : ''), a);
          b.type = 'button';
          b.onclick = function () { identity.avatar = a; saveIdentity(identity); renderBody(); update(); };
          avs.appendChild(b);
        });
        body.appendChild(row('الأفاتار', avs));

        var logoBox = el('div');
        var li = document.createElement('input');
        li.type = 'file'; li.accept = 'image/*'; li.style.display = 'none';
        var lp = el('button', 'zst-btn', '🏷️ رفع شعار/صورة شخصية');
        lp.type = 'button';
        lp.onclick = function () { li.click(); };
        li.onchange = async function () {
          var f = li.files && li.files[0];
          if (!f) return;
          try {
            var data = await downscale(f, 400, 0.9);
            identity.logo = data;
            await loadImage(data, logoCache);
            saveIdentity(identity);
            update(); flash('✅ تم رفع الشعار');
          } catch (e) { flash('⚠️ تعذّر قراءة الصورة'); }
        };
        logoBox.appendChild(lp); logoBox.appendChild(li);
        if (identity.logo) {
          var rl = el('button', 'zst-btn', '✕ إزالة الشعار');
          rl.type = 'button';
          rl.onclick = async function () {
            identity.logo = ''; saveIdentity(identity);
            await loadImage('', logoCache);
            update(); renderBody();
          };
          logoBox.appendChild(rl);
        }
        body.appendChild(row('شعاري', logoBox));

        var saveBtn = el('button', 'zst-btn pri', '💾 حفظ الهوية');
        saveBtn.type = 'button';
        saveBtn.style.width = '100%';
        saveBtn.onclick = function () {
          saveIdentity(identity);
          flash('✅ هويتك محفوظة على جهازك');
        };
        body.appendChild(saveBtn);
        body.appendChild(el('p', 'zst-note',
          'الهوية تُحفظ محليًا على جهازك فقط، وتظهر على كل بطاقاتك. مبنية على ملفك في زاد إن وُجد.'));
      }
    }

    var raf = null;
    function update() {
      savePrefs(prefs);
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        try { paint(canvas, opts, prefs, identity); }
        catch (e) { console.warn('[ZadStudio] paint failed', e); }
      });
    }

    /* ── أزرار الإجراءات ── */
    async function getBlob() {
      await ensureFonts();
      var c = paint(document.createElement('canvas'), opts, prefs, identity);
      return new Promise(function (res) { c.toBlob(function (b) { res(b); }, 'image/png', 1); });
    }

    var shareBtn = el('button', 'zst-btn pri', '📤 مشاركة');
    var saveB = el('button', 'zst-btn gold', '⬇️ حفظ');
    var copyB = el('button', 'zst-btn', '📋 نسخ');
    var textB = el('button', 'zst-btn', '✍️ نص فقط');
    [shareBtn, saveB, copyB, textB].forEach(function (b) { b.type = 'button'; });

    shareBtn.onclick = async function () {
      shareBtn.disabled = true;
      try {
        var blob = await getBlob();
        if (!blob) throw new Error('no blob');
        var name = 'zad-' + (opts.kind || 'card') + '-' + Date.now() + '.png';
        var file = new File([blob], name, { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: (opts.share && opts.share.title) || opts.title || 'زاد',
            text: (opts.share && opts.share.text) || ''
          });
        } else {
          download(blob, name);
          flash('⬇️ نُزّلت الصورة — شاركها من المعرض');
        }
      } catch (e) {
        if (e && e.name === 'AbortError') { /* ألغى المستخدم */ }
        else { flash('⚠️ تعذّر إنشاء الصورة'); }
      }
      shareBtn.disabled = false;
    };

    saveB.onclick = async function () {
      saveB.disabled = true;
      try {
        var blob = await getBlob();
        download(blob, 'zad-' + (opts.kind || 'card') + '-' + Date.now() + '.png');
        flash('✅ تم الحفظ');
      } catch (e) { flash('⚠️ تعذّر الحفظ'); }
      saveB.disabled = false;
    };

    copyB.onclick = async function () {
      try {
        var blob = await getBlob();
        if (navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          flash('📋 نُسخت الصورة');
        } else { throw new Error('no clipboard'); }
      } catch (e) { flash('⚠️ النسخ غير مدعوم — استخدم «حفظ»'); }
    };

    textB.onclick = async function () {
      var text = (opts.share && opts.share.text) || [opts.title, opts.body, opts.source, APP_DOMAIN]
        .filter(Boolean).join('\n\n');
      try {
        if (navigator.share && !window.matchMedia('(min-width: 900px)').matches) {
          await navigator.share({ title: opts.title || 'زاد', text: text });
        } else {
          await navigator.clipboard.writeText(text);
          flash('📋 نُسخ النص');
        }
      } catch (e) { flash('⚠️ تعذّر النسخ'); }
    };

    actions.appendChild(shareBtn); actions.appendChild(saveB);
    actions.appendChild(copyB); actions.appendChild(textB);

    function download(blob, name) {
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 2500);
    }

    function close() {
      clearTimeout(idTimer);
      flashHost = null;
      saveIdentity(identity);        /* لا تفقد الهوية عند الإغلاق بالزر أو Escape */
      document.documentElement.style.overflow = '';
      ov.classList.remove('on');
      setTimeout(function () { ov.remove(); }, 200);
      document.removeEventListener('keydown', onKey);
      active = null;
    }
    function onKey(e) { if (e.key === 'Escape') close(); }

    head.querySelector('.zst-x').onclick = close;
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    document.addEventListener('keydown', onKey);

    renderTabs(); renderBody();
    requestAnimationFrame(function () { ov.classList.add('on'); });
    update();

    active = { close: close, opts: opts };
    return active;
  }

  function close() { if (active) active.close(); }

  /* ══ ٩ · واجهة برمجية عامة ══════════════════════════════════════════════ */
  var ZadStudio = {
    version: '1.1.0',
    __ready: true,
    open: open,
    close: close,
    palettes: Object.keys(PALETTES),
    formats: Object.keys(FORMATS),
    templates: TEMPLATES.map(function (t) { return t.id; }),
    patterns: PATTERNS.map(function (p) { return p.id; }),

    /** يرسم بطاقة ويعيد canvas (بلا واجهة) */
    render: function (opts) {
      ensureFonts();
      var c = document.createElement('canvas');
      return paint(c, opts || {}, loadPrefs(), loadIdentity());
    },

    /** Promise<Blob> — PNG جاهز */
    toBlob: function (opts) {
      return ensureFonts().then(function () {
        return new Promise(function (resolve) {
          var c = paint(document.createElement('canvas'), opts || {}, loadPrefs(), loadIdentity());
          c.toBlob(function (b) { resolve(b); }, 'image/png', 1);
        });
      });
    },

    /** مشاركة مباشرة بالسطر الواحد (تستخدم الإعدادات المحفوظة) */
    share: function (opts) {
      return ensureFonts().then(function () {
        var p = loadPrefs(), id = loadIdentity();
        var c = paint(document.createElement('canvas'), opts || {}, p, id);
        return new Promise(function (resolve) {
          c.toBlob(async function (blob) {
            try {
              var file = new File([blob], 'zad-card.png', { type: 'image/png' });
              if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({ files: [file], title: (opts && opts.title) || 'زاد' });
              } else {
                var url = URL.createObjectURL(blob);
                var a = document.createElement('a'); a.href = url; a.download = 'zad-card.png';
                document.body.appendChild(a); a.click(); a.remove();
                setTimeout(function () { URL.revokeObjectURL(url); }, 2500);
              }
            } catch (e) {}
            resolve(blob);
          }, 'image/png', 1);
        });
      });
    },

    /** إتاحة إضافة خلفية مخصّصة من خارج الاستوديو */
    setIdentity: function (patch) {
      var id = Object.assign(loadIdentity(), patch || {});
      saveIdentity(id);
      return id;
    },
    getIdentity: loadIdentity,

    /** توافق رجعي مع الاسم القديم الذي كانت تناديه عرين الأبطال بلا تعريف */
    card: function (o) {
      o = o || {};
      return open({
        kind: o.kind || 'quote',
        eyebrow: o.tag || '',
        title: o.title || '',
        body: o.body || '',
        source: o.source || '',
        share: { title: o.title, text: [o.title, o.body, o.source].filter(Boolean).join('\n\n') }
      });
    }
  };

  window.ZadStudio = Object.assign(window.ZadStudio || {}, ZadStudio);
  window.ZadShareCard = window.ZadShareCard || function (o) { return window.ZadStudio.card(o); };

  /* صفحة واحدة فيها مفتاح للاستوديو من الإعدادات؟ نضيفه تلقائيًا. */
  function injectSettingsEntry() {
    if (!/settings\.html$/.test(location.pathname)) return;
    if (document.getElementById('zst-settings-row')) return;
    var host = document.querySelector('[data-zst-host]') ||
               document.querySelector('.settings-list, .settings, main .card:last-of-type, main');
    if (!host) return;
    var row = document.createElement('div');
    row.id = 'zst-settings-row';
    row.className = 'settings-row';
    row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;' +
      'border:1px solid var(--border);border-radius:14px;background:var(--card);margin:12px 0';
    row.innerHTML =
      '<div class="lbl" style="min-width:0"><b style="display:block;font-size:14px">استوديو المشاركة</b>' +
      '<small style="color:var(--muted);font-size:12px">بطاقات الآيات والأدعية بهويتك وشعارك</small></div>' +
      '<button type="button" style="padding:9px 16px;border-radius:10px;border:none;background:var(--green-deep);' +
      'color:#fff;font-family:inherit;font-size:13px;font-weight:700;cursor:pointer">🎨 افتح</button>';
    row.querySelector('button').onclick = function () {
      open({
        kind: 'verse', eyebrow: 'بطاقة تجريبية',
        body: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا',
        source: 'سورة الطلاق · ٢'
      });
    };
    host.appendChild(row);
  }

  /* لو الصفحة فيها موديول المشاركة القديم، نجعل زر الصورة يمرّ بالاستوديو */
  function hookLegacy() {
    if (!window.ZadShare || window.ZadShare.__studioHooked) return;
    if (typeof window.ZadShare.png === 'function') {
      var legacyPng = window.ZadShare.png;
      window.ZadShare.png = function (title, body, src, pageName) {
        try {
          return window.ZadStudio.open({
            kind: 'quote', title: title || '', body: body || '',
            source: src || '', eyebrow: pageName || ''
          });
        } catch (e) { return legacyPng.apply(window.ZadShare, arguments); }
      };
      window.ZadShare.__studioHooked = true;
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { hookLegacy(); injectSettingsEntry(); });
  } else { hookLegacy(); injectSettingsEntry(); }

})();
