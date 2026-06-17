/**
 * ZAD API — Worship Router
 * Sprint Z6: worship log upsert + list.
 *
 * POST /api/v1/worship/logs  — upsert one worship log entry (idempotent)
 * GET  /api/v1/worship/logs  — list logs for authenticated user
 *
 * Auth: requireAuth middleware (req.sessionUserId, req.sessionId).
 * All SQL is parameterized. All access scoped to sessionUserId.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { getPool } from '../db/index.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

// ── Validation helpers ────────────────────────────────────────────────────────

function isIsoDate(v: unknown): v is string {
  return typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
}

function clampLimit(v: unknown, defaultVal: number, max: number): number {
  const n = Number(v);
  if (!Number.isFinite(n) || n < 1) return defaultVal;
  return Math.min(Math.floor(n), max);
}

// ── POST /worship/logs ────────────────────────────────────────────────────────
/**
 * Body:
 *   log_date         — ISO date string (YYYY-MM-DD), required
 *   payload          — JSON object, optional (defaults to {})
 *   idempotency_key  — string ≤128 chars, optional
 *
 * If idempotency_key is provided and already processed (within 24h),
 * returns the cached response immediately.
 *
 * Otherwise: upserts worship_log ON CONFLICT (user_id, log_date),
 * advances sync_cursors, and (if key given) stores the response.
 */
router.post(
  '/logs',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.sessionUserId as string;

    const { log_date, payload, idempotency_key } = req.body as {
      log_date?: unknown;
      payload?: unknown;
      idempotency_key?: unknown;
    };

    // ── Input validation ──────────────────────────────────────────────────────
    if (!isIsoDate(log_date)) {
      res.status(400).json({ error: { code: 'INVALID_LOG_DATE', message: 'log_date must be YYYY-MM-DD' } });
      return;
    }

    if (payload !== undefined && payload !== null) {
      if (typeof payload !== 'object' || Array.isArray(payload)) {
        res.status(400).json({ error: { code: 'INVALID_PAYLOAD', message: 'payload must be a JSON object' } });
        return;
      }
    }

    if (idempotency_key !== undefined) {
      if (typeof idempotency_key !== 'string' || idempotency_key.length > 128) {
        res.status(400).json({ error: { code: 'INVALID_IDEMPOTENCY_KEY', message: 'idempotency_key must be string ≤128 chars' } });
        return;
      }
    }

    const pool = getPool();
    if (pool === null) {
      res.status(503).json({ error: { code: 'DB_UNAVAILABLE', message: 'Database not configured' } });
      return;
    }

    const client = await pool.connect();
    try {
      // ── Idempotency check ─────────────────────────────────────────────────
      if (typeof idempotency_key === 'string') {
        const cached = await client.query<{ status: number; body: unknown }>(
          `SELECT status, body
           FROM idempotency_keys
           WHERE key = $1 AND user_id = $2 AND expires_at > now()`,
          [idempotency_key, userId]
        );
        if (cached.rows.length > 0) {
          const row = cached.rows[0];
          res.status(row.status).json(row.body);
          return;
        }
      }

      // ── Upsert worship_log ────────────────────────────────────────────────
      const payloadJson = JSON.stringify(
        payload !== undefined && payload !== null ? payload : {}
      );

      const upsertResult = await client.query<{
        id: string;
        user_id: string;
        log_date: string;
        payload: unknown;
        server_seq: string;
        created_at: string;
        updated_at: string;
      }>(
        `INSERT INTO worship_log (user_id, log_date, payload, server_seq)
         VALUES (
           $1, $2, $3,
           COALESCE((SELECT MAX(server_seq) FROM worship_log WHERE user_id = $1), 0) + 1
         )
         ON CONFLICT (user_id, log_date)
         DO UPDATE SET
           payload    = EXCLUDED.payload,
           server_seq = COALESCE((SELECT MAX(server_seq) FROM worship_log WHERE user_id = $1), 0) + 1,
           updated_at = now()
         RETURNING id, user_id, log_date, payload, server_seq, created_at, updated_at`,
        [userId, log_date, payloadJson]
      );

      const record     = upsertResult.rows[0];
      const httpStatus = 200;
      const body       = { data: record };

      // ── Cache idempotency result ──────────────────────────────────────────
      if (typeof idempotency_key === 'string') {
        await client.query(
          `INSERT INTO idempotency_keys (key, user_id, status, body)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (key) DO NOTHING`,
          [idempotency_key, userId, httpStatus, JSON.stringify(body)]
        );
      }

      // ── Advance sync cursor ───────────────────────────────────────────────
      await client.query(
        `INSERT INTO sync_cursors (user_id, last_seq)
         VALUES ($1, $2)
         ON CONFLICT (user_id)
         DO UPDATE SET
           last_seq   = GREATEST(sync_cursors.last_seq, EXCLUDED.last_seq),
           updated_at = now()`,
        [userId, record.server_seq]
      );

      res.status(httpStatus).json(body);
    } catch (err) {
      next(err);
    } finally {
      client.release();
    }
  }
);

// ── GET /worship/logs ─────────────────────────────────────────────────────────
/**
 * Query params:
 *   since     — YYYY-MM-DD: only return logs on/after this date
 *   after_seq — integer ≥0: only return logs with server_seq > this value
 *   limit     — 1-100 (default 50)
 */
router.get(
  '/logs',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.sessionUserId as string;

    const { since, after_seq, limit: limitParam } = req.query as Record<string, unknown>;

    if (since !== undefined && !isIsoDate(since)) {
      res.status(400).json({ error: { code: 'INVALID_SINCE', message: 'since must be YYYY-MM-DD' } });
      return;
    }

    const afterSeqNum = after_seq !== undefined ? Number(after_seq) : undefined;
    if (afterSeqNum !== undefined && (!Number.isFinite(afterSeqNum) || afterSeqNum < 0 || !Number.isInteger(afterSeqNum))) {
      res.status(400).json({ error: { code: 'INVALID_AFTER_SEQ', message: 'after_seq must be a non-negative integer' } });
      return;
    }

    const limitNum = clampLimit(limitParam, 50, 100);

    const pool = getPool();
    if (pool === null) {
      res.status(503).json({ error: { code: 'DB_UNAVAILABLE', message: 'Database not configured' } });
      return;
    }

    try {
      const params: unknown[] = [userId, limitNum + 1];
      const conditions: string[] = ['user_id = $1'];

      if (isIsoDate(since)) {
        params.push(since);
        conditions.push(`log_date >= $${params.length}`);
      }
      if (afterSeqNum !== undefined) {
        params.push(afterSeqNum);
        conditions.push(`server_seq > $${params.length}`);
      }

      const result = await pool.query<{
        id: string;
        log_date: string;
        payload: unknown;
        server_seq: string;
        created_at: string;
        updated_at: string;
      }>(
        `SELECT id, log_date, payload, server_seq, created_at, updated_at
         FROM worship_log
         WHERE ${conditions.join(' AND ')}
         ORDER BY server_seq ASC
         LIMIT $2`,
        params
      );

      const rows    = result.rows;
      const hasMore = rows.length > limitNum;
      const data    = hasMore ? rows.slice(0, limitNum) : rows;

      res.json({
        data,
        meta: {
          count:          data.length,
          has_more:       hasMore,
          next_after_seq: hasMore ? data[data.length - 1]?.server_seq ?? null : null,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

export { router as worshipRouter };
