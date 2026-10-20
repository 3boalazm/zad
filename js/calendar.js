/* ═══════════════════════════════════════════════════════════════════════════
   زاد — إصلاح التقويم والمواقيت
   الفيز الثالث: islamic-umalqura + adhan-js + إزاحة يدوية
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── 1. التقويم الهجري الصحيح ────────────────────────────────────────────── */

const HIJRI_SETTING_KEY = 'zad_hijri_offset';

/* الإزاحة اليدوية: يختارها المستخدم من الإعدادات (+1/-1/0) */
function getHijriOffset() {
  const n = parseInt(localStorage.getItem(HIJRI_SETTING_KEY) || '0', 10);
  return (isNaN(n) || n < -3 || n > 3) ? 0 : n;   /* P3-4: حدّ آمن ±3 أيام */
}
function setHijriOffset(n) {
  const v = Math.max(-3, Math.min(3, parseInt(n, 10) || 0));   /* P3-4 */
  localStorage.setItem(HIJRI_SETTING_KEY, String(v));
  refreshHijriDisplay();
  return v;
}
window.setHijriOffset = setHijriOffset;
window.getHijriOffset = getHijriOffset;

/* يحوّل الأرقام العربية المشرقية/الفارسية إلى لاتينية حتى لا يفشل parseInt */
function _toLatinDigits(v) {
  return String(v)
    .replace(/[\u0660-\u0669]/g, d => '\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669'.indexOf(d))
    .replace(/[\u06F0-\u06F9]/g, d => '\u06F0\u06F1\u06F2\u06F3\u06F4\u06F5\u06F6\u06F7\u06F8\u06F9'.indexOf(d));
}
window._toLatinDigits = _toLatinDigits;

/* ── الطريقة الأساسية: islamic-umalqura (التقويم السعودي الرسمي) ─────────── */
function getHijriDateAccurate(date = new Date()) {
  const offset = getHijriOffset();
  const adjusted = new Date(date);
  adjusted.setDate(adjusted.getDate() + offset);

  try {
    /* P0-5: 'ar-SA' تُخرج أرقاماً عربية مشرقية (١٤٤٨) و parseInt() عليها = NaN،
       فكان التاريخ الهجري يظهر «NaN undefined NaN هـ» في لوحة التحكم والإعدادات
       ويُخزَّن كذلك في zad_hijri_today. الحل: nu-latn + مُطبِّع أرقام احتياطي. */
    const fmt = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-latn', {
      day: 'numeric', month: 'numeric', year: 'numeric'
    });
    const parts = fmt.formatToParts(adjusted);
    const get = type => {
      const n = parseInt(_toLatinDigits(parts.find(p => p.type === type)?.value || '0'), 10);
      return isNaN(n) ? 0 : n;
    };
    const h = { year: get('year'), month: get('month'), day: get('day'), source: 'umalqura' };
    /* إن فشل التحليل لسبب ما نسقط إلى المرجع الثابت بدل عرض NaN */
    if (!h.year || !h.month || !h.day) return getHijriDateFallback(adjusted);
    return h;
  } catch {
    /* Fallback: المرجع الثابت المبرمج في app.js الأصلي */
    return getHijriDateFallback(adjusted);
  }
}

/* Fallback: نفس خوارزمية app.js الأصلية (تعمل بدون Intl) */
function getHijriDateFallback(date) {
  const HIJRI_REF = {
    greg: new Date(2026, 4, 18, 0, 0, 0),
    year: 1447, month: 12, day: 1
  };
  const MONTH_LEN = [30,29,30,29,30,29,30,29,30,29,30,29];
  const diffDays = Math.round((date - HIJRI_REF.greg) / 86400000);
  let { year, month, day } = HIJRI_REF;
  let d = (day - 1) + diffDays;
  if (d >= 0) {
    while (d >= MONTH_LEN[month - 1]) { d -= MONTH_LEN[month - 1]; month++; if (month > 12) { month = 1; year++; } }
  } else {
    while (d < 0) { month--; if (month < 1) { month = 12; year--; } d += MONTH_LEN[month - 1]; }
  }
  return { year, month, day: d + 1, source: 'fallback' };
}

