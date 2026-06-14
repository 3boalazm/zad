# ZAD — Risks & Architectural Decisions
**النوع:** سجل القرارات المعمارية والمخاطر  
**التاريخ:** يونيو 2026

---

## القسم الأول: نموذج الأمان (Security Model)

### 1.1 JWT vs Sessions

**القرار:** JWT مع Refresh Token

| المعيار | JWT | Sessions |
|---------|-----|---------|
| **Stateless** | ✅ لا حاجة لـ session store | ❌ يحتاج Redis/DB |
| **Offline PWA** | ✅ يعمل مع Service Worker | ❌ يحتاج اتصال للتحقق |
| **Mobile** | ✅ سهل التخزين في IndexedDB | ❌ Cookie أصعب في PWA |
| **Revocation** | ❌ أصعب (يحتاج blacklist) | ✅ حذف من DB يكفي |
| **Complexity** | 🟡 متوسط | 🟢 أبسط |

**التطبيق:**
- Access Token: JWT يصلح 1 ساعة (في memory لا localStorage)
- Refresh Token: Opaque token مخزّن في `HttpOnly Cookie` — 30 يوم
- انتهاء الجلسة: عند إغلاق المتصفح أو مرور 30 يوماً

**ملاحظة أمان:** Access Token لا يُحفظ في localStorage أبداً — في memory فقط (Redux/Zustand أو module variable).

---

### 1.2 حماية API Keys والـ Secrets

| السر | الوضع الحالي | المطلوب |
|------|-------------|---------|
| `GROQ_API_KEY` | ✅ في Vercel env — آمن | لا تغيير |
| `VAPID_KEY` | 🔴 placeholder في frontend | نقل لـ `.env` على الخادم — يُرسَل للـ frontend عبر `GET /api/v1/notifications/vapid-key` (public key فقط) |
| Firebase Config | 🟡 في `firebase-init.js` (public — مقصود) | الحماية عبر Firebase Rules لا إخفاء الكونفيج |
| Database Connection String | — | `.env` فقط — لا يصل للـ frontend أبداً |
| JWT Secret | — | `.env` فقط — rotate كل 90 يوم |
| Aladhan API | ✅ لا key — مفتوح | — |

---

### 1.3 منع API Keys في الـ Frontend

**القاعدة الصارمة:**
```
❌ ممنوع في أي ملف frontend:
  - GROQ_API_KEY
  - Private VAPID Key
  - Database credentials
  - JWT secret
  - Admin tokens

✅ مقبول في الـ frontend:
  - Firebase Config (public identifier)
  - Public VAPID Key (public by design)
  - Aladhan API (لا key)
  - Google Client ID (public)
```

**آلية التطبيق:**
- `.gitignore` يشمل `.env*`
- CI/CD يفحص عدم وجود secrets في الكود
- Vercel Environment Variables لكل secret

---

### 1.4 CORS

```
محلياً (Development):
  Origin: http://localhost:3000, http://localhost:5500

إنتاج:
  Origin: https://zadullashr.vercel.app, https://zadullashr.com
  Methods: GET, POST, PUT, DELETE, OPTIONS
  Headers: Content-Type, Authorization
  Credentials: true (للـ Refresh Token cookie)

مرفوض:
  * (wildcard) ممنوع في الإنتاج
```

---

### 1.5 CSRF Protection

| الوضع | الحماية |
|-------|---------|
| JWT في memory (لا cookie) | ✅ محمي بطبيعته (CSRF يستهدف cookies) |
| Refresh Token في HttpOnly Cookie | 🟡 يحتاج CSRF Token للـ refresh endpoint فقط |
| SameSite=Strict على Cookie | ✅ يمنع CSRF على الـ cookie |

**التطبيق:** `Set-Cookie: refresh_token=...; HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth/refresh`

---

### 1.6 Rate Limiting

| المستوى | الأداة | التطبيق |
|---------|--------|---------|
| **AI Endpoint** | Redis (per-IP counter) | 15 req/دقيقة — موجود في `gemini.js` لكن per-instance فقط |
| **Auth Endpoints** | Redis (per-IP) | 10 محاولات/15 دقيقة — يمنع brute force |
| **Progress APIs** | Redis (per-user) | 100 req/دقيقة — تكبيرة كل 0.6 ثانية معقول |
| **Global** | Nginx/Caddy | 1000 req/minute per IP |

