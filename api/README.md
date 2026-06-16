# ZAD API

Backend API for the ZAD Islamic PWA — Sprint Z4: DB connection layer.

## Stack

- **Runtime:** Node.js ≥ 18
- **Framework:** Express 4
- **Language:** TypeScript 5
- **DB:** PostgreSQL 16 — optional pg pool connection (Sprint Z4)

## Directory structure

```
api/
├── src/
│   ├── config/        # Typed config loader with validation
│   ├── db/            # pg Pool — createPool / getDbStatus / closePool
│   ├── health/        # /health/live and /health/ready (real DB ping)
│   ├── middleware/    # requestId, requestLogger, notFound, errorHandler
│   ├── tests/         # node:test unit + health smoke tests
│   ├── app.ts         # Express app factory
│   └── server.ts      # Entry point — async main, pool init, graceful shutdown
├── docs/              # Sprint closure documents
├── .env.example       # Copy to .env — never commit .env
├── package.json
├── package-lock.json
└── tsconfig.json
```

## Quick start

```bash
# Install dependencies (deterministic — uses lockfile)
npm ci

# Type-check
npm run typecheck

# Build
npm run build

# Run tests
npm test

# Run (production build)
npm start

# Run in development (auto-reload)
npm run dev
```

## Health endpoints

```
GET /health/live   → 200  always (process alive)
GET /health/ready  → 200  db:not_configured  (no DATABASE_URL)
                  → 200  db:ok               (DATABASE_URL set, pg reachable)
                  → 503  db:error            (DATABASE_URL set, pg unreachable)
```

## Environment variables

See `.env.example` for the full list.

`DATABASE_URL` is **optional in Z4** — the API starts and serves traffic without it.
Set it to connect to PostgreSQL; `/health/ready` will report `db:ok` on success.

## Sprint roadmap

| Sprint | Status | Description |
|--------|--------|-------------|
| Z0 | ✅ | Freeze & baseline |
| Z1/Z1.1 | ✅ | Database contract (19 tables) |
| Z2/Z2.1/Z2.2 | ✅ | SQL migrations |
| Z2.3 | ✅ | SQL dry-run on PostgreSQL 16 |
| Z3 | ✅ | API skeleton — Express + TypeScript |
| **Z4** | **✅** | **DB connection layer (this)** |
| Z5 | 🔜 | Auth endpoints (anonymous, refresh, me) |
