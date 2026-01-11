require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const schemaPath = path.join(__dirname, '..', 'database', 'postgres-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Running database migration...');
    await pool.query(schema);
    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await pool.end();
  }
}

runMigration();