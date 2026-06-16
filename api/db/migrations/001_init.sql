-- ============================================================
-- ZAD — Migration 001: Init
-- Sprint: Z5.1 DB Baseline Recovery (revised)
-- Idempotent: YES
-- ============================================================

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Migration tracking
CREATE TABLE IF NOT EXISTS db_migrations (
    version     INTEGER     PRIMARY KEY,
    name        TEXT        NOT NULL,
    applied_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Shared trigger function for updated_at
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- 4. Record
INSERT INTO db_migrations (version, name)
VALUES (1, '001_init')
ON CONFLICT (version) DO NOTHING;
