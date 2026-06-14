# ZAD — API Boundary Draft
**النوع:** مسودة endpoints مقترحة — بدون تنفيذ  
**Base URL:** `https://api.zadullashr.com` (أو `https://zadullashr.vercel.app/api`)  
**الإصدار:** v1

---

## مبادئ تصميم الـ API

| المبدأ | التطبيق |
|--------|---------|
| **REST JSON** | `Content-Type: application/json` |
| **Arabic-friendly** | ردود الخطأ باللغة العربية |
| **Idempotent PUT** | كل تحديث للبيانات بـ PUT يمكن تكراره بأمان |
| **Batch Updates** | ورد اليوم يُرسَل كـ batch لا request لكل عبادة |
| **Offline-first** | كل endpoint اختياري — الـ PWA لا يتوقف لو فشل API |
| **Versioned** | `/api/v1/` من البداية لتسهيل التطوير المستقبلي |

---

## 1. Auth Endpoints

| Method | Endpoint | Purpose | Auth Required | Reads/Writes | Related Tables |
|--------|----------|---------|--------------|-------------|----------------|
| `POST` | `/api/v1/auth/anonymous` | إنشاء مستخدم anonymous والحصول على JWT | ❌ | W: users | `users` |
| `POST` | `/api/v1/auth/google` | تسجيل/دخول بـ Google OAuth | ❌ | RW: users, auth_providers | `users`, `auth_providers` |
| `POST` | `/api/v1/auth/email/register` | تسجيل بإيميل وكلمة مرور | ❌ | W: users, auth_providers | `users`, `auth_providers` |
| `POST` | `/api/v1/auth/email/login` | دخول بإيميل | ❌ | R: auth_providers | `auth_providers` |
| `POST` | `/api/v1/auth/refresh` | تجديد JWT token | ✅ | R: users | `users` |
| `POST` | `/api/v1/auth/logout` | إلغاء الجلسة | ✅ | — | — |
| `GET`  | `/api/v1/auth/me` | بيانات المستخدم الحالي | ✅ | R: users | `users` |
| `DELETE` | `/api/v1/auth/account` | حذف الحساب كاملاً (GDPR) | ✅ | W: users.deleted_at | `users` + cascade |

**Request/Response Shapes (مرجعية):**

```
POST /auth/anonymous
Response: { userId, token, expiresAt, isAnonymous: true }

POST /auth/google
Body:    { idToken: "google_id_token" }
Response: { userId, token, expiresAt, isNewUser: bool }
```

---

## 2. Profile Endpoints

| Method | Endpoint | Purpose | Auth Required | Reads/Writes | Related Tables |
|--------|----------|---------|--------------|-------------|----------------|
| `GET`  | `/api/v1/profile` | جلب الملف الشخصي الكامل | ✅ | R: users, user_settings | `users`, `user_settings` |
| `PUT`  | `/api/v1/profile` | تحديث الاسم والـ avatar | ✅ | W: users | `users` |
| `GET`  | `/api/v1/profile/settings` | جلب إعدادات التطبيق | ✅ | R: user_settings | `user_settings` |
| `PUT`  | `/api/v1/profile/settings` | تحديث الإعدادات (theme, font, lang) | ✅ | W: user_settings | `user_settings` |
| `PUT`  | `/api/v1/profile/location` | تحديث المدينة والإحداثيات | ✅ | W: user_settings | `user_settings` |

---

## 3. Progress Endpoints

| Method | Endpoint | Purpose | Auth Required | Reads/Writes | Related Tables |
|--------|----------|---------|--------------|-------------|----------------|
| `GET`  | `/api/v1/progress/today` | الورد اليومي الكامل مع الـ streak | ✅ | R: worship_log, streak_history | `worship_log`, `streak_history` |
| `PUT`  | `/api/v1/progress/worship` | تحديث batch لعبادات اليوم | ✅ | W: worship_log | `worship_log` |
| `GET`  | `/api/v1/progress/takbeer` | عداد التكبير لليوم | ✅ | R: takbeer_log | `takbeer_log` |
| `PUT`  | `/api/v1/progress/takbeer` | تحديث عداد التكبير | ✅ | W: takbeer_log | `takbeer_log` |
| `GET`  | `/api/v1/progress/mushaf` | تقدم الختمة | ✅ | R: mushaf_progress | `mushaf_progress` |
| `PUT`  | `/api/v1/progress/mushaf` | تحديث تقدم الختمة | ✅ | W: mushaf_progress | `mushaf_progress` |
| `GET`  | `/api/v1/progress/fasting` | سجل الصيام للعشر | ✅ | R: fasting_log | `fasting_log` |
| `PUT`  | `/api/v1/progress/fasting/:day` | تحديث صيام يوم معين (1-9) | ✅ | W: fasting_log | `fasting_log` |
| `GET`  | `/api/v1/progress/adhkar` | تقدم الأذكار لليوم | ✅ | R: adhkar_log | `adhkar_log` |
| `PUT`  | `/api/v1/progress/adhkar/:section` | تحديث قسم أذكار | ✅ | W: adhkar_log | `adhkar_log` |
| `GET`  | `/api/v1/progress/streak` | معلومات السلسلة الكاملة | ✅ | R: streak_history, worship_log | `streak_history` |
| `GET`  | `/api/v1/progress/summary` | ملخص إجمالي للعشر (للتقرير) | ✅ | R: multiple | جميع جداول progress |
| `GET`  | `/api/v1/progress/history` | تاريخ الأداء السابق | ✅ | R: worship_log | `worship_log` |

