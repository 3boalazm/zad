# ZAD — Operations, Deployment & Runbook
**Version:** 1.0  
**Target:** Production Operations & SRE Teams

---

## 1. Environment Configuration

The backend reads configuration exclusively from system environment variables. For local development, copy `.env.example` to `.env`.

| Variable | Type | Default | Description |
|---|---|---|---|
| `PORT` | Integer (1..65535) | `4010` | TCP port on which the Express HTTP server listens. |
| `NODE_ENV` | String | `development` | Runtime environment (`development`, `production`, `test`). |
| `API_PREFIX` | String | `/api/v1` | URL prefix for all API endpoints. Must start with `/`. |
| `DATABASE_URL` | String (URI) | `undefined` | PostgreSQL connection URI (`postgresql://user:pass@host:5432/db`). Optional during offline mock runs. |
| `DB_SSL` | Boolean | `false` | Set to `true` when connecting to managed cloud PostgreSQL (AWS RDS, Supabase, Neon). |

---

## 2. Database Migrations

Migrations are stored in `api/db/migrations/` as numbered SQL files:
- `001_initial.sql` — Core `users` table and timestamps.
- `002_auth.sql` — `users_auth` table with argon2 password hashes and session tokens.
- `003_worship.sql` — `worship_logs` table with unique constraint on `(user_id, date, type)`.
- `004_sync.sql` — `sync_devices`, `sync_events`, and composite `idempotency_keys`.

### Executing Migrations
```bash
# Example using psql
psql "$DATABASE_URL" -f api/db/migrations/001_initial.sql
psql "$DATABASE_URL" -f api/db/migrations/002_auth.sql
psql "$DATABASE_URL" -f api/db/migrations/003_worship.sql
psql "$DATABASE_URL" -f api/db/migrations/004_sync.sql
```
*Note:* `004_sync.sql` includes an automated schema check that migrates legacy single-key tables to composite `PRIMARY KEY (user_id, key)` safely.

---

## 3. Service Lifecycle & Process Management

### 3.1 Production Start
```bash
cd api
npm ci --omit=dev
npm run build
npm start
```

### 3.2 Health Check Probes
- **Liveness Probe:** `GET /health/live`
  - Returns `200 {"status":"ok"}` whenever the event loop is active.
- **Readiness Probe:** `GET /health/ready`
  - Returns `200 {"status":"ok","db":"ok"}` when PostgreSQL is reachable.
  - Returns `200 {"status":"ok","db":"not_configured"}` if `DATABASE_URL` is omitted (development mode).
  - Returns `503 {"status":"degraded","db":"error"}` if PostgreSQL is unreachable.

### 3.3 Graceful Shutdown
The service listens for `SIGTERM` and `SIGINT`:
1. Ceases accepting new HTTP requests.
2. Waits up to 10 seconds for active in-flight requests to complete.
3. Drains and closes the PostgreSQL connection pool (`pool.end()`).
4. Exits with code 0.

---

## 4. Backup & Disaster Recovery

### 4.1 PostgreSQL Backup
```bash
# Full database backup
pg_dump -Fc "$DATABASE_URL" > zad_backup_$(date +%Y%m%d_%H%M%S).dump

# Verification
pg_restore -l zad_backup_*.dump > /dev/null && echo "Backup valid"
```

### 4.2 Database Restore
```bash
# Restore to target database
pg_restore --clean --if-exists -d "$DATABASE_URL" zad_backup_*.dump
```

---

## 5. PWA Frontend Asset Invalidation

Static assets are cached aggressively by `sw.js`. When deploying a frontend release:
1. Increment the cache version constant in `sw.js`:
   ```javascript
   const CACHE_NAME = 'zad-v2026.10.20';
   ```
2. The Service Worker `activate` event will automatically clean up stale caches and claim clients immediately.
