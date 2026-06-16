/**
 * Tests for /health/ready and /health/live
 * Uses node:test + supertest-style manual HTTP checks (no supertest dependency).
 * We spin up the app directly via createApp() and use node:http.
 */
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';

// We test the app without a real DB pool.
// db/index.ts will return 'not_configured' when _pool is null.
// We import createApp after ensuring DATABASE_URL is unset.
async function getJson(
  server: http.Server,
  path: string
): Promise<{ status: number; body: Record<string, unknown> }> {
  return new Promise((resolve, reject) => {
    const addr = server.address() as { port: number };
    const req = http.get(
      { host: '127.0.0.1', port: addr.port, path },
      (res) => {
        let data = '';
        res.on('data', (chunk: string) => { data += chunk; });
        res.on('end', () => {
          resolve({
            status: res.statusCode ?? 0,
            body: JSON.parse(data) as Record<string, unknown>,
          });
        });
      }
    );
    req.on('error', reject);
  });
}

describe('Health endpoints — no DATABASE_URL', () => {
  let server: http.Server;

  before(async () => {
    delete process.env['DATABASE_URL'];
    // Import createApp dynamically after clearing env
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createApp } = require('../app.js') as typeof import('../app.js');
    const app = createApp();
    await new Promise<void>((resolve) => {
      server = app.listen(0, '127.0.0.1', resolve); // port 0 = random
    });
  });

  after(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it('/health/live returns 200 with status ok', async () => {
    const { status, body } = await getJson(server, '/health/live');
    assert.equal(status, 200);
    assert.equal(body['status'], 'ok');
    assert.equal(body['check'], 'live');
  });

  it('/health/ready returns 200 with db:not_configured when no DATABASE_URL', async () => {
    const { status, body } = await getJson(server, '/health/ready');
    assert.equal(status, 200);
    assert.equal(body['status'], 'ok');
    assert.equal(body['db'], 'not_configured');
  });

  it('/health/ready does not include sprint label (removed in Z4)', async () => {
    const { body } = await getJson(server, '/health/ready');
    assert.equal(body['sprint'], undefined);
  });

  it('unknown route returns 404', async () => {
    const { status } = await getJson(server, '/nonexistent');
    assert.equal(status, 404);
  });
});
