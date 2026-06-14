# ZAD — Target Database Design
**النوع:** وثيقة تصميم معمارية — بدون كود تنفيذي  
**القاعدة المقترحة:** PostgreSQL (Primary) + Redis (Optional Cache) + Object Storage (Future)

---

## 1. مبادئ التصميم

| المبدأ | التطبيق |
|--------|---------|
| **Local-first أولاً** | يبقى التطبيق يعمل بدون Backend — DB تضاف تدريجياً |
| **Privacy by Design** | بيانات العبادة الشخصية لا تُشارَك إطلاقاً (alias فقط في المجموعات) |
| **Soft Delete** | لا حذف فعلي للبيانات — `deleted_at` timestamp |
| **Audit Trail** | كل جدول يحتوي `created_at`, `updated_at` |
| **UUID للمستخدمين** | لا auto-increment للـ users — UUID v4 |
| **Minimal PII** | لا بريد إلكتروني إلزامي في الفيز الأول |
| **Child Data Isolation** | بيانات الأطفال معزولة ومرتبطة بـ parent_uid |

---

## 2. Domain Architecture (المجالات)

```
┌─────────────────────────────────────────────────────────────────┐
│                    ZAD — Database Domains                        │
├────────────────┬────────────────┬───────────────┬───────────────┤
│   IDENTITY     │   WORSHIP      │   SOCIAL      │  CONTENT      │
│                │                │               │               │
│ users          │ worship_log    │ groups        │ (hardcoded JS │
│ user_settings  │ takbeer_log    │ group_members │  في الفيز 1)  │
│ auth_providers │ mushaf_progress│ group_invites │               │
│ push_tokens    │ fasting_log    │               │               │
│                │ adhkar_log     │               │               │
│                │ badges         │               │               │
│                │ user_goals     │               │               │
│                │ zakat_calc     │               │               │
│                │ streak_history │               │               │
└────────────────┴────────────────┴───────────────┴───────────────┘
```

---

## 3. تصميم الجداول التفصيلي

### 3A. Domain: IDENTITY

---

#### جدول: `users`

```
users
├── id              UUID          PK  DEFAULT gen_random_uuid()
├── display_name    VARCHAR(50)   NULLABLE  (alias للعرض — ليس الاسم الحقيقي)
├── avatar_seed     VARCHAR(20)   NULLABLE  (seed لتوليد avatar محلياً بدون رفع صورة)
├── locale          VARCHAR(5)    DEFAULT 'ar'
├── timezone        VARCHAR(50)   DEFAULT 'Asia/Riyadh'
├── is_anonymous    BOOLEAN       DEFAULT true  (مستخدم بدون تسجيل = anonymous UUID)
├── created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
├── updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
└── deleted_at      TIMESTAMPTZ   NULLABLE  (soft delete)
```

**ملاحظات معمارية:**
- المستخدم Anonymous يُنشأ تلقائياً عند أول زيارة ويحصل على UUID محلي
- `is_anonymous = true` لا يتطلب email أو password
- عند ربط حساب لاحقاً: `is_anonymous` → `false` مع إضافة record في `auth_providers`

**Indexes:**
```
INDEX ON users(created_at)
INDEX ON users(is_anonymous) WHERE deleted_at IS NULL
```

---

#### جدول: `auth_providers`

```
auth_providers
├── id              UUID          PK
├── user_id         UUID          FK → users.id  ON DELETE CASCADE
├── provider        VARCHAR(20)   NOT NULL  ('google', 'email', 'phone', 'apple')
├── provider_uid    VARCHAR(200)  NOT NULL  (Firebase UID أو Google sub)
├── email           VARCHAR(200)  NULLABLE
├── email_verified  BOOLEAN       DEFAULT false
├── created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
└── last_sign_in    TIMESTAMPTZ   NULLABLE
```

**Constraints:**
```
UNIQUE (provider, provider_uid)
```

---

#### جدول: `user_settings`

