/**
 * ZAD API — Vercel entry point
 * Vercel's zero-config Express detection needs a recognised file
 * (app|index|server.ts) that default-exports the app or calls app.listen().
 * server.ts wraps app.listen() inside an async main(), which Vercel's
 * detector can miss — so this file gives it a synchronous default export.
 * app.listen()/SIGTERM handling stay in server.ts for the standalone server;
 * Vercel's Fluid compute manages the request lifecycle itself.
 */
import { createApp } from './app.js';
import { config } from './config/index.js';
import { createPool } from './db/index.js';

if (config.databaseUrl !== null) {
  createPool(config.databaseUrl);
}

const app = createApp();

export default app;
