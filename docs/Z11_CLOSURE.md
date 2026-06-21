# ZAD Sprint Z11 Closure — Isolated Registration Flow

## Status

PASS — Z11 deployed and verified on server.

## Frontend commit

867497b feat(z11): isolated registration flow

## Backend note

The live API directory is not currently a Git repository:

/opt/codeandcanvas/apps/zad/api

Therefore the Z11 backend live patch was copied into this repository for traceability:

- docs/z11-live-backend/register.ts
- docs/z11-live-backend/auth.router.ts

## Verified behavior

- POST /api/v1/auth/register exists.
- Weak password returns 422.
- Missing password returns 422.
- Register success returns 201.
- zad_sid cookie is set.
- Duplicate email returns 409 EMAIL_EXISTS.
- auth/me after register returns 200.
- Auto-login after registration works.
- API build passed.
- API typecheck passed.
- zad-api.service restarted and active.
- js/sync-manager.js untouched.
- app.js untouched.
- js/state-manager.js untouched.
- js/storage.js untouched.
- sw.js untouched.
- No Firebase files modified.

## Product constraints preserved

- Registration is isolated.
- No auto-sync.
- Offline-first remains default.
- localStorage/zad_v2 remains source of truth.
- Sync remains manual.

## Z11.1 Live Register Fix — 2026-06-21

Public register smoke exposed two backend drift issues in the live API file:

- `users.is_anonymous` was defaulting to true because live `register.ts` inserted only `users(id)`.
- register cookie used `SameSite=Strict` while login used `SameSite=Lax`.

Fix applied live in `/opt/codeandcanvas/apps/zad/api/src/auth/register.ts`:

- `INSERT INTO users (id, is_anonymous) VALUES ($1, false)`
- `sameSite: 'lax'`
- session metadata now uses `req.socket.remoteAddress`
- user-agent truncated with `substring(0, 256)`

Verification:

- Public register: `201 Created`
- `auth/me`: `200 OK` with `isAnonymous:false`
- DB join: `users.is_anonymous = false`
- Duplicate register: `409 EMAIL_EXISTS`
