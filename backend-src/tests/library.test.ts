/**
 * Tests for /api/v1/library — the HadeethEnc proxy.
 *
 * The upstream is never contacted: `globalThis.fetch` is replaced by a
 * deterministic stub, so the suite runs offline and fast.
 */
import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';

const realFetch = globalThis.fetch;

interface StubCall { url: string }

let calls: StubCall[] = [];
let mode: 'ok' | 'fail' | 'slow-ok' = 'ok';

function stubFetch(url: string | URL | Request): Promise<Response> {
  const href = String(url);
  calls.push({ url: href });

  if (!href.startsWith('https://hadeethenc.com/api/v1/')) {
    return Promise.reject(new Error(`unexpected upstream: ${href}`));
  }
  if (mode === 'fail') return Promise.reject(new Error('network down'));

  let payload: unknown;
  if (href.includes('/categories/list/')) {
    payload = [{ id: 1, title: 'القرآن', hadeeths_count: 197 }];
  } else if (href.includes('/hadeeths/one/')) {
    payload = { id: 42, title: 'الإخلاص', hadeeth: 'إنما الأعمال بالنيات', grade: 'صحيح' };
  } else if (href.includes('/hadeeths/list/')) {
    payload = { data: [{ id: 7, title: 'النية' }], meta: { current_page: 1, last_page: 3 } };
  } else {
    payload = {};
  }
  return Promise.resolve(
    new Response(JSON.stringify(payload), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );
}

async function getJson(
  server: http.Server,
  path: string,
): Promise<{ status: number; body: unknown; headers: http.IncomingHttpHeaders }> {
  return new Promise((resolve, reject) => {
    const addr = server.address() as { port: number };
    http
      .get({ host: '127.0.0.1', port: addr.port, path }, (res) => {
        let data = '';
        res.on('data', (chunk: string) => { data += chunk; });
        res.on('end', () => {
          let body: unknown = data;
          try { body = JSON.parse(data); } catch { /* keep raw */ }
          resolve({ status: res.statusCode ?? 0, body, headers: res.headers });
        });
      })
      .on('error', reject);
  });
}

describe('Library proxy', () => {
  let server: http.Server;

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
    globalThis.fetch = realFetch;
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  beforeEach(() => {
    calls = [];
    mode = 'ok';
    globalThis.fetch = stubFetch as unknown as typeof fetch;
  });

  it('proxies categories and normalises the language param', async () => {
    const res = await getJson(server, '/api/v1/library/categories');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.match(calls[0]!.url, /\/categories\/list\/\?language=ar$/);
    assert.equal(res.headers['cache-control'], 'public, max-age=300');
  });

  it('falls back to Arabic when the language param is malformed', async () => {
    await getJson(server, '/api/v1/library/hadiths?category_id=77&language=<script>');
    assert.match(calls[0]!.url, /language=ar&category_id=77/);
  });

  it('serves category lists with pagination passthrough', async () => {
    const res = await getJson(server, '/api/v1/library/hadiths?category_id=4&page=2&per_page=15');
    assert.equal(res.status, 200);
    assert.match(calls[0]!.url, /category_id=4&page=2&per_page=15$/);
    assert.deepEqual((res.body as { meta: { last_page: number } }).meta, { current_page: 1, last_page: 3 });
  });

  it('clamps out-of-range pagination instead of trusting the client', async () => {
    await getJson(server, '/api/v1/library/hadiths?category_id=4&page=-3&per_page=9999');
    assert.match(calls[0]!.url, /page=1&per_page=50$/);
  });

  it('uses category 1 when the client omits category_id', async () => {
    await getJson(server, '/api/v1/library/hadiths');
    assert.match(calls[0]!.url, /category_id=1&/);
  });

  it('serves a single hadith', async () => {
    const res = await getJson(server, '/api/v1/library/hadiths/42');
    assert.equal(res.status, 200);
    assert.match(calls[0]!.url, /\/hadeeths\/one\/\?language=ar&id=42$/);
    assert.equal((res.body as { id: number }).id, 42);
  });

  it('rejects a non-numeric hadith id without hitting the upstream', async () => {
    const res = await getJson(server, '/api/v1/library/hadiths/abc%20def');
    assert.equal(res.status, 400);
    assert.equal((res.body as { error: { code: string } }).error.code, 'INVALID_ID');
    assert.equal(calls.length, 0);
  });

  it('returns a typed 502 when the upstream is unreachable', async () => {
    mode = 'fail';
    const res = await getJson(server, '/api/v1/library/hadiths?category_id=9');
    assert.equal(res.status, 502);
    assert.equal((res.body as { error: { code: string } }).error.code, 'UPSTREAM_UNAVAILABLE');
  });

  it('caches repeat reads so upstream is called once', async () => {
    await getJson(server, '/api/v1/library/hadiths/99');
    const second = await getJson(server, '/api/v1/library/hadiths/99');
    assert.equal(calls.length, 1);
    assert.equal(second.headers['x-zad-cache'], 'hit');
  });
});
