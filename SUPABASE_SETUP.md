# Supabase Setup Guide

This guide will help you set up Supabase for image storage and management.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. A new Supabase project

## Step 1: Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in project details:
   - Name: `trendyfashions` (or your preferred name)
   - Database Password: (save this securely)
   - Region: Choose closest to your users
4. Wait for project to be created (2-3 minutes)

## Step 2: Create Storage Bucket

1. In your Supabase project dashboard, go to **Storage**
2. Click **New bucket**
3. Name: `images`
4. Public bucket: **Yes** (so images can be accessed via URL)
5. Click **Create bucket**

## Step 3: Set Up Database Table

1. Go to **SQL Editor** in your Supabase dashboard
2. Click **New query**
3. Copy and paste the contents of `supabase/migrations/001_create_images_table.sql`
4. Click **Run** (or press Cmd/Ctrl + Enter)
5. Verify the table was created by going to **Table Editor** → `images`

## Step 4: Get API Keys

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (this is your `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public** key (this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **service_role** key (this is your `SUPABASE_SERVICE_ROLE_KEY`) - **Keep this secret!**

## Step 5: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your Supabase credentials to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

3. **Important**: Add `.env.local` to `.gitignore` if not already there

## Step 6: Set Up Row Level Security (RLS)

The migration script already sets up RLS policies, but you may need to adjust them:

1. Go to **Authentication** → **Policies** in Supabase dashboard
2. For the `images` table, ensure:
   - **SELECT**: Public (anyone can read)
   - **INSERT/UPDATE/DELETE**: Authenticated users only (or adjust as needed)

## Step 7: Reduce Local Images (Optional)

Before uploading to Supabase, you can reduce local images to 6 per subcategory:

```bash
npm run reduce-images
```

This will:
- Keep only 6 images per subcategory
- Delete excess images
- Create a log of deleted files in `scripts/deleted-images.log`

## Step 8: Upload Images to Supabase

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/admin/images` in your browser

3. Upload images by:
   - Selecting a category
   - Selecting a subcategory
   - Choosing an image file
   - Clicking "Upload Image"

## Step 9: Verify Setup

1. Check Supabase Storage:
   - Go to **Storage** → **images** bucket
   - Verify uploaded files appear

2. Check Database:
   - Go to **Table Editor** → `images`
   - Verify records are created

3. Test API:
   - Visit `/api/images` in your browser
   - Should return JSON with image data

## Troubleshooting

### Images not uploading
- Check browser console for errors
- Verify environment variables are set correctly
- Check Supabase Storage bucket exists and is public
- Verify RLS policies allow inserts

### API errors
- Check Supabase project URL and keys are correct
- Verify database table exists
- Check Supabase dashboard for error logs

### Storage access denied
- Ensure storage bucket is set to **Public**
- Check RLS policies on storage bucket
- Verify service role key is used for admin operations

## Next Steps

1. Add authentication to admin routes (recommended)
2. Update product data fetching to use Supabase images
3. Migrate existing local images to Supabase
4. Set up image optimization/CDN if needed

## Security Notes

- Never commit `.env.local` to git
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret (it bypasses RLS)
- Consider adding authentication to `/admin/images` route
- Use RLS policies to restrict access as needed
