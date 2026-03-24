import type { NextApiResponse } from 'next';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { createBlogPost, getBlogPosts } from '@/lib/db/content';

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const isAuthenticated = await requireAuth(req, res);
  if (!isAuthenticated) return;

  if (req.method === 'GET') {
    try {
      const posts = await getBlogPosts(false);
      return res.status(200).json({ posts });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to fetch blog posts' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, slug, excerpt, content, cover_image, published } = req.body || {};
      if (!title || !slug || !content) {
        return res.status(400).json({ error: 'title, slug and content are required' });
      }

      const post = await createBlogPost({
        title,
        slug,
        excerpt,
        content,
        cover_image,
        published: Boolean(published),
      });

      return res.status(201).json({ post });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to create blog post' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
