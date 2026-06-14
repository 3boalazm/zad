# ZAD — Migration Mapping
**النوع:** خريطة ربط بين البيانات الحالية والهدف  
**القاعدة:** لا كود migration — mapping مفاهيمي فقط

---

## 1. مبدأ Migration المتبع

```
┌──────────────────────────────────────────────────────┐
│           Strangler Fig Pattern                       │
│                                                      │
│  Static PWA (يبقى يعمل)                             │
│         │                                            │
│         ▼                                            │
│  [ Feature Flag / Adapter Layer ]                    │
│         │              │                             │
│         ▼              ▼                             │
│  localStorage     PostgreSQL API                     │
│  (حتى اكتمال    (يُضاف تدريجياً                    │
│   المرحلة)       feature by feature)                 │
└──────────────────────────────────────────────────────┘
```

**المبدأ:** كل feature تُهاجَر بشكل مستقل. لا "big bang migration".  
**الضمان:** التطبيق يعمل بدون Backend في كل وقت (offline-first يبقى).

---

## 2. جدول الـ Migration الكامل

### 2A. Identity & Auth

| Current Feature | Current Source | Target Table(s) | API Needed | Migration Complexity | Notes |
|----------------|----------------|-----------------|------------|---------------------|-------|
| **Anonymous user** | UUID محلي في `zad_v2.groups.me.id` | `users` (is_anonymous=true) | `POST /auth/anonymous` | 🟢 منخفض | أول شيء يُنفَّذ — يُنشئ user_id ثابت |
| **Google Sign-In** | `firebase-auth.js` → Firebase Auth | `users` + `auth_providers` | `POST /auth/google` | 🟡 متوسط | يحتاج OAuth flow على الخادم |
| **Email Sign-Up** | `firebase-auth.js` → Firebase Auth | `users` + `auth_providers` | `POST /auth/email/register` + `POST /auth/email/login` | 🟡 متوسط | يحتاج email verification على الخادم |
| **Auth State** | `ZadAuth.onChange()` → Firebase | JWT + `GET /auth/me` | `GET /auth/me` | 🟡 متوسط | استبدال Firebase observer بـ JWT refresh |
| **User Profile** | `localStorage['zad_profile']` | `users` + `user_settings` | `GET /profile` + `PUT /profile` | 🟢 منخفض | بيانات بسيطة |
| **Theme + Font Settings** | `localStorage['zad_v2'].theme`, `localStorage['zad_font_size']` | `user_settings` | `PUT /settings` | 🟢 منخفض | تُزامَن اختيارياً |

---

### 2B. Worship Progress

| Current Feature | Current Source | Target Table(s) | API Needed | Migration Complexity | Notes |
|----------------|----------------|-----------------|------------|---------------------|-------|
| **الورد اليومي** | `localStorage['zad_v2'].worship` `{fajr:bool, ...}` | `worship_log` | `GET /progress/today` + `PUT /progress/worship` | 🟢 منخفض | أبسط feature للبدء |
| **الصيام** | `localStorage['zad_v2'].fasting` `{1:bool, ..., 9:bool}` | `fasting_log` | `GET /progress/fasting` + `PUT /progress/fasting/:day` | 🟢 منخفض | فقط 9 أيام |
| **التكبير** | `localStorage['zad_v2'].takbeer` | `takbeer_log` | `GET /progress/takbeer` + `POST /progress/takbeer/tap` | 🟢 منخفض | كل نقرة = increment |
| **الختمة / المصحف** | `localStorage['zad_v2'].mushaf` + `IndexedDB mushaf` | `mushaf_progress` | `GET /progress/mushaf` + `PUT /progress/mushaf` | 🟢 منخفض | |
| **الأذكار** | `localStorage['zad_v2'].adhkar` + `IndexedDB adhkar` | `adhkar_log` | `GET /progress/adhkar` + `PUT /progress/adhkar/:section` | 🟢 منخفض | |
| **السلسلة (streak)** | `localStorage['zad_v2'].streak` | `streak_history` | `GET /progress/streak` | 🟢 منخفض | تُحسَب server-side من worship_log |
| **الأوسمة** | `localStorage['zad_v2'].badges` (Array of IDs) | `badges` | `GET /progress/badges` + `POST /progress/badges/award` | 🟡 متوسط | منطق الحصول يُنقل للـ backend |
| **الأهداف الشخصية** | `IndexedDB ZadStore → state['userGoals']` | `user_goals` | `GET /goals` + `POST /goals` + `DELETE /goals/:id` | 🟢 منخفض | |
| **حسابات الزكاة** | `IndexedDB zakatCalc` | `zakat_calc` | `GET /zakat/history` + `POST /zakat/calc` | 🟡 متوسط | يحتاج API سعر الذهب |
| **تقدم عرفة** | `localStorage['zad_v2'].arafah` | `worship_log` (worship_key='arafah_*') أو JSONB column | `PUT /progress/arafah` | 🟢 منخفض | يمكن تخزينه كـ JSONB مؤقتاً |

