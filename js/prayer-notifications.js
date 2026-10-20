/* ═══════════════════════════════════════════════════════════════════════════
   إشعارات مواقيت الصلاة — زاد
   ─────────────────────────────────────────────────────────────────────────
   P1-7 في تقرير الأوديت: القسم كله كان بلا أي إشعار لمواقيت الصلاة، وهي
   الميزة الأولى التي يُثبَّت لأجلها أي تطبيق مواقيت.

   ثلاثة مبادئ حكمت التصميم:

   1) **التسليم عبر Service Worker أولًا.** `new Notification()` لا تُعرض على
      Chrome/Android إطلاقًا (مهجورة منذ سنوات) — وهذا هو السبب الأول لشكوى
      «الإشعارات لا تصل» في تقييمات المتاجر. المسار الصحيح هو
      `ServiceWorkerRegistration.showNotification()`، ونحتفظ بـ`new Notification()`
      كاحتياطي لسطح المكتب فقط.

   2) **الحساب محلي بالكامل.** نستخدم `calcPrayerTimes()` (محرك adhan-js
      المُوطَّن في js/vendor/adhan.min.js) فلا حاجة لأي شبكة — الإشعارات تعمل
      أوفلاين. ونجدول على **اللحظة المطلقة** (`Date`) لا على ساعة مكتوبة، لذا
      لا تتأثر بمنطقة الجهاز الزمنية ولا بالتوقيت الصيفي.

   3) **إعادة التسليح.** متصفح الويب لا يملك يقظة خلفية، فنعوّض بإعادة
      الجدولة عند كل ظهور للصفحة (`visibilitychange`) وبعد كل إشعار يُطلق
      وعند منتصف الليل وعند عودة الشبكة — مع حفظ «آخر إشعار أُطلق» حتى لا
      يتكرر عند إعادة الجدولة.

   الاعتماديات: js/calendar.min.js (يوفر calcPrayerTimes) — يسقط بأمان إن غاب.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const SETTINGS_KEY = 'zad_prayer_notif';
  const LAST_FIRED_KEY = 'zad_prayer_notif_last';
  const DAY_MS = 86400000;

  const PRAYERS = [
    { id: 'fajr',    label: 'الفجر',   icon: '🌅' },
    { id: 'dhuhr',   label: 'الظهر',   icon: '☀️' },
    { id: 'asr',     label: 'العصر',   icon: '🌤️' },
    { id: 'maghrib', label: 'المغرب',  icon: '🌇' },
    { id: 'isha',    label: 'العشاء',  icon: '🌙' },
  ];

  const DEFAULTS = {
    enabled: false,
    prayers: { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true },
    beforeMin: 0,        /* 0 = عند الأذان · 5/10/15 = قبله بدقائق */
    jumuah: true,        /* تذكير إضافي قبل ظهر الجمعة */
  };

  /* ── الإعدادات ─────────────────────────────────────────────────────────── */
  function readSettings() {
    let raw = {};
    try { raw = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'); } catch (e) { raw = {}; }
    return {
      enabled:   raw.enabled === true,
      prayers:   Object.assign({}, DEFAULTS.prayers, raw.prayers || {}),
      beforeMin: [0, 5, 10, 15, 20].indexOf(Number(raw.beforeMin)) >= 0 ? Number(raw.beforeMin) : 0,
      jumuah:    raw.jumuah !== false,
    };
  }
  function writeSettings(patch) {
    const next = Object.assign(readSettings(), patch || {});
    if (patch && patch.prayers) next.prayers = Object.assign(readSettings().prayers, patch.prayers);
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(next)); } catch (e) {}
    return next;
  }

  /* ── الموقع ────────────────────────────────────────────────────────────── */
  function getLocation() {
    /* الأولوية للموقع المحفوظ (يكتبه prayers.html وgps-fix.js) */
    try {
      const raw = JSON.parse(localStorage.getItem('zad_last_location') || 'null');
      if (raw && isFinite(raw.lat) && isFinite(raw.lng)) return { lat: raw.lat, lng: raw.lng, city: raw.city || '', source: 'saved' };
    } catch (e) {}
    try {
      const lat = parseFloat(localStorage.getItem('zad_lat'));
      const lng = parseFloat(localStorage.getItem('zad_lng'));
      if (isFinite(lat) && isFinite(lng)) return { lat, lng, city: localStorage.getItem('zad_city') || '', source: 'flat' };
    } catch (e) {}
    /* القاهرة كمرجع أخير — أفضل من لا شيء، وتُظهر حالة واضحة للمستخدم */
    return { lat: 30.0444, lng: 31.2357, city: 'القاهرة', source: 'fallback' };
  }

  /* ── التسليم ───────────────────────────────────────────────────────────── */
  async function deliver(title, body, opts) {
    const o = opts || {};
    const payload = {
      body: body,
      icon: './icons/icon.png',            /* PNG مطلوب على Android — الـSVG لا يظهر */
      badge: './icons/icon.png',
      dir: 'rtl',
      lang: 'ar',
      tag: o.tag || 'zad-prayer',
      renotify: !!o.renotify,
      data: { url: o.url || 'prayers.html', prayer: o.prayer || null },
    };
    if (o.vibrate) payload.vibrate = [250, 120, 250];
    /* لوحة رمضان: الوضع الهادئ — يُسلَّم الإشعار **صامتًا** بين الإمساك
       والإفطار بدل إسكاته بالكامل، فلا يضيع الوقت ويُحترَم الصائم. */
    try {
      if (window.ZadRamadan && window.ZadRamadan.quietNow && window.ZadRamadan.quietNow()) payload.silent = true;
    } catch (e) {}

    /* 1) Service Worker — المسار الذي يعمل فعلًا على Android */
    try {
      if (navigator.serviceWorker && navigator.serviceWorker.getRegistration) {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg && reg.showNotification) { await reg.showNotification(title, payload); return 'sw'; }
      }
    } catch (e) { /* نسقط للمسار التالي */ }

    /* 2) احتياطي سطح المكتب */
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, payload);                                          /* eslint-disable-line no-new */
        return 'legacy';
      }
    } catch (e) {}
    return 'none';
  }

  /* ── الجدولة ───────────────────────────────────────────────────────────── */
  let timers = [];
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  function permissionOK() {
    return ('Notification' in window) && Notification.permission === 'granted';
  }

  async function upcomingPrayers(days) {
    if (typeof window.calcPrayerTimes !== 'function') return [];
    const loc = getLocation();
    const span = days || 2;
    const out = [];
    for (let d = 0; d < span; d++) {
      const day = new Date();
      day.setDate(day.getDate() + d);
      let times;
      try {
        times = await window.calcPrayerTimes(loc.lat, loc.lng, day, { timezone: undefined });
      } catch (e) { continue; }
      PRAYERS.forEach(p => {
        const t = times[p.id] && times[p.id].time;
        if (t instanceof Date) out.push({ id: p.id, label: p.label, icon: p.icon, at: new Date(t.getTime()), city: loc.city });
      });
    }
    return out.sort((a, b) => a.at - b.at);
  }

  function alreadyFired(id, at) {
    /* يمنع التكرار عند إعادة الجدولة: نتذكر آخر إشعار أُطلق بمعرّفه ووقته */
    try {
      const last = JSON.parse(localStorage.getItem(LAST_FIRED_KEY) || '{}');
      return last[id] === at.getTime();
    } catch (e) { return false; }
  }
  function markFired(id, at) {
    try {
      const last = JSON.parse(localStorage.getItem(LAST_FIRED_KEY) || '{}');
      last[id] = at.getTime();
      localStorage.setItem(LAST_FIRED_KEY, JSON.stringify(last));
    } catch (e) {}
  }

  async function schedule() {
    clearTimers();
    const s = readSettings();
    if (!s.enabled || !permissionOK()) return { scheduled: 0, reason: s.enabled ? 'permission' : 'disabled' };

    const list = await upcomingPrayers(2);
    if (!list.length) return { scheduled: 0, reason: 'no-times' };

    const now = Date.now();
    let count = 0;
    const offsetMs = s.beforeMin * 60000;

    list.forEach(p => {
      if (s.prayers[p.id] === false) return;
      const fireAt = p.at.getTime() - offsetMs;
      const delay = fireAt - now;
      if (delay <= 0 || delay > 2 * DAY_MS) return;
      if (alreadyFired(p.id, p.at)) return;

      const id = setTimeout(async () => {
        markFired(p.id, p.at);
        const when = p.at.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
        const head = s.beforeMin > 0
          ? `${p.icon} بقي ${s.beforeMin} دقيقة على ${p.label}`
          : `${p.icon} حان الآن وقت صلاة ${p.label}`;
        const body = s.beforeMin > 0
          ? `الأذان الساعة ${when}${p.city ? ' · ' + p.city : ''} — استعد للصلاة`
          : `الأذان الآن${p.city ? ' في ' + p.city : ''} · ${when} — حيّ على الصلاة`;
        await deliver(head, body, { tag: 'zad-prayer-' + p.id, prayer: p.id, vibrate: true });
        /* إعادة تسليح لليوم التالي بدل الاكتفاء بإشعار واحد */
        setTimeout(() => { schedule(); }, 60000);
      }, delay);

      timers.push(id);
      count++;
    });

    /* تذكير الجمعة — قبل الظهر بـ45 دقيقة */
    if (s.jumuah && s.prayers.dhuhr !== false) {
      const fri = list.filter(p => p.id === 'dhuhr' && p.at.getDay() === 5)[0];
      if (fri) {
        const delay = fri.at.getTime() - 45 * 60000 - now;
        if (delay > 0 && delay < DAY_MS && !alreadyFired('jumuah', fri.at)) {
          timers.push(setTimeout(async () => {
            markFired('jumuah', fri.at);
            await deliver('🕌 الجمعة بعد 45 دقيقة', 'اغتسل وتطيّب وبكّر إلى المسجد — والدال على الخير كفاعله', { tag: 'zad-jumuah', vibrate: true });
          }, delay));
          count++;
        }
      }
    }

    return { scheduled: count, reason: 'ok' };
  }

  /* إعادة الجدولة عند منتصف الليل (تتغير المواقيت يوميًا) */
  function armMidnightRollover() {
    const now = new Date();
    const next = new Date(now); next.setHours(24, 0, 30, 0);
    setTimeout(() => { schedule(); armMidnightRollover(); }, next - now);
  }

  /* ── التفعيل ───────────────────────────────────────────────────────────── */
  async function enable() {
    if (!('Notification' in window)) {
      return { ok: false, error: 'unsupported', message: 'هذا المتصفح لا يدعم الإشعارات' };
    }
    let perm = Notification.permission;
    if (perm === 'default') {
      try { perm = await Notification.requestPermission(); } catch (e) { perm = 'denied'; }
    }
    if (perm !== 'granted') {
      return {
        ok: false,
        error: perm === 'denied' ? 'denied' : 'default',
        message: perm === 'denied'
          ? 'الإشعارات مرفوضة من إعدادات المتصفح — افتح إعدادات الموقع وغيّر إذن الإشعارات إلى «سماح»'
          : 'لم يُمنح الإذن بعد',
      };
    }
    writeSettings({ enabled: true });
    const res = await schedule();

    /* إشعار تأكيد فوري — يثبت للمستخدم أن المسار يعمل فعلًا */
    await deliver('🔔 إشعارات المواقيت مفعّلة', `سننبّهك عند أذان كل صلاة${res.scheduled ? ' · ' + res.scheduled + ' إشعارات مجدولة' : ''}`, { tag: 'zad-prayer-confirm' });

    return { ok: true, scheduled: res.scheduled, reason: res.reason };
  }

  function disable() {
    writeSettings({ enabled: false });
    clearTimers();
    return { ok: true };
  }

  async function toggle() {
    return readSettings().enabled ? disable() : await enable();
  }

  /* ── إرشاد توفير البطارية ──────────────────────────────────────────────────
     أكبر سبب لفشل إشعارات PWA على Android هو «تحسين البطارية» الذي يقتل
     الـService Worker. نكشف الشركة المصنّعة ونعطي الخطوات الدقيقة لها. */
  function batteryHelp() {
    const ua = navigator.userAgent || '';
    if (/MIUI|Xiaomi|Redmi|POCO/i.test(ua)) {
      return { vendor: 'Xiaomi / Redmi / POCO', steps: 'الإعدادات ← التطبيقات ← إدارة التطبيقات ← زاد ← توفير البطارية ← «لا قيود»، ثم فعّل «التشغيل التلقائي».' };
    }
    if (/HUAWEI|HONOR/i.test(ua)) {
      return { vendor: 'Huawei / Honor', steps: 'الإعدادات ← البطارية ← تشغيل التطبيقات ← زاد ← أوقف «الإدارة التلقائية» وفعّل الخيارات الثلاثة يدويًا.' };
    }
    if (/OPPO|realme|OnePlus/i.test(ua)) {
      return { vendor: 'Oppo / realme / OnePlus', steps: 'الإعدادات ← البطارية ← استخدام البطارية ← زاد ← «السماح بالنشاط في الخلفية» و«التشغيل التلقائي».' };
    }
    if (/samsung|SM-[A-Z]/i.test(ua)) {
      return { vendor: 'Samsung', steps: 'الإعدادات ← البطارية ← حدود الاستخدام في الخلفية ← أخرج «زاد» من «التطبيقات المُدارة» و«الخاملة العميقة».' };
    }
    if (/iPhone|iPad|iPod/i.test(ua)) {
      return { vendor: 'iOS', steps: 'iOS لا يسمح بإشعارات مجدولة محليًا لتطبيق ويب إلا أثناء فتح الصفحة. ثبّت التطبيق ثم افتحه مرة يوميًا، أو استخدم إشعارات الخادم (Push) إن فُعّلت.' };
    }
    return { vendor: 'Android', steps: 'الإعدادات ← التطبيقات ← زاد ← البطارية ← «غير مقيّد». وأبقِ التطبيق مثبَّتًا على الشاشة الرئيسية.' };
  }

  /* ── الحالة للتشخيص ────────────────────────────────────────────────────── */
  async function status() {
    const s = readSettings();
    let deliveryPath = 'unavailable';
    try {
      if (navigator.serviceWorker && navigator.serviceWorker.getRegistration) {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg && reg.showNotification) deliveryPath = 'service-worker';
      }
    } catch (e) {}
    if (deliveryPath === 'unavailable' && permissionOK()) deliveryPath = 'legacy-notification';
    const loc = getLocation();
    return {
      supported: 'Notification' in window,
      permission: ('Notification' in window) ? Notification.permission : 'unsupported',
      enabled: s.enabled,
      settings: s,
      deliveryPath: deliveryPath,
      timers: timers.length,
      location: loc,
      locationSource: loc.source,
      engineReady: typeof window.calcPrayerTimes === 'function' && !!window.adhan,
    };
  }

  /* ── إعادة الجدولة التفاعلية ───────────────────────────────────────────── */
  function init() {
    if (window.ZadPrayerNotif && window.ZadPrayerNotif._inited) return;

    /* Fajr هو المقصود غالبًا — لا نمرّ عبر حاجز «وقت الراحة» في design-system.js
       لأنه يمنع الجدولة أصلًا بين 00:00 و05:00 (أي أن من يفعّل الإشعارات ليلًا
       لا يحصل على تنبيه الفجر أبدًا). */
    const kick = () => {
      if (readSettings().enabled && permissionOK()) schedule();
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kick);
    else kick();

    document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });
    window.addEventListener('online', kick);
    window.addEventListener('focus', kick);
    armMidnightRollover();

    window.ZadPrayerNotif._inited = true;
  }

  window.ZadPrayerNotif = {
    PRAYERS: PRAYERS,
    DEFAULTS: DEFAULTS,
    get settings() { return readSettings(); },
    setSettings: writeSettings,
    enable: enable,
    disable: disable,
    toggle: toggle,
    schedule: schedule,
    deliver: deliver,
    status: status,
    batteryHelp: batteryHelp,
    upcomingPrayers: upcomingPrayers,
    getLocation: getLocation,
    init: init,
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
