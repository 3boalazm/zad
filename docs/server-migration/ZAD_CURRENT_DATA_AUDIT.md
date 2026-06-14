# ZAD — Current Data Layer Audit
**التاريخ:** يونيو 2026  
**المحلِّل:** تحليل معماري بناءً على فحص الكود الفعلي  
**الإصدار:** المصدر الرسمي على `github.com/3boalazm/zadullashr.git`

---

## 1. خريطة طبقة التخزين الحالية

```
┌──────────────────────────────────────────────────────┐
│               ZAD — Static PWA                       │
│                                                      │
│  ┌─────────────────┐   ┌────────────────────────┐   │
│  │  localStorage   │   │  IndexedDB (Dexie.js)  │   │
│  │  (Primary now)  │   │  (طبقة ثانية — مخطط)   │   │
│  └────────┬────────┘   └──────────┬─────────────┘   │
│           │                       │                  │
│  ┌────────▼────────────────────────▼─────────────┐   │
│  │            app.js STATE / ZadState            │   │
│  │            (dual-owner — fixed in P0)         │   │
│  └───────────────────────────────────────────────┘   │
│                                                      │
│  ┌──────────────┐  ┌─────────────┐  ┌────────────┐  │
│  │Firebase RTDB │  │Firebase Auth│  │Firebase FCM│  │
│  │(groups/users)│  │(optional)   │  │(unconfigured│  │
│  └──────────────┘  └─────────────┘  └────────────┘  │
│                                                      │
│  ┌──────────────┐  ┌─────────────┐                  │
│  │Groq LLM API  │  │Tafsir MCP   │                  │
│  │(via /api/    │  │(mcp.tafsir  │                  │
│  │ gemini)      │  │.net/mcp)    │                  │
│  └──────────────┘  └─────────────┘                  │
│                                                      │
│  ┌─────────────────────────────────────────────────┐ │
│  │ Hardcoded JS Data Files (adhkar, heroes, hasna) │ │
│  └─────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

---

## 2. جدول Audit الكامل لطبقة البيانات

### 2A. المفتاح الرئيسي: `zad_v2` (localStorage)

| Feature | Current Storage | Files Involved | Data Shape | Risk | Server Migration Priority |
|---------|----------------|----------------|------------|------|--------------------------|
| **Theme (الثيم)** | `localStorage['zad_v2'].theme` | `app.js`, `state-manager.js`, كل صفحة HTML | `string: 'light'\|'dark'\|'oled'` | منخفض — لا يفقد ترتيب العمل | P5 — مع Profile |
| **يوم العشر الحالي** | `localStorage['zad_v2'].day` | `app.js` → `checkDayReset()` | `string: 'YYYY-MM-DD'` | متوسط — reset logic مرتبط به | P3 — مع Progress |
| **الورد اليومي (worship)** | `localStorage['zad_v2'].worship` | `app.js`, `worship.html` | `{fajr:bool, zuhr:bool, asr:bool, maghrib:bool, isha:bool, rawatib:bool, duha:bool, qiyam:bool, morning_dhikr:bool, evening_dhikr:bool, takbeer_100:bool, tawbah:bool}` | **عالٍ** — يُحذف عند day reset يومياً | P3 |
| **الصيام (fasting)** | `localStorage['zad_v2'].fasting` | `app.js` | `{1:bool, 2:bool, ..., 9:bool}` — رقم اليوم من ذي الحجة | متوسط | P3 |
| **التكبير** | `localStorage['zad_v2'].takbeer` | `app.js`, `takbeer.html` | `{count:int, total:int, sessions:int, phrase:str, target:33}` | متوسط | P3 |
| **المصحف / الختمة** | `localStorage['zad_v2'].mushaf` | `app.js`, `mushaf.html` | `{juz:int(0-30), plan:'daily-juz'\|'by-pages'}` | متوسط | P3 |
| **الأوسمة (badges)** | `localStorage['zad_v2'].badges` | `app.js`, `badges.html` | `Array<string>` — IDs الأوسمة | متوسط | P3 |
| **السلسلة (streak)** | `localStorage['zad_v2'].streak` | `app.js`, `state-manager.js` | `int` | **عالٍ** — يُفقد عند مسح البيانات | P3 |
| **الأذكار (adhkar)** | `localStorage['zad_v2'].adhkar` | `app.js`, `adhkar.html` | `{[sectionKey]: {count:int, done:bool}}` | متوسط | P3 |
| **تقدم الأذكار** | `localStorage['zad_v2'].adhkarProgress` | `state-manager.js` | `{[sectionId]: {completed:bool, ts:number}}` | متوسط | P3 |
| **عرفة milestones** | `localStorage['zad_v2'].arafah` | `arafah.html` | `{milestones:{}, dhikrCount:int, khushooMode:bool, bonus:{}}` | منخفض | P4 |
| **الأهداف الشخصية** | `IndexedDB (ZadStore) → state['userGoals']` | `goals-module.js` | `Array<{id, icon, title, target, unit, metric, addedAt, current}>` | متوسط | P3 |
| **تقدم القرآن** | `localStorage['zad_v2'].quranProgress` | `state-manager.js`, `mushaf-quran.html` | `{page:int, juz:int, surah:int, lastRead:str\|null}` | متوسط | P3 |
| **التكبير العشر (takbeer7)** | `localStorage['zad_v2'].takbeer7` | `app.js` | `{[key]:int}` | منخفض | P4 |
| **المجموعات (groups — محلي)** | `localStorage['zad_v2'].groups` | `groups.js` (LocalAdapter) | `{me:{id:uuid, alias:str}, list:[{id,name,code,members:[]}]}` | **عالٍ** — يُفقد عند مسح البيانات | P4 |

---

### 2B. مفاتيح localStorage المستقلة (Satellite Keys)

| المفتاح | الوصف | Files | Risk |
|---------|-------|-------|------|
| `zad_profile` | الملف الشخصي `{name, avatar, goals[], city}` | `profile.html`, `firebase-auth.js` | **عالٍ** |
| `zad_profile_skipped` | هل تخطّى المستخدم إعداد الملف | `profile.html` | منخفض |
| `zad_font_size` | حجم الخط (`small/medium/large`) | كل صفحة HTML (inline script) | منخفض |
| `zad_sound_on` | حالة الصوت | `audio-manager.js` | منخفض |
| `zad_clock` | تفضيل عرض الساعة | UI | منخفض |
| `zad_city`, `zad_lat`, `zad_lng` | آخر موقع جغرافي | `prayers.html`, `gps-fix.js` | منخفض |
| `zad_saved_location`, `zad_last_location` | موقع محفوظ | `prayers.html` | منخفض |
| `zad_prayer_cache`, `zad_prayer_today`, `zad_prayer_today_date` | كاش مواقيت الصلاة | `prayers.html`, `calendar.js` | منخفض |
| `zad_hijri_today` | التاريخ الهجري المحسوب | `calendar.js` | منخفض |
| `zad_khatma_plan` | خطة الختمة المختارة | `mushaf-quran.html` | منخفض |
| `zad_challenges` | تحديات العشر | `challenges.html` | متوسط |
| `zad_badges_asma` | أوسمة أسماء الله | `asma.html` | متوسط |
| `zad_ai_guard_log`, `zad_ai_reports` | سجل AI للمشرف | `ai-guard.js` | **حساس — يحتاج نقل للخادم** |
| `zad_mfont` | حجم خط المصحف | `mushaf-quran.html` | منخفض |
| `zad_lang` | لغة التطبيق | `lang.js` | منخفض |
| `zad_dev` | وضع المطور | `developer.html` | منخفض |
| `zad_float_tasbih_pos` | موضع عداد التسبيح العائم | `float-tasbih.js` | منخفض |
| `zad_sync_enabled` | حالة تفعيل المزامنة السحابية | `sync-module.js` | منخفض |
| `zad_vapid` | VAPID key للإشعارات | `firebase-push.js` | **أمان — يجب نقله للخادم** |
| `zad_ten_days_method`, `zad_ten_days_table` | بيانات جدول العشر | `taqweem.html` | منخفض |
| `zad_month_table_method` | طريقة حساب التقويم | `calendar.js` | منخفض |
| `zadAlAshr` | بيانات زاد الأشر القديم | legacy | منخفض |
| `zad_state` | نسخة قديمة من الحالة | legacy | منخفض |
| `zad_has_data` | flag وجود بيانات | app init | منخفض |
| `pl_likes`, `pl_view` | إعجابات وعرض قائمة التشغيل | `playlist.html` | منخفض |
| `ghars_takbeer` | تكبير صفحة الغرس | `ghars.html` | منخفض |
| `zad_arafah_tab` | تبويب عرفة الأخير | `arafah.html` | منخفض |
| `zad_custom_from`, `zad_custom_to` | نطاق مخصص للتقويم | `calendar.js` | منخفض |

---

### 2C. sessionStorage

| المفتاح | الوصف | Files | ملاحظة |
|---------|-------|-------|--------|
| `zad_pg_grace` | فترة السماح لبوابة ولي الأمر (60 ثانية) | `parent-gate.js` | مقصود أن يُمحى عند إغلاق التبويب |
| `zad_cloud_groups` | كاش مؤقت للمجموعات من Firebase | `groups.js` / `groups.firebase.js` | يُمحى عند إغلاق التبويب |
| `zad_float_tasbih` | حالة عداد التسبيح العائم للجلسة | `float-tasbih.js` | مقصود |

---

### 2D. IndexedDB (Dexie.js) — `ZadDatabase` (الإصدار 3)

| الجدول | الوصف | keyPath | الحقول المفهرسة | الحالة |
|--------|-------|---------|----------------|--------|
| `state` | blob حالة عامة (key/value) | `key` | — | نشط |
| `worshipLog` | سجل العبادات اليومية | `++id` | `date, key` | نشط |
| `takbeer` | عداد التكبير اليومي | `date` | — | نشط |
| `mushaf` | تقدم الختمة | `date` | — | نشط |
| `fasting` | سجل الصيام | `day` | — | نشط |
| `badges` | الأوسمة | `id` | — | نشط |
| `settings` | إعدادات المستخدم | `key` | — | نشط |
| `history` | سجل الأداء التاريخي | `date` | — | نشط |
| `tasbih` | أذكار التسبيح | `id` | — | نشط (v2) |
| `adhkar` | سجل الأذكار | `++id` | `sectionId, date` | نشط (v2) |
| `zakatCalc` | حسابات الزكاة | `++id` | `date` | نشط (v3) |
| `profile` | الملف الشخصي | `key` | — | نشط (v3) |

**ملاحظة مهمة:** Migration من localStorage إلى IndexedDB موجود في `storage.js` → `migrateFromLocalStorage()` لكنه لا يُشغَّل تلقائياً في كل صفحة — يُشغَّل فقط عند `DOMContentLoaded` في الصفحات التي تحمل `storage.js`.

---

### 2E. Firebase Auth

| Feature | Files | الحالة | Risk |
|---------|-------|--------|------|
| Google Sign-In (OAuth Popup) | `firebase-auth.js` | موجود — اختياري | **عالٍ** — dependency خارجي |
| Email/Password Sign-Up + Verify | `firebase-auth.js` | موجود | **عالٍ** |
| Auth State Observer (`onAuthStateChanged`) | `firebase-auth.js` → `ZadAuth` | موجود | متوسط |
| Local Fallback (بدون تسجيل) | `groups.js` LocalAdapter | موجود | منخفض |

---

### 2F. Firebase Realtime Database (RTDB)

| Path | الوصف | Files | الحالة | Risk |
|------|-------|-------|--------|------|
| `users/{uid}` | بيانات المزامنة (streak, takbeer, worship, mushaf) | `firebase-auth.js` → `syncLocalToCloud()` | موجود — يُستدعى اختيارياً | متوسط |
| `groups/{gid}` | بيانات المجموعة (name, code, createdBy, members) | `groups.firebase.js` | **نشط** — Backend الوحيد للمجموعات | **عالٍ** |
| `groups/{gid}/members/{uid}` | `{alias, pct, streak, badge, updatedAt}` | `groups.firebase.js` | **نشط** | **عالٍ** |
| `codes/{CODE}` | ربط الكود بـ gid | `groups.firebase.js` | نشط | متوسط |
| `userGroups/{uid}/{gid}` | فهرس المجموعات لكل مستخدم | `groups.firebase.js` | نشط | متوسط |
| `pushTokens/{uid\|anon}` | FCM push tokens | `firebase-push.js` | **غير مكتمل** — VAPID_KEY = 'REPLACE_WITH...' | **عالٍ** |

---

### 2G. Firebase Cloud Messaging (FCM)

| الوضع الحالي | Risk |
|-------------|------|
| `VAPID_KEY = 'REPLACE_WITH_YOUR_VAPID_PUBLIC_KEY'` — غير مضبوط | **حرج** — أي استدعاء لـ `ZadPush.enable()` سيفشل |
| `firebase-messaging-sw.js` موجود لكن لم يُراجَع | **عالٍ** |
| التوكنات تُحفظ في RTDB تحت `pushTokens/` | متوسط |

---

### 2H. AI / خارجي

| Service | Endpoint | Files | Secret Location | Risk |
|---------|----------|-------|----------------|------|
| **Groq LLM** (llama-3.3-70b) | `POST /api/gemini` (Vercel Edge Function) | `js/gemini.js` | `process.env.GROQ_API_KEY` على Vercel — **✅ آمن** | منخفض — Secret على الخادم |
| **Tafsir MCP** | `https://mcp.tafsir.net/mcp` | `js/gemini.js` | لا يحتاج key | منخفض |
| **Aladhan API** (مواقيت الصلاة) | خارجي | `prayers.html`, `calendar.js` | لا يحتاج key | منخفض |
| **Vercel Analytics** | `/_vercel/insights/script.js` | كل صفحة | — | منخفض |
| **Google Fonts** | CDN | كل صفحة | — | منخفض |
| **Dexie Cloud** | `SYNC_CONFIG.databaseUrl = ''` | `sync-module.js` | **فارغ — غير مضبوط** | متوسط |

