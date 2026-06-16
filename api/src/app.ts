/**
 * ZAD API — Express application factory
 * Sprint Z5: Auth/Sessions added (login, logout, me, requireAuth middleware).
 *
 * Middleware order:
 *   1. requestId      — UUID per request
 *   2. cookieParser   — parse HttpOnly session cookies
 *   3. json body      — parse request bodies
 *   4. requestLogger  — structured JSON logs
 *   5. routes         — /health, /api/v1/auth, /api/v1 index
 *   6. notFound       — 404 handler
 *   7. errorHandler   — global error handler (4-arg, last)
 *
 * CORS: disabled — same-origin with PWA (ADR-008).
 */

import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import { config } from './config/index.js';
import { requestIdMiddleware } from './middleware/requestId.js';
import { requestLogger } from './middleware/requestLogger.js';
import { notFoundHandler } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import { healthRouter } from './health/health.router.js';
import { authRouter } from './auth/auth.router.js';

export function createApp(): Application {
  const app = express();

  // ── Security hardening ────────────────────────────────────────────────────
  app.disable('x-powered-by');

  // ── 1. Request ID ─────────────────────────────────────────────────────────
  app.use(requestIdMiddleware);

  // ── 2. Cookie parser (before routes that read session cookie) ────────────
  app.use(cookieParser());

  // ── 3. Body parsing ───────────────────────────────────────────────────────
  app.use(express.json({ limit: '256kb' }));

  // ── 4. Request logging ────────────────────────────────────────────────────
  app.use(requestLogger);

  // ── 5. Routes ─────────────────────────────────────────────────────────────
  app.use('/health', healthRouter);
  app.use(`${config.apiPrefix}/auth`, authRouter);

  app.get(config.apiPrefix, (_req, res) => {
    res.json({
      service: config.serviceName,
      version: '0.5.0',
      sprint: 'Z5',
      message: 'ZAD API — Auth/Sessions active.',
      endpoints: [
        'POST /api/v1/auth/login',
        'POST /api/v1/auth/logout',
        'GET  /api/v1/auth/me',
      ],
    });
  });

  // ── 6. Not found handler ──────────────────────────────────────────────────
  app.use(notFoundHandler);

  // ── 7. Global error handler (must be last) ────────────────────────────────
  app.use(errorHandler);

  return app;
}
