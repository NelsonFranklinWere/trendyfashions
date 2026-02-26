import { Pool, PoolClient } from 'pg';

/**
 * Database connection: Supabase (PostgreSQL).
 * DATABASE_URL in .env.local must point to Supabase, e.g.:
 * postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres
 */
let pool: Pool | null = null;

/** Supabase (and most cloud Postgres) require SSL */
function isSupabaseOrCloud(connectionString: string): boolean {
  return (
    connectionString.includes('supabase.co') ||
    connectionString.includes('supabase.com') ||
    connectionString.includes('pooler.supabase.com')
  );
}

export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error(
        'DATABASE_URL environment variable is not set. ' +
        'Please set it in your .env.local file. ' +
        'For Supabase: postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres (use %40 for @ in password)'
      );
    }

    const useSsl = isSupabaseOrCloud(connectionString) || process.env.NODE_ENV === 'production';
    pool = new Pool({
      connectionString,
      ssl: useSsl ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
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

