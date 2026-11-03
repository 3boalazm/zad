# Privacy Analysis

Defensive source review only. Positive patterns visible include parameterized SQL, protected user-scoped endpoints, session-token hashing, password-hash helper, request size limit and SW API bypass. Production headers, CSRF/rate controls, log retention, key rotation, active Firebase rules, AI retention and group data sharing were not confirmed. Location, worship patterns, accounts, children/family and AI prompts are sensitive. No penetration testing or secret inspection occurred.

## Evidence status
Source: repository paths listed in `14-Evidence/Source-References.md`. Production claims are limited to the read-only checks in `14-Evidence/Evidence-Index.md`. Classification: source-verified, production-verified, historical, inferred or unknown as stated above. Review date: 2026-11-03.