**Batch Update Shape (مرجعية):**

```
PUT /progress/worship
Body: {
  date: "2026-05-20",
  worship: {
    fajr: true, zuhr: true, asr: false,
    maghrib: true, isha: true,
    morning_dhikr: true, evening_dhikr: false,
    takbeer_100: false, tawbah: true,
    qiyam: false, duha: true, rawatib: false
  }
}
```

---

## 4. Goals Endpoints

| Method | Endpoint | Purpose | Auth Required | Reads/Writes | Related Tables |
|--------|----------|---------|--------------|-------------|----------------|
| `GET`  | `/api/v1/goals` | قائمة الأهداف الشخصية مع التقدم | ✅ | R: user_goals | `user_goals` |
| `POST` | `/api/v1/goals` | إضافة هدف جديد | ✅ | W: user_goals | `user_goals` |
| `PUT`  | `/api/v1/goals/:id` | تحديث هدف (current progress) | ✅ | W: user_goals | `user_goals` |
| `DELETE` | `/api/v1/goals/:id` | حذف هدف (soft delete) | ✅ | W: user_goals.deleted_at | `user_goals` |
| `GET`  | `/api/v1/goals/templates` | قوالب الأهداف الجاهزة | ❌ | R: static | — |

---

## 5. Groups Endpoints

| Method | Endpoint | Purpose | Auth Required | Reads/Writes | Related Tables |
|--------|----------|---------|--------------|-------------|----------------|
| `GET`  | `/api/v1/groups/mine` | مجموعاتي النشطة | ✅ | R: group_members, groups | `group_members`, `groups` |
| `POST` | `/api/v1/groups` | إنشاء مجموعة جديدة | ✅ | W: groups, group_members | `groups`, `group_members` |
| `POST` | `/api/v1/groups/join` | انضمام بكود دعوة | ✅ | W: group_members | `group_members`, `groups` |
| `GET`  | `/api/v1/groups/:id` | بيانات مجموعة | ✅ (عضو) | R: groups, group_members | `groups`, `group_members` |
| `GET`  | `/api/v1/groups/:id/leaderboard` | لوحة الترتيب مرتبة | ✅ (عضو) | R: group_members | `group_members` |
| `PUT`  | `/api/v1/groups/:id/my-stats` | رفع إحصاءاتي (pct, streak, badge) | ✅ (عضو) | W: group_members | `group_members` |
| `PUT`  | `/api/v1/groups/:id/my-alias` | تغيير اسم العرض في المجموعة | ✅ (عضو) | W: group_members | `group_members` |
| `DELETE` | `/api/v1/groups/:id/me` | مغادرة مجموعة | ✅ (عضو) | W: group_members.left_at | `group_members` |
| `DELETE` | `/api/v1/groups/:id` | حذف مجموعة | ✅ (admin فقط) | W: groups.deleted_at | `groups` |

**Join Body (مرجعية):**

```
POST /groups/join
Body:    { inviteCode: "XYZABC", alias: "أبو مصطفى" }
Response: { groupId, groupName, membersCount, myRank }
```

---

## 6. Kids / Family Endpoints

| Method | Endpoint | Purpose | Auth Required | Reads/Writes | Related Tables |
|--------|----------|---------|--------------|-------------|----------------|
| `POST` | `/api/v1/kids/verify-parent` | تحقق server-side من بوابة ولي الأمر | ✅ | R: parent verification | — |
| `GET`  | `/api/v1/kids/safe-urls` | قائمة URLs الآمنة للأطفال | ❌ | R: static config | — |
| `POST` | `/api/v1/kids/report` | بلاغ عن محتوى غير مناسب | ✅ | W: admin log | `ai_audit_log` |

