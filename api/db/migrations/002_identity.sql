-- ============================================================
-- ZAD — Migration 002: Identity
-- Sprint: Z5.1 DB Baseline Recovery (revised)
-- Depends on: 001_init
-- Idempotent: YES
--
-- users schema matches Z5 auth code expectations:
--   - is_anonymous: anonymous-first model (no forced account)
--   - deleted_at: soft-delete support
--   - display_name, locale: optional UX fields, nullable
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    is_anonymous    BOOLEAN     NOT NULL DEFAULT true,
    display_name    TEXT,
    locale          TEXT        NOT NULL DEFAULT 'ar',
    deleted_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger
        WHERE tgname = 'trg_users_updated_at'
          AND tgrelid = 'users'::regclass
    ) THEN
        CREATE TRIGGER trg_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
    END IF;
END;
$$;

-- Partial index: active (non-deleted) users only
CREATE INDEX IF NOT EXISTS idx_users_active
    ON users (created_at DESC)
    WHERE deleted_at IS NULL;

-- 4. Record
INSERT INTO db_migrations (version, name)
VALUES (2, '002_identity')
ON CONFLICT (version) DO NOTHING;
