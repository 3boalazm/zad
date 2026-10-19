import { Request, Response } from 'express';

/**
 * 404 handler — catches any route not matched by the router.
 * Must be registered AFTER all routes.
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route not found: ${req.method} ${req.path}`,
      reqId: req.requestId,
    },
  });
}
