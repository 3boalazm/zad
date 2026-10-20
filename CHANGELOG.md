# Changelog
All notable changes to the **ZAD** project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased] - 2026-10-20

> هذا القسم يغطي عملين: توسعة مكتبة المرئيات، وإصلاحات أوديت قسم «الصلاة والتقويم» (التفاصيل الكاملة في `PRAYER-CALENDAR-AUDIT-2026-10-20.md`).

### Added
- **Audit report `PRAYER-CALENDAR-AUDIT-2026-10-20.md`** — a detailed, line-referenced engineering audit of the Prayer & Calendar section (`prayers.html`, `qibla.html`, `hijri.html`, `js/calendar.js`), with 5 critical / 7 high / 17 medium findings, verified against the official aladhan `/v1/methods` table, plus a researched feature roadmap benchmarked against Muslim Pro, Athan and Pillars.
- Five additional calculation methods in the `prayers.html` method picker: 13 (Diyanet — Turkey), 23 (Jordan), 21 (Morocco), 19 (Algeria) and 18 (Tunisia), so users outside Egypt/the Gulf can match their local authority.
- An explicit offline notice in `prayers.html` (`.pt-offline-note` / `#pt-offline-note`) shown when times are served from the previous day's cache instead of silently displaying stale data.
- `rolloverToNewDay()` — an automatic midnight refresh in `prayers.html`, plus `showFromCacheWithWarning()` as the offline fallback path (P1-6).
- `_toLatinDigits()` exported on `window` from `js/calendar.js`: converts Arabic-Indic / Extended Arabic-Indic digits to Latin so `parseInt` can never silently return `NaN` again.
- **Video library expansion (`videos.html`)** — grew from 26 to 81 lecture/podcast cards:
  - All 64 entries from the curated source list are now present: 14 «إيه المشكلة؟» episodes, 7 «عالمغرب» story episodes, 11 «وعي» companion-series episodes, and 23 lectures from Osman Al-Khamis, Saleh Al-Maghamsi, Ahmad Al-Sayyid, Muhammad Hassan, Ibrahim Muhammad, Abd Al-Rahman Dhaker Al-Hashimi and others.
  - Two new filter categories with matching tabs: `sahaba` (🧭 سلسلة الصحابة) and `stories` (📖 قصص وعبر).
  - Seven new entries in the speaker/presenter dropdown plus a «عالمغرب» program option; hero counters updated to 81 lectures / 25 scholars & presenters / 330+ knowledge points.
  - Resolved direct YouTube ids for 10 of the previously link-only entries, verified against the channels' official RSS feeds (exact title match): «التشتت» `vsRocif9_bs`, «التوكل» `k6GCXw5Mdac`, «الدراسة» `8ViQ2SJHbNA`, and the whole «وعي» companion run 107–113 (`6Y_mldxwNqo`, `MM1xqf5KiEM`, `XQE91wxNAhU`, `V8iZ3uTnS70`, `XXUHOJ9ABrg`, `mFXG5EHJ6-s`) plus «اتباع الهوى» `R2NoSY1pLzg`. A further 5 were resolved from the channel's own official season playlists (title + channel shown by YouTube itself): «الطلاق» `W-x0KFbE4F4`, «الموضة» `Y1TqGwQgIn8`, «الصحاب/الصحبة والاختلاط» `8l6DuXZTUxg`, «حب الظهور/الرياء» `7Yazl_GXvSs`, «السوشيال ميديا» `jdEbCO0Ibwo`; these also carry their real `data-dur`. All 15 now show real thumbnails and play in the built-in player (41 direct cards total).
  - Remaining 40 entries keep the card anatomy but render a designed poster (gradient + watermark icon + bottom caption bar) with an «↗» external-open button instead of a play triangle, a `🔍 بحث` / `🌐 الموقع` badge, and a footer action opening the original source — no video id is invented. An explanatory note strip above the grid makes the distinction explicit.

