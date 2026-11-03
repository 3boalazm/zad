# Synchronization Behavior

The service worker (`sw.js`, cache version `zad-20261103-i18n-r48`) declares network-first with 3-second timeout for selected HTML/CSS/JS, cache-first media, explicit precache, API/provider bypass, install skipWaiting and old-cache cleanup. Precache is a subset, so this is not a guarantee that the whole product works offline. `js/storage.js` defines Dexie IndexedDB schemas v1–v3 and migration/fallback; `js/sync-manager.js` still calls localStorage `zad_v2` the local source of truth. Many modules use localStorage directly. Auth, sync, AI, proxy library and external audio/media need connectivity. No offline workflow was run.

## Evidence status
Source: repository paths listed in `14-Evidence/Source-References.md`. Production claims are limited to the read-only checks in `14-Evidence/Evidence-Index.md`. Classification: source-verified, production-verified, historical, inferred or unknown as stated above. Review date: 2026-11-03.
