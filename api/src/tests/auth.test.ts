/**
 * ZAD API — Auth unit tests
 * Sprint Z5: password hashing, session token, /me without session.
 * Uses node:test + node:assert — no external test deps.
 *
 * These tests run WITHOUT a real DB (offline).
 * DB-dependent flows (login/logout against real DB) are verified in smoke tests.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';

// ── Password hashing ─────────────────────────────────────────────────────────
describe('Password hashing — argon2id', () => {
  it('hashPassword returns argon2id format string', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { hashPassword } = require('../auth/password.js') as typeof import('../auth/password.js');
    const hash = await hashPassword('correct-horse-battery-staple');
    assert.ok(hash.startsWith('$argon2id$'), `expected argon2id prefix, got: ${hash.substring(0, 20)}`);
  });

  it('verifyPassword returns true for correct password', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { hashPassword, verifyPassword } = require('../auth/password.js') as typeof import('../auth/password.js');
    const raw = 'correct-horse-battery-staple';
    const hash = await hashPassword(raw);
    const ok = await verifyPassword(hash, raw);
    assert.equal(ok, true);
  });

  it('verifyPassword returns false for wrong password', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { hashPassword, verifyPassword } = require('../auth/password.js') as typeof import('../auth/password.js');
    const hash = await hashPassword('correct-horse-battery-staple');
    const ok = await verifyPassword(hash, 'wrong-password');
    assert.equal(ok, false);
  });

  it('verifyPassword returns false for malformed hash (no throw)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { verifyPassword } = require('../auth/password.js') as typeof import('../auth/password.js');
    const ok = await verifyPassword('not-a-valid-hash', 'any-password');
    assert.equal(ok, false);
  });
});

// ── Session token utilities ───────────────────────────────────────────────────
describe('Session token utilities', () => {
  it('createSessionToken returns 64-char hex string', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createSessionToken } = require('../auth/session.js') as typeof import('../auth/session.js');
    const token = createSessionToken();
    assert.equal(token.length, 64);
    assert.match(token, /^[0-9a-f]{64}$/);
  });

  it('hashSessionToken is deterministic', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createSessionToken, hashSessionToken } = require('../auth/session.js') as typeof import('../auth/session.js');
    const token = createSessionToken();
    const h1 = hashSessionToken(token);
    const h2 = hashSessionToken(token);
    assert.equal(h1, h2);
    assert.equal(h1.length, 64); // SHA-256 hex = 64 chars
  });

  it('different tokens produce different hashes', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createSessionToken, hashSessionToken } = require('../auth/session.js') as typeof import('../auth/session.js');
    const h1 = hashSessionToken(createSessionToken());
    const h2 = hashSessionToken(createSessionToken());
    assert.notEqual(h1, h2);
  });

  it('hashSessionToken output differs from input (not identity)', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createSessionToken, hashSessionToken } = require('../auth/session.js') as typeof import('../auth/session.js');
    const token = createSessionToken();
    const hash = hashSessionToken(token);
    assert.notEqual(hash, token);
  });
});

// ── /auth/me without session (offline — no DB needed) ────────────────────────
describe('GET /auth/me — no session cookie', () => {
  let server: http.Server;

  async function getJson(path: string, cookies = ''): Promise<{ status: number; body: Record<string, unknown> }> {
    return new Promise((resolve, reject) => {
      const addr = server.address() as { port: number };
      const req = http.get(
        { host: '127.0.0.1', port: addr.port, path, headers: { cookie: cookies } },
        (res) => {
          let data = '';
          res.on('data', (c: string) => { data += c; });
          res.on('end', () => resolve({ status: res.statusCode ?? 0, body: JSON.parse(data) as Record<string, unknown> }));
        }
      );
      req.on('error', reject);
    });
  }

  // Use a node test lifecycle hook to start/stop server
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

  it('returns 401 with NO_SESSION when no cookie present', async () => {
    const { status, body } = await getJson('/api/v1/auth/me');
    assert.equal(status, 401);
    const err = body['error'] as Record<string, unknown>;
    assert.equal(err['code'], 'NO_SESSION');
  });

  it('login with missing fields returns 400', async () => {
    return new Promise((resolve, reject) => {
      const addr = server.address() as { port: number };
      const payload = JSON.stringify({ email: 'test@example.com' }); // missing password
      const req = http.request(
        { host: '127.0.0.1', port: addr.port, path: '/api/v1/auth/login',
          method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) } },
        (res) => {
          let data = '';
          res.on('data', (c: string) => { data += c; });
          res.on('end', () => {
            try {
              assert.equal(res.statusCode, 400);
              const body = JSON.parse(data) as Record<string, unknown>;
              const err = body['error'] as Record<string, unknown>;
              assert.equal(err['code'], 'INVALID_INPUT');
              resolve();
            } catch (e) { reject(e); }
          });
        }
      );
      req.on('error', reject);
      req.write(payload);
      req.end();
    });
  });

  it('login with DB unavailable returns 503', async () => {
    return new Promise((resolve, reject) => {
      const addr = server.address() as { port: number };
      const payload = JSON.stringify({ email: 'test@example.com', password: 'pass' });
      const req = http.request(
        { host: '127.0.0.1', port: addr.port, path: '/api/v1/auth/login',
          method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) } },
        (res) => {
          let data = '';
          res.on('data', (c: string) => { data += c; });
          res.on('end', () => {
            try {
              // No DB configured → 503
              assert.equal(res.statusCode, 503);
              resolve();
            } catch (e) { reject(e); }
          });
        }
      );
      req.on('error', reject);
      req.write(payload);
      req.end();
    });
  });
});
