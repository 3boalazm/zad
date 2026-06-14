# ZAD — Server Conversion Plan
**النهج:** Strangler Fig — تحويل تدريجي بدون كسر الـ PWA الحالي  
**مبدأ لا يُكسَر:** في كل لحظة، التطبيق يعمل بالكامل بدون Backend

---

## خريطة المراحل

```
Phase 0: Freeze & Baseline          [الآن]
Phase 1: Backend Skeleton + DB      [أسبوع 1-2]
Phase 2: Auth Migration             [أسبوع 3-4]
Phase 3: User Profile & Progress    [أسبوع 5-7]
Phase 4: Groups & Family            [أسبوع 8-10]
Phase 5: AI Proxy & Secrets         [أسبوع 11]
Phase 6: Push Notifications         [أسبوع 12]
Phase 7: Firebase Decommission      [أسبوع 13-14]
```

---

## Phase 0: Freeze / Audit / Baseline
**الهدف:** تجميد الكود الحالي وإنشاء baseline موثّق قبل أي تغيير

### الأهداف التفصيلية:
- إنشاء Git tag `v1.0-pre-server-migration`
- توثيق كل localStorage key وقيمتها الحالية (تم في `ZAD_CURRENT_DATA_AUDIT.md`)
- تشغيل suite اختبارات Playwright/Chromium وتسجيل النتائج كـ baseline
- التأكد من اكتمال P0-P3 الحالية (State Consolidation, Parent Gate, AI Cleanup, Sync Fix)
- مراجعة `firebase/database.rules.json` والتأكد من أمان القواعد الحالية

### الملفات المتأثرة:
- لا تعديل على أي ملف

### ما لا يُعدَّل:
- كل شيء

### الاختبارات المطلوبة:
- تشغيل Playwright suite كاملة وحفظ النتيجة كـ `baseline-report.json`
- التحقق اليدوي من: ورد اليوم، التكبير، المجموعات، AI Chat

### Rollback Plan:
- N/A — لا تغيير

---

## Phase 1: Backend Skeleton + DB Schema
**الهدف:** بناء هيكل الـ Backend في `/api` بدون ربطه بالـ frontend بعد

### الأهداف التفصيلية:
- إنشاء `package.json` في `/opt/codeandcanvas/apps/zad/api`
- اختيار Framework: **Express.js + TypeScript** (أو Fastify) 
- إعداد PostgreSQL schema (من `ZAD_TARGET_DATABASE_DESIGN.md`)
- إعداد migration tooling (مثل `node-postgres` أو Drizzle ORM)
- إنشاء `Dockerfile` للـ API
- إعداد `.env.example` بكل المتغيرات المطلوبة
- إعداد Health Check endpoint `GET /api/health`
- إعداد Logging بسيط (Winston أو Pino)

### الملفات المتأثرة:
```
/opt/codeandcanvas/apps/zad/api/    ← ينشأ من الصفر
  ├── src/
  │   ├── db/
  │   │   ├── schema.sql           ← schema الكامل
  │   │   └── migrations/          ← ملفات migration مرقّمة
  │   ├── routes/
  │   │   └── health.ts            ← GET /api/health
  │   └── index.ts                 ← entry point
  ├── package.json
  ├── tsconfig.json
  ├── Dockerfile
  └── .env.example
```

### ما لا يُعدَّل:
- `/opt/codeandcanvas/apps/zad/source` — كل الكود الحالي يبقى كما هو
- `vercel.json`
- Firebase Config
- أي ملف HTML أو JS

### الاختبارات المطلوبة:
- `GET /api/health` يرجع `{status: 'ok', db: 'connected'}`
- تشغيل migration scripts بنجاح على قاعدة بيانات تطوير
- Docker container يبنى ويشتغل بدون errors

### Rollback Plan:
- حذف `/api` folder — لا تأثير على الـ PWA الحالي

---

## Phase 2: Auth Migration
**الهدف:** إضافة نظام Auth على الخادم بالتوازي مع Firebase Auth

### الأهداف التفصيلية:
- تطبيق `POST /api/auth/anonymous` — ينشئ `users` row ويرجع JWT
- تطبيق `POST /api/auth/google` — OAuth callback يربط Google UID بـ `users`
- تطبيق `POST /api/auth/email/register` و `POST /api/auth/email/login`
- JWT middleware للـ API routes
- تطبيق Adapter Pattern في `firebase-auth.js`:
  - `ZadAuth.signInWithGoogle()` يستدعي الخادم الجديد
  - Fallback لـ Firebase Auth لو Backend غير متاح
- تحديث `groups.firebase.js`: استخدام `user_id` من الخادم بدل Firebase UID

### الملفات المتأثرة في `/source`:
```
js/firebase-auth.js    ← إضافة adapter layer — لا حذف Firebase بعد
```

### الملفات الجديدة في `/api`:
```
src/routes/auth.ts
src/middleware/jwt.ts
src/services/auth-service.ts
```

