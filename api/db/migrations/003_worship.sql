-- ============================================================
-- ZAD — Migration 003: Worship
-- Sprint: Z5.1 DB Baseline Recovery
-- Depends on: 002_identity (users)
-- Idempotent: YES
-- Scope: minimal tables required by Z6 Worship Sync plan.
--        server_seq column enables delta sync.
-- ============================================================

CREATE TABLE IF NOT EXISTS worship_log (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    log_date    DATE        NOT NULL,
    payload     JSONB       NOT NULL DEFAULT '{}',
    server_seq  BIGINT      NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, log_date)
);

CREATE INDEX IF NOT EXISTS idx_worship_log_user_date
    ON worship_log (user_id, log_date DESC);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger
        WHERE tgname = 'trg_worship_log_updated_at'
          AND tgrelid = 'worship_log'::regclass
    ) THEN
        CREATE TRIGGER trg_worship_log_updated_at
        BEFORE UPDATE ON worship_log
        FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
    END IF;
END;
$$;

INSERT INTO db_migrations (version, name)
VALUES (3, '003_worship')
ON CONFLICT (version) DO NOTHING;
