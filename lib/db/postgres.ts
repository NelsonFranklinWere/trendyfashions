import { Pool, PoolClient } from 'pg';

/**
 * Database connection: Supabase (PostgreSQL).
 * DATABASE_URL in .env.local must point to Supabase, e.g.:
 * postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres
 */
let pool: Pool | null = null;

/** Cloud Postgres (Supabase etc.) requires SSL; local Postgres does not. */
function shouldUseSsl(connectionString: string): boolean {
  if (process.env.DATABASE_SSL === 'true') return true;
  if (process.env.DATABASE_SSL === 'false') return false;
  const local =
    connectionString.includes('127.0.0.1') ||
    connectionString.includes('localhost') ||
    connectionString.includes('@postgres:') ||
    connectionString.includes('@/');
  if (local) return false;
  return (
    connectionString.includes('supabase.co') ||
    connectionString.includes('supabase.com') ||
    connectionString.includes('pooler.supabase.com') ||
    process.env.NODE_ENV === 'production'
  );
}

export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error(
        'DATABASE_URL environment variable is not set. ' +
        'Please set it in your .env.local file. ' +
        'Example: postgresql://user:password@127.0.0.1:5432/trendyfashionzone'
      );
    }

    const useSsl = shouldUseSsl(connectionString);
    pool = new Pool({
      connectionString,
      ssl: useSsl ? { rejectUnauthorized: false } : false,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }

  return pool;
}

// Execute a query
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<{ rows: T[]; rowCount: number }> {
  const client = getPool();
  const result = await client.query(text, params);
  return { rows: result.rows, rowCount: result.rowCount || 0 };
}

// Get a client from the pool for transactions
export async function getClient(): Promise<PoolClient> {
  return await getPool().connect();
}

// Execute a transaction
export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Close the pool (useful for cleanup in tests)
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