### ما لا يُعدَّل:
- `firebase-init.js` — يبقى كـ fallback
- أي صفحة HTML
- State management (app.js, state-manager.js)

### الاختبارات المطلوبة:
- تسجيل دخول بـ Google يعمل ويرجع JWT
- JWT يُستخدَم في الـ API calls التالية
- Firebase Auth لا تزال تعمل كـ fallback عند فشل الخادم
- Anonymous user يُنشأ بدون تسجيل

### Rollback Plan:
- `git revert` لتغيير `firebase-auth.js` فقط
- الخادم يمكن تعطيله بدون تأثير على PWA

---

## Phase 3: User Profile & Worship Progress
**الهدف:** نقل بيانات التقدم اليومي للخادم مع إبقاء localStorage كـ primary لا secondary

### الأهداف التفصيلية:

**3A — Profile:**
- تطبيق `GET /api/profile` + `PUT /api/profile`
- تحديث `profile.html`: قراءة من API أولاً، fallback لـ localStorage
- نقل `zad_profile` من localStorage إلى `users` + `user_settings` في DB

**3B — Worship Progress:**
- تطبيق `GET /api/progress/today` — يرجع ورد اليوم مع الـ streak
- تطبيق `PUT /api/progress/worship` — batch update للعبادات
- تطبيق `GET/PUT /api/progress/takbeer`
- تطبيق `GET/PUT /api/progress/mushaf`
- تطبيق `GET/PUT /api/progress/fasting`
- تطبيق `GET/PUT /api/progress/adhkar`
- إضافة `SyncAdapter` في `app.js`:
  - عند اتصال الإنترنت: يرفع البيانات المحلية للخادم
  - الخادم يُعيد latest state (max strategy للـ streak)

**3C — Badges & Goals:**
- تطبيق `GET /api/progress/badges` + منطق الأوسمة server-side
- تطبيق `GET/POST/DELETE /api/goals`

### الملفات المتأثرة في `/source`:
```
js/app.js              ← إضافة SyncAdapter (لا حذف localStorage)
js/goals-module.js     ← قراءة من API مع fallback لـ IndexedDB
profile.html           ← قراءة من API مع fallback لـ localStorage
```

### ما لا يُعدَّل:
- localStorage logic — يبقى كـ primary
- Firebase Auth
- كل صفحات المحتوى (adhkar, mushaf, hasna...)
- service worker / PWA manifest

### الاختبارات المطلوبة:
- ورد اليوم يُحفظ في DB عند اتصال الإنترنت
- يُستعاد من DB عند تغيير الجهاز
- بدون إنترنت: localStorage يعمل وحده بشكل كامل
- Streak يُحسَب صحيحاً من الخادم

### Rollback Plan:
- تعطيل `SyncAdapter` بـ feature flag في `localStorage['zad_api_enabled'] = false`
- يعود للعمل بـ localStorage وحده فوراً

---

## Phase 4: Groups & Family Competition
**الهدف:** نقل المجموعات من Firebase RTDB إلى PostgreSQL وإصلاح خلل اللوحة

### الأهداف التفصيلية:
- تطبيق `POST /api/groups` — إنشاء مجموعة
- تطبيق `POST /api/groups/join` — انضمام بكود
- تطبيق `GET /api/groups/mine` — قائمة مجموعاتي
- تطبيق `GET /api/groups/:id` — بيانات مجموعة محددة
- تطبيق `GET /api/groups/:id/leaderboard` — **يُصلح الخلل الحالي**
- تطبيق `PUT /api/groups/:id/my-stats` — رفع الإحصاءات
- تطبيق `DELETE /api/groups/:id/me` — مغادرة
- تحديث `groups.firebase.js`: يُصبح `groups.api.js` يستخدم الخادم
- تحديث `group-board.html`: يقرأ من API لا localStorage

### الملفات المتأثرة في `/source`:
```
js/groups.firebase.js  ← يُحوَّل لـ groups.api.js (أو adapter)
group-board.html       ← يُصلح الخلل: يقرأ من API
groups.html            ← يستخدم groups.api.js
```

### ما لا يُعدَّل:
- `groups.js` (LocalAdapter) — يبقى كـ fallback بدون auth
- Firebase RTDB rules — تبقى لحين اكتمال النقل

### الاختبارات المطلوبة:
- إنشاء مجموعة جديدة وإنشائها في DB
- الانضمام بكود من جهاز آخر يعمل
- اللوحة تعرض بيانات حقيقية (لا بيانات localStorage القديمة)
- المجموعة تعمل بدون Firebase بعد النقل

### Rollback Plan:
- إعادة `groups.firebase.js` — المجموعات ترجع لـ Firebase
- تحديث `group-board.html` لـ localStorage القديم

---

## Phase 5: AI Proxy & Server-side Secrets
**الهدف:** ضمان أن جميع API keys والـ secrets على الخادم فقط