**ملاحظة معمارية:** في الفيز الحالي، Parent Gate تعمل client-side. هذه الـ endpoints للفيز المستقبلي حين يُضاف child profile منفصل.

---

## 7. Reports Endpoints

| Method | Endpoint | Purpose | Auth Required | Reads/Writes | Related Tables |
|--------|----------|---------|--------------|-------------|----------------|
| `GET`  | `/api/v1/reports/ten-days` | تقرير العشر كاملاً | ✅ | R: multiple | جميع جداول progress |
| `GET`  | `/api/v1/reports/worship-heatmap` | خريطة حرارة الورد | ✅ | R: worship_log | `worship_log` |
| `GET`  | `/api/v1/reports/streak-chart` | مخطط السلسلة | ✅ | R: streak_history | `streak_history` |
| `POST` | `/api/v1/reports/export` | تصدير البيانات (GDPR) | ✅ | R: all user data | all tables |

---

## 8. AI Proxy Endpoints

| Method | Endpoint | Purpose | Auth Required | Reads/Writes | Related Tables |
|--------|----------|---------|--------------|-------------|----------------|
| `POST` | `/api/gemini` | المساعد الإسلامي (Groq + Tafsir MCP) | ❌ (rate limited by IP) | — | — |
| `GET`  | `/api/gemini` | Health check للـ AI | ❌ | R: MCP health | — |
| `POST` | `/api/v1/ai/report` | بلاغ من المشرف | ✅ (admin) | W: ai_audit_log | `ai_audit_log` |
| `GET`  | `/api/v1/admin/ai-logs` | عرض سجلات AI (للمشرف) | ✅ (admin) | R: ai_audit_log | `ai_audit_log` |

**ملاحظة:** `/api/gemini` موجود ويعمل على Vercel — لا يحتاج تغيير في الفيز الأول.

---

## 9. Notifications Endpoints

| Method | Endpoint | Purpose | Auth Required | Reads/Writes | Related Tables |
|--------|----------|---------|--------------|-------------|----------------|
| `POST` | `/api/v1/notifications/register` | تسجيل push token | ✅ | W: push_tokens | `push_tokens` |
| `DELETE` | `/api/v1/notifications/unregister` | إلغاء تسجيل push | ✅ | W: push_tokens.is_active | `push_tokens` |
| `POST` | `/api/v1/notifications/send` | إرسال إشعار (للمشرف) | ✅ (admin) | R: push_tokens | `push_tokens` |
| `GET`  | `/api/v1/notifications/vapid-key` | جلب VAPID public key | ❌ | R: env config | — |

---

## 10. System / Utility Endpoints

| Method | Endpoint | Purpose | Auth Required | Reads/Writes | Related Tables |
|--------|----------|---------|--------------|-------------|----------------|
| `GET`  | `/api/health` | Health check للـ Backend | ❌ | R: db ping | — |
| `GET`  | `/api/v1/prayer-times` | مواقيت الصلاة (proxy + cache) | ❌ | R: Aladhan API + Redis | — |
| `GET`  | `/api/v1/gold-price` | سعر الذهب للزكاة (proxy + cache) | ❌ | R: external + Redis | — |
| `GET`  | `/api/v1/hijri-date` | التاريخ الهجري الحالي | ❌ | R: calculation | — |

---

## Error Response Format (الموحَّد)

```json
{
  "error": {
    "code": "WORSHIP_DATE_INVALID",
    "message": "التاريخ المطلوب خارج نطاق العشر المسموح به",
    "details": null
  }
}
```

## Success Response Format (الموحَّد)

```json
{
  "data": { ... },
  "meta": {
    "timestamp": "2026-05-20T10:30:00Z",
    "version": "v1"
  }
}
```

---

## Rate Limiting

| المسار | الحد | النافذة |
|--------|------|---------|
| `/api/gemini` | 15 requests | 60 ثانية (per IP) |
| `/api/v1/auth/*` | 10 requests | 15 دقيقة (per IP) |
| `/api/v1/progress/*` | 100 requests | دقيقة واحدة (per user) |
| `/api/v1/notifications/send` | 5 requests | ساعة (admin only) |

---

*هذه مسودة endpoints — الأسماء والمسارات قابلة للتعديل قبل التنفيذ*
