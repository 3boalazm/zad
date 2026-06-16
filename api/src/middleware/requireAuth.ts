/**
 * ZAD API — requireAuth middleware
 * Sprint Z5: protects routes that need an active session.
 *
 * Usage:
 *   router.get('/protected', requireAuth, handler);
 *
 * Attaches session info to req:
 *   req.sessionUserId  — authenticated user's UUID
 *   req.sessionId      — session row UUID (for revocation)
 */

import { Request, Response, NextFunction } from 'express';
import { getPool } from '../db/index.js';
import { SESSION_COOKIE, getSession } from '../auth/session.js';

declare global {
  namespace Express {
    interface Request {
      sessionUserId?: string;
      sessionId?: string;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
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

  const session = await getSession(pool, raw).catch(() => null);
  if (session === null) {
    res.clearCookie(SESSION_COOKIE, { path: '/' });
    res.status(401).json({ error: { code: 'SESSION_INVALID', message: 'Session expired or revoked' } });
    return;
  }

  req.sessionUserId = session.user_id;
  req.sessionId = session.id;
  next();
}
