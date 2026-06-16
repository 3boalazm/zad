-- ============================================================
-- ZAD — Migration 004: Sync
-- Sprint: Z5.1 DB Baseline Recovery
-- Depends on: 002_identity (users)
-- Idempotent: YES
-- Scope: supports offline-first delta sync (Z6).
-- ============================================================

-- Per-user last-synced sequence cursor
CREATE TABLE IF NOT EXISTS sync_cursors (
    user_id     UUID        PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    last_seq    BIGINT      NOT NULL DEFAULT 0,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger
        WHERE tgname = 'trg_sync_cursors_updated_at'
          AND tgrelid = 'sync_cursors'::regclass
    ) THEN
        CREATE TRIGGER trg_sync_cursors_updated_at
        BEFORE UPDATE ON sync_cursors
        FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
    END IF;
END;
$$;

-- Idempotency keys — prevent duplicate offline retries
CREATE TABLE IF NOT EXISTS idempotency_keys (
    key         TEXT        PRIMARY KEY,
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status      INTEGER,
    body        JSONB,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at  TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '24 hours')
);

CREATE INDEX IF NOT EXISTS idx_idempotency_keys_user
    ON idempotency_keys (user_id);

CREATE INDEX IF NOT EXISTS idx_idempotency_keys_expires
    ON idempotency_keys (expires_at);

INSERT INTO db_migrations (version, name)
VALUES (4, '004_sync')
ON CONFLICT (version) DO NOTHING;
