import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';

/**
 * Attaches a unique request ID to every incoming request.
 *
 * If the incoming X-Request-Id header is present AND passes validation,
 * it is reused (e.g. forwarded by a trusted reverse proxy).
 * Otherwise a fresh crypto.randomUUID() is generated.
 *
 * Validation rules for accepted proxy-supplied IDs:
 *   - Must be a non-empty string (arrays are reduced to first element)
 *   - Length ≤ 128 characters
 *   - Characters: A-Z a-z 0-9 . _ : -  (no whitespace, no injection chars)
 *
 * The ID is attached to:
 *   req.requestId   (typed via module augmentation)
 *   X-Request-Id response header
 */
declare global {
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}

const SAFE_ID_RE = /^[A-Za-z0-9._:\-]{1,128}$/;

function sanitizeIncomingId(raw: string | string[] | undefined): string | null {
  if (raw === undefined) return null;

  // Proxy may forward as array — take first element only
  const candidate = Array.isArray(raw) ? raw[0] : raw;

  if (typeof candidate !== 'string') return null;
  if (!SAFE_ID_RE.test(candidate)) return null;

  return candidate;
}

export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const incoming = sanitizeIncomingId(req.headers['x-request-id']);
  const id = incoming ?? randomUUID();

  req.requestId = id;
  res.setHeader('X-Request-Id', id);
  next();
}
