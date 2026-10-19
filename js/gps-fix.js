/* ═══════════════════════════════════════════════════════════════════════════
   زاد — gps-fix.js
   ─────────────────────────────────────────────────────────────────────────
   معالجة أخطاء GPS وحفظ آخر موقع ناجح لاستخدامه كـ Fallback
   ═══════════════════════════════════════════════════════════════════════════ */

const GPS_KEY = 'zad_last_location';

/* احفظ موقع ناجح */
function saveGPSLocation(lat, lng, cityName) {
  try {
    const city = cityName || '';
    /* zad_last_location — يستخدمها gps-fix.js */
    localStorage.setItem(GPS_KEY, JSON.stringify({ lat, lng, city, ts: Date.now() }));
    /* zad_lat / zad_lng / zad_city — يستخدمها prayers.html مباشرةً */
    localStorage.setItem('zad_lat',  String(lat));
    localStorage.setItem('zad_lng',  String(lng));
    if (city) localStorage.setItem('zad_city', city);
    console.log(`[GPS] ✅ حُفظ الموقع: ${lat.toFixed(3)}, ${lng.toFixed(3)} — ${city}`);
  } catch {}
}

/* جلب آخر موقع محفوظ */
function getLastSavedGPS() {
  try {
    const raw = localStorage.getItem(GPS_KEY);
    if (!raw) return null;
    const loc = JSON.parse(raw);
    /* صالح لمدة 30 يوم */
    if (Date.now() - loc.ts > 30 * 24 * 60 * 60 * 1000) return null;
    return loc;
  } catch { return null; }
}

/* طلب GPS مع fallback آمن ورسائل واضحة */
function requestGPSWithFeedback(onSuccess, onError) {
  if (!navigator.geolocation) {
    handleGPSError({ code: 0, message: 'غير مدعوم' }, onError);
    return;
  }

  /* إظهار مؤشر تحميل لو متاح */
  showGPSLoading(true);

  navigator.geolocation.getCurrentPosition(
    pos => {
      showGPSLoading(false);
      const { latitude: lat, longitude: lng } = pos.coords;
      /* محاولة جلب اسم المدينة بالعربي */
      reverseGeocode(lat, lng, cityName => {
        saveGPSLocation(lat, lng, cityName);
        if (typeof onSuccess === 'function') onSuccess(lat, lng, cityName);
        showGPSToast(`✅ تم تحديد موقعك: ${cityName || `${lat.toFixed(2)}, ${lng.toFixed(2)}`}`);
      });
    },
    err => {
      showGPSLoading(false);
      handleGPSError(err, onError);
    },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
  );
}

/* معالجة الأخطاء */
function handleGPSError(err, onError) {
  const last = getLastSavedGPS();
  let msg = '';

  switch (err.code) {
    case 1: /* PERMISSION_DENIED */
      msg = 'تم رفض إذن الموقع. فعّله من إعدادات المتصفح.';
      break;
    case 2: /* POSITION_UNAVAILABLE */
      msg = 'تعذّر تحديد الموقع حالياً.';
      break;
    case 3: /* TIMEOUT */
      msg = 'استغرق تحديد الموقع وقتاً طويلاً.';
      break;
    default:
      msg = 'المتصفح لا يدعم تحديد الموقع.';
  }

  if (last) {
    msg += ` جاري استخدام آخر موقع: ${last.city || 'محفوظ'}.`;
    if (typeof onError === 'function') onError(last.lat, last.lng, last.city, true);
  } else {
    /* الافتراضي: مكة المكرمة */
    msg += ' جاري استخدام توقيت مكة المكرمة.';
    if (typeof onError === 'function') onError(21.4225, 39.8262, 'مكة المكرمة', false);
  }

  showGPSToast(`⚠️ ${msg}`);
}

/* Reverse geocoding بسيط وسريع */
function reverseGeocode(lat, lng, callback) {
  /* مدن رئيسية سريعة بدون API */
  const KNOWN_CITIES = [
    { name: 'مكة المكرمة', lat: 21.42, lng: 39.83 },
    { name: 'المدينة المنورة', lat: 24.47, lng: 39.61 },
    { name: 'الرياض', lat: 24.71, lng: 46.68 },
    { name: 'جدة', lat: 21.54, lng: 39.17 },
    { name: 'القاهرة', lat: 30.04, lng: 31.24 },
    { name: 'الإسكندرية', lat: 31.20, lng: 29.92 },
    { name: 'دبي', lat: 25.20, lng: 55.27 },
    { name: 'أبو ظبي', lat: 24.45, lng: 54.38 },
    { name: 'عَمّان', lat: 31.95, lng: 35.93 },
    { name: 'القدس', lat: 31.77, lng: 35.23 },
    { name: 'الدوحة', lat: 25.29, lng: 51.53 },
    { name: 'الكويت', lat: 29.38, lng: 47.99 },
    { name: 'المنامة', lat: 26.23, lng: 50.59 },
    { name: 'مسقط', lat: 23.59, lng: 58.41 },
  ];

  for (const c of KNOWN_CITIES) {
    const d = Math.hypot(lat - c.lat, lng - c.lng);
    if (d < 0.3) { callback(c.name); return; }
  }
  callback('');
}

function showGPSLoading(show) {
  const btn = document.getElementById('gps-btn') || document.getElementById('gps-request-btn');
  if (btn) btn.classList.toggle('loading', show);
}

function showGPSToast(msg) {
  if (typeof showToast === 'function') {
    showToast(msg);
  } else {
    console.log('[GPS]', msg);
  }
}

/* أضف حدث onclick لزر GPS لو موجود في الصفحة */
document.addEventListener('DOMContentLoaded', () => {
  /* مزامنة تلقائية: لو zad_last_location موجود بس zad_lat غايب → اكتب المفاتيح الـ flat */
  try {
    const old = JSON.parse(localStorage.getItem(GPS_KEY) || 'null');
    const flatLat = localStorage.getItem('zad_lat');
    if (old && old.lat && !flatLat) {
      localStorage.setItem('zad_lat',  String(old.lat));
      localStorage.setItem('zad_lng',  String(old.lng));
      if (old.city) localStorage.setItem('zad_city', old.city);
      console.log('[GPS] ↩ تمت مزامنة الموقع القديم لـ prayers.html');
    }
  } catch {}

  /* أي زر بيحمل id أو class GPS */
  const gpsBtns = document.querySelectorAll('#gps-btn, #gps-request-btn, [data-action="gps"], .gps-detect-btn');
  gpsBtns.forEach(btn => btn.addEventListener('click', () => requestGPSWithFeedback()));

  /* لو في صفحة المواقيت: حمّل من آخر موقع فوراً */
  if (document.getElementById('prayers-container') || document.getElementById('prayer-times-container')) {
    const last = getLastSavedGPS();
    if (last) {
      console.log(`[GPS] استخدام آخر موقع: ${last.city || last.lat.toFixed(2)}`);
      /* تحديث مؤشر الموقع في الصفحة */
      const locLabel = document.getElementById('location-label') || document.getElementById('city-name');
      if (locLabel && last.city) locLabel.textContent = last.city;
    }
  }
});

window.requestGPSWithFeedback = requestGPSWithFeedback;
window.getLastSavedGPS        = getLastSavedGPS;
window.saveGPSLocation        = saveGPSLocation;
