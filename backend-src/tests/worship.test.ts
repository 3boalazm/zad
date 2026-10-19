/**
 * ZAD API — Worship + Sync unit tests
 * Sprint Z6: endpoint auth boundary without a real DB.
 *
 * Pattern mirrors existing test suite (auth.test.ts, health.test.ts):
 *   - Dynamic require() for module-level imports
 *   - node:http directly (no supertest)
 *   - before/after via require('node:test')
 *
 * Auth boundary tested:
 *   - No cookie                → 401 NO_SESSION (always, regardless of pool state)
 *   - Fake cookie, no real DB  → 401 SESSION_INVALID (pool exists from prior tests)
 *                                or 503 DB_UNAVAILABLE (pool null)
 *     Both indicate: not authenticated. We assert status !== 200.
 *
 * Validation and 503 behaviour is verified via smoke_test_z6.sh
 * against a live server with a real authenticated session.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';

// ── HTTP helpers ──────────────────────────────────────────────────────────────

function httpPost(
  server: http.Server,
  path: string,
  body: unknown,
  cookie = ''
): Promise<{ status: number; body: Record<string, unknown> }> {
  return new Promise((resolve, reject) => {
    const addr = server.address() as { port: number };
    const data = JSON.stringify(body);
    const req  = http.request(
      {
        host: '127.0.0.1',
        port: addr.port,
        path,
        method: 'POST',
        headers: {
          'Content-Type':   'application/json',
          'Content-Length': Buffer.byteLength(data),
          ...(cookie ? { cookie } : {}),
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (c: string) => { raw += c; });
        res.on('end', () => {
          resolve({ status: res.statusCode ?? 0, body: JSON.parse(raw) as Record<string, unknown> });
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function httpGet(
  server: http.Server,
  path: string,
  cookie = ''
): Promise<{ status: number; body: Record<string, unknown> }> {
  return new Promise((resolve, reject) => {
    const addr = server.address() as { port: number };
    const req  = http.get(
      {
        host: '127.0.0.1',
        port: addr.port,
        path,
        headers: { ...(cookie ? { cookie } : {}) },
      },
      (res) => {
        let raw = '';
        res.on('data', (c: string) => { raw += c; });
        res.on('end', () => {
          resolve({ status: res.statusCode ?? 0, body: JSON.parse(raw) as Record<string, unknown> });
        });
      }
    );
    req.on('error', reject);
  });
}

// ── POST /worship/logs ────────────────────────────────────────────────────────
describe('POST /worship/logs — auth boundary', () => {
  let server: http.Server;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { before, after } = require('node:test') as typeof import('node:test');

  before(async () => {
    delete process.env['DATABASE_URL'];
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createApp } = require('../app.js') as typeof import('../app.js');
    const app = createApp();
    await new Promise<void>((resolve) => {
      server = app.listen(0, '127.0.0.1', resolve);
    });
  });

  after(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it('returns 401 NO_SESSION when no cookie present', async () => {
    const { status, body } = await httpPost(server, '/api/v1/worship/logs', { log_date: '2026-06-16', payload: {} });
    assert.equal(status, 401);
    const err = body['error'] as Record<string, unknown>;
    assert.equal(err['code'], 'NO_SESSION');
  });

  it('returns non-200 when fake cookie (not authenticated)', async () => {
    const { status } = await httpPost(
      server,
      '/api/v1/worship/logs',
      { log_date: '2026-06-16', payload: {} },
      'zad_session=0000000000000000000000000000000000000000000000000000000000000000'
    );
    // Pool may or may not be configured depending on test order.
    // Either 401 SESSION_INVALID (pool exists, fake token not in DB)
    // or 503 DB_UNAVAILABLE (pool null). Both mean: not authenticated.
    assert.notEqual(status, 200);
    assert.ok(status === 401 || status === 503, `expected 401 or 503, got ${status}`);
  });
});

// ── GET /worship/logs ─────────────────────────────────────────────────────────
describe('GET /worship/logs — auth boundary', () => {
  let server: http.Server;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { before, after } = require('node:test') as typeof import('node:test');

  before(async () => {
    delete process.env['DATABASE_URL'];
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createApp } = require('../app.js') as typeof import('../app.js');
    const app = createApp();
    await new Promise<void>((resolve) => {
      server = app.listen(0, '127.0.0.1', resolve);
    });
  });

  after(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it('returns 401 NO_SESSION when no cookie present', async () => {
    const { status, body } = await httpGet(server, '/api/v1/worship/logs');
    assert.equal(status, 401);
    const err = body['error'] as Record<string, unknown>;
    assert.equal(err['code'], 'NO_SESSION');
  });

  it('returns non-200 when fake cookie (not authenticated)', async () => {
    const { status } = await httpGet(
      server,
      '/api/v1/worship/logs',
      'zad_session=0000000000000000000000000000000000000000000000000000000000000000'
    );
    assert.notEqual(status, 200);
    assert.ok(status === 401 || status === 503, `expected 401 or 503, got ${status}`);
  });
});

// ── POST /sync/push ───────────────────────────────────────────────────────────
describe('POST /sync/push — auth boundary', () => {
  let server: http.Server;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { before, after } = require('node:test') as typeof import('node:test');

  before(async () => {
    delete process.env['DATABASE_URL'];
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createApp } = require('../app.js') as typeof import('../app.js');
    const app = createApp();
    await new Promise<void>((resolve) => {
      server = app.listen(0, '127.0.0.1', resolve);
    });
  });

  after(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it('returns 401 NO_SESSION when no cookie present', async () => {
    const { status, body } = await httpPost(server, '/api/v1/sync/push', { changes: [] });
    assert.equal(status, 401);
    const err = body['error'] as Record<string, unknown>;
    assert.equal(err['code'], 'NO_SESSION');
  });

  it('returns non-200 when fake cookie (not authenticated)', async () => {
    const { status } = await httpPost(
      server,
      '/api/v1/sync/push',
      { changes: [{ log_date: '2026-06-16', payload: {} }] },
      'zad_session=0000000000000000000000000000000000000000000000000000000000000000'
    );
    assert.notEqual(status, 200);
    assert.ok(status === 401 || status === 503, `expected 401 or 503, got ${status}`);
  });
});

// ── POST /sync/pull ───────────────────────────────────────────────────────────
describe('POST /sync/pull — auth boundary', () => {
  let server: http.Server;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { before, after } = require('node:test') as typeof import('node:test');

  before(async () => {
    delete process.env['DATABASE_URL'];
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createApp } = require('../app.js') as typeof import('../app.js');
    const app = createApp();
    await new Promise<void>((resolve) => {
      server = app.listen(0, '127.0.0.1', resolve);
    });
  });

  after(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it('returns 401 NO_SESSION when no cookie present', async () => {
    const { status, body } = await httpPost(server, '/api/v1/sync/pull', { after_seq: 0 });
    assert.equal(status, 401);
    const err = body['error'] as Record<string, unknown>;
    assert.equal(err['code'], 'NO_SESSION');
  });

  it('returns non-200 when fake cookie (not authenticated)', async () => {
    const { status } = await httpPost(
      server,
      '/api/v1/sync/pull',
      { after_seq: 0 },
      'zad_session=0000000000000000000000000000000000000000000000000000000000000000'
    );
    assert.notEqual(status, 200);
    assert.ok(status === 401 || status === 503, `expected 401 or 503, got ${status}`);
  });
});
