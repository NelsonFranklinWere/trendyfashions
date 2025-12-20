/**
 * Migration Script: Export database from Supabase and import to PostgreSQL
 * 
 * This script:
 * 1. Exports all data from Supabase (images, products, admin_users, admin_sessions)
 * 2. Creates tables in PostgreSQL if they don't exist
 * 3. Imports all data to PostgreSQL
 * 4. Updates image URLs to point to local filesystem
 */

import { createClient } from '@supabase/supabase-js';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

const readFile = promisify(fs.readFile);

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const databaseUrl = process.env.DATABASE_URL;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

if (!databaseUrl) {
  console.error('❌ Missing DATABASE_URL environment variable');
  console.error('Please set DATABASE_URL in .env.local');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// PostgreSQL connection
const pool = new Pool({
  connectionString: databaseUrl,
});

async function query(text: string, params?: any[]) {
  const result = await pool.query(text, params);
  return { rows: result.rows, rowCount: result.rowCount || 0 };
}

interface MigrationStats {
  images: { total: number; imported: number; failed: number };
  products: { total: number; imported: number; failed: number };
  adminUsers: { total: number; imported: number; failed: number };
  adminSessions: { total: number; imported: number; failed: number };
}

async function createTables() {
  console.log('📋 Creating database tables...\n');

  const schemaPath = path.join(process.cwd(), 'database', 'postgres-schema.sql');
  
  if (!fs.existsSync(schemaPath)) {
    console.error(`❌ Schema file not found: ${schemaPath}`);
    process.exit(1);
  }

  const schema = await readFile(schemaPath, 'utf-8');

  // Remove RLS (Row Level Security) policies as we'll handle auth differently
  const cleanedSchema = schema
    .replace(/ALTER TABLE .* ENABLE ROW LEVEL SECURITY;/g, '')
    .replace(/DROP POLICY IF EXISTS .* ON .*;/g, '')
    .replace(/CREATE POLICY .* ON .* .*;/g, '');

  // Split by semicolons and execute each statement
  const statements = cleanedSchema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (const statement of statements) {
    try {
      await query(statement);
    } catch (error: any) {
      // Ignore "already exists" errors
      if (!error.message.includes('already exists') && !error.message.includes('duplicate')) {
        console.warn(`⚠️  Warning: ${error.message}`);
      }
    }
  }

  console.log('✅ Database tables created/verified\n');
}

async function migrateTable<T>(
  tableName: string,
  transformFn?: (row: T) => T
): Promise<{ total: number; imported: number; failed: number }> {
  console.log(`📥 Migrating ${tableName}...`);

  const stats = { total: 0, imported: 0, failed: 0 };

  try {
    // Fetch all data from Supabase
    const { data, error } = await supabaseAdmin
      .from(tableName)
      .select('*');

    if (error) {
      console.error(`❌ Error fetching ${tableName}:`, error);
      return stats;
    }

    if (!data || data.length === 0) {
      console.log(`   ⏭️  No ${tableName} to migrate`);
      return stats;
    }

    stats.total = data.length;
    console.log(`   Found ${stats.total} records`);

    // Import to PostgreSQL
    for (const row of data) {
      try {
        let rowToInsert = transformFn ? transformFn(row as T) : row;

        // Build INSERT query - handle NULL values properly
        const columns = Object.keys(rowToInsert).filter(col => rowToInsert[col as keyof typeof rowToInsert] !== undefined);
        const values = columns.map((_, i) => `$${i + 1}`);
        const valuesArray = columns.map(col => {
          const val = rowToInsert[col as keyof typeof rowToInsert];
          return val === null ? null : val;
        });

        const insertQuery = `
          INSERT INTO ${tableName} (${columns.join(', ')})
          VALUES (${values.join(', ')})
          ON CONFLICT (id) DO UPDATE SET
          ${columns.filter(c => c !== 'id').map(c => `${c} = EXCLUDED.${c}`).join(', ')}
        `;

        await query(insertQuery, valuesArray);
        stats.imported++;
      } catch (error: any) {
        console.error(`   ❌ Error importing ${tableName} record:`, error.message);
        stats.failed++;
      }
    }

    console.log(`   ✅ Imported ${stats.imported}/${stats.total} records\n`);
  } catch (error: any) {
    console.error(`❌ Error migrating ${tableName}:`, error);
  }

  return stats;
}

async function updateImageUrls() {
  console.log('🔄 Updating image URLs to local paths...\n');

  try {
    // Read migration log if it exists
    const logPath = path.join(process.cwd(), 'migration-images-log.json');
    if (!fs.existsSync(logPath)) {
      console.log('⚠️  Migration log not found. Skipping URL updates.');
      console.log('   Run migrate-images-from-supabase.ts first.');
      return;
    }

    const logData = await readFile(logPath, 'utf-8');
    const migrationLog = JSON.parse(logData);

    let updated = 0;
    let failed = 0;

    for (const entry of migrationLog) {
      if (entry.status === 'success' && entry.localPath) {
        try {
          await query(
            `UPDATE images SET url = $1, storage_path = $2 WHERE id = $3`,
            [entry.localPath, entry.localPath, entry.id]
          );
          updated++;
        } catch (error: any) {
          console.error(`   ❌ Error updating ${entry.filename}:`, error.message);
          failed++;
        }
      }
    }

    console.log(`   ✅ Updated ${updated} image URLs`);
    if (failed > 0) {
      console.log(`   ❌ Failed to update ${failed} image URLs`);
    }
    console.log('');
  } catch (error: any) {
    console.error('❌ Error updating image URLs:', error);
  }
}

async function migrateDatabase() {
  console.log('🚀 Starting database migration from Supabase to PostgreSQL...\n');

  // Test PostgreSQL connection
  try {
    await query('SELECT NOW()');
    console.log('✅ PostgreSQL connection successful\n');
  } catch (error: any) {
    console.error('❌ PostgreSQL connection failed:', error.message);
    console.error('Please ensure DATABASE_URL is set correctly in .env.local');
    process.exit(1);
  }

  const stats: MigrationStats = {
    images: { total: 0, imported: 0, failed: 0 },
    products: { total: 0, imported: 0, failed: 0 },
    adminUsers: { total: 0, imported: 0, failed: 0 },
    adminSessions: { total: 0, imported: 0, failed: 0 },
  };

  try {
    // 1. Create tables
    await createTables();

    // 2. Migrate tables
    stats.images = await migrateTable('images');
    stats.products = await migrateTable('products');
    stats.adminUsers = await migrateTable('admin_users');
    stats.adminSessions = await migrateTable('admin_sessions');

    // 3. Update image URLs if migration log exists
    await updateImageUrls();

    // 4. Print summary
    console.log('='.repeat(50));
    console.log('📊 Migration Summary');
    console.log('='.repeat(50));
    console.log(`Images:        ${stats.images.imported}/${stats.images.total} imported`);
    console.log(`Products:      ${stats.products.imported}/${stats.products.total} imported`);
    console.log(`Admin Users:   ${stats.adminUsers.imported}/${stats.adminUsers.total} imported`);
    console.log(`Admin Sessions: ${stats.adminSessions.imported}/${stats.adminSessions.total} imported`);
    console.log('='.repeat(50));

    const totalImported = 
      stats.images.imported + 
      stats.products.imported + 
      stats.adminUsers.imported + 
      stats.adminSessions.imported;
    
    const totalFailed = 
      stats.images.failed + 
      stats.products.failed + 
      stats.adminUsers.failed + 
      stats.adminSessions.failed;

    if (totalFailed > 0) {
      console.log(`\n⚠️  ${totalFailed} records failed to import. Check errors above.`);
    } else {
      console.log(`\n✅ All ${totalImported} records migrated successfully!`);
    }
  } catch (error: any) {
    console.error('\n❌ Migration error:', error);
    process.exit(1);
  }
}

// Run migration
migrateDatabase()
  .then(() => {
    console.log('\n✨ Database migration complete!');
    pool.end();
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    pool.end();
    process.exit(1);
  });

