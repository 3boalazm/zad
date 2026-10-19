/**
 * Vercel's single serverless entry point for the ZAD Express API.
 * The implementation lives outside /api so Vercel does not count each
 * internal TypeScript module as a separate Serverless Function.
 */
export { default } from '../backend-src/app.js';