---

### 1.7 Children / Kids Safety

**الوضع الحالي:**
- `parent-gate.js` يعمل client-side — قابل للتجاوز بـ DevTools
- التحقق من الإجابة الرياضية في المتصفح فقط

**المخاطر:**
```
🔴 طفل متمكن من التقنية يمكنه:
  1. فتح DevTools وتعيين zad_pg_grace يدوياً
  2. استدعاء setGrace() من console
  3. الوصول لـ ai.html مباشرة عبر URL
```

**الخطة (Phase 2 من السلامة):**
- إضافة `POST /api/v1/kids/verify-parent` على الخادم
- Parent Gate تُرسِل challenge/response للخادم للتحقق
- AI Chat (`ai.html`) يتحقق من وجود `parent_verified` header
- صفحات الأطفال تُضيف `X-Kids-Context: true` header
- الخادم يرفض الطلبات غير المصرح بها

---

### 1.8 Firebase Decommission Plan

```
المرحلة ١ (الآن): Firebase يعمل بشكل كامل
         │
         ▼
المرحلة ٢ (بعد Phase 2): Firebase Auth = fallback فقط
         │
         ▼
المرحلة ٣ (بعد Phase 4): Firebase RTDB يُقرأ منه فقط (no new writes)
         │
         ▼
المرحلة ٤ (بعد Phase 7): Firebase يُوقَف بالكامل

قبل الإيقاف النهائي:
✅ تصدير كل بيانات RTDB → JSON backup
✅ التأكد من نقل كل users/{uid} → PostgreSQL
✅ التأكد من نقل كل groups/* → PostgreSQL
✅ مراجعة Firebase Analytics data
✅ إلغاء اشتراك Firebase (لتوفير التكلفة)
```

---

## القسم الثاني: المخاطر الفنية

### 2.1 مخاطر عالية الأولوية

| الرقم | المخاطرة | الاحتمالية | الأثر | المعالجة |
|-------|---------|-----------|-------|----------|
| R01 | **Group Board Leaderboard خلل حالي** | عالٍ (موجود الآن) | متوسط | Phase 4 — يُصلح في أول فرصة |
| R02 | **FCM/Push Notifications معطوبة** | عالٍ (VAPID_KEY فارغ) | متوسط | Phase 6 |
| R03 | **Migration from localStorage غير مكتملة** | متوسط | عالٍ (فقدان بيانات) | التأكد من تشغيل `migrateFromLocalStorage()` في كل صفحة |
| R04 | **AI Guard Log في localStorage** | متوسط | أمان | Phase 5 — نقل للخادم |
| R05 | **Parent Gate قابلة للتجاوز** | متوسط | أمان الأطفال | Phase 2 (kids safety) |
| R06 | **Dexie Cloud URL فارغ** | موجود | منخفض | يُعرض للمستخدم كـ "المزامنة غير مضبوطة" |

---

### 2.2 مخاطر البنية التحتية

| المخاطرة | الاحتمالية | الأثر | المعالجة |
|---------|-----------|-------|----------|
| Firebase Firebase يُغيّر أسعاره أو يُوقَف | منخفض | عالٍ | خطة Firebase Decommission (Phase 7) |
| Groq API quota محدود | متوسط | متوسط | Rate limiting موجود + fallback message |
| Vercel free tier limits | متوسط | متوسط | الانتقال لـ server مخصص في الـ `/api` |
| Tafsir MCP غير متاح | متوسط | منخفض | Fallback صامت موجود في `gemini.js` |
| PostgreSQL Server downtime | منخفض | عالٍ | PWA يعمل بـ localStorage بدون DB |

---

### 2.3 مخاطر البيانات

| المخاطرة | الاحتمالية | الأثر | المعالجة |
|---------|-----------|-------|----------|
| فقدان بيانات أثناء Migration | متوسط | **حرج** | Backup قبل كل migration + Rollback plan |
| Dual-owner state race condition | متوسط (تم معالجته جزئياً في P0) | عالٍ | P0 اكتمل — مراقبة مستمرة |
| تعارض بيانات localStorage vs DB | عالٍ (محتمل في بداية التحويل) | متوسط | Max-wins strategy + timestamp comparison |
| حذف المستخدم لبيانات IndexedDB | متوسط | عالٍ | `requestPersistentStorage()` موجود |