### الأهداف التفصيلية:
- مراجعة `/api/gemini` الحالي (Vercel Edge) — **ممتاز بالفعل**، GROQ_API_KEY في `.env`
- نقل `VAPID_KEY` من localStorage إلى `.env` على الخادم
- إضافة `ai_audit_log` table في DB بدلاً من `localStorage['zad_ai_reports']`
- تطبيق `POST /api/admin/ai-report` للمشرف
- تطبيق rate limiting server-side للـ AI (موجود في `gemini.js` لكن per-instance)
- نقل rate limiting لـ Redis لضمان consistent limiting عبر instances

### الملفات المتأثرة في `/source`:
```
js/ai-guard.js         ← يرسل logs للـ API بدلاً من localStorage
firebase-push.js       ← يقرأ VAPID_KEY من API بدلاً من localStorage
```

### ما لا يُعدَّل:
- `js/gemini.js` (Vercel Edge) — يبقى كما هو إلى حد بعيد
- `ai.html`
- كل منطق AI الحالي

### الاختبارات المطلوبة:
- لا `VAPID_KEY` في أي ملف frontend
- AI logs تُحفظ في DB لا localStorage
- Rate limiting يعمل عبر sessions مختلفة

### Rollback Plan:
- إعادة `ai-guard.js` لـ localStorage
- لا تأثير على وظيفة AI الأساسية

---

## Phase 6: Push Notifications
**الهدف:** تفعيل Push Notifications بشكل كامل

### الأهداف التفصيلية:
- إعداد VAPID keys على الخادم (ليس Firebase FCM أو مع البقاء عليه)
- قرار: هل نبقى على Firebase FCM أم نستخدم Web Push مباشرة؟
  - **توصية:** Web Push مباشرة للاستقلالية عن Firebase
- تطبيق `POST /api/notifications/register` — يحفظ push token في `push_tokens`
- تطبيق `POST /api/notifications/send` — يرسل إشعار (للمشرف فقط)
- تحديث `firebase-push.js` أو إنشاء `web-push.js` بديل
- تحديث `firebase-messaging-sw.js` ليتعامل مع Web Push الخادم

### الملفات المتأثرة في `/source`:
```
firebase-push.js           ← يُحدَّث أو يُستبدَل
firebase-messaging-sw.js   ← يُحدَّث
```

### ما لا يُعدَّل:
- `sw.js` (service worker الرئيسي)
- أي صفحة HTML

### الاختبارات المطلوبة:
- إشعار push يصل للمستخدم على Chrome/Android
- Token يُحفظ في `push_tokens` table
- لا VAPID_KEY في الـ frontend code

### Rollback Plan:
- إبقاء Firebase FCM كـ fallback
- يمكن العودة لـ `firebase-push.js` القديم

---

## Phase 7: Firebase Decommission
**الهدف:** إزالة التبعية على Firebase تدريجياً (بعد التأكد من اكتمال الفيزات 2-6)

### جدول إزالة Firebase:

| الخدمة | يُزال متى؟ | ما يحلّ محلّه |
|--------|-----------|--------------|
| Firebase Auth | بعد Phase 2 مستقرة 4 أسابيع | JWT على الخادم |
| Firebase RTDB (groups) | بعد Phase 4 مستقرة 4 أسابيع | PostgreSQL |
| Firebase RTDB (users sync) | بعد Phase 3 مستقرة | PostgreSQL |
| Firebase RTDB (pushTokens) | بعد Phase 6 مستقرة | `push_tokens` table |
| Firebase FCM | بعد Phase 6 مستقرة | Web Push API |
| Firebase SDK scripts | آخر خطوة | يُزال من كل HTML |

### خطوات إزالة كل خدمة:
1. تحديث Firebase Rules لمنع الكتابة الجديدة
2. قراءة-فقط لأسبوعين للتأكد من نقل البيانات
3. إزالة الـ SDK script من HTML
4. حذف `firebase-init.js`, `firebase-auth.js`, `firebase-push.js`
5. إعداد Firebase Backup قبل إغلاق المشروع

### الاختبارات النهائية:
- التطبيق يعمل بشكل كامل بدون أي طلب لـ `firebase*` domains
- Network DevTools: لا requests لـ `firebaseapp.com` أو `googleapis.com`
- كل features تعمل: Auth, Groups, Progress, Push, AI

---

## ملاحظات عامة على كل المراحل

| القاعدة | التطبيق |
|---------|---------|
| **Feature Flags** | كل feature جديدة تُفعَّل بـ `localStorage['zad_feature_X'] = true` |
| **Adapter Pattern** | كل ملف firebase-*.js يُحاط بـ Adapter يمكن تبديله |
| **No Breaking Changes** | الـ PWA يعمل offline بالكامل في كل مرحلة |
| **Monitoring** | إضافة error tracking (Sentry) من Phase 1 |
| **Data Backup** | نسخ احتياطية يومية من الـ DB من Phase 1 |
