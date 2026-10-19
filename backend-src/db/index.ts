/**
 * ZAD API — Database module
 * Sprint Z4: real pg Pool connection — optional (no DATABASE_URL = not_configured).
 *
 * Design decisions:
 *   - Single pg.Pool, created once in server.ts and injected here.
 *   - No ORM, no query builder, no migrations in this module.
 *   - Migrations live in /db/migrations/ and are run manually / via CI.
 *   - getDbStatus() is async — pings with SELECT 1.
 *   - Pool is closed in graceful shutdown (server.ts).
 */

import { Pool, PoolConfig } from 'pg';

export type DbStatus = 'not_configured' | 'connecting' | 'ok' | 'error';

let _pool: Pool | null = null;

/**
 * Creates and stores the singleton pool.
 * Called once at startup in server.ts when DATABASE_URL is present.
 * Safe to call only if databaseUrl is non-null (enforced by caller).
 */
export function createPool(connectionString: string): Pool {
  const cfg: PoolConfig = {
    connectionString,
    max: 10,                // max concurrent connections
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    // SSL: trust the server's certificate in production if needed.
    // ssl defaults to false (plain TCP) for local/docker deployments.
    // Set DB_SSL=true to enable TLS (e.g. RDS, Supabase, managed cloud PG).
    ssl: process.env['DB_SSL'] === 'true' ? { rejectUnauthorized: false } : false,
  };
  _pool = new Pool(cfg);

  // Log pool-level errors so they don't silently crash the process
  _pool.on('error', (err) => {
    process.stderr.write(
      JSON.stringify({
        ts: new Date().toISOString(),
        level: 'error',
        msg: 'pg pool idle client error',
        error: err.message,
      }) + '\n'
    );
  });

  return _pool;
}

/**
 * Returns the active pool or null if not initialised.
 * Used by future route handlers (Sprint Z5+).
 */
export function getPool(): Pool | null {
  return _pool;
}

/**
 * Pings the database with SELECT 1.
 * Returns:
 *   'not_configured' — DATABASE_URL was not set; pool was never created
 *   'ok'            — SELECT 1 succeeded
 *   'error'         — pool exists but query failed (DB unreachable / bad creds)
 *
 * Never throws — callers (health route) must handle all statuses.
 */
export async function getDbStatus(): Promise<DbStatus> {
  if (_pool === null) return 'not_configured';

  try {
    await _pool.query('SELECT 1');
    return 'ok';
  } catch {
    return 'error';
  }
}

/**
 * Gracefully closes all pool connections.
 * Called from server.ts SIGTERM/SIGINT handler before process.exit().
 */
export async function closePool(): Promise<void> {
  if (_pool !== null) {
    await _pool.end();
    _pool = null;
  }
}
