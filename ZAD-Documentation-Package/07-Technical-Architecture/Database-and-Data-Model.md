# Database and Data Model

`backend-src/app.ts` mounts `/health`, `/api/v1/auth`, `/worship`, `/sync`, `/library`. Auth routes: POST register/login/logout, GET me. Worship: POST/GET logs. Sync: POST push/pull. Library: GET categories, hadiths, hadiths/:id. Worship/sync use `requireAuth`. PostgreSQL access and migrations are in backend-src/db and api/db/migrations. Worship writes use parameterized SQL, per-user/date upsert, transaction/advisory locking and optional idempotency; sync uses sequence cursors. Production API health and route listing verified; no authenticated call or write made.

## Evidence status
Source: repository paths listed in `14-Evidence/Source-References.md`. Production claims are limited to the read-only checks in `14-Evidence/Evidence-Index.md`. Classification: source-verified, production-verified, historical, inferred or unknown as stated above. Review date: 2026-11-03.