---

### 2I. Hardcoded Data (JS Files)

| الملف | الوصف | الحجم التقريبي | Migration Priority |
|-------|-------|----------------|-------------------|
| `js/adhkar-database.js` | قاعدة أذكار الصباح والمساء | كبير | محتوى ثابت — يبقى محلياً |
| `js/adhkar-database-extended.js` | أذكار موسّعة | كبير | محتوى ثابت |
| `js/adhkar-complete.js` | أذكار كاملة | كبير | محتوى ثابت |
| `js/adhkar-sections.js` | تقسيم أقسام الأذكار | متوسط | محتوى ثابت |
| `js/adhkar-content-sections.js` | محتوى الأقسام | متوسط | محتوى ثابت |
| `js/hasn-part1.js`, `js/hasn-part2.js` | حصن المسلم | كبير | محتوى ثابت |
| `heroes-data.js` | بيانات قصص أبطال الأطفال | صغير | محتوى ثابت |

**قرار معماري:** هذه الملفات محتوى إسلامي ثابت — لا يوجد مبرر لنقلها لقاعدة بيانات في الفيزات الأولى. يمكن نقلها لاحقاً كـ Content API للتسهيل على المحررين.

---

## 3. مخاطر طبقة البيانات الحالية — ملخص

| المخاطرة | الوصف | الخطورة |
|---------|-------|--------|
| **Dual-Owner State** | `STATE` في `app.js` و `_state` في `state-manager.js` (تم التعامل معه جزئياً في P0) | ✅ يُعالَج |
| **FCM غير مكتمل** | VAPID_KEY غير مضبوط — Push Notifications لا تعمل | 🔴 حرج |
| **Dexie Cloud فارغ** | المزامنة السحابية غير مضبوطة رغم وجود UI لها | 🟡 متوسط |
| **AI Key في الـ Backend** | GROQ_API_KEY محفوظ في Vercel env — آمن | ✅ جيد |
| **بيانات المجموعات على Firebase فقط** | `group-board.html` يقرأ من localStorage القديم لا من Firebase | 🔴 خلل |
| **بوابة ولي الأمر — client-only** | التحقق فقط في المتصفح — يمكن تجاوزه | 🟡 متوسط |
| **40+ مفتاح localStorage** | تشتت البيانات — صعوبة الصيانة | 🟡 متوسط |
| **لا يوجد user identifier ثابت** | المستخدم بدون حساب = لا sync ممكن | 🟡 متوسط |
| **Migration غير مكتملة** | `migrateFromLocalStorage()` لا تُشغَّل في كل الصفحات | 🟡 متوسط |

---

*آخر تحديث: يونيو 2026 — استناداً إلى فحص مباشر للكود المصدري*
