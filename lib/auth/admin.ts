import {
  getAdminUserByEmail,
  getAdminUserById,
  createAdminSession as createAdminSessionDb,
  getSessionByToken,
  deleteSession as deleteSessionDb,
  deleteExpiredSessions,
  updateLastLogin,
  type AdminUser as DbAdminUser,
} from '@/lib/db/admin';
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
  return await createAdminSessionDb(userId);
}

// Verify session token
export async function verifySession(token: string): Promise<SessionData | null> {
  const session = await getSessionByToken(token);

  if (!session) {
    return null;
  }

  const user = await getAdminUserById(session.user_id);
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
  await deleteSessionDb(token);
}

// Clean up expired sessions
export async function cleanupExpiredSessions(): Promise<void> {
  await deleteExpiredSessions();
}

// Authenticate admin user
export async function authenticateAdmin(email: string, password: string): Promise<{ user: AdminUser; token: string } | null> {
  const user = await getAdminUserByEmail(email.toLowerCase());

  if (!user || !user.is_active) {
    return null;
  }

  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) {
    return null;
  }

  // Update last login
  await updateLastLogin(user.id);

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
