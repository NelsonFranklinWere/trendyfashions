import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase/server';

// Category mapping to match database categories
const categoryMapping: Record<string, string> = {
  'mens-officials': 'mens-officials',
  'casual': 'casual',
  'loafers': 'loafers',
  'nike': 'nike',
  'sports': 'sports',
  'vans': 'vans',
  'mens-style': 'mens-style',
  'sneakers': 'sneakers',
  // Legacy mappings
  officials: 'mens-officials',
  casuals: 'casual',
  'mens-casuals': 'casual',
  'mens-loafers': 'loafers',
  'mens-nike': 'nike',
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { category } = req.query;

    // Map category to database category
    const dbCategory = category ? (categoryMapping[category as string] || category as string) : undefined;

    let query = supabaseAdmin.from('images').select('*').order('uploaded_at', { ascending: false });

    if (dbCategory) {
      query = query.eq('category', dbCategory);
    }

    const { data, error } = await query;

    if (error) {
      // Log error for debugging but don't fail the request
      console.error(`[API /images] Supabase error for category "${category}":`, error.message);
      // Return empty array instead of error to prevent frontend issues
      // This is expected if no images exist for a category yet
      return res.status(200).json({ images: [] });
    }

    // Log success for debugging
    if (dbCategory) {
      console.log(`[API /images] Successfully fetched ${data?.length || 0} images for category: ${dbCategory}`);
    }

    return res.status(200).json({ images: data || [] });
  } catch (error: any) {
    // Log error for debugging but don't fail the request
    console.error(`[API /images] Unexpected error for category "${req.query.category}":`, error.message);
    // Return empty array instead of error to prevent frontend issues
    // This ensures smooth user experience even if API has issues
    return res.status(200).json({ images: [] });
  }
}