### Changed
- **`prayers.html` calculation-method labels corrected against the official aladhan table** (P0-1): the values were cyclically shifted, so choosing "MWL" actually requested method 3 with 15° Fajr — roughly 20–25 minutes early in Egypt. Labels now read from the authoritative ids, and the mislabelled `value=1` option was removed.
- **Default calculation method unified on Egypt** (Egyptian General Authority of Survey, id 5) in both engines: `js/calendar.js` now defaults to `'Egypt'` and `CALC_METHODS` is reordered Egypt-first, matching `prayers.html`. Previously the two engines disagreed.
- **The chosen method is now persisted** in `zad_prayer_method_id`, restored on boot, and honoured by the dashboard — `index.html:485` no longer hardcodes `method=4` (Umm al-Qura), which contradicted `prayers.html` and shifted Isha by ~20 minutes for the same location.
- **Hijri occasion keys in `hijri.html` are now year-independent** (`"month-day"` instead of `"1447-12-9"`), so Arafah, both Eids, Ashura and Ramadan are detected in every year rather than only 1447 (P0-2). The table grew from 4 to 14 occasions, each carrying its own badge text.
- **`hijri.html` now respects the user's manual Hijri offset** (`zad_hijri_offset`) in both directions — `gregToHijri` applies `+offset`, `hijriToGreg` applies `−offset` — so the calendar no longer contradicts the topbar date (P0-4).
- The `hijri.html` legend entry «أيام العشر» was renamed «مناسبات إسلامية» to match what it actually marks.
- `js/calendar.js` clamps the Hijri offset to ±3 days in both the getter and setter (was unbounded — `-99` used to pass through), and the on-screen value reflects the clamped result.
- Network calls in `prayers.html` to aladhan and Nominatim now carry `AbortSignal.timeout(8000)` (P1-3); geocoding and times fetch run in parallel via `Promise.all`.
- `hourCycle: 'h23'` added to the time formatter in `js/calendar.js` to prevent a 24:00 / 12-hour surprise on some locales.
- The location-error message in `js/calendar.js` now distinguishes an adhan-js failure from a GPS failure, instead of always blaming GPS.
- Bumped the service-worker static cache to `zad-20261020-prayer-audit-r1` so installed PWAs pick up the changed pages and `js/calendar.min.js`.
- `shareVid(id, title, url)` now accepts an explicit URL so search/site-backed cards share their real source instead of a `youtu.be/<key>` link.
- `copyVidSummary()` reads `.vid-tile-title` (falling back to `.vid-title`) and prefers the card's `data-href`, fixing empty titles in copied summaries for the compact tile layout.

### Fixed
- **P0-5 (found while fixing, not in the original draft): the dashboard showed `NaN undefined NaN هـ` as today's Hijri date.** `js/calendar.js:32` built its formatter with locale `'ar-SA-u-ca-islamic-umalqura'`, which emits Arabic-Indic digits (`١٤٤٨`); `parseInt('١٤٤٨', 10)` returns `NaN` and `formatToParts` never throws, so the `catch` fallback never ran. The `NaN` was also written into `#hijri-full` / `.hd-hijri` / `[data-hijri]` and cached into `zad_hijri_today`. Locale changed to `…-nu-latn`, with the digit normaliser and an explicit fallback as defence in depth. Verified: `formatHijriDate()` → `9 جمادى الأولى 1448 هـ`.
- **P0-3: the "next prayer" countdown never advanced.** `prayers.html` bumped the target with `setDate(+1)` on the same prayer, so the hero kept showing yesterday's prayer for up to ~24 hours. The target is now recomputed from the current time.
- Pruned the month-table cache: `prayers.html` reads/writes `zad_month_table_${hy}_${hm}` (the live key) instead of the dead `zad_ten_days_table`, and keeps at most 3 tables (P1-4).
- `prayers.html` now writes the shared `zad_prayer_today` key with values stripped to `HH:MM`, which is what `js/ui/daily-hub.js` splits on — the dashboard's "next prayer" card and the prayer page can no longer disagree (P1-5).
- Removed stray `console.log` calls from `qibla.html` (3) and `js/calendar.js`, and converted the non-absolute-orientation-frame warning into a single, once-only toast (P2).
- Rebuilt `js/calendar.min.js` from source. The pages load the `.min` build and the repository has no minification step in `package.json`, so without this rebuild none of the `js/calendar.js` fixes would reach users.
- **Withdrawn from the audit:** the reported "P1-8 — `getCurrentPosition` called without options" was wrong; `prayers.html:677` already passes `{ enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }`. The finding came from truncated code extraction during the audit and has been struck from the report.
- Bumped the service-worker static cache to `zad-20261020-video-library` so installed PWAs drop the stale runtime-cached `videos.html` and receive the expanded library.

- Comprehensive engineering documentation suite in `docs/`:
  - `docs/engineering-audit.md`: System map, component inventory, data flows, and verified defect log.
  - `docs/architecture.md`: Complete system architecture, domain models, and PWA offline state management.
  - `docs/security-review.md`: STRIDE threat model, session cookie security, and parameterization audit.
  - `docs/testing-and-validation.md`: Exact commands, outputs, and 14/14 acceptance checklist.
  - `docs/operations.md`: SRE deployment, migration execution, health checks, and backup/restore runbook.
  - Root `README.md`: Clarified repository identity as an Islamic Offline-First PWA + Express API.
- Implemented `POST /api/v1/auth/register` route in `api/src/auth/auth.router.ts` with input validation, duplicate email detection, atomic user creation, and argon2id password hashing.
- Added test coverage in `api/src/tests/auth.test.ts` for registration validation and database availability boundaries.
- Added `scripts/test-mobile-navigation.cjs` regression tests for hamburger state, fixed mobile-header rules, and reduced-motion safety.
- Added `viewport-fit=cover` to meta viewport tags across `demo.html`, `diagnostics.html`, `duas.html`, `register.html`, `sync.html`, `worship.html`, and `zad_al_ashr.html`.
- Implemented keyboard accessibility (`tabindex="0"`, `Space`, and `Enter` handling) for the central Tasbeeh counter ring in `takbeer.html`.
- Added focus trapping and previous focus restoration on open/close in `command-palette.js`.

