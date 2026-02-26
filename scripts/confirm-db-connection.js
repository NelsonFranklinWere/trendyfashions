#!/usr/bin/env node
/**
 * Confirm Supabase database connection.
 * Usage: node scripts/confirm-db-connection.js
 * Requires: .env.local with DATABASE_URL (Supabase connection string)
 */
require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('ERROR: DATABASE_URL not set in .env.local');
  process.exit(1);
}

const isSupabase = url.includes('supabase.co');
const pool = new Pool({
  connectionString: url,
  ssl: isSupabase ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 10000,
});

async function main() {
  try {
    const r = await pool.query(
      'SELECT 1 as ok, current_database() as db, current_user as usr, version() as ver'
    );
    console.log('✅ Connection OK');
    console.log('   Database:', r.rows[0].db);
    console.log('   User:', r.rows[0].usr);
    console.log('   Server:', r.rows[0].ver.split(',')[0]);
    await pool.end();
  } catch (e) {
    console.error('❌ Connection failed:', e.message);
    if (e.message.includes('ENETUNREACH')) {
      console.error('   Tip: Your network may not reach Supabase (e.g. IPv6). Try from another machine or use the connection string from Supabase Dashboard → Project Settings → Database (Session mode / IPv4).');
    }
    process.exit(1);
  }
}

main();