```
user_settings
├── user_id         UUID          PK  FK → users.id  ON DELETE CASCADE
├── theme           VARCHAR(10)   DEFAULT 'light'  CHECK IN ('light','dark','oled')
├── font_size       VARCHAR(10)   DEFAULT 'medium' CHECK IN ('small','medium','large')
├── quran_font_size INTEGER       DEFAULT 24  CHECK BETWEEN 16 AND 40
├── sound_on        BOOLEAN       DEFAULT true
├── lang            VARCHAR(5)    DEFAULT 'ar'
├── prayer_method   INTEGER       DEFAULT 4
├── city            VARCHAR(100)  NULLABLE
├── lat             DECIMAL(9,6)  NULLABLE
├── lng             DECIMAL(9,6)  NULLABLE
├── updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
```

---

#### جدول: `push_tokens`

```
push_tokens
├── id              UUID          PK
├── user_id         UUID          FK → users.id  ON DELETE CASCADE
├── token           TEXT          NOT NULL UNIQUE
├── platform        VARCHAR(20)   DEFAULT 'web'
├── user_agent      VARCHAR(200)  NULLABLE
├── is_active       BOOLEAN       DEFAULT true
├── created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
├── last_used       TIMESTAMPTZ   NULLABLE
```

---

### 3B. Domain: WORSHIP

---

#### جدول: `worship_log`

```
worship_log
├── id              UUID          PK
├── user_id         UUID          FK → users.id  ON DELETE CASCADE
├── log_date        DATE          NOT NULL
├── worship_key     VARCHAR(50)   NOT NULL  ('fajr','zuhr','asr','maghrib','isha','rawatib','duha','qiyam','morning_dhikr','evening_dhikr','takbeer_100','tawbah')
├── completed       BOOLEAN       NOT NULL DEFAULT false
├── completed_at    TIMESTAMPTZ   NULLABLE
├── created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
└── updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
```

**Constraints:**
```
UNIQUE (user_id, log_date, worship_key)
```

**Indexes:**
```
INDEX ON worship_log(user_id, log_date)
INDEX ON worship_log(log_date) -- للـ analytics
```

---

#### جدول: `takbeer_log`

```
takbeer_log
├── id              UUID          PK
├── user_id         UUID          FK → users.id  ON DELETE CASCADE
├── log_date        DATE          NOT NULL
├── daily_count     INTEGER       NOT NULL DEFAULT 0
├── total_count     INTEGER       NOT NULL DEFAULT 0
├── sessions        INTEGER       NOT NULL DEFAULT 0
├── phrase          VARCHAR(200)  DEFAULT 'اللَّهُ أَكْبَرُ'
├── target          INTEGER       DEFAULT 33
├── updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
```

**Constraints:**
```
UNIQUE (user_id, log_date)
```

---

#### جدول: `mushaf_progress`

```
mushaf_progress
├── id              UUID          PK
├── user_id         UUID          FK → users.id  ON DELETE CASCADE
├── log_date        DATE          NOT NULL
├── juz_reached     INTEGER       NOT NULL DEFAULT 0  CHECK BETWEEN 0 AND 30
├── page_reached    INTEGER       NULLABLE
├── surah_reached   INTEGER       NULLABLE
├── plan            VARCHAR(30)   DEFAULT 'daily-juz'
├── updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
```

**Constraints:**
```
UNIQUE (user_id, log_date)
```

---

#### جدول: `fasting_log`

```
fasting_log
├── id              UUID          PK
├── user_id         UUID          FK → users.id  ON DELETE CASCADE
├── dhul_hijja_day  INTEGER       NOT NULL  CHECK BETWEEN 1 AND 9
├── year            INTEGER       NOT NULL  -- السنة الهجرية (مثلاً 1447)
├── fasted          BOOLEAN       NOT NULL DEFAULT false
├── created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
└── updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
```

**Constraints:**
```
UNIQUE (user_id, dhul_hijja_day, year)
```

---

#### جدول: `adhkar_log`

```
adhkar_log
├── id              UUID          PK
├── user_id         UUID          FK → users.id  ON DELETE CASCADE
├── log_date        DATE          NOT NULL
├── section_id      VARCHAR(50)   NOT NULL  ('morning', 'evening', 'sleep', 'prayer', 'misc')
├── count           INTEGER       DEFAULT 0
├── completed       BOOLEAN       DEFAULT false
├── completed_at    TIMESTAMPTZ   NULLABLE
└── updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
```

