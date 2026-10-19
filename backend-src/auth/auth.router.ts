/**
 * ZAD API — Auth Router
 * Sprint Z5: login / logout / me
 *
 * POST /api/v1/auth/login   — verify email+password, create session, set cookie
 * POST /api/v1/auth/logout  — revoke session, clear cookie
 * GET  /api/v1/auth/me      — return current user from active session
 */

import { Router, Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { getPool } from '../db/index.js';
import { verifyPassword, hashPassword } from './password.js';
import {
  SESSION_COOKIE,
  SESSION_DURATION_DAYS,
  createSession,
  getSession,
  revokeSession,
} from './session.js';

const router = Router();

/** Returns true when running in production mode */
function isProduction(): boolean {
  return process.env['NODE_ENV'] === 'production';
}

/** Cookie options shared by set and clear */
function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: isProduction(),
    maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000,
    path: '/',
  };
}

// ── POST /auth/register ──────────────────────────────────────────────────────
router.post('/register', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const rawEmail = typeof req.body?.email === 'string'
      ? req.body.email.trim().toLowerCase()
      : '';
    const rawPassword = typeof req.body?.password === 'string'
      ? req.body.password
      : '';

    if (!rawEmail || !rawPassword) {
      res.status(422).json({
        error: { code: 'VALIDATION_ERROR', message: 'email and password are required' },
        detail: 'email and password are required',
      });
      return;
    }

    if (!rawEmail.includes('@') || rawEmail.indexOf('.') === -1 || rawEmail.length < 5) {
      res.status(422).json({
        error: { code: 'VALIDATION_ERROR', message: 'invalid email format' },
        detail: 'invalid email format',
      });
      return;
    }

    if (rawPassword.length < 8) {
      res.status(422).json({
        error: { code: 'VALIDATION_ERROR', message: 'password must be at least 8 characters' },
        detail: 'password must be at least 8 characters',
      });
      return;
    }

    const pool = getPool();
    if (pool === null) {
      res.status(503).json({ error: { code: 'DB_UNAVAILABLE', message: 'Database not configured' } });
      return;
    }

    const client = await pool.connect();
    try {
      const dupCheck = await client.query<{ exists: boolean }>(
        `SELECT EXISTS(
           SELECT 1 FROM users_auth WHERE LOWER(email) = $1
         ) AS exists`,
        [rawEmail]
      );
      if (dupCheck.rows[0]?.exists) {
        res.status(409).json({ error: { code: 'EMAIL_EXISTS', message: 'Email already registered' } });
        return;
      }

      const passwordHash = await hashPassword(rawPassword);

      await client.query('BEGIN');
      const userId: string = randomUUID();

      await client.query(
        `INSERT INTO users (id, is_anonymous) VALUES ($1, false)`,
        [userId]
      );

      await client.query(
        `INSERT INTO users_auth (user_id, email, password_hash)
         VALUES ($1, $2, $3)`,
        [userId, rawEmail, passwordHash]
      );

      await client.query('COMMIT');

      const rawToken = await createSession(pool, userId, {
        ip: req.socket.remoteAddress,
        userAgent: (req.get('user-agent') ?? '').substring(0, 256),
      });

      res.cookie(SESSION_COOKIE, rawToken, cookieOptions());
      res.status(201).json({ status: 'ok', userId, email: rawEmail });
    } catch (err: unknown) {
      try { await client.query('ROLLBACK'); } catch (_) {}
      if (
        err !== null &&
        typeof err === 'object' &&
        'code' in err &&
        (err as { code: string }).code === '23505'
      ) {
        res.status(409).json({ error: { code: 'EMAIL_EXISTS', message: 'Email already registered' } });
        return;
      }
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    next(err);
  }
});

// ── POST /auth/login ─────────────────────────────────────────────────────────
router.post('/login', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body as { email?: unknown; password?: unknown };

    // Input validation first — before any DB check
    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      res.status(400).json({ error: { code: 'INVALID_INPUT', message: 'email and password are required' } });
      return;
    }

    const pool = getPool();
    if (pool === null) {
      res.status(503).json({ error: { code: 'DB_UNAVAILABLE', message: 'Database not configured' } });
      return;
    }

    // Look up user by email
    const userResult = await pool.query<{
      user_id: string;
      password_hash: string;
      email_verified: boolean;
    }>(
      `SELECT ua.user_id, ua.password_hash, ua.email_verified
       FROM users_auth ua
       WHERE ua.email = $1
       LIMIT 1`,
      [email.toLowerCase().trim()]
    );

    const userAuth = userResult.rows[0];
    const success = userAuth !== undefined && await verifyPassword(userAuth.password_hash, password);

    // Log the attempt (audit)
    await pool.query(
      `INSERT INTO login_events (user_id, email_attempted, success, ip_address, user_agent, failure_reason)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        userAuth?.user_id ?? null,
        email.toLowerCase().trim(),
        success,
        req.socket.remoteAddress ?? null,
        req.headers['user-agent']?.substring(0, 256) ?? null,
        success ? null : (userAuth ? 'invalid_password' : 'user_not_found'),
      ]
    );

    if (!success) {
      // Return generic message — do not leak whether email exists
      res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
      return;
    }

    // Create session
    const rawToken = await createSession(pool, userAuth!.user_id, {
      ip: req.socket.remoteAddress,
      userAgent: req.headers['user-agent']?.substring(0, 256),
    });

    res.cookie(SESSION_COOKIE, rawToken, cookieOptions());
    res.status(200).json({ status: 'ok', userId: userAuth!.user_id });
  } catch (err) {
    next(err);
  }
});

// ── POST /auth/logout ────────────────────────────────────────────────────────
router.post('/logout', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const raw = req.cookies?.[SESSION_COOKIE] as string | undefined;

    if (raw) {
      const pool = getPool();
      if (pool !== null) {
        await revokeSession(pool, raw);
      }
    }

    res.clearCookie(SESSION_COOKIE, { path: '/' });
    res.status(200).json({ status: 'ok' });
  } catch (err) {
    next(err);
  }
});

// ── GET /auth/me ─────────────────────────────────────────────────────────────
router.get('/me', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const raw = req.cookies?.[SESSION_COOKIE] as string | undefined;

    if (!raw) {
      res.status(401).json({ error: { code: 'NO_SESSION', message: 'Not authenticated' } });
      return;
    }

    const pool = getPool();
    if (pool === null) {
      res.status(503).json({ error: { code: 'DB_UNAVAILABLE', message: 'Database not configured' } });
      return;
    }

    const session = await getSession(pool, raw);
    if (session === null) {
      res.clearCookie(SESSION_COOKIE, { path: '/' });
      res.status(401).json({ error: { code: 'SESSION_INVALID', message: 'Session expired or revoked' } });
      return;
    }

    // Fetch user info
    const userResult = await pool.query<{ id: string; is_anonymous: boolean }>(
      `SELECT id, is_anonymous FROM users WHERE id = $1 AND deleted_at IS NULL`,
      [session.user_id]
    );

    const user = userResult.rows[0];
    if (!user) {
      res.status(401).json({ error: { code: 'USER_NOT_FOUND', message: 'User not found' } });
      return;
    }

    res.status(200).json({
      userId: user.id,
      isAnonymous: user.is_anonymous,
      sessionExpiresAt: session.expires_at,
    });
  } catch (err) {
    next(err);
  }
});

export { router as authRouter };
