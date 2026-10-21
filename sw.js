/* ════════════════════════════════════════════════════════════
   زاد — Service Worker
   Version: 20261020-z22
   Strategy: Network-First WITH TIMEOUT (HTML/CSS/JS) + Cache-First (media)

   إصلاح حرج: إضافة مهلة زمنية للشبكة. على الشبكات الضعيفة (0 KB/s متصلة
   لكن ميتة) كان fetch يعلّق للأبد فلا يرجع للكاش = شاشة سوداء. الآن لو لم
   تستجب الشبكة خلال 3 ثوانٍ نرجع فوراً للنسخة المخزّنة.

   Z9a: إضافة /api/ و /health/ إلى قائمة BYPASS —
        نداءات الـ API يجب أن تصل دائماً للخادم مباشرةً بدون أي
        تدخّل من الـ SW. كاش session غير صحيح = 401 مستمر بعد login.

   Z18: إصلاح fallback الملاحة — كان أي طلب لصفحة غير مُخزَّنة مسبقاً
        (مثل report.html) يرجع بمحتوى index.html بصمت عند فشل/بطء الشبكة،
        فتظهر لوحة التحكم بدل الصفحة المطلوبة وكأنها فتحت بنجاح. الآن
        يُرجَع fallback الصفحة الرئيسية فقط لطلبات الجذر الفعلية، وأي
        صفحة أخرى غير مخزّنة تعرض رسالة خطأ صريحة بدلاً من ذلك.

   Z19 (Offline/PWA audit): توسيع PRECACHE ليشمل الصفحات الأساسية
        المُعلَن أنها تعمل أوفلاين (القبلة، الحج/عرفة، الزكاة/الأضحية،
        الأطفال، الذكاء الاصطناعي، برنامج اليوم، قارئ المصحف) والتي كانت
        تفشل بصمت عند أول زيارة أوفلاين قبل زيارتها أونلاين ولو مرة —
        رغم أن محتواها مُخزَّن محلياً بالكامل في الكود ولا يحتاج شبكة.
        وإضافة نطاقات Firebase (RTDB + Auth) إلى BYPASS: لم تكن مُستثناة
        من قبل، فكان بإمكان استجابات GET الخاصة بمستخدم (عبر fallback
        الـ long-polling عندما يُحظَر WebSocket) أن تُخزَّن في كاش مشترك
        بين كل مستخدمي نفس الجهاز/المتصفح — وأيضاً كانت مهلة الشبكة
        (3 ثوانٍ) تقطع اتصالات long-polling الطويلة الطبيعية بالخطأ.

   Z20 (Performance pass): كل ملفات JS/CSS المشتركة بقت لها نسخة .min
        (whitespace/comments بس — بدون mangle ولا compress، عشان أونكليك=
        في الـ HTML بتنادي على أسماء الدوال دي مباشرة ومش بيشوفها أي
        أداة تحليل استاتيكي). كل صفحات الموقع بتحمّل النسخ المصغّرة دلوقتي،
        فـ PRECACHE اتحدّثت تتماشى معاها — لو فضلت بتحمّل النسخ القديمة
        هتتخزّن كاش من غير فايدة وتضيع مساحة storage المستخدم.

   Z21: حوّلت كل خطوط الموقع الـ15 من .otf لـ .woff2 (68% أصغر إجمالاً —
        3.65MB بقت 1.18MB)، والـ .otf الأصلي فضل موجود كـ fallback في كل
        @font-face. حدّثت أسماء الخطوط في PRECACHE لنفس السبب.
   ════════════════════════════════════════════════════════════ */

// R13: إعادة تصميم الهوم من الصفر — إبطال الكاش حتى يرى المستخدم العائد الواجهة الجديدة فورًا.
const CACHE_STATIC = 'zad-20261021-special-r19';
const NET_TIMEOUT  = 3000; /* مهلة الشبكة قبل الرجوع للكاش (ms) */