/* Override الدالة الأصلية في app.js */
window.getHijriDate = getHijriDateAccurate;

/* ── عرض التاريخ الهجري المنسّق ─────────────────────────────────────────── */
const HIJRI_MONTHS = [
  'محرم','صفر','ربيع الأول','ربيع الآخر','جمادى الأولى','جمادى الآخرة',
  'رجب','شعبان','رمضان','شوال','ذو القعدة','ذو الحجة'
];

function formatHijriDate(date = new Date()) {
  const h = getHijriDateAccurate(date);
  return `${h.day} ${HIJRI_MONTHS[h.month - 1]} ${h.year} هـ`;
}
window.formatHijriDate = formatHijriDate;

function refreshHijriDisplay() {
  const str = formatHijriDate();
  document.querySelectorAll('#hijri-full, .hd-hijri, [data-hijri]').forEach(el => {
    el.textContent = str;
  });
}

/* ── 2. تحسين fetchAndCacheHijriDate (override الأصلية) ──────────────────── */
window.fetchAndCacheHijriDate = async function() {
  try {
    const today   = new Date();
    const key     = 'zad_hijri_today';
    const todayStr = today.toISOString().split('T')[0];
    const h = getHijriDateAccurate(today);
    localStorage.setItem(key, JSON.stringify({
      y: h.year, m: h.month, d: h.day,
      greg: todayStr, ts: Date.now(),
      source: h.source, offset: getHijriOffset()
    }));
    document.querySelectorAll('#hijri-full, .hd-hijri').forEach(el => {
      el.textContent = `${h.day} ${HIJRI_MONTHS[h.month-1]} ${h.year} هـ`;
    });
  } catch(e) {}
};

/* ═══════════════════════════════════════════════════════════════════════════
   3. مواقيت الصلاة — adhan-js
   ─────────────────────────────────────────────────────────────────────────
   مكتبة adhan-js متخصصة وموثوقة (مُضمَّنة محليًا في js/vendor/adhan.min.js).
   تحلّ محل حساب الغروب التقريبي في app.js، وتعمل أوفلاين بالكامل.
   أسماء الطرق الفعلية في adhan 4.x هي: Egyptian / MuslimWorldLeague /
   NorthAmerica / UmmAlQura / Karachi / Kuwait / Qatar / Dubai / Turkey /
   Singapore / Tehran / MoonsightingCommittee / Other — راجع ADHAN_KEY.
   ═══════════════════════════════════════════════════════════════════════════ */

/* P1-2: adhan-js صار محليًا.
   كان يُحمَّل من cdn.jsdelivr.net، وهو نطاق مدرج في قائمة BYPASS في sw.js
   (سطر 99) — أي أن Service Worker يرفض تخزينه، فيموت المحرك الثاني أوفلاين
   دائمًا في تطبيق يُعلن أنه Offline-First. النسخة المحلية (15 KB، MIT)
   تُحمَّل أولًا وتُدخَل في PRECACHE، والـCDN احتياطي أخير فقط.
   لاحظ أن المسار تغيّر في 4.4.6: لم يعد dist/adhan.min.js موجودًا. */
(function loadAdhan() {
  if (window.adhan) return;
  const LOCAL = 'js/vendor/adhan.min.js';
  const CDN   = 'https://cdn.jsdelivr.net/npm/adhan@4.4.6/lib/bundles/adhan.umd.min.js';
  const add = (src, onerror) => {
    const el = document.createElement('script');
    el.src = src;
    el.async = false;
    if (onerror) el.onerror = onerror;
    document.head.appendChild(el);
    return el;
  };
  add(LOCAL, () => { add(CDN); });   /* إن غاب الملف المحلي نجرّب CDN بدل الفشل الصامت */
})();

/* طريقة الحساب — يختارها المستخدم من الإعدادات */
const CALC_METHOD_KEY = 'zad_prayer_method';

