/**
 * ZAD API — Configuration
 * Sprint Z4: DATABASE_URL validated if present (must be postgresql:// or postgres://).
 */

export interface AppConfig {
  port: number;
  nodeEnv: string;
  apiPrefix: string;
  /** Null when DATABASE_URL is not set — pool is not created */
  databaseUrl: string | null;
  serviceName: string;
}

function getEnv(key: string, fallback?: string): string {
  const value = process.env[key];
  if (value !== undefined && value !== '') return value;
  if (fallback !== undefined) return fallback;
  throw new Error(`Missing required environment variable: ${key}`);
}

function getOptionalEnv(key: string): string | null {
  const value = process.env[key];
  return value !== undefined && value !== '' ? value : null;
}

function parsePort(raw: string): number {
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > 65535) {
    throw new Error(`Invalid PORT "${raw}": must be an integer between 1 and 65535`);
  }
  return n;
}

function parseApiPrefix(raw: string): string {
  if (!raw.startsWith('/')) {
    throw new Error(`Invalid API_PREFIX "${raw}": must start with "/"`);
  }
  return raw.length > 1 ? raw.replace(/\/+$/, '') : raw;
}

/**
 * Validates DATABASE_URL format if provided.
 * Accepts postgresql:// and postgres:// schemes.
 * Does NOT test connectivity — that happens in server.ts via createPool().
 * Returns null if not set (pool will not be created).
 */
function parseDatabaseUrl(raw: string | null): string | null {
  if (raw === null) return null;
  if (!raw.startsWith('postgresql://') && !raw.startsWith('postgres://')) {
    throw new Error(
      'Invalid DATABASE_URL: must start with postgresql:// or postgres://'
    );
  }
  return raw;
}

export function loadConfig(): AppConfig {
  return {
    port: parsePort(getEnv('PORT', '4010')),
    nodeEnv: getEnv('NODE_ENV', 'development'),
    apiPrefix: parseApiPrefix(getEnv('API_PREFIX', '/api/v1')),
    databaseUrl: parseDatabaseUrl(getOptionalEnv('DATABASE_URL')),
    serviceName: 'zad-api',
  };
}

export const config = loadConfig();
