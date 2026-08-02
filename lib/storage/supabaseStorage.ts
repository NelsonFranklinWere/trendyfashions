/**
 * Legacy Supabase Storage helper — unused in production.
 * Images are stored locally via lib/storage/localStorage.ts.
 * Kept only so old scripts do not break if imported by mistake.
 */

export async function uploadToSupabaseStorage(): Promise<string> {
  throw new Error(
    'Supabase Storage has been removed. Use uploadToLocalStorage from @/lib/storage/localStorage instead.',
  );
}
