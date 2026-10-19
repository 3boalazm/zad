# ZAD — System Architecture & Design
**Document Version:** 2.0  
**Status:** Verified & Active  
**Target Platform:** Web (Progressive Web App) + Backend API (Node.js/TypeScript)

---

## 1. Architectural Philosophy

ZAD ("زاد") is built upon four guiding architectural principles:
1. **Offline-First Resilience:** A spiritual user tracking their worship or reciting Quran in a mosque or during Hajj travel must never experience data loss or frozen screens due to poor mobile network connectivity. Core features execute entirely client-side.
2. **Calm & Non-Intrusive UX:** Zero ads, zero disruptive popups, zero intrusive push notifications. Visuals emphasize focus, dark/OLED battery savings, and accessibility.
3. **Sharia Safety & Integrity:** AI interactions are strictly gated to spiritual reflection (*Tadabbur*). Inquiries regarding *Fatwa*, *Fiqh*, or legal rulings are intercepted and redirected to authorized scholarly resources.
4. **Data Isolation & Concurrency Safety:** Multi-device synchronization guarantees data integrity via idempotent batch processing, sequence tracking, and advisory locking.

---

## 2. High-Level Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (PWA)                              │
│                                                                        │
│   ┌────────────────┐   ┌────────────────┐   ┌──────────────────────┐  │
│   │  DOM / Views   │   │  UI Components │   │   Theme Engine       │  │
│   │ (64 HTML files)│   │  (Dock, Menu,  │   │  (Light, Dark, OLED, │  │
│   │                │   │   Fab, Modals) │   │   WCAG AA Contrast)  │  │
│   └───────┬────────┘   └────────┬───────┘   └──────────┬───────────┘  │
│           │                     │                      │              │
│   ┌───────▼─────────────────────▼──────────────────────▼───────────┐  │
│   │                   Service Worker (sw.js)                       │  │
│   │        - Cache-First for static assets (HTML/CSS/JS)           │  │
│   │        - Offline fallback page                                 │  │
│   └─────────────────────────────┬──────────────────────────────────┘  │
│                                 │                                     │
│   ┌─────────────────────────────▼──────────────────────────────────┐  │
│   │                   Client Storage Layer                         │  │
│   │  - localStorage: Theme, audio preferences, transient flags     │  │
│   │  - Dexie.js (IndexedDB): worship_logs, zakatCalc, adhkar_state │  │
│   └─────────────────────────────┬──────────────────────────────────┘  │
└─────────────────────────────────┼─────────────────────────────────────┘
                                  │ HTTPS (Optional Sync / Auth)
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        BACKEND API (Node/TS)                           │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐  │
│   │                      Express 4 Application                     │  │
│   │  - Middleware: Request ID, JSON parser, CookieParser, Logger   │  │
│   │  - requireAuth: HttpOnly 'zad_session' validation              │  │
│   └──────┬──────────────────────┬──────────────────────┬───────────┘  │
│          │                      │                      │              │
│   ┌──────▼───────┐       ┌──────▼───────┐       ┌──────▼───────────┐  │
│   │ Auth Router  │       │Worship Router│       │   Sync Router    │  │
│   │- /login      │       │- /logs (GET) │       │- /push (batch)   │  │
│   │- /register   │       │- /logs (POST)│       │- /pull (sequence)│  │
│   │- /me         │       │              │       │                  │  │
│   └──────┬───────┘       └──────┬───────┘       └──────┬───────────┘  │
│          │                      │                      │              │
│   ┌──────▼──────────────────────▼──────────────────────▼───────────┐  │
│   │               Database Pool & Transaction Layer                │  │
│   │  - pg.Pool (Max 20 connections)                                │  │
│   │  - pg_advisory_xact_lock(hashtext(user_id))                    │  │
│   │  - Idempotency isolation: (user_id, key)                       │  │
│   └─────────────────────────────┬──────────────────────────────────┘  │
└─────────────────────────────────┼─────────────────────────────────────┘
                                  │ TCP Socket
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     DATABASE LAYER (PostgreSQL 16)                     │
│                                                                        │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────────────────┐  │
│   │    users     │   │  users_auth  │   │       worship_logs       │  │
│   └──────────────┘   └──────────────┘   └──────────────────────────┘  │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────────────────┐  │
│   │ sync_devices │   │ sync_events  │   │     idempotency_keys     │  │
│   └──────────────┘   └──────────────┘   └──────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Core Domain Entities

### 3.1 Users & Authentication
- **`users`:** Holds user profiles (`id UUID`, `email TEXT UNIQUE`, `name TEXT`, `created_at TIMESTAMPTZ`).
- **`users_auth`:** Holds authentication credentials (`user_id UUID`, `password_hash TEXT` using `argon2id`, `session_token_hash TEXT`, `session_expires_at TIMESTAMPTZ`).

### 3.2 Worship Tracking
- **`worship_logs`:** Represents a discrete act of worship (`id UUID`, `user_id UUID`, `date DATE`, `type TEXT`, `status TEXT`, `value JSONB`, `updated_at TIMESTAMPTZ`).
- **`idempotency_keys`:** Scoped idempotency journal preventing duplicated operations (`user_id UUID`, `key TEXT`, `response_status INT`, `response_body JSONB`, `created_at TIMESTAMPTZ`, `PRIMARY KEY (user_id, key)`).

### 3.3 Multi-Device Synchronization
- **`sync_devices`:** Tracks registered client installations (`device_id UUID`, `user_id UUID`, `last_seen TIMESTAMPTZ`).
- **`sync_events`:** Monotonically increasing sequence log per user (`user_id UUID`, `server_seq BIGINT`, `entity_type TEXT`, `entity_id UUID`, `change_type TEXT`, `data JSONB`).

---

## 4. Key Architectural Subsystems

### 4.1 Safe Mobile Navigation Dock
On screens narrower than 769px, `.topbar` transitions to an ergonomic floating glass pill dock positioned at:
```css
bottom: calc(14px + env(safe-area-inset-bottom, 0px));
```
All floating action buttons (FABs) adhere to an elevation hierarchy:
- Primary Dock: `bottom: calc(14px + safe-area)`, `z-index: 190`
- Floating Widgets (`.zad-tkbr-fab`, `#zad-pwa-fab`): `bottom: calc(84px + safe-area)`, `z-index: 195`
- Modals / Command Palette: `z-index: 2000000`

### 4.2 Speech Recognition Recitation Matching
`tasmee.html` normalizes spoken recitation against Uthmani scripture:
1. Strips all Harakat / Tashkeel (`[\u064B-\u065F\u0610-\u061A]`).
2. Strips Quranic recitation marks and stop symbols (`[\u06D6-\u06ED]`).
3. Strips Quranic Dagger Alif (`\u0670`) and Tatweel (`\u0640`).
4. Normalizes all forms of Alif (`أ`, `إ`, `آ`, `ٱ` $\to$ `ا`) and Yaa (`ى` $\to$ `ي`).
5. Evaluates Levenshtein distance across normalized sliding windows for accurate memorization grading.
