/**
 * ZAD API — Library Router (proxy)
 *
 * The textual library is served by the public HadeethEnc API. Calling it
 * directly from the browser works only when that host is reachable and
 * sends permissive CORS headers; on restricted networks (and inside the
 * PWA's offline shell) it does not. This router is a thin, cached,
 * rate-friendly proxy on our own origin:
 *
 *   GET /api/v1/library/categories            → root categories (+ counts)
 *   GET /api/v1/library/hadiths?category_id&page&per_page
 *   GET /api/v1/library/hadiths/:id
 *
 * Design notes:
 *   • No authentication: the upstream data is public.
 *   • `hadiths` may omit category_id — the upstream then needs a category,
 *     so we fall back to the first root category rather than erroring.
 *   • 5-minute in-memory cache (bounded) keeps us far away from upstream
 *     rate limits and makes the reader feel instant on repeat visits.
 *   • Upstream timeout 8s; on failure we return 502 with a typed code so
 *     the client can fall back to its bundled seed without guessing.
 */

import { Router, Request, Response } from 'express';

const router = Router();

const UPSTREAM = 'https://hadeethenc.com/api/v1';
const UPSTREAM_TIMEOUT_MS = 8000;
const CACHE_TTL_MS = 5 * 60 * 1000;
const CACHE_MAX = 200;

interface CacheEntry {
  at: number;
  body: unknown;
}

const cache = new Map<string, CacheEntry>();

function cacheGet(key: string): unknown | null {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return hit.body;
}

function cacheSet(key: string, body: unknown): void {
  if (cache.size >= CACHE_MAX) {
    const oldest = [...cache.entries()].sort((a, b) => a[1].at - b[1].at)[0];
    if (oldest) cache.delete(oldest[0]);
  }
  cache.set(key, { at: Date.now(), body });
}

async function upstream(path: string): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    const res = await fetch(`${UPSTREAM}${path}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json', 'User-Agent': 'ZAD/1.0 (+https://zad.codeandcanvas.net)' },
    });
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

function clampInt(raw: unknown, fallback: number, min: number, max: number): number {
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(Math.max(Math.floor(n), min), max);
}

// ── GET /library/categories ──────────────────────────────────────────────────
router.get('/categories', async (req: Request, res: Response): Promise<void> => {
  const language = typeof req.query.language === 'string' && /^[a-z-]{2,7}$/.test(req.query.language)
    ? req.query.language
    : 'ar';
  const key = `categories:${language}`;
  const cached = cacheGet(key);
  if (cached) {
    res.set('X-Zad-Cache', 'hit').json(cached);
    return;
  }
  try {
    const body = await upstream(`/categories/list/?language=${encodeURIComponent(language)}`);
    cacheSet(key, body);
    res.set('X-Zad-Cache', 'miss').set('Cache-Control', 'public, max-age=300').json(body);
  } catch {
    res.status(502).json({ error: { code: 'UPSTREAM_UNAVAILABLE', message: 'تعذّر الوصول إلى مصدر المكتبة' } });
  }
});

// ── GET /library/hadiths?category_id=..&page=..&per_page=.. ──────────────────
router.get('/hadiths', async (req: Request, res: Response): Promise<void> => {
  const categoryId = typeof req.query.category_id === 'string' && /^\d{1,5}$/.test(req.query.category_id)
    ? req.query.category_id
    : '1';
  const page = clampInt(req.query.page, 1, 1, 500);
  const perPage = clampInt(req.query.per_page, 20, 1, 50);
  const language = typeof req.query.language === 'string' && /^[a-z-]{2,7}$/.test(req.query.language)
    ? req.query.language
    : 'ar';

  const key = `list:${language}:${categoryId}:${page}:${perPage}`;
  const cached = cacheGet(key);
  if (cached) {
    res.set('X-Zad-Cache', 'hit').json(cached);
    return;
  }
  try {
    const body = await upstream(
      `/hadeeths/list/?language=${language}&category_id=${categoryId}&page=${page}&per_page=${perPage}`,
    );
    cacheSet(key, body);
    res.set('X-Zad-Cache', 'miss').set('Cache-Control', 'public, max-age=300').json(body);
  } catch {
    res.status(502).json({ error: { code: 'UPSTREAM_UNAVAILABLE', message: 'تعذّر الوصول إلى مصدر المكتبة' } });
  }
});

// ── GET /library/hadiths/:id ─────────────────────────────────────────────────
router.get('/hadiths/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!/^\d{1,7}$/.test(id)) {
    res.status(400).json({ error: { code: 'INVALID_ID', message: 'معرّف الحديث غير صالح' } });
    return;
  }
  const language = typeof req.query.language === 'string' && /^[a-z-]{2,7}$/.test(req.query.language)
    ? req.query.language
    : 'ar';
  const key = `one:${language}:${id}`;
  const cached = cacheGet(key);
  if (cached) {
    res.set('X-Zad-Cache', 'hit').json(cached);
    return;
  }
  try {
    const body = await upstream(`/hadeeths/one/?language=${language}&id=${id}`);
    cacheSet(key, body);
    res.set('X-Zad-Cache', 'miss').set('Cache-Control', 'public, max-age=300').json(body);
  } catch {
    res.status(502).json({ error: { code: 'UPSTREAM_UNAVAILABLE', message: 'تعذّر الوصول إلى مصدر المكتبة' } });
  }
});

export { router as libraryRouter };
