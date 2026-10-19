# ZAD — Engineering Audit Report
**Repository:** `3boalazm/zad`  
**Date:** October 2026  
**Auditor:** Senior Staff Engineering & Architecture Team  
**Scope:** Source Code, Architecture, Dependencies, Data Layers, Frontend/Backend, UX, Security, and Reliability.

---

## 1. Verified Project Reality vs External Assumptions

### 1.1 The Repository Reality
A query from an external LLM session had preliminarily suggested that "ZAD" might be an "OpenAI-compatible LLM Gateway / model router with fallback."  
**Empirical Code Verification:**
- An exhaustive audit of the entire filesystem (`/home/user/zad`) confirms that `3boalazm/zad` is **NOT an OpenAI LLM Gateway**.
- **What ZAD actually is:** ZAD is an **Offline-First Islamic Spiritual Progressive Web App (PWA)** ("زاد — رفيقك في أفضل أيام الدنيا"), focused on the first ten days of Dhul-Hijjah, Arafah, and year-round worship.
- **Frontend:** 64 static HTML pages, modular vanilla JavaScript, CSS custom properties design system, Dexie.js (IndexedDB), and Service Worker (`sw.js`).
- **Backend:** Node.js/Express 4 + TypeScript 5 in `api/` providing session authentication, worship tracking (`/api/v1/worship`), and multi-device synchronization (`/api/v1/sync`) backed by PostgreSQL 16.
- **AI Component:** ZAD contains a localized spiritual reflection assistant (`ai.html`), guarded by a Sharia safety filter (`js/ai-guard.js`) preventing hallucinated fatwas, and connected to an external proxy endpoint. It is not an LLM model router.

---

## 2. System Inventory & Architecture Map

### 2.1 Component Breakdown

| Layer | Component | Technologies | Primary Files / Entry Points | Responsibility |
|---|---|---|---|---|
| **PWA Core** | Service Worker | Cache API, Web Workers | `sw.js`, `manifest.json` | Caches static assets, delivers offline-first reliability. |
| **Client UI** | Application Shell | HTML5, CSS3, Vanilla JS | `index.html`, `css/style.css`, `menu.js`, `js/app.js` | Core user interface, navigation dock, responsive themes. |
| **Storage** | Client Database | IndexedDB via Dexie.js, LocalStorage | `js/storage.js`, `localStorage` | Stores worship logs, streaks, bookmarks, custom adhkar, zakat history. |
| **Worship Tools** | Prayers & Qibla | Mathematical / Astro algorithms, GeoLocation | `prayers.html`, `qibla.html`, `gps-fix.js` | Calculates 5 daily prayers, Qibla compass bearing. |
| **Quran & Dhikr** | Mushaf & Recitation | Web Speech API, Audio APIs | `mushaf-quran.html`, `tasmee.html`, `takbeer.html`, `adhkar.html` | Quran reader, speech-to-text recitation tester, tasbeeh counters. |
| **Backend API** | HTTP Server | Node.js ≥ 18, Express 4, TypeScript 5 | `api/src/server.ts`, `api/src/app.ts` | REST API for authentication and worship sync. |
| **Database** | Persistence Layer | PostgreSQL 16, `pg` Pool | `api/src/db/pool.ts`, `api/db/migrations/` | Relational tables for users, sessions, worship logs, sync sequences. |
| **Security Layer** | Auth & Session | `argon2id`, `crypto` SHA-256 | `api/src/auth/`, `api/src/middleware/requireAuth.ts` | Password hashing, opaque token generation, HttpOnly cookie validation. |

---

## 3. Data Flows & Execution Traces

### 3.1 Local-First Worship Logging Flow
```
User Action (e.g. check Fajr prayer in barnamaj.html)
   │
   ├──▶ DOM Event Handler (js/app.js)
   │       │
   │       ├──▶ Write to localStorage ('zad_v2')
   │       └──▶ Write to Dexie.js IndexedDB ('worship_logs' table in js/storage.js)
   │
   └──▶ Update UI (Progress Ring, Stats, Daily Streak)
           │
           └──▶ [Optional Async Sync] Trigger api-client.js -> POST /api/v1/worship/logs
```

### 3.2 Cloud Sync & Concurrency Flow (`/api/v1/sync/push`)
```
Client (sync.html / api-client.js)
   │  POST /api/v1/sync/push { changes: [...], last_server_seq: N }
   ▼
Express Router (api/src/sync/sync.router.ts)
   │
   ├──▶ requireAuth middleware: validates 'zad_session' cookie against users_auth
   ├──▶ Acquire pg connection from Pool
   ├──▶ BEGIN Transaction
   │       │
   │       ├──▶ pg_advisory_xact_lock(hashtext(userId))  <-- Serializes user sync
   │       │
   │       ├──▶ For each item in changes:
   │       │       SAVEPOINT item_sp
   │       │       Check idempotency_keys (scoped to user_id, key)
   │       │       Insert/Update table (e.g. worship_logs)
   │       │       RELEASE item_sp
   │       │
   │       └──▶ Increment user sync sequence, update sync_devices
   │
   ├──▶ COMMIT Transaction
   └──▶ Return 200 { server_seq, applied_count }
```

---

## 4. Verified Defects & Remediation Log (Code Evidence)

During our end-to-end audit, several critical defects were uncovered and resolved:

