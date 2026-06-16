-- ============================================================
-- ZAD — DB Preflight (Z5.1 revised)
-- Run BEFORE any migration.
-- ============================================================

\echo '=== ZAD DB PREFLIGHT ==='

SELECT version();

SELECT current_database() AS db_name,
       current_user       AS db_user,
       now()              AS db_time;

-- Extensions
SELECT extname, extversion
FROM pg_extension
WHERE extname IN ('pgcrypto', 'uuid-ossp')
ORDER BY extname;

-- Existing tables in public schema
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- db_migrations presence
SELECT to_regclass('public.db_migrations') AS migrations_table;

-- pgcrypto presence
SELECT to_regclass('public.db_migrations') IS NOT NULL AS has_migrations,
       EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto') AS has_pgcrypto,
       EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'fn_set_updated_at') AS has_trigger_fn;
