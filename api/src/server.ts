/**
 * ZAD API — Server entry point
 * Sprint Z4: initialises DB pool (if DATABASE_URL set), then starts HTTP server.
 *
 * Startup sequence:
 *   1. Load config
 *   2. If DATABASE_URL present → createPool → smoke-test with getDbStatus()
 *   3. Create Express app
 *   4. Bind HTTP server to PORT
 *   5. On SIGTERM/SIGINT → close HTTP server → close pool → exit 0
 */

import { createApp } from './app.js';
import { config } from './config/index.js';
import { createPool, getDbStatus, closePool } from './db/index.js';

async function main(): Promise<void> {
  // ── DB initialisation (optional) ─────────────────────────────────────────
  if (config.databaseUrl !== null) {
    createPool(config.databaseUrl);

    const dbStatus = await getDbStatus();
    process.stdout.write(
      JSON.stringify({
        ts: new Date().toISOString(),
        level: dbStatus === 'ok' ? 'info' : 'warn',
        msg: 'DB pool initialised',
        db: dbStatus,
      }) + '\n'
    );
    // We do NOT crash on 'error' — the API starts and /health/ready returns 503.
    // This allows the process to stay alive while DB recovers.
  }

  // ── HTTP server ───────────────────────────────────────────────────────────
  const app = createApp();

  const server = app.listen(config.port, () => {
    process.stdout.write(
      JSON.stringify({
        ts: new Date().toISOString(),
        level: 'info',
        msg: 'ZAD API started',
        port: config.port,
        env: config.nodeEnv,
        apiPrefix: config.apiPrefix,
        db: config.databaseUrl ? 'pool_created' : 'not_configured',
        sprint: 'Z5',
      }) + '\n'
    );
  });

  // ── Graceful shutdown ─────────────────────────────────────────────────────
  function shutdown(signal: string): void {
    process.stdout.write(
      JSON.stringify({
        ts: new Date().toISOString(),
        level: 'info',
        msg: `Received ${signal} — shutting down gracefully`,
      }) + '\n'
    );

    server.close(async () => {
      await closePool();
      process.stdout.write(
        JSON.stringify({
          ts: new Date().toISOString(),
          level: 'info',
          msg: 'HTTP server and DB pool closed',
        }) + '\n'
      );
      process.exit(0);
    });

    // Force-kill after 10 seconds if graceful shutdown hangs
    setTimeout(() => {
      process.stderr.write('Graceful shutdown timeout — forcing exit\n');
      process.exit(1);
    }, 10_000).unref();
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
}

main().catch((err: unknown) => {
  process.stderr.write(
    JSON.stringify({
      ts: new Date().toISOString(),
      level: 'fatal',
      msg: 'Failed to start server',
      error: err instanceof Error ? err.message : String(err),
    }) + '\n'
  );
  process.exit(1);
});
