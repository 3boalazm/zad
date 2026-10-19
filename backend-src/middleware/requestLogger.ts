import { Request, Response, NextFunction } from 'express';

/**
 * Lightweight request logger.
 * Logs: timestamp, method, path, status, duration, request-id.
 * Uses process.stdout directly — no external logging library in Z3.
 * Replace with pino/winston in Z4+ if needed.
 */
export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const line = JSON.stringify({
      ts: new Date().toISOString(),
      method: req.method,
      path: req.path,
      status: res.statusCode,
      ms: duration,
      reqId: req.requestId,
    });
    process.stdout.write(line + '\n');
  });

  next();
}
