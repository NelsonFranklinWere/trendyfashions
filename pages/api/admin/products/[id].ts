import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase/server';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth/middleware';

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  // Require authentication for all operations
  const isAuthenticated = await requireAuth(req, res);
  if (!isAuthenticated) {
    return;
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        return res.status(404).json({ error: 'Product not found' });
      }

      return res.status(200).json({ product: data });
    } catch (error: any) {
      console.error('Error fetching product:', error);
      return res.status(500).json({ error: error.message || 'Failed to fetch product' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { name, description, price, image, category, subcategory, gender, tags, featured } = req.body;

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (price !== undefined) updateData.price = parseFloat(price);
      if (image !== undefined) updateData.image = image;
      if (category !== undefined) updateData.category = category;
      if (subcategory !== undefined) updateData.subcategory = subcategory;
      if (gender !== undefined) updateData.gender = gender || null;
      if (tags !== undefined) updateData.tags = tags || [];
      if (featured !== undefined) updateData.featured = featured || false;

      const { data, error } = await supabaseAdmin
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return res.status(200).json({ product: data });
    } catch (error: any) {
      console.error('Error updating product:', error);
      return res.status(500).json({ error: error.message || 'Failed to update product' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { error } = await supabaseAdmin.from('products').delete().eq('id', id);

      if (error) {
        throw error;
      }

      return res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('Error deleting product:', error);
      return res.status(500).json({ error: error.message || 'Failed to delete product' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