---

### 2C. Social / Groups

| Current Feature | Current Source | Target Table(s) | API Needed | Migration Complexity | Notes |
|----------------|----------------|-----------------|------------|---------------------|-------|
| **إنشاء مجموعة** | Firebase RTDB `groups/{gid}` | `groups` | `POST /groups` | 🟡 متوسط | نقل من Firebase RTDB |
| **الانضمام بكود** | Firebase RTDB `codes/{CODE}` | `groups` (lookup by invite_code) | `POST /groups/join` | 🟡 متوسط | |
| **قائمة مجموعات المستخدم** | Firebase RTDB `userGroups/{uid}` | `group_members` | `GET /groups/mine` | 🟡 متوسط | |
| **لوحة الترتيب** | `group-board.html` ← localStorage (خلل حالي!) | `group_members` | `GET /groups/:id/leaderboard` | 🔴 عالٍ | **هذا خلل موجود الآن** — اللوحة تقرأ بيانات قديمة |
| **مزامنة إحصاءات العضو** | `groups.firebase.js` → `groups/{gid}/members/{uid}` | `group_members` | `PUT /groups/:id/my-stats` | 🟡 متوسط | payload صغير: `{alias, pct, streak, badge}` |
| **مغادرة المجموعة** | Firebase RTDB delete | `group_members.left_at` | `DELETE /groups/:id/me` | 🟢 منخفض | |
| **Alias المستخدم** | `localStorage['zad_v2'].groups.me.alias` | `group_members.alias` | `PUT /groups/:id/my-alias` | 🟢 منخفض | |

---

### 2D. AI & External Services

| Current Feature | Current Source | Target Table(s) | API Needed | Migration Complexity | Notes |
|----------------|----------------|-----------------|------------|---------------------|-------|
| **AI Chat (Groq + MCP)** | `/api/gemini` (Vercel Edge — موجود وجيد) | لا جدول (stateless) | `/api/gemini` (موجود) | ✅ لا شيء | Secret على الخادم بالفعل |
| **AI Guard Log** | `localStorage['zad_ai_guard_log']` → `localStorage['zad_ai_reports']` | `ai_audit_log` (جدول مستقبلي) | `POST /admin/ai-report` | 🔴 أمان | **يجب نقله للخادم — بيانات أمان** |
| **Push Notifications** | Firebase FCM + VAPID غير مضبوط | `push_tokens` | `POST /notifications/register` + backend sender | 🔴 عالٍ | يحتاج VAPID key + backend sender |
| **مواقيت الصلاة** | Aladhan API (frontend مباشرة) | لا جدول — cache في Redis | `GET /prayer-times?city=&date=` (proxy) | 🟡 متوسط | proxy يحمي rate limit |
| **أسعار الذهب (Zakat)** | API خارجي من الـ frontend | Redis cache | `GET /gold-price?currency=SAR` | 🟡 متوسط | |
| **Dexie Cloud Sync** | `sync-module.js` — فارغ ومعطوط | ← يُستبدَل بـ PostgreSQL API | — | لا شيء — يُلغى | سيُستبدَل بـ Backend API الجديد |