const CALC_METHODS = {
  'Egypt':        { name: 'الهيئة المصرية للمساحة',  key: 'Egypt'        },
  'UmmAlQura':    { name: 'أم القرى (السعودية)',    key: 'UmmAlQura'    },
  'MWL':          { name: 'رابطة العالم الإسلامي',  key: 'MWL'          },
  'ISNA':         { name: 'أمريكا الشمالية',         key: 'ISNA'         },
  'Karachi':      { name: 'كراتشي',                  key: 'Karachi'      },
  'Kuwait':       { name: 'الكويت',                  key: 'Kuwait'       },
  'Qatar':        { name: 'قطر',                     key: 'Qatar'        },
  'Dubai':        { name: 'دبي',                     key: 'Dubai'        },
  'Turkey':       { name: 'ديانت — تركيا',           key: 'Turkey'       },
  'Singapore':    { name: 'سنغافورة',                key: 'Singapore'    },
  'Tehran':       { name: 'طهران',                   key: 'Tehran'       },
  'Moonsighting': { name: 'لجنة رؤية الهلال',         key: 'Moonsighting' },
};

/* P0-6: مفاتيح التطبيق → أسماء adhan.CalculationMethod الفعلية.
   'Egypt' و'MWL' و'ISNA' غير موجودة في adhan إطلاقًا، فكان السطر
   adhan.CalculationMethod[methodKey] ? ... : UmmAlQura() يسقط **صامتًا**
   إلى أم القرى — أي أن المستخدم المصري الذي اختار «الهيئة المصرية» كان
   يُحسب له بتوقيت مكة (العشاء يختلف 12 دقيقة، والفجر 7 عن MWL). */
const ADHAN_KEY = {
  Egypt: 'Egyptian', UmmAlQura: 'UmmAlQura', MWL: 'MuslimWorldLeague',
  ISNA: 'NorthAmerica', Karachi: 'Karachi', Kuwait: 'Kuwait', Qatar: 'Qatar',
  Dubai: 'Dubai', Turkey: 'Turkey', Singapore: 'Singapore', Tehran: 'Tehran',
  Moonsighting: 'MoonsightingCommittee',
};

/* P1-5: جسر بين مُعرِّف aladhan الرقمي الذي تحفظه prayers.html في
   zad_prayer_method_id واسم adhan الذي يستخدمه هذا الملف في
   zad_prayer_method — حتى يتفق المحرّكان على طريقة واحدة بدل مفتاحين. */
const ALADHAN_TO_ADHAN = {
  1: 'Karachi', 2: 'ISNA', 3: 'MWL', 4: 'UmmAlQura', 5: 'Egypt', 7: 'Tehran',
  9: 'Kuwait', 10: 'Qatar', 11: 'Singapore', 12: 'MWL', 13: 'Turkey',
  15: 'Moonsighting', 16: 'Dubai',
};
/* الخريطة العكسية: أول تطابق يفوز. مهم لأن MWL يظهر مرتين (3 = رابطة العالم
   الإسلامي و12 = فرنسا/UOIF التي تسقط عليها)؛ لو أخذنا آخر تطابق لحفظنا 12
   فعرضت prayers.html «فرنسا» لمن اختار رابطة العالم الإسلامي. */
const ADHAN_TO_ALADHAN = {};
Object.entries(ALADHAN_TO_ADHAN).forEach(([id, k]) => {
  if (!(k in ADHAN_TO_ALADHAN)) ADHAN_TO_ALADHAN[k] = Number(id);
});
const METHOD_ID_KEY = 'zad_prayer_method_id';

function getPrayerMethod() {
  /* الأولوية للمُعرِّف الرقمي المشترك مع prayers.html إن وُجد */
  const id = parseInt(localStorage.getItem(METHOD_ID_KEY) || '', 10);
  if (!isNaN(id) && ALADHAN_TO_ADHAN[id]) return ALADHAN_TO_ADHAN[id];
  const stored = localStorage.getItem(CALC_METHOD_KEY);
  return (stored && ADHAN_KEY[stored]) ? stored : 'Egypt';   /* P1-1: مطابق لافتراضي prayers.html */
}
function setPrayerMethod(method) {
  localStorage.setItem(CALC_METHOD_KEY, method);
  const id = ADHAN_TO_ALADHAN[method];
  if (id !== undefined) localStorage.setItem(METHOD_ID_KEY, String(id));   /* يُبقي prayers.html متفقًا */
  return method;
}