/* ── أصول تُخزَّن مسبقاً عند التثبيت ── */
const PRECACHE = [
  './', './index.html', './404.html',
  './register.html', './sync.html',
  './js/api-client.min.js', './js/sync-manager.min.js',
  './prayers.html', './ramadan.html', './adhkar.html', './mushaf.html', './takbeer.html',
  './hasn.html', './worship.html', './zahra.html', './hawwa.html', './settings.html', './hijri.html',
  './css/style.min.css', './css/premium-ui.min.css', './manifest.json',
  './fonts/thmanyahserifdisplay-Bold.woff2', './fonts/thmanyahserifdisplay-Regular.woff2',
  './icons/icon-192.svg', './icons/icon-512.svg',
  /* core JS */
  './js/font-scale.js', /* R6: مقياس الخط الموحّد — تحمّله كل صفحة قبل أول رسم */
  './js/app.min.js', './js/adhkar-azkar.min.js', './js/ghars-stories.min.js', './js/diagnostics.min.js', './js/storage.min.js', './js/calendar.min.js',
  /* P1-2: محرك المواقيت مُوطَّن محليًا بدل cdn.jsdelivr.net (المدرج في BYPASS
     أدناه، فكان يرفض تخزينه ويموت الحساب أوفلاين). 15 KB فقط.
     P1-7: وحدة إشعارات المواقيت.
     P0-9: نموذج الانحراف المغناطيسي WMM-2025 (11 KB) — لازم يكون مخزَّنًا مسبقًا
     مع qibla.html نفسها، وإلا فُتحت الصفحة من الكاش أوفلاين ومات التصحيح بالذات
     في الوقت الذي يُستخدم فيه (بلا شبكة). */
  './js/vendor/adhan.min.js', './js/prayer-notifications.min.js',
  './js/vendor/geomag.min.js', './js/vendor/canvas-confetti.min.js',
  /* R19: GSAP موطَّن محليًا بدل cdnjs (كان 37 صفحة تعتمد على CDN خارجي
     فيسقط كل الأنيميشن أوفلاين) + وحدة الوضع الخاص المشتركة. */
  './js/vendor/gsap.min.js', './js/vendor/ScrollTrigger.min.js', './js/ui/special-mode.min.js',
  './menu.min.js', './command-palette.min.js', './js/ui/bottom-nav.min.js', './js/ui/progress-rollup.min.js',
  './js/design-system.min.js', './js/fixes-module.min.js',
  './js/utils/helpers.min.js', './js/core/state-manager.min.js', './js/core/router.min.js',
  './js/ui/design-tokens.min.js', './js/ui/feedback.min.js',
  './js/ui/daily-hub.min.js', './js/ui/micro-interactions.min.js', './js/ui/offline-ui.min.js', './js/nav-accordion.min.js',
  /* adhkar offline data */
  './js/adhkar-database.min.js', './js/adhkar-complete.min.js',
  './js/hasn-part1.min.js', './js/hasn-part2.min.js',
  './js/adhkar-database-extended.min.js', './js/adhkar-content-sections.min.js',

  /* ── Z19: أصول مشتركة كانت ناقصة من أغلب الصفحات ── */
  './lang.min.js',
  './js/seasons-module.min.js', './js/share-button.min.js', './js/gps-fix.min.js', './js/pwa-install-fab.min.js',
  './js/sync-module.min.js',

  /* ── Z19: صفحات مُعلَن أنها تعمل أوفلاين بالكامل (محتواها مُضمَّن في الكود) ── */
  './qibla.html',                                   /* حساب اتجاه القبلة محلي بالكامل */
  './barnamaj.html',                                /* الوجهة الفعلية لاختصار "ورد اليوم" و redirect صفحة worship.html */
  './mushaf-quran.html', './js/quran-module.min.js',    /* قارئ المصحف: الصفحة نفسها + رسائل الخطأ المدمجة فيها أفضل من fallback الـ SW العام */
  './zakat.html', './js/ui/zakat-engine.js', './zakat-ahkam.html', './zakat-anwa.html',
  './odhiya.html', './js/ui/hajj-now.js',
  './manasik.html', './arafah.html', './js/audio-manager.min.js', './hasad.html', './sadaqah.html',
  './arafah-dua.html', './hikayat-hajj.html',
  './ai.html', './js/ai-guard.min.js', './js/advanced-ai-module.min.js', /* المساعد المحلي (أذكار/سيرة/فقه) يعمل أوفلاين؛ المحادثة فقط تحتاج نتاً وتُعرَض برسالة صريحة */
  './kids.html', './kids-tales.html', './kids-garden.html', './kids-gazette.html',
  './kids-detectives.html', './kids-city.html', './kids-memory.html',
  './kids-liars.html', './kids-recipe.html', './kids-compass.html',
  './kids-lab.html', './kids-hospitality.html', './kids-day.html',
  './kids-heroes.html', './kids-school.html',
  './kids-fun.html', './kids-academy.html', './kids-creativity.html', './kids-parents.html',

  /* ── R14: المكتبة النصية + محرّكات اليوم ──
     صفحة المكتبة وبياناتها تُخزَّن مسبقًا، فيعمل البحث في ١٥٠ حديثًا بلا شبكة.
     الجلب الحيّ لبقية الموسوعة يمرّ عبر /api/ وهو مستثنى من الكاش أصلًا. */
  './maktaba-nassiya.html', './js/data/maktaba.js', './js/ui/library-data.js',
  './js/data/verses.js', './js/data/videos.js', './js/ui/daily-verse.js', './js/ui/media-random.js',
];

