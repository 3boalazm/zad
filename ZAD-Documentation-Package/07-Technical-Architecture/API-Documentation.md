# API Documentation

Base `/api/v1`. Auth POST `/auth/register`, `/login`, `/logout`; GET `/me`. Worship (auth): POST `/worship/logs` body includes ISO `log_date`, optional JSON object `payload`, optional idempotency key <=128; GET `/worship/logs` supports `since`, `after_seq`, `limit` 1–100. Sync (auth): POST `/sync/push` max batch 50; POST `/sync/pull` with cursor/limit. Library GET `/library/categories`, `/hadiths`, `/hadiths/:id`. Route listing is production verified; details are source-derived. No production mutation.

## Evidence status
Source: repository paths listed in `14-Evidence/Source-References.md`. Production claims are limited to the read-only checks in `14-Evidence/Evidence-Index.md`. Classification: source-verified, production-verified, historical, inferred or unknown as stated above. Review date: 2026-11-03.
