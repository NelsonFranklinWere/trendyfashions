import type { NextApiResponse } from 'next';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { deleteBlogPost, updateBlogPost } from '@/lib/db/content';

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const isAuthenticated = await requireAuth(req, res);
  if (!isAuthenticated) return;

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Blog post ID is required' });
  }

  if (req.method === 'PUT') {
    try {
      const post = await updateBlogPost(id, req.body || {});
      if (!post) return res.status(404).json({ error: 'Blog post not found' });
      return res.status(200).json({ post });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to update blog post' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const ok = await deleteBlogPost(id);
      if (!ok) return res.status(404).json({ error: 'Blog post not found' });
      return res.status(200).json({ success: true });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to delete blog post' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
