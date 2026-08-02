import fs from 'fs';
import path from 'path';

const UPLOAD_ROOT = path.join(process.cwd(), 'public', 'uploads');

function getPublicBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://trendyfashionzone.co.ke').replace(/\/$/, '');
}

/**
 * Save product image files under public/uploads and return a public site URL.
 * Replaces Supabase Storage for self-hosted DigitalOcean deployments.
 */
export async function uploadToLocalStorage(
  key: string,
  buffer: Buffer,
  _contentType?: string,
): Promise<string> {
  const safeKey = key.replace(/^\/+/, '').replace(/\.\./g, '');
  const dest = path.join(UPLOAD_ROOT, safeKey);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buffer);

  const encodedPath = safeKey
    .split('/')
    .map((seg) => encodeURIComponent(seg))
    .join('/');
  return `${getPublicBaseUrl()}/uploads/${encodedPath}`;
}

/** @deprecated Use uploadToLocalStorage — kept as alias during migration. */
export const uploadToSupabaseStorage = uploadToLocalStorage;