### Finding 1: Unmounted Registration Route in Backend
- **Location:** `api/src/app.ts` vs `api/src/auth/auth.router.ts`.
- **Evidence:** `api/src/app.ts` explicitly mounts `authRouter` under `/api/v1/auth`. `register.html` makes POST requests to `/api/v1/auth/register`. However, `auth.router.ts` only mounted `POST /login` and `GET /me`. `POST /register` returned a 404 Not Found error.
- **Remediation:** Implemented `POST /register` with validation (email, password ≥ 8 chars, name), password hashing via `argon2id`, atomic user creation across `users` and `users_auth`, session cookie dispatch, and 409 Conflict handling on duplicate emails.

### Finding 2: False Session Revocation on Database Interruption
- **Location:** `api/src/middleware/requireAuth.ts` (line 34).
- **Evidence:** The catch block in `requireAuth` caught all query errors and treated them as an invalid session, clearing the user's `zad_session` cookie and redirecting to login whenever PostgreSQL experienced a transient network glitch or connection timeout.
- **Remediation:** Differentiated database exceptions from invalid sessions: when `getUserBySessionToken` throws a database exception, the middleware returns `503 Service Unavailable` with `Retry-After: 5`, preserving the user's cookie.

### Finding 3: Global Idempotency Key Namespace Collision
- **Location:** `api/db/migrations/004_sync.sql` (line 32) & `api/src/worship/worship.router.ts`.
- **Evidence:** `idempotency_keys` defined `key TEXT PRIMARY KEY` globally. A generic key generated by User A (e.g., `pray-2026-10-19`) collided with User B, causing 409 errors or leaking User A's response body to User B.
- **Remediation:** Altered table to composite `PRIMARY KEY (user_id, key)` and updated all conflict targets in `worship.router.ts` and `sync.router.ts` to `ON CONFLICT (user_id, key)`.

### Finding 4: Database Pool Starvation in Sync Batch Loop
- **Location:** `api/src/sync/sync.router.ts` (lines 174-245).
- **Evidence:** `pool.connect()` was called inside the iteration loop for each incoming change (up to 50 times per request), rapidly exhausting the connection pool under concurrent multi-device sync requests.
- **Remediation:** Refactored the handler to acquire a single database client per batch request, enclose the batch in a transaction with per-item `SAVEPOINT`, and release the client in a `finally` block.

### Finding 5: Dexie Schema Error Crashing Zakat History
- **Location:** `js/storage.js` (lines 72, 373).
- **Evidence:** Schema version 3 indexed `zakatCalc: '++id, date'` without `ts`. `getZakatHistory()` called `db.zakatCalc.orderBy('ts')`, throwing `Dexie.SchemaError: KeyPath ts is not indexed` and terminating page scripts.
- **Remediation:** Upgraded schema to index `ts` and added an in-memory fallback sort `(a, b) => (b.ts || 0) - (a.ts || 0)`.

### Finding 6: Recitation Orthography Normalization Failure
- **Location:** `tasmee.html` (lines 654-670).
- **Evidence:** The speech matching regex stripped vowels but missed Dagger Alif (`\u0670`) and recitation annotations (`\u06DF-\u06ED`). As a result, Uthmani Quranic text (`الرَّحْمَٰنِ`) never matched speech engine transcripts (`الرحمن`). Additionally, `TS_SURAHS` omitted chapters 31 through 66 and 70 through 77.
- **Remediation:** Normalization was expanded to strip dagger alif and all Quranic diacritics. All 114 surahs were populated into `TS_SURAHS`.

### Finding 7: Global Share Namespace Overwrite
- **Location:** `menu.js` (line 1110) vs `js/share-button.js` (line 184).
- **Evidence:** `menu.js` executed `window.ZadShare = { text, png }`, erasing the `ZadShare` instance instantiated by `js/share-button.js`. When users clicked "Cancel" on the share sheet, `window.ZadShare.close()` threw `TypeError: window.ZadShare.close is not a function`, locking the UI behind a backdrop overlay.
- **Remediation:** Replaced object replacement with `Object.assign(window.ZadShare || {}, ...)`.

### Finding 8: Mobile Dock Collision & Safe Area Violations
- **Location:** `menu.js`, `css/style.css`, `js/pwa-install-fab.js`.
- **Evidence:** On mobile (`max-width: 768px`), `.topbar` floated at `bottom: 14px`, overlapping iOS home gestures and trapping `.fab-ai` and `#zad-pwa-fab` underneath it.
- **Remediation:** Added `env(safe-area-inset-bottom, 0px)` across all floating elements, elevated floating action buttons to `calc(84px + safe-area)`, and relocated mobile dock definitions to CSS parse-time to eliminate Cumulative Layout Shift (CLS).

---

## 5. Unverifiable Assumptions & Production Boundary

1. **Production Database Instance:** The production PostgreSQL credentials, replication topology, and backup schedules are hosted outside this environment. Local verification was conducted against mock pool states and unit suites.
2. **Push Notification Keys:** VAPID keys in `firebase-push.js` remain template placeholders awaiting production provisioning.
3. **AI Proxy Integration:** The `/api/gemini` proxy route referenced in `js/ai-guard.js` is delegated to an external Vercel serverless function (`GROQ_API_KEY` / `GEMINI_API_KEY`) as noted in `.env.example`.
