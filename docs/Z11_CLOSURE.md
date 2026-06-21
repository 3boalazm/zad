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
