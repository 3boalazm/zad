# ZAD — Application Security Review & Threat Model
**Date:** October 2026  
**Security Posture:** Production-Grade / Hardened  
**Scope:** Client PWA, Backend API (`api/`), Database Layer (`PostgreSQL`), Data Privacy.

---

## 1. Threat Modeling (STRIDE Analysis)

| Threat Category | Potential Attack Surface | Mitigation Implemented in Code | Status |
|---|---|---|---|
| **Spoofing** | Forged session cookies or user impersonation | Opaque 256-bit cryptographically random tokens; only SHA-256 hashes stored in DB; validated via `requireAuth` middleware. | ✅ Mitigated |
| **Tampering** | Altering worship logs or injecting arbitrary SQL | 100% Parameterized queries (`$1, $2, ...`); schema constraints on UUIDs and Dates; Advisory locking on user transactions. | ✅ Mitigated |
| **Repudiation** | Denying sync operations or duplicate actions | Strict idempotency journaling on `(user_id, key)`; monotonic server sequence counters in `sync_events`. | ✅ Mitigated |
| **Information Disclosure** | Credential leak in logs or response payloads | Passwords hashed with `argon2id`; tokens hashed with `SHA-256`; stack traces stripped in production error handlers; zero secrets in Git. | ✅ Mitigated |
| **Denial of Service** | Exhausting database pool via concurrent sync | Single client connection acquired per sync batch; request payload size limits; connection timeout handles. | ✅ Mitigated |
| **Elevation of Privilege** | Cross-tenant data access or key collision | `idempotency_keys` composite primary key `(user_id, key)` strictly bounds cache lookup to authenticated `req.user.id`. | ✅ Mitigated |

---

## 2. Authentication & Session Architecture

### 2.1 Password Hashing
- **Algorithm:** `argon2id` (v19) via native `argon2` module.
- **Cost Parameters:** Memory cost 65536 KiB, time cost 3 iterations, parallelism 4 threads.
- **Verification:** Constant-time verification through `argon2.verify()`, resilient against timing attacks.

### 2.2 Cookie Protection Policy
Session tokens are dispatched via `res.cookie('zad_session', token, options)`:
- `httpOnly: true` — JavaScript document access is prohibited, preventing XSS-based token theft.
- `secure: isProd` — Enforces HTTPS in production environments.
- `sameSite: 'lax'` — Prevents Cross-Site Request Forgery (CSRF) in top-level navigations while enabling smooth client browsing.
- `path: '/'` — Uniform application scope.
- `maxAge: 30 * 24 * 3600 * 1000` — 30-day bounded session lifecycle.

### 2.3 Transient Outage Resilience
In `api/src/middleware/requireAuth.ts`:
- Any unhandled database exception during session lookup returns HTTP `503 Service Unavailable` with `Retry-After: 5`.
- The cookie is **never deleted** on database timeout, preventing millions of logged-in mobile PWA users from being logged out during temporary maintenance.

---

## 3. Injection Defense & Query Parameterization

An audit of all database operations across `api/src/auth/`, `api/src/worship/`, and `api/src/sync/` reveals zero dynamic SQL string interpolations:
- All queries pass arguments via parameter arrays:
  ```typescript
  await client.query(
    `INSERT INTO worship_logs (id, user_id, date, type, status, value, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW())
     ON CONFLICT (id) DO UPDATE ...`,
    [id, userId, date, type, status, JSON.stringify(value)]
  );
  ```
- Advisory locking hashes the user ID into an int4 hash (`pg_advisory_xact_lock(hashtext(userId))`) avoiding any string concatenation.

---

## 4. Privacy & Client-Side Storage Posture

- **Zero Tracking:** No Google Analytics, Facebook Pixel, advertising SDKs, or third-party telemetry scripts are loaded.
- **Local Astronomy Calculation:** Prayer times and Qibla compass azimuths are calculated on-device using spherical geometry and standard astronomical conventions; coordinates are cached locally in `localStorage` and never transmitted to external analytics servers.
- **Sharia Integrity Gate:** `js/ai-guard.js` operates client-side prior to network dispatch. Queries matching `FATWA_KEYWORDS` (e.g. `حكم`, `طلاق`, `حلال`, `فتوى`) are blocked from reaching external AI proxies, providing immediate guidance to seek vetted scholarly consensus.

---

## 5. Security Headers & Network Controls

Defined in `vercel.json` and enforced on deployment:
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: encrypted-media=*, autoplay=*`
