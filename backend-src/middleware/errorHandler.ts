import { Request, Response, NextFunction } from 'express';

/**
 * Global error handler.
 * Must be registered LAST (4-argument signature required by Express).
 *
 * In development: includes stack trace.
 * In production: stack is omitted.
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  const isDev = process.env['NODE_ENV'] !== 'production';

  const status =
    'status' in err && typeof (err as { status: unknown }).status === 'number'
      ? (err as { status: number }).status
      : 500;

  res.status(status).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: isDev ? err.message : 'An unexpected error occurred',
      ...(isDev ? { stack: err.stack } : {}),
      reqId: req.requestId,
    },
  });
}
