#!/usr/bin/env node
// ============================================================
// ZAD — Cleanup Test User (Z5.1 revised — email auth)
// Usage: node scripts/cleanup_test_user.js <email>
// ============================================================
'use strict';

const { Pool } = require('pg');

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: node cleanup_test_user.js <email>');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const client = await pool.connect();
    try {
      // Cascade deletes sessions, users_auth, login_events (SET NULL) via FK
      const res = await client.query(
        `DELETE FROM users
         WHERE id IN (
           SELECT user_id FROM users_auth WHERE LOWER(email) = LOWER($1)
         )
         RETURNING id`,
        [email]
      );

      if (res.rowCount > 0) {
        console.log('✓ Deleted user email=' + email + ' id=' + res.rows[0].id);
      } else {
        console.log('⚠ User not found: ' + email + ' (already cleaned up?)');
      }
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
