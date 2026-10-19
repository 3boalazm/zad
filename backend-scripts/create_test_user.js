#!/usr/bin/env node
// ============================================================
// ZAD — Create Test User (Z5.1 revised — email auth)
// Usage: node scripts/create_test_user.js
// Reads DATABASE_URL from env (.env must be sourced first).
// Output: { userId, email, rawPassword }
// ============================================================
'use strict';

const { Pool } = require('pg');
const argon2   = require('argon2');
const crypto   = require('crypto');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    // Random credentials — never hardcoded
    const tag         = crypto.randomBytes(4).toString('hex');
    const email       = `smoke-${tag}@example.test`;
    const rawPassword = crypto.randomBytes(12).toString('hex');

    // argon2id — same config as src/auth/password.ts
    const passwordHash = await argon2.hash(rawPassword, {
      type:        argon2.argon2id,
      memoryCost:  65536,
      timeCost:    3,
      parallelism: 1,
    });

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insert user (is_anonymous=false for smoke test)
      const userRes = await client.query(
        `INSERT INTO users (is_anonymous, display_name, locale)
         VALUES (false, $1, 'ar')
         RETURNING id`,
        [`Smoke Test ${tag}`]
      );
      const userId = userRes.rows[0].id;

      // Insert email credentials
      await client.query(
        `INSERT INTO users_auth (user_id, email, password_hash, email_verified)
         VALUES ($1, $2, $3, true)`,
        [userId, email, passwordHash]
      );

      await client.query('COMMIT');

      console.log(JSON.stringify({ userId, email, rawPassword }, null, 2));

    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }

  } finally {
    await pool.end();
  }
}

main().catch(err => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