/* المذهب — يؤثر في حساب العصر فقط (حنفي: الظل مثليّ بدل جمهوري) */
const MADHAB_KEY = 'zad_prayer_madhab';
function getMadhab() { return localStorage.getItem(MADHAB_KEY) === 'hanafi' ? 'hanafi' : 'shafi'; }
function setMadhab(m) {
  const v = (m === 'hanafi') ? 'hanafi' : 'shafi';
  localStorage.setItem(MADHAB_KEY, v);
  return v;
}
window.setPrayerMethod = setPrayerMethod;
window.getPrayerMethod = getPrayerMethod;
window.CALC_METHODS    = CALC_METHODS;
window.ADHAN_KEY       = ADHAN_KEY;
window.getMadhab       = getMadhab;
window.setMadhab       = setMadhab;

/* ── حساب المواقيت ───────────────────────────────────────────────────────── */
async function calcPrayerTimes(lat, lng, date = new Date(), opts = {}) {
  await waitForAdhan();

  const methodKey = opts.method || getPrayerMethod();
  const adhanName = ADHAN_KEY[methodKey] || ADHAN_KEY.Egypt;
  const factory   = adhan.CalculationMethod[adhanName] || adhan.CalculationMethod.Egyptian;
  const params    = factory();

  /* المذهب: حنفي = ظلّ مثليّ للعصر */
  if (adhan.Madhab && (opts.madhab || getMadhab()) === 'hanafi') params.madhab = adhan.Madhab.Hanafi;

  const coords = new adhan.Coordinates(lat, lng);
  /* P0-6: adhan 4.x ألغى DateComponents تمامًا (كان في 3.x). السطر السابق
     new adhan.DateComponents(y, m, d) كان يرمي
     TypeError: adhan.DateComponents is not a constructor في **كل** استدعاء،
     فيبتلعه catch ويُظهر رسالة خطأ — أي أن calcPrayerTimes و
     fetchPrayerTimesIfPossible لم يعملا ولا مرة منذ الترقية إلى 4.x.
     الصحيح في 4.x: تمرير كائن Date عادي. */
  const times = new adhan.PrayerTimes(coords, date, params);

  /* منطقة الموقع الزمنية لا منطقة الجهاز: adhan يُرجع لحظات زمنية مطلقة،
     وبدون timeZone كانت مواقيت مدينة بعيدة (مكة مثلًا) تُعرض بتوقيت جهاز
     المستخدم في القاهرة — فارق ساعة كاملة. */
  const tz = opts.timezone || undefined;
  function fmt(t) {
    if (!t) return '--:--';
    return t.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: tz });   /* P3-3: h23 بدل hour12:false (تجنّب ٢٤:٠٠) */
  }

  const out = {
    fajr:    { time: times.fajr,    label: 'الفجر',   fmt: fmt(times.fajr)    },
    sunrise: { time: times.sunrise, label: 'الشروق',  fmt: fmt(times.sunrise) },
    dhuhr:   { time: times.dhuhr,   label: 'الظهر',   fmt: fmt(times.dhuhr)   },
    asr:     { time: times.asr,     label: 'العصر',   fmt: fmt(times.asr)     },
    maghrib: { time: times.maghrib, label: 'المغرب',  fmt: fmt(times.maghrib) },
    isha:    { time: times.isha,    label: 'العشاء',  fmt: fmt(times.isha)    },
    method:  methodKey,
  };

  /* P2-9: منتصف الليل وثلثه الأخير محسوبان على الجهاز بلا أي شبكة */
  try {
    if (adhan.SunnahTimes) {
      const st = new adhan.SunnahTimes(times);
      out.midnight  = { time: st.middleOfTheNight,    label: 'منتصف الليل',   fmt: fmt(st.middleOfTheNight) };
      out.lastthird = { time: st.lastThirdOfTheNight, label: 'الثلث الأخير', fmt: fmt(st.lastThirdOfTheNight) };
    }
  } catch (e) { /* إضافة اختيارية — لا تُفشل النتيجة الأساسية */ }

  return out;
}

