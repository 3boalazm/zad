# ZAD — Migration Decisions v0
**Sprint:** Z0 — Freeze & Server Migration Baseline  
**التاريخ:** يونيو 2026  
**الحالة:** مُغلَق ومُقرَّر — لا يتغير في Sprint Z0

---

## القرارات الأساسية المُقرَّرة

### 1. الكود الرسمي الحالي
`/source` (أو `github.com/3boalazm/zadullashr.git`) هو الكود الرسمي الحالي الوحيد.  
لا يُعدَّل أي ملف فيه في Sprint Z0.

### 2. مجلد الـ Backend المحجوز
`/api` محجوز للـ Backend الذي سيُبنى لاحقاً ابتداءً من Phase 1.  
يبقى فارغاً حتى إشعار آخر.

### 3. نهج التحويل: Strangler Fig
التحويل من Static PWA إلى server-side يتبع نمط **Strangler Fig** لا Big Bang Rewrite:
- كل feature تُهاجَر بشكل مستقل
- التطبيق يعمل بشكل كامل في كل لحظة
- لا "إعادة كتابة من الصفر"

### 4. Offline-First غير قابل للتفاوض
التطبيق يجب أن يعمل **بدون إنترنت وبدون Backend** في كل مرحلة.  
localStorage/IndexedDB يبقى Primary — الخادم ثانوي اختياري.

### 5. Firebase لا يُحذف الآن
Firebase Auth + RTDB + FCM تبقى كما هي حتى اكتمال Phase 2-6.  
لا يُكتَب كود يزيل Firebase قبل جاهزية البديل واختباره.

### 6. قاعدة البيانات المبدئية
**PostgreSQL** هو الاختيار المبدئي للبيانات على الخادم.  
Redis اختياري للجلسات والكاش.  
لا يُنفَّذ أي schema قبل Phase 1.

### 7. قرار Auth مؤجل
قرار آلية المصادقة النهائية (JWT / Sessions / مكتبة متخصصة) **مؤجل** ولم يُحسَم بعد.  
JWT مُقترَح في الوثائق لكنه **غير معتمد نهائياً في Sprint Z0**.  
القرار النهائي يُتخذ في بداية Phase 2 بعد مراجعة المتطلبات الأمنية.

### 8. شرط إغلاق Sprint Z0
لا يبدأ تنفيذ **Phase 1** (Backend Skeleton + DB Schema) قبل:
- إغلاق Sprint Z0 بنجاح (PASS)
- الـ tag `v1.0-pre-server-migration` موجود ومؤكَّد
- الوثائق الست داخل `docs/server-migration/`
- `scripts/verify-zad-baseline.sh` يعمل بدون errors

### 9. مبدأ No Breaking Changes
أي API أو Backend مستقبلي يجب أن يعمل بجانب الـ Static PWA بدون كسره.  
لا endpoint يُنشأ يُلزِم الـ frontend بالتغيير قبل أن يكون جاهزاً.

---

## ما هو خارج نطاق Sprint Z0

| الموضوع | القرار |
|---------|--------|
| اختيار ORM | مؤجل لـ Phase 1 |
| Framework الـ Backend (Express/Fastify/Hono) | مؤجل لـ Phase 1 |
| بنية الـ Dockerfile | مؤجل لـ Phase 1 |
| آلية Auth النهائية | مؤجل لـ Phase 2 |
| حذف Firebase | مؤجل لـ Phase 7 |
| إعداد Dexie Cloud | ملغى (يُستبدَل بـ Backend API) |

---

## التوقيع

هذه الوثيقة تُعبِّر عن الحالة المعمارية المُتفَق عليها عند إغلاق Sprint Z0.  
أي تغيير يستلزم فتح Sprint جديد وتوثيق القرار فيه.