/* ── لا تُخزَّن أبداً ── */
const BYPASS = [
  /* ── Z9a: API + Health — يصلان دائماً للخادم مباشرةً ── */
  '/api/',          /* كل نداءات /api/v1/* بدون استثناء  */
  '/health/',       /* /health/ready وما شابه             */

  /* ── AI / external APIs ── */
  'api.anthropic.com', 'generativelanguage.googleapis.com', 'api.groq.com',
  'mcp.tafsir.net',

  /* ── Fonts / CDN ── */
  'fonts.googleapis.com', 'fonts.gstatic.com',
  'cdnjs.cloudflare.com', 'cdn.jsdelivr.net',

  /* ── Analytics / Vercel infra ── */
  'analytics', 'vercel.com/api', '_vercel',

  /* ── Prayer times / Quran APIs ── */
  'aladhan.com', 'alquran.cloud',

  /* ── Geo ── */
  'nominatim.openstreetmap.org',

  /* ── Media streams ── */
  'radiojar.com', 'zeno.fm',

  /* ── Z19: Firebase (Auth + Realtime DB) — بيانات خاصة بالمستخدم.
     لم تكن مُستثناة من قبل: عادةً تمر عبر WebSocket (لا تراه الـ SW أصلاً)،
     لكن عند فشل WebSocket تتحول لـ long-polling عبر GET عادي يمر من هنا —
     فكان بإمكان رد GET لمستخدم أن يُخزَّن ويُقدَّم لاحقاً لمستخدم آخر على
     نفس الجهاز، وكانت مهلة الـ 3 ثوانٍ تقطع اتصال الـ long-poll الطبيعي. ── */
  'firebasedatabase.app', 'firebaseio.com',
  'identitytoolkit.googleapis.com', 'securetoken.googleapis.com',
  'www.gstatic.com/firebasejs',
];
const bypass = url => BYPASS.some(p => url.includes(p));

/* ── Install ── */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_STATIC)
      /* addAll يرفض الكل لو سقط أصل واحد — والتالي يُخزّن ما نجح ويترك الباقي */
      .then(c => Promise.allSettled(PRECACHE.map(u => c.add(u))))
      .catch(() => {})           /* لا تفشل التثبيت لو أصل واحد لم يُحمَّل */
      .then(() => self.skipWaiting())
  );
});

/* ── Activate: احذف الكاشات القديمة وتولَّ السيطرة ── */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_STATIC).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ includeUncontrolled: true }))
      .then(clients => clients.forEach(c => c.postMessage({ type: 'SW_UPDATED', ver: '20261019-no-welcome' })))
  );
});

/* ── Helper: fetch مع مهلة زمنية (يرفض بعد NET_TIMEOUT) ── */
function fetchWithTimeout(request, timeout) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('network-timeout')), timeout);
    fetch(request, { cache: 'no-cache' }).then(
      res => { clearTimeout(timer); resolve(res); },
      err => { clearTimeout(timer); reject(err); }
    );
  });
}