function waitForAdhan(maxWait = 5000) {
  return new Promise((resolve, reject) => {
    if (window.adhan) { resolve(); return; }
    const start = Date.now();
    const check = setInterval(() => {
      if (window.adhan) { clearInterval(check); resolve(); }
      else if (Date.now() - start > maxWait) { clearInterval(check); reject(new Error('adhan.js timeout')); }
    }, 50);
  });
}

/* ── override الدالة القديمة في app.js ───────────────────────────────────── */
window.fetchPrayerTimesIfPossible = async function() {
  try {
    const pos = await window._getGeoLocation({ timeout: 8000 });
    const { latitude: lat, longitude: lng } = pos.coords;
    const times = await calcPrayerTimes(lat, lng);
    /* إرجاع وقت المغرب كـ Date (متوافق مع الكود القديم) */
    return times.maghrib.time;
  } catch (e) {
    return null;
  }
};

window.calcPrayerTimes = calcPrayerTimes;

/* ── عرض المواقيت في صفحة الصلاة ────────────────────────────────────────── */
async function renderPrayerTimesPage() {
  const container = document.getElementById('prayer-times-container');
  if (!container) return;

  try {
    const pos = await window._getGeoLocation({ timeout: 8000 });
    const { latitude: lat, longitude: lng } = pos.coords;
    const times = await calcPrayerTimes(lat, lng);
    const method = CALC_METHODS[times.method]?.name || times.method;

    container.innerHTML = `
      <div class="prayer-method-badge">
        📍 طريقة الحساب: ${method}
        <button onclick="showMethodPicker()" class="btn btn-ghost" style="font-size:12px;padding:4px 10px">تغيير</button>
      </div>
      ${Object.entries(times).filter(([, p]) => p && p.time instanceof Date).map(([key, p]) => `
        <div class="prayer-row ${key}">
          <span class="prayer-name">${p.label}</span>
          <span class="prayer-time" data-time24="${p.fmt}">${p.fmt}</span>
        </div>
      `).join('')}
    `;

    /* تطبيق تنسيق الساعة */
    if (typeof applyClockFormat === 'function') applyClockFormat();

  } catch (e) {
    /* P1-2: كان أي فشل (حتى تعذّر تحميل adhan-js من CDN) يُعرض كخطأ GPS مضلِّل */
    const msg = (!window.adhan || (e && e.message === 'adhan.js timeout'))
      ? 'تعذّر تحميل محرك حساب المواقيت — تحقّق من اتصال الإنترنت ثم أعد المحاولة'
      : 'تعذّر الحصول على الموقع — فعّل GPS أو اختر مدينتك يدوياً من صفحة المواقيت';
    container.innerHTML = `<div class="error-state">${msg}</div>`;
  }
}
window.renderPrayerTimesPage = renderPrayerTimesPage;