### Changed
- **Content Generalization & Year-Round Spiritual Companion:**
  - Generalized application branding, slogans, navigation labels, and meta descriptions across 58 HTML pages and JS components from Dhul-Hijjah-only to year-round worship companion ("زاد — رفيقك في العبادة والخير" / "رفيقك اليومي في الطاعات").
  - Updated navigation items: "الصدقة والبر" (was "صدقة العشر"), "حصاد العبادات" (was "حصاد العشر"), "إحصاء العبادات" (was "إحصاء العشر"), "الورد القرآني" (was "مصحف العشر"), and "المرئيات والمحاضرات" (was "محاضرات العشر").
  - Retained dedicated seasonal sections (`fadael.html`, `arafah.html`, `odhiya.html`, `manasik.html`) as specialized guides within the broader year-round application.
  - Synchronized localization dictionaries (`lang.js`, `lang.min.js`), menu bundles (`menu.js`, `menu.min.js`), search command palette (`command-palette.js`, `command-palette.min.js`), PWA manifest (`manifest.json`), and AI agent index (`llms.txt`).

### Fixed
- **Mobile Header Navigation Disappearing:** Keep the hamburger/header pinned at the top on mobile, preserve its visibility while the drawer opens, account for safe-area insets, and expose the drawer state with `aria-expanded`/`aria-controls`.
- **Reduced-Motion Navigation Freeze:** Avoid pausing GSAP's global timeline and skip shared entrance animations when reduced motion is requested, preventing the home/sidebar navigation from remaining transparent.
- **Service Worker Asset Refresh:** Bump the static cache version so installed PWAs replace stale navigation bundles.
- **Mobile Navigation Dock Collision:** Resolved collision between the mobile floating topbar, `.fab-ai`, and `#zad-pwa-fab` by incorporating `env(safe-area-inset-bottom, 0px)` and raising secondary widgets to `bottom: calc(84px + safe-area)`.
- **Cumulative Layout Shift (CLS):** Pre-rendered the mobile bottom floating dock directly in `css/style.css` at CSS parse time rather than waiting for dynamic injection in `menu.js`.
- **Global Share Object Overwrite:** Fixed `window.ZadShare` collision where `menu.js` erased `js/share-button.js` methods, breaking the share sheet cancel button.
- **Accordion Duel & Double Arrows:** Added pre-flight check in `js/nav-accordion.js` to prevent duplicate arrow injections when `menu.js v3` accordion is active.
- **Redundant Tasbeeh Widget:** Suppressed the floating `.zad-tkbr-fab` widget when navigating to `takbeer.html`.
- **Contrast & Eye Strain:**
  - Upgraded OLED `--muted` color token from `rgba(255,255,255,.4)` to `rgba(255,255,255,.68)`, achieving > 6.5:1 contrast ratio.
  - Softened Quran night-mode text color in `mushaf-quran.html` from neon yellow (`#ffe54d`) to warm ivory (`#ede6d6`).
  - Restyled `.hamburger` button in dark modes from an inverted white box to a subtle translucent glass button with a 44x44px touch target.
- **Database Connection Pool Starvation:** Refactored `api/src/sync/sync.router.ts` to acquire a single database connection per sync batch rather than calling `pool.connect()` inside the change iteration loop.
- **Idempotency Key Namespace Isolation:** Updated `api/db/migrations/004_sync.sql` and backend routers to use a composite `PRIMARY KEY (user_id, key)`, preventing cross-user idempotency collisions.
- **Session Cookie Revocation on Transient Error:** Updated `api/src/middleware/requireAuth.ts` to return `503 Service Unavailable` with `Retry-After: 5` on database connection timeouts instead of clearing valid user session cookies.
- **Dexie Schema Error in Zakat History:** Added missing `ts` index to Dexie schema version 3 in `js/storage.js` and added an in-memory fallback sort to `getZakatHistory()`.
- **Quranic Speech Normalization:** Enhanced `tasmee.html` normalization regex to strip Dagger Alif (`\u0670`) and recitation marks (`\u06DF-\u06ED`), and expanded `TS_SURAHS` to cover all 114 surahs.
- **GPS Logic Synchronization:** Synchronized prayer-key syncing logic between `gps-fix.js` and `js/gps-fix.js` and regenerated minified bundles.

### Changed
- Recompiled and verified all minified client assets: `menu.min.js`, `command-palette.min.js`, `js/nav-accordion.min.js`, `js/pwa-install-fab.min.js`, `js/share-button.min.js`, `js/storage.min.js`, and `css/style.min.css`.
