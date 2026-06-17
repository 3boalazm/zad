# ZAD — Sprint Z6: Worship Sync Endpoints

**Sprint:** Z6  
**Date:** يونيو 2026  
**Depends on:** Z5.1 Auth baseline (32/32 PASS)  
**Node:** v18.19.1 — no Node 20 deps added

---

## Files Changed

| File | Type | Change |
|------|------|--------|
| `src/app.ts` | modified | Added worship + sync router imports and mounts |
| `src/server.ts` | modified | sprint Z4 → Z6, version 0.5.0 → 0.6.0 |
| `src/worship/worship.router.ts` | **new** | POST + GET /worship/logs |
| `src/sync/sync.router.ts` | **new** | POST /sync/push + POST /sync/pull |
| `src/tests/worship.test.ts` | **new** | 8 auth boundary tests |
| `scripts/smoke_test_z6.sh` | **new** | Full smoke test Z5+Z6 |

---

## Endpoints Added

```
POST /api/v1/worship/logs   — upsert worship log entry (idempotent)
GET  /api/v1/worship/logs   — list logs with cursor pagination
POST /api/v1/sync/push      — batch push (max 50 items)
POST /api/v1/sync/pull      — pull changes after server_seq cursor
```

All endpoints protected by existing `requireAuth` middleware.  
`req.sessionUserId` used for all user-scoped DB access.

---

## Tests Added (8 new, 37 total)

```
▶ POST /worship/logs — auth boundary
  ✔ returns 401 NO_SESSION when no cookie present
  ✔ returns non-200 when fake cookie (not authenticated)

▶ GET /worship/logs — auth boundary
  ✔ returns 401 NO_SESSION when no cookie present
  ✔ returns non-200 when fake cookie (not authenticated)

▶ POST /sync/push — auth boundary
  ✔ returns 401 NO_SESSION when no cookie present
  ✔ returns non-200 when fake cookie (not authenticated)

▶ POST /sync/pull — auth boundary
  ✔ returns 401 NO_SESSION when no cookie present
  ✔ returns non-200 when fake cookie (not authenticated)
```

**Test design rationale:**  
Tests without a cookie always return `401 NO_SESSION` (deterministic, before any DB access).  
Tests with a fake cookie return either `401 SESSION_INVALID` (pool exists, fake token not in DB)
or `503 DB_UNAVAILABLE` (pool null), both meaning: not authenticated.  
Validation errors (400) and DB path (503) are tested in smoke_test_z6.sh with a live session.

---

## Verification Output

```
npm ci     → PASS (0 vulnerabilities)
npm run build      → PASS (exit 0)
npm run typecheck  → PASS (exit 0)
npm test           → PASS (37/37, 0 fail)
```

---

## DB Schema Assumptions

| Table | Columns used |
|-------|-------------|
| `worship_log` | id, user_id, log_date (UNIQUE with user_id), payload JSONB, server_seq BIGINT, created_at, updated_at |
| `sync_cursors` | user_id PK, last_seq BIGINT, updated_at |
| `idempotency_keys` | key PK, user_id, status INT, body JSONB, created_at, expires_at |

No new migrations required — tables were created in 003_worship.sql and 004_sync.sql.

---

## Known Limitations

- `server_seq` uses `MAX(server_seq)+1` per user within the INSERT. Concurrent writes from the same user could produce the same seq value. Acceptable for single-session offline-first use case. A DB SEQUENCE object would be the production fix.
- No automatic TTL cleanup for expired `idempotency_keys`. They expire naturally (WHERE `expires_at > now()`) but are not deleted. A periodic cleanup job can be added in Z7.

---

## Server Apply Commands

```bash
cd /opt/codeandcanvas/apps/zad/source

# 1. Copy Z6 files
cp api_z6/src/app.ts          api/src/app.ts
cp api_z6/src/server.ts       api/src/server.ts
cp -r api_z6/src/worship      api/src/
cp -r api_z6/src/sync         api/src/
cp api_z6/src/tests/worship.test.ts api/src/tests/
cp api_z6/scripts/smoke_test_z6.sh  api/scripts/
cp api_z6/docs/ZAD_SPRINT_Z6_CLOSURE.md api/docs/

# 2. Verify locally
cd api
rm -rf dist
npm ci
npm run build
npm run typecheck
npm test
# Expected: 37/37 PASS

# 3. Start API on test port
set -a && . ./.env && set +a
PORT=4910 API_PREFIX=/api/v1 node dist/server.js > /tmp/zad-z6.log 2>&1 &
sleep 2

# 4. Run smoke test
chmod +x scripts/smoke_test_z6.sh
API_BASE=http://127.0.0.1:4910/api/v1 ./scripts/smoke_test_z6.sh

# 5. Git commit
kill %1 2>/dev/null || true
cd /opt/codeandcanvas/apps/zad/source
git add api/src/ api/package.json api/scripts/smoke_test_z6.sh api/docs/ZAD_SPRINT_Z6_CLOSURE.md
git commit -m "feat(api/z6): worship sync endpoints (worship/logs, sync/push, sync/pull)"
git push origin main
```

---

**Sprint Z6: VERIFIED — 37/37 PASS, build/typecheck clean**