/* ── قائمة اختيار طريقة الحساب ──────────────────────────────────────────── */
function showMethodPicker() {
  const current = getPrayerMethod();
  const madhab  = getMadhab();
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px';
  modal.innerHTML = `
    <div style="background:var(--card);border-radius:20px;padding:24px;width:100%;max-width:360px">
      <h3 style="margin:0 0 16px;font-size:16px;color:var(--ink)">اختر طريقة حساب المواقيت</h3>
      ${Object.entries(CALC_METHODS).map(([key, m]) => `
        <div onclick="setPrayerMethod('${key}');document.body.removeChild(this.closest('[style*=fixed]'));if(typeof showToast==='function')showToast('✅ تم اختيار: ${m.name}');setTimeout(()=>location.reload(),800)"
          style="padding:14px 16px;border-radius:12px;cursor:pointer;margin-bottom:8px;
                 background:${key===current?'rgba(14,59,46,.1)':'var(--sand)'};
                 border:${key===current?'2px solid var(--green-deep)':'1.5px solid var(--border)'}">
          <div style="font-size:14px;font-weight:${key===current?800:500}">${m.name} ${key===current?'✓':''}</div>
        </div>
      `).join('')}
      <div style="margin-top:16px;padding-top:14px;border-top:1.5px solid var(--border)">
        <h3 style="margin:0 0 10px;font-size:14px;color:var(--ink)">مذهب حساب العصر</h3>
        <div style="display:flex;gap:8px">
          ${[['shafi','الجمهور'],['hanafi','حنفي']].map(([k, label]) => `
            <div data-madhab="${k}" onclick="setMadhab('${k}');this.parentElement.querySelectorAll('[data-madhab]').forEach(e=>{e.style.background='var(--sand)';e.style.borderColor='var(--border)';e.firstElementChild.style.fontWeight='500'});this.style.background='rgba(14,59,46,.1)';this.style.borderColor='var(--green-deep)';this.firstElementChild.style.fontWeight='800';if(typeof showToast==='function')showToast('✅ مذهب: ${label}')"
              style="flex:1;padding:10px 12px;border-radius:12px;cursor:pointer;text-align:center;
                     background:${k===madhab?'rgba(14,59,46,.1)':'var(--sand)'};
                     border:${k===madhab?'2px solid var(--green-deep)':'1.5px solid var(--border)'}">
              <b style="font-size:13px;font-weight:${k===madhab?800:500}">${label} ${k===madhab?'✓':''}</b>
            </div>`).join('')}
        </div>
        <div style="margin-top:8px;font-size:12px;color:var(--muted);line-height:1.6">
          الحنفي يؤخّر العصر حتى يصير الظل مثليّ القامة (نحو 45 دقيقة بعد الجمهور). لا يؤثر في بقية الصلوات.
        </div>
      </div>
      <button onclick="document.body.removeChild(this.closest('[style*=fixed]'))" 
        style="width:100%;padding:12px;border:none;background:none;color:var(--muted);font-family:inherit;cursor:pointer;margin-top:8px">
        إلغاء
      </button>
    </div>`;
  document.body.appendChild(modal);
}
window.showMethodPicker = showMethodPicker;

/* ═══════════════════════════════════════════════════════════════════════════
   4. إعداد الإزاحة الهجرية في الإعدادات
   ─────────────────────────────────────────────────────────────────────────
   يُضاف تلقائياً لصفحة الإعدادات
   ═══════════════════════════════════════════════════════════════════════════ */
function injectHijriOffsetControl() {
  const container = document.getElementById('hijri-offset-container');
  if (!container) return;

  const current = getHijriOffset();
  container.innerHTML = `
    <div class="setting-row">
      <div class="setting-label">
        <div style="font-weight:700;margin-bottom:4px">ضبط التاريخ الهجري</div>
        <div style="font-size:12px;color:var(--muted)">
          في حال اختلاف التاريخ مع إعلان رؤية الهلال، يمكنك ضبطه يدوياً
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:10px;margin-top:10px">
        <button onclick="setHijriOffset(getHijriOffset()-1)" class="btn btn-ghost" style="padding:8px 14px">-1</button>
        <span id="hijri-offset-display" style="font-size:14px;font-weight:700;min-width:40px;text-align:center">
          ${current > 0 ? '+' : ''}${current}
        </span>
        <button onclick="setHijriOffset(getHijriOffset()+1)" class="btn btn-ghost" style="padding:8px 14px">+1</button>
        <button onclick="setHijriOffset(0)" class="btn btn-ghost" style="padding:8px 14px;font-size:12px">إعادة</button>
      </div>
      <div style="margin-top:8px;font-size:13px;color:var(--muted)">
        التاريخ الحالي: <strong id="hijri-current-display">${formatHijriDate()}</strong>
      </div>
    </div>
  `;
}

/* Override setHijriOffset لتحديث العرض */
const _origSetOffset = window.setHijriOffset;
window.setHijriOffset = function(n) {
  const v = _origSetOffset(n);   /* P3-4: القيمة بعد القصّ، لا المطلوبة */
  const display = document.getElementById('hijri-offset-display');
  if (display) display.textContent = v > 0 ? `+${v}` : String(v);
  const current = document.getElementById('hijri-current-display');
  if (current) current.textContent = formatHijriDate();
};

/* تشغيل التهيئة */
document.addEventListener('DOMContentLoaded', () => {
  refreshHijriDisplay();
  injectHijriOffsetControl();
});