---

## القسم الثالث: القرارات المعمارية (ADR)

### ADR-001: PostgreSQL بدلاً من Firestore

**الحالة:** مقترح للموافقة

**السياق:** الانتقال من Firebase يحتاج لاختيار قاعدة بيانات بديلة.

**القرار:** PostgreSQL على الخادم الخاص

**الأسباب:**
- Server مملوك وموجود (`/opt/codeandcanvas`)
- تكلفة صفر مقارنة بـ Firestore (الذي يُكلَّف per-read)
- SQL أقوى لـ reporting وleaderboard queries
- لا vendor lock-in
- Supabase (managed PostgreSQL) كبديل سهل لو احتجنا

**البدائل المرفوضة:**
- Firestore: تكلفة عالية + Firebase dependency
- MongoDB: لا مبرر لـ document store هنا
- PlanetScale: hosted لكن يحتاج subscription

---

### ADR-002: Local-First Architecture

**الحالة:** مُقرَّر (لا يتغير)

**القرار:** localStorage/IndexedDB يبقى Primary — الخادم ثانوي

**الأسباب:**
- المستخدمون في بيئات متقطعة الإنترنت (حج، أماكن مزدحمة)
- العشر أيام الحرجة لا يمكن فيها تحمّل downtime
- PWA offline-first هو الميزة التنافسية الأساسية

---

### ADR-003: Strangler Fig بدلاً من Big Bang Rewrite

**الحالة:** مُقرَّر

**القرار:** كل feature تُهاجَر على حدة — لا rewrite من الصفر

**الأسباب:**
- `zad-main` يحتوي 70+ ملف HTML + عشرات الـ JS modules
- Big Bang rewrite = شهور بدون features جديدة
- Strangler Fig = التطبيق يعمل ويتطور في نفس الوقت

---

### ADR-004: Adapter Pattern لـ Firebase

**الحالة:** مُقرَّر

**القرار:** كل ملف `firebase-*.js` يُحاط بـ Adapter يمكن تبديله

```javascript
// المبدأ:
const GroupsAPI = window.ZadAuth?.uid()
  ? GroupsFirebaseAdapter   // موجود
  : GroupsLocalAdapter;     // fallback

// المستقبل:
const GroupsAPI = window.ZadAuth?.uid()
  ? GroupsServerAdapter     // الجديد
  : GroupsLocalAdapter;     // fallback
```

---

### ADR-005: JWT في Memory لا في localStorage

**الحالة:** مُقرَّر

**القرار:** Access JWT في module variable — لا `localStorage['token']`

**الأسباب:**
- XSS يمكنه سرقة أي localStorage
- JWT في memory لا يصل لـ script خارجية
- Refresh Token في `HttpOnly Cookie` (لا يُقرأ بـ JS)

---

### ADR-006: Dexie Cloud يُلغى لصالح Server API

**الحالة:** مُقرَّر

**القرار:** إلغاء `SYNC_CONFIG.databaseUrl` وعدم إعداد Dexie Cloud

**الأسباب:**
- Dexie Cloud يضيف paid dependency جديد
- لدينا Backend مخصص (`/api`) — يوفر نفس الوظيفة
- أقل تعقيداً معمارياً
- بيانات تبقى على الخادم الخاص

---

## القسم الرابع: قائمة مراجعة ما قبل النشر

### قبل Phase 1:
- [ ] Git tag `v1.0-pre-server-migration` منشأ
- [ ] Playwright baseline محفوظ
- [ ] P0-P3 الحالية مكتملة ومختبرة
- [ ] Firebase RTDB rules مراجعة وآمنة
- [ ] لا API keys في الكود المصدري

### قبل كل Phase:
- [ ] Database backup
- [ ] Feature flag للـ phase الجديدة = false (تُفعَّل بعد الاختبار)
- [ ] Rollback plan موثَّق ومُختبَر
- [ ] لا Breaking Changes في الـ PWA offline mode

### قبل Firebase Decommission (Phase 7):
- [ ] 100% من بيانات RTDB منقولة وموثَّقة
- [ ] لا Firebase-dependent code في الـ frontend
- [ ] اختبار كامل بدون إنترنت
- [ ] اختبار كامل بدون Firebase في Network DevTools

---

*هذا السجل يُحدَّث عند كل قرار معماري جديد*
