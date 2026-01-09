import { NextApiRequest, NextApiResponse } from 'next';
import { verifySession } from './admin';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    userId: string;
    email: string;
    name: string | null;
    role: string;
  };
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: NextApiResponse
): Promise<boolean> {
  const token = req.cookies.admin_token;

  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return false;
  }

  const session = await verifySession(token);

  if (!session) {
    res.status(401).json({ error: 'Invalid or expired session' });
    return false;
  }

  req.user = session;
  return true;
}
