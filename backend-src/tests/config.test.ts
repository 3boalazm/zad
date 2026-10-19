/**
 * Tests for src/config/index.ts
 * Using Node.js built-in test runner (node:test) — no external test deps.
 * Run after build: node --test dist/tests/config.test.js
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Base safe defaults — every loadWithEnv call starts from these,
// then overrides with the provided keys.
const DEFAULTS: Record<string, string> = {
  PORT: '4010',
  NODE_ENV: 'test',
  API_PREFIX: '/api/v1',
};

/**
 * Calls loadConfig() with a controlled set of env vars.
 * Saves & restores all touched keys so tests don't bleed into each other.
 */
function loadWithEnv(
  overrides: Record<string, string | undefined>
): ReturnType<typeof import('../config/index.js').loadConfig> {
  // Merge: start from safe defaults, then apply overrides
  const toSet: Record<string, string | undefined> = { ...DEFAULTS, ...overrides };

  // Save current env for all touched keys
  const saved: Record<string, string | undefined> = {};
  for (const k of Object.keys(toSet)) {
    saved[k] = process.env[k];
  }

  // Apply
  for (const [k, v] of Object.entries(toSet)) {
    if (v === undefined || v === '') {
      delete process.env[k];
    } else {
      process.env[k] = v;
    }
  }

  // Load config (loadConfig() reads process.env directly each call)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mod = require('../config/index.js') as typeof import('../config/index.js');
  let result: ReturnType<typeof mod.loadConfig> | undefined;
  let thrown: Error | undefined;
  try {
    result = mod.loadConfig();
  } catch (e) {
    thrown = e as Error;
  }

  // Restore env
  for (const [k, v] of Object.entries(saved)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }

  if (thrown !== undefined) throw thrown;
  return result!;
}

// ─────────────────────────────────────────────────────────────────────────────
describe('Config — PORT validation', () => {
  it('accepts a valid port', () => {
    const cfg = loadWithEnv({ PORT: '3000' });
    assert.equal(cfg.port, 3000);
  });

  it('accepts boundary port 1', () => {
    const cfg = loadWithEnv({ PORT: '1' });
    assert.equal(cfg.port, 1);
  });

  it('accepts boundary port 65535', () => {
    const cfg = loadWithEnv({ PORT: '65535' });
    assert.equal(cfg.port, 65535);
  });

  it('throws on port 0', () => {
    assert.throws(() => loadWithEnv({ PORT: '0' }), /PORT/);
  });

  it('throws on port 65536', () => {
    assert.throws(() => loadWithEnv({ PORT: '65536' }), /PORT/);
  });

  it('throws on non-integer port', () => {
    assert.throws(() => loadWithEnv({ PORT: 'abc' }), /PORT/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Config — API_PREFIX validation', () => {
  it('accepts /api/v1', () => {
    const cfg = loadWithEnv({ API_PREFIX: '/api/v1' });
    assert.equal(cfg.apiPrefix, '/api/v1');
  });

  it('strips trailing slash from /api/v1/', () => {
    const cfg = loadWithEnv({ API_PREFIX: '/api/v1/' });
    assert.equal(cfg.apiPrefix, '/api/v1');
  });

  it('preserves lone /', () => {
    const cfg = loadWithEnv({ API_PREFIX: '/' });
    assert.equal(cfg.apiPrefix, '/');
  });

  it('throws when prefix does not start with /', () => {
    assert.throws(() => loadWithEnv({ API_PREFIX: 'api/v1' }), /API_PREFIX/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Config — DATABASE_URL validation', () => {
  it('returns null when DATABASE_URL absent', () => {
    const cfg = loadWithEnv({ DATABASE_URL: undefined });
    assert.equal(cfg.databaseUrl, null);
  });

  it('accepts postgresql:// URL', () => {
    const cfg = loadWithEnv({ DATABASE_URL: 'postgresql://user:pass@localhost/db' });
    assert.equal(cfg.databaseUrl, 'postgresql://user:pass@localhost/db');
  });

  it('accepts postgres:// URL', () => {
    const cfg = loadWithEnv({ DATABASE_URL: 'postgres://user:pass@localhost/db' });
    assert.equal(cfg.databaseUrl, 'postgres://user:pass@localhost/db');
  });

  it('throws on mysql:// URL', () => {
    assert.throws(
      () => loadWithEnv({ DATABASE_URL: 'mysql://user:pass@localhost/db' }),
      /DATABASE_URL/
    );
  });
});