---

### 2E. Kids / Family Safety

| Current Feature | Current Source | Target Table(s) | API Needed | Migration Complexity | Notes |
|----------------|----------------|-----------------|------------|---------------------|-------|
| **Parent Gate** | `parent-gate.js` — client-only sessionStorage | `user_settings.parental_gate_method` (مستقبلي) | `POST /kids/verify-parent` | 🔴 أمان | التحقق يجب أن يكون server-side |
| **Kids Safe Zone** | `isKidSafe()` check في المتصفح | لا جدول — middleware | Route-level middleware | 🟡 متوسط | |
| **يوتيوب nocookie** | embed مباشر في HTML | لا تغيير مطلوب | — | ✅ لا شيء | آمن كما هو |

---

## 3. Migration Priority Matrix

```
         عالي الأثر                    منخفض الأثر
              │                              │
              ▼                              ▼
🔴 حرج  │ Groups Leaderboard (خلل حالي) │ Dexie Cloud (يُلغى)
         │ Push Notifications (معطوب)    │ Theme/Font Settings
         │ AI Guard Log (أمان)           │
─────────┼───────────────────────────────┼────────────────────
🟡 مهم  │ Auth (anonymous → registered) │ Zakat History
         │ Worship Progress              │ Prayer Times Proxy
         │ Streak + Badges              │ User Goals
─────────┼───────────────────────────────┼────────────────────
🟢 عادي │ User Profile                  │ Settings Sync
         │ Fasting Log                   │ App Preferences
```

---

## 4. Data Shape Transformation Examples

### worship.{fajr:true} → worship_log

```
BEFORE (localStorage):
  zad_v2.worship = { fajr: true, zuhr: false, asr: true, ... }

AFTER (PostgreSQL):
  worship_log row:
    user_id     = 'uuid-xxx'
    log_date    = '2026-05-20'
    worship_key = 'fajr'
    completed   = true
    completed_at = '2026-05-20T04:32:00Z'
```

### groups (Firebase RTDB) → PostgreSQL

```
BEFORE (Firebase RTDB):
  groups/abc123:
    name: "عائلة أبو العزم"
    code: "XYZABC"
    createdBy: "firebase-uid-xxx"
    members:
      firebase-uid-xxx: {alias:"أبو مصطفى", pct:80, streak:7, badge:"🏆"}
      firebase-uid-yyy: {alias:"أم مصطفى", pct:60, streak:5, badge:"🥇"}

AFTER (PostgreSQL):
  groups: {id: uuid, name: "عائلة أبو العزم", invite_code: "XYZABC", created_by: user_uuid_xxx}
  group_members: [{group_id, user_id: user_uuid_xxx, alias:"أبو مصطفى", completion_pct:80, streak_days:7, badge_emoji:"🏆"},
                  {group_id, user_id: user_uuid_yyy, alias:"أم مصطفى", completion_pct:60, streak_days:5, badge_emoji:"🥇"}]
```

---

## 5. ما لا يُهاجَر

| العنصر | السبب |
|--------|-------|
| `js/adhkar-database*.js` | محتوى إسلامي ثابت — يبقى في JS |
| `js/hasn-part*.js` | محتوى ثابت |
| `heroes-data.js` | محتوى ثابت |
| `sessionStorage['zad_pg_grace']` | مؤقت بطبيعته — لا معنى لنقله |
| `localStorage['zad_prayer_cache']` | cache مؤقت — يُستعاض عنه بـ Redis |
| ملفات HTML الثابتة | يبقى PWA كما هو |

---

*هذه الخريطة مرجع للمطوّر — لا تُشكّل commitment بترتيب تنفيذ*