**Constraints:**
```
UNIQUE (user_id, log_date, section_id)
```

---

#### جدول: `streak_history`

```
streak_history
├── user_id         UUID          PK  FK → users.id  ON DELETE CASCADE
├── current_streak  INTEGER       NOT NULL DEFAULT 0
├── best_streak     INTEGER       NOT NULL DEFAULT 0
├── last_active     DATE          NULLABLE
└── updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
```

---

#### جدول: `badges`

```
badges
├── id              UUID          PK
├── user_id         UUID          FK → users.id  ON DELETE CASCADE
├── badge_id        VARCHAR(50)   NOT NULL  (slug كـ 'takbeer_1000', 'khatma', 'streak_10')
├── earned_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
├── context         JSONB         NULLABLE  (بيانات سياق الوسام — مثلاً أي يوم)
```

**Constraints:**
```
UNIQUE (user_id, badge_id)
```

---

#### جدول: `user_goals`

```
user_goals
├── id              UUID          PK
├── user_id         UUID          FK → users.id  ON DELETE CASCADE
├── goal_template   VARCHAR(50)   NOT NULL  ('khatma', 'fasting9', 'qiyam', 'takbeer1000', 'sadaqah', 'dhikr')
├── target          INTEGER       NOT NULL
├── current         INTEGER       NOT NULL DEFAULT 0
├── unit            VARCHAR(20)   NOT NULL
├── metric          VARCHAR(30)   NOT NULL  (مرجع الحساب: 'mushaf', 'fasting', 'takbeer'...)
├── added_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
└── deleted_at      TIMESTAMPTZ   NULLABLE
```

---

#### جدول: `zakat_calc`

```
zakat_calc
├── id              UUID          PK
├── user_id         UUID          FK → users.id  ON DELETE CASCADE
├── calc_date       DATE          NOT NULL
├── gold_grams      DECIMAL(10,2) NULLABLE
├── gold_karat      INTEGER       NULLABLE
├── silver_grams    DECIMAL(10,2) NULLABLE
├── cash_amount     DECIMAL(15,2) NULLABLE
├── currency        VARCHAR(3)    DEFAULT 'SAR'
├── total_zakat     DECIMAL(15,2) NULLABLE
├── nisab_met       BOOLEAN       NULLABLE
├── gold_price_used DECIMAL(10,2) NULLABLE  -- سعر الذهب وقت الحساب
├── created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
```

---

### 3C. Domain: SOCIAL

---

#### جدول: `groups`

```
groups
├── id              UUID          PK
├── name            VARCHAR(40)   NOT NULL
├── invite_code     CHAR(6)       NOT NULL UNIQUE  -- الكود المكوّن من 6 أحرف
├── created_by      UUID          FK → users.id
├── max_members     INTEGER       DEFAULT 20
├── created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
├── updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
└── deleted_at      TIMESTAMPTZ   NULLABLE
```

**Indexes:**
```
INDEX ON groups(invite_code) WHERE deleted_at IS NULL
```

---

#### جدول: `group_members`

```
group_members
├── id              UUID          PK
├── group_id        UUID          FK → groups.id  ON DELETE CASCADE
├── user_id         UUID          FK → users.id  ON DELETE CASCADE
├── alias           VARCHAR(24)   NOT NULL  (اسم العرض داخل المجموعة)
├── completion_pct  INTEGER       DEFAULT 0  CHECK BETWEEN 0 AND 100
├── streak_days     INTEGER       DEFAULT 0
├── badge_emoji     CHAR(4)       DEFAULT '🌱'
├── role            VARCHAR(10)   DEFAULT 'member'  CHECK IN ('admin', 'member')
├── joined_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
├── updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
└── left_at         TIMESTAMPTZ   NULLABLE  (soft leave)
```

**Constraints:**
```
UNIQUE (group_id, user_id)
```

**Indexes:**
```
INDEX ON group_members(group_id, completion_pct DESC)  -- للترتيب في اللوحة
INDEX ON group_members(user_id) WHERE left_at IS NULL   -- مجموعات المستخدم النشطة
```

