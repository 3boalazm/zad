/**
 * ZAD API — Sync Router
 * Sprint Z6: delta sync pull + batch push.
 *
 * POST /api/v1/sync/pull — pull server changes after cursor
 * POST /api/v1/sync/push — push batch of client changes (max 50)
 *
 * Auth: requireAuth middleware (req.sessionUserId).
 * All SQL is parameterized. All access scoped to sessionUserId.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { getPool } from '../db/index.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

// ── Validation helper ─────────────────────────────────────────────────────────

function isIsoDate(v: unknown): v is string {
  return typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
}

// ── POST /sync/pull ───────────────────────────────────────────────────────────
/**
 * Body:
 *   after_seq — integer ≥0 (default 0 = full sync)
 *   limit     — 1-500 (default 100)
 *
 * Returns worship_log rows for user where server_seq > after_seq.
 * Ordered by server_seq ASC for deterministic cursor pagination.
 */
router.post(
  '/pull',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.sessionUserId as string;

    const rawAfterSeq = (req.body as Record<string, unknown>)?.['after_seq'];
    const rawLimit    = (req.body as Record<string, unknown>)?.['limit'];

    const afterSeq = rawAfterSeq !== undefined ? Number(rawAfterSeq) : 0;
    if (!Number.isFinite(afterSeq) || afterSeq < 0 || !Number.isInteger(afterSeq)) {
      res.status(400).json({ error: { code: 'INVALID_AFTER_SEQ', message: 'after_seq must be a non-negative integer' } });
      return;
    }

    const limitNum = Math.min(Math.max(1, Number(rawLimit) || 100), 500);

    const pool = getPool();
    if (pool === null) {
      res.status(503).json({ error: { code: 'DB_UNAVAILABLE', message: 'Database not configured' } });
      return;
    }

    try {
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
         WHERE user_id = $1 AND server_seq > $2
         ORDER BY server_seq ASC
         LIMIT $3`,
        [userId, afterSeq, limitNum + 1]
      );

      const rows    = result.rows;
      const hasMore = rows.length > limitNum;
      const data    = hasMore ? rows.slice(0, limitNum) : rows;
      const nextSeq = data.length > 0
        ? Number(data[data.length - 1]?.server_seq ?? afterSeq)
        : afterSeq;

      res.json({ data, meta: { count: data.length, has_more: hasMore, next_after_seq: nextSeq } });
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /sync/push ───────────────────────────────────────────────────────────
/**
 * Body:
 *   changes — array of { log_date, payload?, idempotency_key? } (max 50)
 *
 * Per-item statuses:
 *   accepted         — new record inserted
 *   updated          — existing record updated
 *   skipped_duplicate — idempotency_key already processed
 *   failed           — validation error or DB error for this item
 *
 * One item failure does NOT abort remaining items.
 * Cross-user writes are prevented: all SQL uses sessionUserId.
 */

type PushStatus = 'accepted' | 'updated' | 'skipped_duplicate' | 'failed';

interface PushResult {
  log_date:    string;
  status:      PushStatus;
  server_seq?: string;
  error?:      string;
}

router.post(
  '/push',
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.sessionUserId as string;

    const { changes } = req.body as { changes?: unknown };

    if (!Array.isArray(changes)) {
      res.status(400).json({ error: { code: 'INVALID_BODY', message: 'changes must be an array' } });
      return;
    }
    if (changes.length === 0) {
      res.json({ results: [], meta: { accepted: 0, updated: 0, skipped_duplicate: 0, failed: 0 } });
      return;
    }
    if (changes.length > 50) {
      res.status(400).json({ error: { code: 'BATCH_TOO_LARGE', message: 'Maximum 50 changes per push' } });
      return;
    }

    const pool = getPool();
    if (pool === null) {
      res.status(503).json({ error: { code: 'DB_UNAVAILABLE', message: 'Database not configured' } });
      return;
    }

    const results: PushResult[] = [];
    const counts: Record<PushStatus, number> = { accepted: 0, updated: 0, skipped_duplicate: 0, failed: 0 };

    for (const rawChange of changes) {
      const change = rawChange as Record<string, unknown>;
      const { log_date, payload, idempotency_key } = change;

      // ── Per-item validation (no DB access for these) ──────────────────────
      if (!isIsoDate(log_date)) {
        results.push({ log_date: typeof log_date === 'string' ? log_date : '', status: 'failed', error: 'invalid log_date' });
        counts['failed']++;
        continue;
      }

      if (payload !== undefined && payload !== null) {
        if (typeof payload !== 'object' || Array.isArray(payload)) {
          results.push({ log_date, status: 'failed', error: 'payload must be object' });
          counts['failed']++;
          continue;
        }
      }

      if (idempotency_key !== undefined) {
        if (typeof idempotency_key !== 'string' || idempotency_key.length > 128) {
          results.push({ log_date, status: 'failed', error: 'invalid idempotency_key' });
          counts['failed']++;
          continue;
        }
      }

      // ── DB operations per item (isolated — one item error ≠ abort batch) ──
      const client = await pool.connect();
      try {
        // Idempotency check
        if (typeof idempotency_key === 'string') {
          const cached = await client.query<{ body: { status: PushStatus; server_seq?: string } }>(
            `SELECT body
             FROM idempotency_keys
             WHERE key = $1 AND user_id = $2 AND expires_at > now()`,
            [idempotency_key, userId]
          );
          if (cached.rows.length > 0) {
            const cachedBody = cached.rows[0].body;
            results.push({ log_date, status: 'skipped_duplicate', server_seq: cachedBody?.server_seq });
            counts['skipped_duplicate']++;
            continue;
          }
        }

        // Detect insert vs update
        const existing = await client.query<{ id: string }>(
          `SELECT id FROM worship_log WHERE user_id = $1 AND log_date = $2`,
          [userId, log_date]
        );
        const isNew = existing.rows.length === 0;

        // Upsert
        const payloadJson = JSON.stringify(payload !== undefined && payload !== null ? payload : {});
        const upsert = await client.query<{ server_seq: string }>(
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
           RETURNING server_seq`,
          [userId, log_date, payloadJson]
        );

        const { server_seq } = upsert.rows[0] as { server_seq: string };
        const itemStatus: PushStatus = isNew ? 'accepted' : 'updated';

        // Cache idempotency
        if (typeof idempotency_key === 'string') {
          await client.query(
            `INSERT INTO idempotency_keys (key, user_id, status, body)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (key) DO NOTHING`,
            [idempotency_key, userId, 200, JSON.stringify({ status: itemStatus, server_seq })]
          );
        }

        // Advance sync cursor
        await client.query(
          `INSERT INTO sync_cursors (user_id, last_seq)
           VALUES ($1, $2)
           ON CONFLICT (user_id)
           DO UPDATE SET
             last_seq   = GREATEST(sync_cursors.last_seq, EXCLUDED.last_seq),
             updated_at = now()`,
          [userId, server_seq]
        );

        results.push({ log_date, status: itemStatus, server_seq });
        counts[itemStatus]++;

      } catch (itemErr) {
        results.push({ log_date, status: 'failed', error: 'internal error' });
        counts['failed']++;
        process.stderr.write(
          JSON.stringify({
            ts: new Date().toISOString(),
            level: 'error',
            msg: 'sync/push item error',
            log_date,
            error: itemErr instanceof Error ? itemErr.message : String(itemErr),
          }) + '\n'
        );
      } finally {
        client.release();
      }
    }

    res.json({ results, meta: counts });
  }
);

export { router as syncRouter };
