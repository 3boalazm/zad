# ZAD Server API — Sprint Z5.1 Closure

## Status

PASS — Sprint Z5.1 closed on server runtime.

## Server Paths

Runtime API path:

`/opt/codeandcanvas/apps/zad/api`

Git-controlled source path:

`/opt/codeandcanvas/apps/zad/source`

Important note: the API runtime folder is currently not a Git repository. Source control exists under `/source`.

## Completed

- Patched API sprint label from `Z4` to `Z5`.
- Rebuilt `dist/`.
- Confirmed `dist/server.js` returns sprint `Z5`.
- Typecheck passed.
- Temporary API started on port `4910`.
- Health endpoints passed.
- Auth smoke test passed.

## Verification

Final smoke result:

- Total: 32
- PASS: 32
- FAIL: 0
- WARN: 0

Verified endpoints:

- `GET /health/live` → 200
- `GET /health/ready` → 200, db ok
- `GET /api/v1` → sprint Z5
- `POST /api/v1/auth/login` → 200
- `GET /api/v1/auth/me` → 200 after login
- `POST /api/v1/auth/logout` → 200
- `GET /api/v1/auth/me` → 401 after logout
- `POST /api/v1/auth/login` with bad password → 401

## Closure Decision

Sprint Z5.1 is accepted as the backend authentication baseline.

Next sprint:

Z6 — Worship Sync Endpoints.

## Source Control Note

Before or during Z6, decide whether the backend API should be moved into a proper Git-controlled source path, for example:

`/opt/codeandcanvas/apps/zad/source/api`

or maintained as a separate backend repository.

Until then, API changes must be delivered as reviewed patch packages and backed up on the server before application.