/* ── Fetch ── */

/* ── استقبال أمر التفعيل الفوري من الصفحة ── */
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

/* ── P1-7: النقر على إشعار مواقيت الصلاة ─────────────────────────────────────
   بدون هذا المعالج يفتح Chrome صفحة about:blank أو لا يفعل شيئًا، فيظن
   المستخدم أن الإشعار معطّل. نفتح الصفحة المسجّلة في notification.data.url
   (تضعها js/prayer-notifications.js) ونعيد استخدام تبويب مفتوح إن وُجد بدل
   تكديس التبويبات عند كل أذان. */
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || 'prayers.html';
  let targetUrl;
  try { targetUrl = new URL(target, self.location.origin).href; }
  catch (e) { targetUrl = self.location.origin + '/prayers.html'; }

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      /* 1) نفس الصفحة مفتوحة بالفعل → ركّز عليها */
      for (const c of list) {
        if (c.url === targetUrl && 'focus' in c) return c.focus();
      }
      /* 2) أي تبويب للتطبيق مفتوح → أعِد توجيهه بدل فتح تبويب جديد */
      for (const c of list) {
        if ('navigate' in c && 'focus' in c) return c.navigate(targetUrl).then(x => x.focus());
      }
      /* 3) لا شيء مفتوح → افتح نافذة */
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
      return undefined;
    })
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (!url.startsWith('http')) return;
  if (e.request.method !== 'GET') return;   /* لا تتدخّل في POST */
  if (bypass(url)) return;

  /* الصور والخطوط → Cache First (نادراً ما تتغيّر) */
  const isMedia = /\.(png|jpg|jpeg|svg|gif|webp|woff2?|mp4|mp3|otf|ttf)/i.test(url);
  if (isMedia) {
    e.respondWith(
      caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
        if (res && res.status === 200 && res.type !== 'opaque') {
          const clone = res.clone();
          caches.open(CACHE_STATIC).then(c => c.put(e.request, clone)).catch(() => {});
        }
        return res;
      }).catch(() => hit))
    );
    return;
  }

  /* HTML/CSS/JS → Network-First بمهلة، ثم الكاش، ثم fallback صريح */
  const isNavigation = e.request.mode === 'navigate' || e.request.destination === 'document';
  const isRootRequest = isNavigation && /\/(index\.html)?$/.test(new URL(url).pathname);

  e.respondWith(
    fetchWithTimeout(e.request, NET_TIMEOUT)
      .then(res => {
        if (res && res.status === 200 && res.type !== 'opaque') {
          const clone = res.clone();
          caches.open(CACHE_STATIC).then(c => c.put(e.request, clone)).catch(() => {});
        }
        return res;
      })
      .catch(() =>
        caches.match(e.request).then(hit => {
          if (hit) return hit;

          /* لو الطلب فعلاً للصفحة الرئيسية، ارجع لنسختها المخزّنة.
             غير كده لا تستبدل صفحة لم تُخزَّن بعد (مثل report.html) بمحتوى
             index.html — ده كان يعرض لوحة التحكم بدل الصفحة المطلوبة فعلياً
             ويوهم المستخدم إنها فتحت بنجاح. اعرض رسالة خطأ صريحة بدلاً منها. */
          if (isRootRequest) {
            return caches.match('./index.html').then(idx => idx || offlineErrorResponse());
          }
          if (isNavigation) return offlineErrorResponse();

          /* طلبات CSS/JS غير الملاحية: لا تُرجِع HTML مكانها (يكسر التحليل) */
          return new Response('', { status: 503, statusText: 'Offline' });
        })
      )
  );
});

function offlineErrorResponse() {
  return new Response(
    '<!doctype html><meta charset=utf-8><body style="background:#0e3b2e;color:#fff;font-family:sans-serif;text-align:center;padding-top:30vh">'
    + '<h2>تعذّر التحميل</h2><p>تحقّق من الاتصال وحاول مجدداً.</p>'
    + '<a href="./index.html" style="color:#e6c97a">العودة للرئيسية</a></body>',
    { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}
