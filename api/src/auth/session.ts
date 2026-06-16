/**
 * ZAD API — Session management
 * Sprint Z5: opaque tokens, SHA-256 stored in DB, raw in HttpOnly cookie.
 *
 * Token lifecycle:
 *   1. createSessionToken()  → 32 random bytes as hex (64-char string)
 *   2. hashSessionToken()    → SHA-256(raw) stored in sessions.token_hash
 *   3. Client receives raw token in HttpOnly cookie
 *   4. On request: hashSessionToken(cookie) → lookup in DB
 *   5. revokeSession() → SET revoked_at = NOW()
 *
 * Why SHA-256 (not argon2) for session tokens?
 *   Session tokens are 256-bit random — already have full entropy.
 *   argon2 slow hashing is for passwords (low-entropy user input).
 *   SHA-256 is fast, deterministic, and safe for high-entropy tokens.
 */

import { randomBytes, createHash } from 'crypto';
import { Pool } from 'pg';

export const SESSION_COOKIE = 'zad_sid';
export const SESSION_DURATION_DAYS = 30;

/**
 * Generates a cryptographically random session token.
 * Returns 32 bytes as a 64-char lowercase hex string.
 */
export function createSessionToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Hashes a raw session token with SHA-256.
 * Returns hex string stored in sessions.token_hash.
 */
export function hashSessionToken(raw: string): string {
  return createHash('sha256').update(raw, 'utf8').digest('hex');
}

export interface SessionRow {
  id: string;
  user_id: string;
  expires_at: Date;
}

/**
 * Creates a session in the DB and returns the raw token for the cookie.
 * The raw token is NEVER stored in the DB.
 */
export async function createSession(
  pool: Pool,
  userId: string,
  meta: { ip?: string; userAgent?: string }
): Promise<string> {
  const raw = createSessionToken();
  const hash = hashSessionToken(raw);
  const expiresAt = new Date(
    Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000
  );

  await pool.query(
    `INSERT INTO sessions (user_id, token_hash, ip_address, user_agent, expires_at)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, hash, meta.ip ?? null, meta.userAgent ?? null, expiresAt]
  );

  return raw; // caller sets this in HttpOnly cookie
}

/**
 * Looks up an active session by raw token from the cookie.
 * Returns the session row or null if not found / expired / revoked.
 */
export async function getSession(
  pool: Pool,
  rawToken: string
): Promise<SessionRow | null> {
  const hash = hashSessionToken(rawToken);

  const result = await pool.query<SessionRow>(
    `SELECT id, user_id, expires_at
     FROM sessions
     WHERE token_hash = $1
       AND revoked_at IS NULL
       AND expires_at > NOW()
     LIMIT 1`,
    [hash]
  );

  return result.rows[0] ?? null;
}

/**
 * Revokes a single session by raw token.
 */
export async function revokeSession(
  pool: Pool,
  rawToken: string
): Promise<void> {
  const hash = hashSessionToken(rawToken);
  await pool.query(
    `UPDATE sessions SET revoked_at = NOW() WHERE token_hash = $1`,
    [hash]
  );
}

/**
 * Revokes ALL active sessions for a user (logout everywhere).
 */
export async function revokeAllSessions(
  pool: Pool,
  userId: string
): Promise<void> {
  await pool.query(
    `UPDATE sessions SET revoked_at = NOW()
     WHERE user_id = $1 AND revoked_at IS NULL`,
    [userId]
  );
}
