/**
 * Database service for admin users and sessions
 * Uses PostgreSQL queries for admin user management
 */

import { query, transaction } from './postgres';
import crypto from 'crypto';

export interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
  name: string | null;
  role: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminSession {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

export async function getAdminUserByEmail(email: string): Promise<AdminUser | null> {
  const result = await query<AdminUser>(
    'SELECT * FROM admin_users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
}

export async function getAdminUserById(id: string): Promise<AdminUser | null> {
  const result = await query<AdminUser>(
    'SELECT * FROM admin_users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

export async function createAdminUser(data: {
  email: string;
  password_hash: string;
  name?: string;
  role?: string;
}): Promise<AdminUser> {
  const result = await query<AdminUser>(
    `INSERT INTO admin_users (email, password_hash, name, role)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [
      data.email,
      data.password_hash,
      data.name || null,
      data.role || 'admin',
    ]
  );
  return result.rows[0];
}

export async function updateAdminUser(
  id: string,
  data: Partial<AdminUser>
): Promise<AdminUser | null> {
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  Object.entries(data).forEach(([key, value]) => {
    if (key !== 'id' && value !== undefined) {
      updates.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  });

  if (updates.length === 0) {
    return await getAdminUserById(id);
  }

  values.push(id);
  const sql = `UPDATE admin_users SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

  const result = await query<AdminUser>(sql, values);
  return result.rows[0] || null;
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function createAdminSession(userId: string): Promise<string> {
  const token = generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  await query(
    `INSERT INTO admin_sessions (user_id, token, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, token, expiresAt.toISOString()]
  );

  return token;
}

export async function getSessionByToken(token: string): Promise<AdminSession | null> {
  const result = await query<AdminSession>(
    `SELECT * FROM admin_sessions 
     WHERE token = $1 AND expires_at > NOW()`,
    [token]
  );
  return result.rows[0] || null;
}

export async function deleteSession(token: string): Promise<boolean> {
  const result = await query(
    'DELETE FROM admin_sessions WHERE token = $1',
    [token]
  );
  return result.rowCount > 0;
}

export async function deleteExpiredSessions(): Promise<number> {
  const result = await query(
    'DELETE FROM admin_sessions WHERE expires_at < NOW()'
  );
  return result.rowCount || 0;
}

export async function updateLastLogin(userId: string): Promise<void> {
  await query(
    'UPDATE admin_users SET last_login = NOW() WHERE id = $1',
    [userId]
  );
}

