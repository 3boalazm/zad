import { Router, Request, Response } from 'express';
import { getDbStatus } from '../db/index.js';
import { config } from '../config/index.js';

const router = Router();

/**
 * GET /health/live
 *
 * Liveness probe — confirms the process is running and the event loop
 * is responsive. Does NOT check dependencies (DB, external services).
 *
 * Always returns 200 while the process is alive.
 */
router.get('/live', (_req: Request, res: Response): void => {
  res.status(200).json({
    status: 'ok',
    service: config.serviceName,
    check: 'live',
    ts: new Date().toISOString(),
  });
});

/**
 * GET /health/ready
 *
 * Readiness probe — confirms the API is ready to serve traffic.
 *
 * HTTP status:
 *   200 — db is 'ok' or 'not_configured' (no DATABASE_URL set, expected)
 *   503 — db is 'error' (pool exists but DB is unreachable or misconfigured)
 *
 * Response body always includes { status, db } for monitoring.
 */
router.get('/ready', async (_req: Request, res: Response): Promise<void> => {
  const dbStatus = await getDbStatus();

  const httpStatus = dbStatus === 'error' ? 503 : 200;
  const overallStatus = dbStatus === 'error' ? 'degraded' : 'ok';

  res.status(httpStatus).json({
    status: overallStatus,
    service: config.serviceName,
    check: 'ready',
    db: dbStatus,
    ts: new Date().toISOString(),
  });
});

export { router as healthRouter };