---

## 4. العلاقات (ER Diagram — نصي)

```
users ─────────────┬──── auth_providers (1:N)
                   ├──── user_settings (1:1)
                   ├──── push_tokens (1:N)
                   ├──── worship_log (1:N)
                   ├──── takbeer_log (1:N)
                   ├──── mushaf_progress (1:N)
                   ├──── fasting_log (1:N)
                   ├──── adhkar_log (1:N)
                   ├──── streak_history (1:1)
                   ├──── badges (1:N)
                   ├──── user_goals (1:N)
                   ├──── zakat_calc (1:N)
                   └──── group_members (M:N) ──── groups
```

---

## 5. Indexes الهامة

| الجدول | الـ Index | السبب |
|--------|-----------|-------|
| `worship_log` | `(user_id, log_date)` | أكثر query شيوعاً: ورد اليوم |
| `worship_log` | `(log_date)` | تقارير إجمالية |
| `group_members` | `(group_id, completion_pct DESC)` | ترتيب اللوحة |
| `groups` | `(invite_code)` WHERE `deleted_at IS NULL` | البحث بالكود |
| `takbeer_log` | `(user_id, log_date)` | عداد اليوم |
| `badges` | `(user_id, badge_id)` | فحص الوسام |
| `adhkar_log` | `(user_id, log_date)` | تقدم الأذكار |
| `streak_history` | `(user_id)` | الـ streak الحالي |

---

## 6. Audit Columns — القاعدة العامة

كل جدول يحمل:

```sql
created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
-- + trigger لتحديث updated_at تلقائياً عند كل UPDATE
```

الجداول التي تحتوي `deleted_at`:
- `users` — soft delete كامل
- `groups` — حذف المجموعة
- `user_goals` — إلغاء الهدف
- `group_members` — مغادرة المجموعة

---

## 7. Privacy & Security Considerations

| الاعتبار | التطبيق |
|---------|---------|
| **PII Minimization** | `display_name` اختياري، لا email إلزامي، `is_anonymous` متاح |
| **Worship Data** | بيانات العبادة مرتبطة بـ `user_id` — لا تُشارَك أبداً |
| **Groups Privacy** | فقط `{alias, pct, streak, badge}` في `group_members` — لا نوع العبادة |
| **Zakat Data** | حساسة — `user_id` فقط، لا اسم، لا تفاصيل مالية كاملة |
| **Child Data** | في الفيز اللاحق: إضافة `parent_user_id` في `users` وعزل البيانات |
| **AI Guard Log** | سجلات المشرف تبقى على الخادم فقط — لا في localStorage |
| **Row Level Security** | PostgreSQL RLS: كل مستخدم يرى بياناته فقط |
| **Encryption at Rest** | إعداد PostgreSQL encryption للبيانات الحساسة |

---

## 8. Redis — استخدامات مقترحة (اختياري)

| الاستخدام | الـ Key | TTL |
|-----------|---------|-----|
| JWT session cache | `session:{token_hash}` | 1 ساعة |
| Rate limiting للـ AI | `rate:{ip}` | 1 دقيقة |
| Cache لأوقات الصلاة | `prayer:{city}:{date}` | 24 ساعة |
| Cache لأسعار الذهب (Zakat) | `gold_price:{currency}` | 12 ساعة |
| Group leaderboard cache | `leaderboard:{group_id}` | 5 دقائق |

---

## 9. Object Storage — مستقبلاً

| الاستخدام | المجلد | الحالة |
|---------|--------|-------|
| صور ملفات المستخدمين | `avatars/{user_id}/` | مستقبلي |
| ملفات تصدير البيانات | `exports/{user_id}/` | مستقبلي |
| assets صوتية للأطفال | `audio/kids/` | مستقبلي |

---

## 10. Schema Version Management

```
db_migrations
├── id           SERIAL      PK
├── version      VARCHAR(20) NOT NULL UNIQUE
├── description  TEXT
├── applied_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
└── applied_by   VARCHAR(50)
```

---

*وثيقة تصميم — لا يُنفَّذ أي schema قبل مراجعة مصطفى وإقرار خطة المرحلة P1*
