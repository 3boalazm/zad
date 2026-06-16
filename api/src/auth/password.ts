/**
 * ZAD API — Password hashing utilities
 * Sprint Z5: argon2id — current best practice for password hashing.
 *
 * argon2id parameters (OWASP recommended minimums):
 *   memoryCost: 65536 KiB (64 MiB)
 *   timeCost:   3 iterations
 *   parallelism: 4
 *
 * Never store raw passwords. Always store the hash returned by hashPassword().
 * Verify with verifyPassword() — constant-time comparison built into argon2.
 */

import argon2 from 'argon2';

const ARGON2_OPTIONS: argon2.Options = {
  type: argon2.argon2id,
  memoryCost: 65536,  // 64 MiB
  timeCost: 3,
  parallelism: 4,
};

/**
 * Hashes a raw password using argon2id.
 * Returns a self-contained hash string (includes salt + params).
 */
export async function hashPassword(raw: string): Promise<string> {
  return argon2.hash(raw, ARGON2_OPTIONS);
}

/**
 * Verifies a raw password against a stored argon2 hash.
 * Returns true if matches, false otherwise.
 * Never throws on wrong password — only throws on internal error.
 */
export async function verifyPassword(
  hash: string,
  raw: string
): Promise<boolean> {
  try {
    return await argon2.verify(hash, raw);
  } catch {
    // Malformed hash or internal error — treat as no-match
    return false;
  }
}
