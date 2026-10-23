/* ═══════════════════════════════════════════════════════════════════════════
   زاد — سجل الشبكة الحيّ  ·  js/net-ledger.js
   ─────────────────────────────────────────────────────────────────────────
   لماذا يوجد هذا الملف؟
   كل تطبيق ديني يقول «خصوصية كاملة» ثم يتصل بعشر خدمات. هنا نُثبت القول:
   كل نطاق خارجي يلمسه التطبيق مسجَّل بسببِه وما يُرسِله، ومَن شاء أوقفه.

   ثلاثة أجزاء:
     1) سجل حيّ   — PerformanceObserver يلتقط كل مورد شبكي (حتى ما حُمّل قبل
                    هذا الملف، عبر buffered) ويُخزّنه محليًا (آخر 200 طلب).
     2) اعتراض    — fetch و XHR يُسجَّلان قبل التنفيذ، فيظهر المحجوب أيضًا.
     3) سياسة     — مفاتيح لكل غرض (لا لكل نطاق): ساعة مرجعية · خطوط ·
                    صور مصغّرة · عنوان عكسي · ذكاء اصطناعي · مزامنة.
   كل شيء يبقى في localStorage. لا يُرفع السجل نفسه أبدًا.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window.ZadNet && window.ZadNet._inited) return;

  var LOG_KEY = 'zad_net_log_v1';
  var POLICY_KEY = 'zad_net_policy';
  var MAX = 200;

  /* ── 1) سِجل النطاقات: الغرض وما يُرسَل بالضبط ───────────────────────────
     kind: 'core'    لا يمكن إيقافه دون تعطيل ميزة أساسية
           'optional' يمكن إيقافه ويبقى التطبيق صالحًا
           'legacy'   لم يبقَ مستخدمًا (نبقي السطر للشفافية)                */
  var HOSTS = {
    'fonts.googleapis.com': {
      name: 'خطوط الويب (فهرسة)', kind: 'optional',
      why: 'تحميل ملف الخطوط المستخدم في الواجهة (Tajawal / Amiri / IBM Plex Sans Arabic حسب الصفحة).',
      sends: 'IP + عنوان الصفحة + نوع المتصفح — يرسلها المتصفح تلقائيًا في أي طلب.',
      ifOff: 'يُستبدل الخط بخط النظام؛ النص يظل مقروءًا.', policy: 'googleFonts'
    },
    'fonts.gstatic.com': {
      name: 'خطوط الويب (الملفات)', kind: 'optional',
      why: 'ملفات الخطوط نفسها بعد قراءة تعريفات Google.',
      sends: 'IP + عنوان الصفحة.', ifOff: 'خط النظام.', policy: 'googleFonts'
    },
    'api.aladhan.com': {
      name: 'Aladhan — مواقيت وساعة مرجعية', kind: 'core',
      why: 'مواقيت الصلاة بحسب مدينتك، ومقارنة ساعة جهازك بساعة مرجعية. طلب الساعة صار مرة واحدة كل ٦ ساعات بدل كل صفحة.',
      sends: 'IP · الإحداثيات (في طلب المواقيت فقط) · التاريخ.',
      ifOff: 'المواقيت تُحسب محليًا بمحرك adhan المدمج؛ طلب الساعة يُلغى.', policy: 'clockSync'
    },
    'img.youtube.com': {
      name: 'جوجل — صور الفيديوهات', kind: 'optional',
      why: 'الصورة المصغّرة لكل فيديو في المكتبة المرئية قبل تشغيله.',
      sends: 'IP + معرّف الفيديو (أي فيديو تنظر إليه).',
      ifOff: 'مربع بلون التطبيق بدل الصورة.', policy: 'youtubeThumbs'
    },
    'i.ytimg.com': {
      name: 'جوجل — صور الفيديوهات (بديل)', kind: 'optional',
      why: 'نفس الغرض عند استخدام نطاق الصور البديل.',
      sends: 'IP + معرّف الفيديو.', ifOff: 'مربع بديل.', policy: 'youtubeThumbs'
    },
    'www.youtube.com': {
      name: 'يوتيوب — المشغّل', kind: 'optional',
      why: 'لا يُطلب إلا عند ضغطك على «تشغيل» في فيديو.',
      sends: 'IP + كوكيز جوجل (من المتصفح) + الفيديو المطلوب.',
      ifOff: 'يمكنك فتح الفيديو في تطبيق يوتيوب بدلًا من التضمين.', policy: null
    },
    'nominatim.openstreetmap.org': {
      name: 'OpenStreetMap — اسم المكان', kind: 'optional',
      why: 'تحويل إحداثياتك إلى اسم مدينة/حيّ لعرضه في شاشة المواقيت والبحث.',
      sends: 'إحداثياتك الحالية — وهذا هو الحسّاس هنا.',
      ifOff: 'يُعرض «موقعك الحالي» ويبقى الاسم قابلًا للكتابة يدويًا.', policy: 'reverseGeo'
    },
    'api.quran.com': {
      name: 'Quran.com — تفسير ونص', kind: 'optional',
      why: 'جلب التفسير الميسّر عند فتحه فقط (الآيات نفسها محفوظة داخل التطبيق).',
      sends: 'IP + رقم السورة والآية.', ifOff: 'التفسير لا يظهر؛ النص يظل كاملًا.', policy: 'quranExtras'
    },
    'api.alquran.cloud': {
      name: 'AlQuran Cloud — نص بديل', kind: 'optional',
      why: 'مصدر احتياطي للآيات عند تعذّر المصدر الأول.',
      sends: 'IP + رقم السورة.', ifOff: 'يُستخدم المخزَّن محليًا.', policy: 'quranExtras'
    },
    'everyayah.com': {
      name: 'EveryAyah — تلاوة', kind: 'optional',
      why: 'ملفات التلاوة آية بآية عند الضغط على تشغيل (وتُحفظ بعدها للاستماع أوفلاين).',
      sends: 'IP + رقم الآية والقارئ.', ifOff: 'الاستماع يتوقف؛ النص يعمل.', policy: 'quranAudio'
    },
    'cdn.islamic.network': {
      name: 'Islamic Network — تلاوة بديلة', kind: 'optional',
      why: 'المصدر الاحتياطي للتلاوة.',
      sends: 'IP + رقم الآية.', ifOff: 'يعتمد على المصدر الأول.', policy: 'quranAudio'
    },
    'api.groq.com': {
      name: 'Groq — الذكاء الاصطناعي', kind: 'optional',
      why: 'أسئلة المساعد الذكي. لا يُطلب إلا حين تكتب سؤالًا.',
      sends: 'نصّ سؤالك كما كتبته + IP.',
      ifOff: 'المساعد المحلي (أذكار وسيرة) يظل يعمل؛ الأسئلة الحرة تتوقف.', policy: 'ai'
    },
    'hadeethenc.com': {
      name: 'موسوعة الحديث', kind: 'optional',
      why: 'جلب نص حديث عند البحث فيه.',
      sends: 'IP + رقم الحديث.', ifOff: 'الأحاديث المحفوظة فقط.', policy: 'hadith'
    },
    'formspree.io': {
      name: 'Formspree — نموذج البلاغ', kind: 'optional',
      why: 'إرسال بلاغ مشكلة من صفحة «بلاغ».',
      sends: 'ما تكتبه في النموذج + بريدك إن أدخلته + IP.',
      ifOff: 'يمكنك نسخ نص البلاغ وإرساله يدويًا.', policy: 'forms'
    },
    'zadullashr-default-rtdb.europe-west1.firebasedatabase.app': {
      name: 'Firebase — مزامنة العائلة', kind: 'optional',
      why: 'مزامنة مجموعات العائلة (اختياري، يحتاج كود مجموعة).',
      sends: 'معرّف المجموعة + عدّادات العبادات.',
      ifOff: 'التطبيق يعمل محليًا بالكامل.', policy: 'groupSync'
    },
    'ipapi.co': {
      name: 'ipapi — تقدير المدينة', kind: 'legacy',
      why: 'كان يقدّر مدينتك من عنوان IP عند فشل GPS.',
      sends: 'IP (ولا شيء آخر).', ifOff: 'أُزيل من الكود نهائيًا — اختيار المدينة يدويًا أوضح وأصدق.'
    },
    'cdn.jsdelivr.net': {
      name: 'jsDelivr — مكتبات', kind: 'legacy',
      why: 'مكتبات قديمة (dexie-cloud / adhan).',
      sends: 'IP.', ifOff: 'النسخ المطلوبة موطَّنة داخل التطبيق.'
    },
    'wa.me': { name: 'واتساب — مشاركة', kind: 'optional', why: 'مشاركة دعاء أو آية عبر واتساب.', sends: 'لا يرسل شيئًا التطبيق — تُفتح الصفحة في المتصفح عند ضغطك.', ifOff: 'لا شيء ما دمت لا تضغط زر المشاركة.' },
    't.me': { name: 'تيليجرام — مشاركة', kind: 'optional', why: 'مشاركة عبر تيليجرام.', sends: 'عند ضغطك فقط.', ifOff: '—' },
    'www.facebook.com': { name: 'فيسبوك — مشاركة', kind: 'optional', why: 'مشاركة عبر فيسبوك.', sends: 'عند ضغطك فقط.', ifOff: '—' },
    'twitter.com': { name: 'X — مشاركة', kind: 'optional', why: 'مشاركة عبر X.', sends: 'عند ضغطك فقط.', ifOff: '—' }
  };

  /* ── 2) السياسة: لكل غرض، لا لكل نطاق ─────────────────────────────────── */
  var POLICY_DEFAULT = {
    googleFonts: true, clockSync: true, youtubeThumbs: true, reverseGeo: true,
    quranExtras: true, quranAudio: true, ai: true, hadith: true, forms: true, groupSync: true
  };
  function readPolicy() {
    var raw = {};
    try { raw = JSON.parse(localStorage.getItem(POLICY_KEY) || '{}') || {}; } catch (e) { raw = {}; }
    var out = {};
    Object.keys(POLICY_DEFAULT).forEach(function (k) {
      out[k] = (raw[k] === false) ? false : true;
    });
    return out;
  }
  function writePolicy(next) {
    try { localStorage.setItem(POLICY_KEY, JSON.stringify(next)); } catch (e) {}
  }
  function allows(policyKey) {
    if (!policyKey) return true;
    return readPolicy()[policyKey] !== false;
  }

  /* ── 3) تحديد النطاق والغرض من أي رابط ────────────────────────────────── */
  var MATCH = [
    { key: 'clockSync', re: /api\.aladhan\.com\/v1\/currentTime/ },
    { key: 'reverseGeo', re: /nominatim\.openstreetmap\.org/ },
    { key: 'ai', re: /api\.groq\.com/ },
    { key: 'groupSync', re: /firebasedatabase\.app/ },
    { key: 'forms', re: /formspree\.io/ },
    { key: 'quranAudio', re: /everyayah\.com|cdn\.islamic\.network/ },
    { key: 'quranExtras', re: /api\.quran\.com|api\.alquran\.cloud/ },
    { key: 'hadith', re: /hadeethenc\.com/ },
    { key: 'youtubeThumbs', re: /img\.youtube\.com|i\.ytimg\.com/ },
    { key: 'googleFonts', re: /fonts\.googleapis\.com|fonts\.gstatic\.com/ }
  ];

  function hostOf(url) {
    try { return new URL(url, location.href).host; } catch (e) { return ''; }
  }
  function policyFor(url) {
    for (var i = 0; i < MATCH.length; i++) { if (MATCH[i].re.test(url)) return MATCH[i].key; }
    return null;
  }
  function infoFor(host) {
    if (HOSTS[host]) return HOSTS[host];
    var bare = host.replace(/^www\./, '');
    if (HOSTS[bare]) return HOSTS[bare];
    var keys = Object.keys(HOSTS);
    for (var i = 0; i < keys.length; i++) {
      if (host.indexOf(keys[i]) >= 0 || keys[i].indexOf(host) >= 0) return HOSTS[keys[i]];
    }
    return { name: host, kind: 'legacy', why: 'غير مسجَّل بعد — أضِفه إلى سجل الشبكة فورًا.', sends: '—', ifOff: '—' };
  }
  /* لا تخزين لِما كتبه المستخدم: نحذف الاستعلام كله ونبقي المسار */
  function safePath(url) {
    try {
      var u = new URL(url, location.href);
      var p = u.pathname || '/';
      if (p.length > 46) p = p.slice(0, 46) + '…';
      return p;
    } catch (e) { return ''; }
  }

  /* ── 4) السجل ─────────────────────────────────────────────────────────── */
  function readLog() {
    try {
      var a = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
      return Array.isArray(a) ? a : [];
    } catch (e) { return []; }
  }
  function pushLog(entry) {
    var log = readLog();
    /* دمج الطلب نفسه خلال دقيقة: يصل مرتين (اعتراض fetch + PerformanceObserver)،
       وأحيانًا بترتيب مختلف — فنبحث للخلف لا في آخر سطر فقط. */
    var merged = false;
    for (var i = log.length - 1; i >= 0 && i >= log.length - 12; i--) {
      var e = log[i];
      if (e.h === entry.h && e.p === entry.p && (entry.t - e.t) < 60000) {
        e.n = (e.n || 1) + 1; e.t = entry.t;
        if (e.s === 'cache' && entry.s === 'net') e.s = 'net';   /* الأدق يغلب */
        merged = true;
        break;
      }
    }
    if (!merged) log.push(entry);
    if (log.length > MAX) log = log.slice(log.length - MAX);
    try { localStorage.setItem(LOG_KEY, JSON.stringify(log)); } catch (e) {}
    return log;
  }

  function record(url, state) {
    var h = hostOf(url);
    if (h && (h === location.host || h === '127.0.0.1:8080')) h = 'جهازك (نفس النطاق)';
    if (!h) return null;
    var entry = { t: Date.now(), h: h, p: safePath(url), s: state || 'net', n: 1, pg: (location.pathname.split('/').pop() || 'index.html') };
    pushLog(entry);
    if (typeof notify === 'function') notify();
    return entry;
  }

  /* 1) كل ما حُمّل — حتى قبل هذا الملف */
  try {
    if (window.PerformanceObserver) {
      var seen = {};
      var po = new PerformanceObserver(function (list) {
        list.getEntries().forEach(function (e) {
          if (!e || !e.name || e.name.indexOf('http') !== 0) return;
          var h = hostOf(e.name);
          if (!h || h === location.host) return;
          var key = h + safePath(e.name);
          if (seen[key]) return;
          seen[key] = 1;
          record(e.name, (e.transferSize > 0) ? 'net' : 'cache');
        });
      });
      po.observe({ type: 'resource', buffered: true });
    }
  } catch (e) {}

  /* 2) اعتراض fetch: نسجّل المحجوب أيضًا، والمنع قبل الخروج للشبكة */
  try {
    var nativeFetch = window.fetch;
    if (nativeFetch) {
      window.fetch = function (input, init) {
        var url = (typeof input === 'string') ? input : (input && input.url) || '';
        var pol = policyFor(url);
        if (pol && !allows(pol)) { record(url, 'blocked'); return Promise.reject(new TypeError('ZadNet: blocked (' + pol + ')')); }
        return nativeFetch.apply(this, arguments).then(function (res) {
          record(url, res && res.ok ? 'net' : 'fail');
          return res;
        }, function (err) { record(url, 'fail'); throw err; });
      };
    }
  } catch (e) {}

  /* 3) اعتراض XHR (لا يزال مستخدمًا في بعض الوحدات) */
  try {
    var XO = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (m, url) {
      this.__zadUrl = url;
      return XO.apply(this, arguments);
    };
    var XS = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function () {
      var url = this.__zadUrl || '';
      var pol = policyFor(url);
      if (pol && !allows(pol)) { record(url, 'blocked'); try { this.abort(); } catch (e) {} return; }
      record(url, 'net');
      return XS.apply(this, arguments);
    };
  } catch (e) {}

  var listeners = [];
  function notify() { listeners.forEach(function (fn) { try { fn(); } catch (e) {} }); }

  /* ── 5) واجهة العرض ───────────────────────────────────────────────────── */
  var CSS = ''
    + '.nl-sum{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:10px 0 14px}'
    + '@media(max-width:560px){.nl-sum{grid-template-columns:repeat(2,1fr)}}'
    + '.nl-s{background:var(--sand);border:1px solid var(--border);border-radius:12px;padding:10px 8px;text-align:center}'
    + '.nl-s b{display:block;font-size:18px;font-weight:900;color:var(--green-deep);font-variant-numeric:tabular-nums}'
    + 'html[data-theme="dark"] .nl-s b,html[data-theme="oled"] .nl-s b{color:var(--sys-green)}'
    + '.nl-s small{font-size:10px;color:var(--muted);font-weight:700;line-height:1.5;display:block;margin-top:2px}'
    + '.nl-list{display:flex;flex-direction:column;gap:6px;max-height:330px;overflow:auto;margin:0 -2px;padding:2px}'
    + '.nl-row{display:grid;grid-template-columns:52px 1fr auto;gap:8px;align-items:center;background:var(--sand);border:1px solid var(--border);border-radius:10px;padding:8px 10px}'
    + '.nl-time{font-size:10.5px;color:var(--muted);font-weight:800;font-variant-numeric:tabular-nums;direction:ltr;text-align:center}'
    + '.nl-main{min-width:0}'
    + '.nl-host{font-size:11.5px;font-weight:800;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
    + '.nl-why{font-size:10.5px;color:var(--muted);line-height:1.5;margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
    + '.nl-badge{font-size:9.5px;font-weight:800;border-radius:99px;padding:3px 8px;white-space:nowrap}'
    + '.nl-badge.net{background:rgba(201,161,74,.16);color:#8a6a1f}'
    + '.nl-badge.cache{background:rgba(42,122,95,.14);color:var(--green-deep)}'
    + '.nl-badge.blocked{background:rgba(168,68,47,.12);color:#8f3a27}'
    + '.nl-badge.local{background:rgba(120,120,120,.1);color:var(--muted)}'
    + '.nl-badge.fail{background:rgba(120,120,120,.14);color:var(--muted)}'
    + 'html[data-theme="dark"] .nl-badge.net,html[data-theme="oled"] .nl-badge.net{background:#26200f;color:#e6c97a}'
    + 'html[data-theme="dark"] .nl-badge.cache,html[data-theme="oled"] .nl-badge.cache{background:#0e2a1e;color:var(--sys-green)}'
    + 'html[data-theme="dark"] .nl-badge.blocked,html[data-theme="oled"] .nl-badge.blocked{background:#2a1512;color:#ff9a80}'
    + '.nl-empty{text-align:center;color:var(--muted);font-size:11.5px;padding:18px;line-height:1.8}'
    + '.nl-ctl{display:flex;flex-direction:column;gap:2px;margin-top:14px;border-top:1px solid var(--border);padding-top:12px}'
    + '.nl-c{display:flex;align-items:flex-start;gap:10px;padding:9px 0;border-bottom:1px dashed var(--border)}'
    + '.nl-c:last-child{border-bottom:none}'
    + '.nl-c .tx{flex:1;min-width:0}'
    + '.nl-c .nm{font-size:12px;font-weight:800;color:var(--ink);display:flex;align-items:center;gap:6px;flex-wrap:wrap}'
    + '.nl-c .nm em{font-style:normal;font-size:9px;font-weight:800;border-radius:6px;padding:1px 5px;background:var(--green-pale);color:var(--green-deep)}'
    + 'html[data-theme="dark"] .nl-c .nm em,html[data-theme="oled"] .nl-c .nm em{background:#0e2a1e;color:var(--sys-green)}'
    + '.nl-c .ds{font-size:10.5px;color:var(--muted);line-height:1.6;margin-top:2px}'
    + '.nl-c .ds b{color:var(--ink);font-weight:800}'
    + '.nl-sw{flex:0 0 auto;width:42px;height:24px;border-radius:99px;border:1.5px solid var(--border);background:var(--sand);position:relative;cursor:pointer;transition:.18s;margin-top:2px}'
    + '.nl-sw::after{content:"";position:absolute;top:2px;inset-inline-start:2px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.25);transition:.18s}'
    + '.nl-sw.on{background:var(--green-soft);border-color:var(--green-soft)}'
    + '.nl-sw.on::after{inset-inline-start:22px}'
    + '.nl-sw:disabled{opacity:.4;cursor:not-allowed}'
    + '.nl-acts{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}'
    + '.nl-btn{border:1.5px solid var(--border);background:var(--sand);color:var(--ink);border-radius:10px;padding:8px 13px;font-family:inherit;font-size:11.5px;font-weight:800;cursor:pointer}'
    + '.nl-btn:hover{border-color:var(--green-soft)}'
    + '.nl-btn.danger{color:#8f3a27;border-color:rgba(168,68,47,.28)}'
    + '.nl-note{font-size:11px;color:var(--muted);line-height:1.8;margin-top:10px}';

  function injectCSS() {
    if (document.getElementById('zad-net-css')) return;
    var st = document.createElement('style');
    st.id = 'zad-net-css'; st.textContent = CSS;
    (document.head || document.documentElement).appendChild(st);
  }

  function fmtTime(t) {
    var d = new Date(t);
    return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
  }
  var STATE_AR = { net: 'شبكة', cache: 'من الذاكرة', blocked: 'أوقفته', fail: 'فشل', local: 'جهازي' };
  /* ترجمة حالة الطلب بلغة الواجهة (الشريحة + العدّاد) */
  function zlabel(state) {
    var ar = STATE_AR[state] || state;
    try {
      var M = window.ZAD_UI_MAP || {}, lg = document.documentElement.lang || 'ar';
      if (lg !== 'ar' && M[ar] && M[ar][lg]) return M[ar][lg];
    } catch (e) {}
    return ar;
  }

  function summary(log) {
    var hosts = {}, net = 0, blocked = 0, total = 0;
    log.forEach(function (e) {
      var n = e.n || 1;
      total += n;
      if (e.h === 'جهازك (نفس النطاق)') return;          /* موارد التطبيق نفسها */
      hosts[e.h] = 1;
      if (e.s === 'blocked') blocked += n; else if (e.s === 'net' || e.s === 'fail') net += n;
    });
    return { total: total, hosts: Object.keys(hosts).length, net: net, blocked: blocked };
  }

  function render(el) {
    if (!el) return;
    injectCSS();
    function draw() {
      var log = readLog().slice().reverse();
      var s = summary(log);
      var rows = log.slice(0, 60).map(function (e) {
        var info = infoFor(e.h);
        return '<div class="nl-row"><div class="nl-time">' + fmtTime(e.t) + '</div>'
          + '<div class="nl-main"><div class="nl-host">' + info.name + '</div>'
          + '<div class="nl-why">' + (e.p || '/') + ' · ' + esc(info.why) + '</div></div>'
          + '<span class="nl-badge ' + e.s + '">' + zlabel(e.s) + (e.n > 1 ? ' ×' + e.n : '') + '</span></div>';
      }).join('');
      el.innerHTML =
        '<div class="nl-sum">'
        + '<div class="nl-s"><b>' + ar(s.total) + '</b><small>طلبًا خارجيًا</small></div>'
        + '<div class="nl-s"><b>' + ar(s.hosts) + '</b><small>نطاقًا</small></div>'
        + '<div class="nl-s"><b>' + ar(s.net) + '</b><small>خرج للشبكة</small></div>'
        + '<div class="nl-s"><b>' + ar(s.blocked) + '</b><small>أوقفناه</small></div>'
        + '</div>'
        + '<div class="nl-list" id="nl-log">' + (rows || '<div class="nl-empty">لم يخرج أي طلب خارجي في هذه الجلسة بعد.<br>تنقّل في التطبيق ثم عُد إلى هنا — كل طلب سيظهر بسطر.</div>') + '</div>'
        + '<div class="nl-acts">'
        + '<button class="nl-btn" id="nl-refresh">🔄 تحديث</button>'
        + '<button class="nl-btn" id="nl-export">⬇️ تنزيل السجل</button>'
        + '<button class="nl-btn danger" id="nl-clear">مسح السجل</button>'
        + '</div>'
        + '<div class="nl-note">السجل نفسه محفوظ في جهازك فقط، ويُحتفظ بآخر ٢٠٠ سطر. لا نسجّل ما تكتبه: تظهر المسارات فقط بلا أي استعلام أو نص.</div>'
        + policyHTML();

      el.querySelector('#nl-refresh').onclick = draw;
      el.querySelector('#nl-clear').onclick = function () {
        try { localStorage.removeItem(LOG_KEY); } catch (e) {}
        draw();
      };
      el.querySelector('#nl-export').onclick = function () {
        var data = { generatedAt: new Date().toISOString(), entries: readLog(), policy: readPolicy(), registry: HOSTS };
        var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'zad-net-log.json';
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
      };
      bindPolicy(el, draw);
    }
    draw();
    listeners.push(draw);
    return draw;
  }

  function policyHTML() {
    var pol = readPolicy();
    var items = [
      { k: 'googleFonts', t: 'خطوط Google', d: 'خطوط الواجهة. إيقافها يجعل النص بخط النظام — أسرع وأكثر خصوصية.' },
      { k: 'clockSync', t: 'مقارنة ساعة جهازك', d: 'طلب واحد كل ٦ ساعات. إيقافه يستخدم ساعتك وحدها.' },
      { k: 'youtubeThumbs', t: 'صور الفيديوهات', d: 'صور يوتيوب المصغّرة. إيقافها يُظهر مربعات محلية.' },
      { k: 'reverseGeo', t: 'اسم المدينة من الإحداثيات', d: 'يرسل إحداثياتك إلى OpenStreetMap. إيقافه يُبقي الإحداثيات على جهازك.' },
      { k: 'ai', t: 'المساعد الذكي', d: 'يرسل نصّ سؤالك إلى Groq. إيقافه يُبقي الأذكار والسيرة المحليين.' },
      { k: 'quranExtras', t: 'تفسير خارجي', d: 'يطلب التفسير عند فتحه. النص والتلاوة يبقيان.' },
      { k: 'quranAudio', t: 'تلاوة خارجية', d: 'ملفات التلاوة عند التشغيل.' },
      { k: 'hadith', t: 'بحث في الأحاديث', d: 'جلب نص حديث غير محفوظ.' },
      { k: 'groupSync', t: 'مزامنة العائلة', d: 'مشاركة عدّادات المجموعة.' },
      { k: 'forms', t: 'نماذج البلاغ', d: 'إرسال نموذج المشكلة إلى Formspree.' }
    ];
    return '<div class="nl-ctl">' + items.map(function (it) {
      var on = pol[it.k] !== false;
      return '<div class="nl-c"><div class="tx"><div class="nm">' + it.t + '</div><div class="ds">' + it.d + '</div></div>'
        + '<button class="nl-sw ' + (on ? 'on' : '') + '" data-pol="' + it.k + '" role="switch" aria-checked="' + on + '" aria-label="' + it.t + '"></button></div>';
    }).join('') + '</div>';
  }

  function bindPolicy(el, redraw) {
    el.querySelectorAll('[data-pol]').forEach(function (btn) {
      btn.onclick = function () {
        var k = btn.getAttribute('data-pol');
        var pol = readPolicy();
        pol[k] = pol[k] === false;
        writePolicy(pol);
        if (k === 'googleFonts' || k === 'youtubeThumbs') {
          location.reload();
          return;
        }
        btn.classList.toggle('on', pol[k]);
        btn.setAttribute('aria-checked', String(pol[k]));
        if (redraw) redraw();
      };
    });
  }

  function esc(s) {
    return String(s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
  function ar(n) { return String(n).replace(/\d/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }); }

  window.ZadNet = {
    _inited: true,
    hosts: HOSTS,
    log: readLog,
    record: record,
    allows: allows,
    policy: readPolicy,
    setPolicy: function (k, v) { var p = readPolicy(); p[k] = !!v; writePolicy(p); },
    clear: function () { try { localStorage.removeItem(LOG_KEY); } catch (e) {} },
    render: render,
    onUpdate: function (fn) { listeners.push(fn); }
  };
})();
