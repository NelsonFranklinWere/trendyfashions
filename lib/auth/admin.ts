import { supabaseAdmin } from '@/lib/supabase/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  is_active: boolean;
}

export interface SessionData {
  userId: string;
  email: string;
  name: string | null;
  role: string;
}

// Generate a secure random token
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Verify password using bcrypt
export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

// Hash password using bcrypt
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

// Create admin session
export async function createAdminSession(userId: string): Promise<string> {
  const token = generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  const { error } = await supabaseAdmin
    .from('admin_sessions')
    .insert({
      user_id: userId,
      token,
      expires_at: expiresAt.toISOString(),
    });

  if (error) {
    throw new Error('Failed to create session');
  }

  return token;
}

// Verify session token
export async function verifySession(token: string): Promise<SessionData | null> {
  const { data: session, error } = await supabaseAdmin
    .from('admin_sessions')
    .select(`
      *,
      admin_users:user_id (
        id,
        email,
        name,
        role,
        is_active
      )
    `)
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error || !session) {
    return null;
  }

  const user = (session as any).admin_users;
  if (!user || !user.is_active) {
    return null;
  }

  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

// Delete session (logout)
export async function deleteSession(token: string): Promise<void> {
  await supabaseAdmin
    .from('admin_sessions')
    .delete()
    .eq('token', token);
}

// Clean up expired sessions
export async function cleanupExpiredSessions(): Promise<void> {
  await supabaseAdmin
    .from('admin_sessions')
    .delete()
    .lt('expires_at', new Date().toISOString());
}

// Authenticate admin user
export async function authenticateAdmin(email: string, password: string): Promise<{ user: AdminUser; token: string } | null> {
  const { data: user, error } = await supabaseAdmin
    .from('admin_users')
    .select('*')
    .eq('email', email.toLowerCase())
    .eq('is_active', true)
    .single();

  if (error || !user) {
    return null;
  }

  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) {
    return null;
  }

  // Update last login
  await supabaseAdmin
    .from('admin_users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', user.id);

  const token = await createAdminSession(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      is_active: user.is_active,
    },
    token,
  };
}
