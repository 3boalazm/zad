-- ============================================================
-- ZAD — DB Verification (Z5.1 revised)
-- Run AFTER applying migrations 001-005.
-- ============================================================

\echo '=== ZAD DB VERIFICATION ==='

-- 1. pgcrypto
SELECT CASE WHEN EXISTS (SELECT 1 FROM pg_extension WHERE extname='pgcrypto')
       THEN 'pgcrypto: INSTALLED ✓' ELSE 'pgcrypto: MISSING ✗' END AS ext_status;

-- 2. trigger function
SELECT CASE WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname='fn_set_updated_at')
       THEN 'fn_set_updated_at: EXISTS ✓' ELSE 'fn_set_updated_at: MISSING ✗' END AS fn_status;

-- 3. migration log
SELECT version, name, applied_at FROM db_migrations ORDER BY version;

-- 4. required tables
SELECT
    req.table_name,
    CASE WHEN t.table_name IS NOT NULL THEN 'EXISTS ✓' ELSE 'MISSING ✗' END AS status
FROM (VALUES
    ('users'),
    ('worship_log'),
    ('sync_cursors'),
    ('idempotency_keys'),
    ('users_auth'),
    ('sessions'),
    ('login_events')
) AS req(table_name)
LEFT JOIN information_schema.tables t
    ON t.table_name = req.table_name AND t.table_schema = 'public'
ORDER BY req.table_name;

-- 5. users_auth: confirm email column (not username)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name   = 'users_auth'
ORDER BY ordinal_position;

-- 6. sessions: confirm schema matches session.ts (including ip_address, user_agent)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name   = 'sessions'
ORDER BY ordinal_position;

-- Quick column presence check
SELECT
    col.column_name,
    CASE WHEN col.column_name IS NOT NULL THEN 'EXISTS ✓' ELSE 'MISSING ✗' END AS status
FROM (VALUES
    ('id'), ('user_id'), ('token_hash'),
    ('ip_address'), ('user_agent'),
    ('expires_at'), ('revoked_at'),
    ('created_at'), ('updated_at')
) AS req(column_name)
LEFT JOIN information_schema.columns col
    ON col.column_name = req.column_name
   AND col.table_schema = 'public'
   AND col.table_name   = 'sessions'
ORDER BY req.column_name;

-- 7. login_events: confirm email_attempted column
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name   = 'login_events'
ORDER BY ordinal_position;

-- 8. row counts (all 0 on fresh install)
SELECT 'users'        AS tbl, COUNT(*) AS rows FROM users
UNION ALL
SELECT 'users_auth',                COUNT(*) FROM users_auth
UNION ALL
SELECT 'sessions',                  COUNT(*) FROM sessions
UNION ALL
SELECT 'login_events',              COUNT(*) FROM login_events
ORDER BY tbl;
