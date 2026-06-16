-- ============================================================
-- ZAD — Migration 005: Auth
-- Sprint: Z5
-- Depends on: 002_identity (users)
-- Idempotent: YES
--
-- Auth model (from Z5 ADRs):
--   - Email + password credentials (no username)
--   - Password hashing: argon2id (app layer, argon2 npm pkg)
--   - Sessions: opaque 32-byte token → SHA-256 stored here
--   - Token delivered via HttpOnly cookie only — no JWT
--
-- Schema matches:
--   src/auth/password.ts  → password_hash argon2id
--   src/auth/session.ts   → token_hash SHA-256, expires_at, revoked_at
--   src/auth/auth.router.ts → email_attempted in login_events
-- ============================================================

-- ── 1. users_auth — email credentials ───────────────────────
-- One credential row per registered user.
-- email: case-insensitive unique (enforced via LOWER index).
-- email_verified: default false — verification flow is future work.
CREATE TABLE IF NOT EXISTS users_auth (
    user_id         UUID            PRIMARY KEY
                                    REFERENCES users(id) ON DELETE CASCADE,
    email           VARCHAR(254)    NOT NULL,
    password_hash   TEXT            NOT NULL,
    email_verified  BOOLEAN         NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT now()
);

-- Case-insensitive unique email
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_auth_email_lower
    ON users_auth (LOWER(email));

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger
        WHERE tgname = 'trg_users_auth_updated_at'
          AND tgrelid = 'users_auth'::regclass
    ) THEN
        CREATE TRIGGER trg_users_auth_updated_at
        BEFORE UPDATE ON users_auth
        FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
    END IF;
END;
$$;

-- ── 2. sessions — opaque token sessions ─────────────────────
-- Matches src/auth/session.ts:
--   createSession()  → INSERT (user_id, token_hash, ip_address, user_agent, expires_at)
--   getSession()     → SELECT WHERE token_hash = $1
--                        AND revoked_at IS NULL
--                        AND expires_at > now()
--   revokeSession()  → UPDATE SET revoked_at = now()
-- updated_at included for trigger consistency.
CREATE TABLE IF NOT EXISTS sessions (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash      TEXT        NOT NULL UNIQUE,
    ip_address      TEXT,
    user_agent      TEXT,
    expires_at      TIMESTAMPTZ NOT NULL,
    revoked_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Lookup by token_hash (hot path — every authenticated request)
CREATE INDEX IF NOT EXISTS idx_sessions_token_hash_active
    ON sessions (token_hash)
    WHERE revoked_at IS NULL;

-- Lookup by user (logout all sessions, admin view)
CREATE INDEX IF NOT EXISTS idx_sessions_user_id
    ON sessions (user_id);

-- Expired session cleanup
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at
    ON sessions (expires_at)
    WHERE revoked_at IS NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger
        WHERE tgname = 'trg_sessions_updated_at'
          AND tgrelid = 'sessions'::regclass
    ) THEN
        CREATE TRIGGER trg_sessions_updated_at
        BEFORE UPDATE ON sessions
        FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
    END IF;
END;
$$;

-- ── 3. login_events — auth audit log ────────────────────────
-- Matches auth.router.ts login handler:
--   - Records both successful and failed attempts
--   - email_attempted: the email provided in the request body
--   - user_id: NULL on failure (user not found), SET NULL on user delete
--   - failure_reason: 'invalid_credentials' | 'user_not_found' | etc.
--   - created_at column name (not occurred_at) — matches INSERT in router
CREATE TABLE IF NOT EXISTS login_events (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID            REFERENCES users(id) ON DELETE SET NULL,
    email_attempted VARCHAR(254)    NOT NULL,
    success         BOOLEAN         NOT NULL,
    ip_address      TEXT,
    user_agent      TEXT,
    failure_reason  TEXT,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT now()
);

-- Per-user audit trail
CREATE INDEX IF NOT EXISTS idx_login_events_user_id
    ON login_events (user_id, created_at DESC)
    WHERE user_id IS NOT NULL;

-- Recent failed attempts (rate limiting queries)
CREATE INDEX IF NOT EXISTS idx_login_events_email_failed
    ON login_events (LOWER(email_attempted), created_at DESC)
    WHERE success = false;

-- ── 4. Record ───────────────────────────────────────────────
INSERT INTO db_migrations (version, name)
VALUES (5, '005_auth')
ON CONFLICT (version) DO NOTHING;
