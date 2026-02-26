/**
 * Supabase Storage service for product images.
 * Uses the `images` bucket in your Supabase project.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  // We throw here so any attempt to use storage without config fails fast and clearly
  throw new Error(
    'Supabase storage is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment.'
  );
}

// Admin client (service role) – server-side only
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Upload a file buffer to Supabase Storage `images` bucket.
 * @param key Path inside the bucket, e.g. `images/officials/file.webp`
 * @returns Public URL for the uploaded file
 */
export async function uploadToSupabaseStorage(
  key: string,
  buffer: Buffer,
  contentType: string,
  options?: {
    cacheControl?: string;
    metadata?: Record<string, string>;
  }
): Promise<string> {
  const { error } = await supabaseAdmin.storage.from('images').upload(key, buffer, {
    contentType,
    cacheControl: options?.cacheControl || 'public, max-age=31536000, immutable',
    upsert: false,
    // Supabase automatically stores metadata; we can pass it if needed
    metadata: options?.metadata,
  } as any);

  if (error) {
    throw new Error(`Supabase Storage upload failed for key "${key}": ${error.message}`);
  }

  const { data } = supabaseAdmin.storage.from('images').getPublicUrl(key);
  if (!data || !data.publicUrl) {
    throw new Error(`Supabase Storage did not return a public URL for key "${key}"`);
  }

  return data.publicUrl;
}

