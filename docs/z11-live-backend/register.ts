/**
 * ZAD API — Registration handler
 * Sprint Z11: isolated registration for manual-sync users.
 *
 * Session pattern: reuses createSession() + SESSION_COOKIE from session.ts.
 * No direct INSERT INTO sessions — all session creation goes through the helper.
 * No auto-sync. Registration is optional and sync-adjacent only.
 */

import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import argon2 from 'argon2';
import { randomUUID } from 'crypto';
import {
  createSession,
  SESSION_COOKIE,
  SESSION_DURATION_DAYS,
} from '../auth/session.js';

export function createRegisterHandler(pool: Pool): Router {
  const router = Router();

  router.post('/', async (req: Request, res: Response) => {

    // ── 1. Parse + normalise ──────────────────────────────────────────────
    const rawEmail    = typeof req.body?.email    === 'string'
      ? req.body.email.trim().toLowerCase()
      : '';
    const rawPassword = typeof req.body?.password === 'string'
      ? req.body.password
      : '';

    // ── 2. Backend validation (authoritative) ─────────────────────────────
    if (!rawEmail || !rawPassword) {
      return res.status(422).json({
        error:  'VALIDATION_ERROR',
        detail: 'email and password are required',
      });
    }

    if (!rawEmail.includes('@') || rawEmail.indexOf('.') === -1 || rawEmail.length < 5) {
      return res.status(422).json({
        error:  'VALIDATION_ERROR',
        detail: 'invalid email format',
      });
    }

    if (rawPassword.length < 8) {
      return res.status(422).json({
        error:  'VALIDATION_ERROR',
        detail: 'password must be at least 8 characters',
      });
    }

    const client = await pool.connect();
    try {
      // ── 3. Duplicate email check ─────────────────────────────────────────
      const dupCheck = await client.query<{ exists: boolean }>(
        `SELECT EXISTS(
           SELECT 1 FROM users_auth WHERE email = $1
         ) AS exists`,
        [rawEmail],
      );
      if (dupCheck.rows[0]?.exists) {
        return res.status(409).json({ error: 'EMAIL_EXISTS' });
      }

      // ── 4. Hash password (argon2id — same params as login) ───────────────
      const passwordHash = await argon2.hash(rawPassword, {
        type:        argon2.argon2id,
        memoryCost:  65536,   // 64 MiB
        timeCost:    3,
        parallelism: 1,
      });

      // ── 5. Atomic insert: users → users_auth ─────────────────────────────
      await client.query('BEGIN');

      const userId: string = randomUUID();

      await client.query(
        `INSERT INTO users (id, is_anonymous) VALUES ($1, false)`,
        [userId],
      );

      await client.query(
        `INSERT INTO users_auth (user_id, email, password_hash)
         VALUES ($1, $2, $3)`,
        [userId, rawEmail, passwordHash],
      );

      await client.query('COMMIT');

      // ── 6. Auto-login: reuse createSession() from session.ts ─────────────
      // createSession handles: token generation, SHA-256 hash, INSERT into
      // sessions(user_id, token_hash, ip_address, user_agent, expires_at)
      const rawToken = await createSession(pool, userId, {
        ip:        req.socket.remoteAddress,
        userAgent: (req.get('user-agent') ?? '').substring(0, 256),
      });

      // ── 7. Set cookie — exact same pattern as login ───────────────────────
      const isProd = process.env.NODE_ENV === 'production';
      res.cookie(SESSION_COOKIE, rawToken, {
        httpOnly: true,
        secure:   isProd,
        sameSite: 'lax',
        maxAge:   SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000,
        path:     '/',
      });

      return res.status(201).json({ userId, email: rawEmail });

    } catch (err: unknown) {
      // ── Duplicate-race: handle PG unique violation (23505) ────────────────
      // Covers the window between dupCheck and INSERT in high-concurrency.
      if (
        err !== null &&
        typeof err === 'object' &&
        'code' in err &&
        (err as { code: string }).code === '23505'
      ) {
        try { await client.query('ROLLBACK'); } catch (_) { /* ignore */ }
        return res.status(409).json({ error: 'EMAIL_EXISTS' });
      }

      try { await client.query('ROLLBACK'); } catch (_) { /* ignore */ }

      // Never leak stack trace or PII to client
      console.error(
        '[register] error:',
        err instanceof Error ? err.message : String(err),
      );
      return res.status(500).json({ error: 'INTERNAL_ERROR' });

    } finally {
      client.release();
    }
  });

  return router;
}
