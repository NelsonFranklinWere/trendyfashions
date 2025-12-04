# Supabase Setup Checklist

## ✅ Completed
- [x] Database schema migration (`000_combined_schema.sql`) - **DONE**

## 🔴 Required Steps

### 1. Add Service Role Key to `.env.local`
**CRITICAL:** You need the Service Role Key for admin operations.

1. Go to: https://supabase.com/dashboard/project/zdeupdkbsueczuoercmm/settings/api
2. Copy the **`service_role` secret** key (NOT the anon key)
3. Update `.env.local`:
   ```
   SUPABASE_SERVICE_ROLE_KEY=paste_your_service_role_key_here
   ```

### 2. Create Storage Bucket
The app needs a storage bucket named `images` for file uploads.

1. Go to: https://supabase.com/dashboard/project/zdeupdkbsueczuoercmm/storage/buckets
2. Click **"New bucket"**
3. Name: `images`
4. Make it **Public** (uncheck "Private bucket")
5. Click **"Create bucket"**

### 3. Set Storage Policies (Optional but Recommended)
1. Go to Storage → `images` bucket → Policies
2. Add policy:
   - **Policy Name:** "Public read access"
   - **Allowed operation:** SELECT
   - **Policy definition:** `true` (allow all)
   - **Target roles:** `anon`, `authenticated`

### 4. Create Admin User
Run this command to create your first admin user:

```bash
npx ts-node --esm scripts/setup-admin.ts admin@trendyfashionzone.co.ke admin123 "Admin User"
```

Or use custom credentials:
```bash
npx ts-node --esm scripts/setup-admin.ts your-email@example.com your-password "Your Name"
```

### 5. Restart Development Server
After updating `.env.local`, restart your dev server:

```bash
npm run dev
```

## ✅ Verification Steps

### Test Database Connection
1. Visit: http://localhost:3000/admin/login
2. Login with your admin credentials
3. Should redirect to `/admin` dashboard

### Test Image Upload
1. Go to: http://localhost:3000/admin/products/add
2. Try uploading an image
3. Should upload successfully to Supabase Storage

### Test Product Management
1. Go to: http://localhost:3000/admin/products
2. Click "Add Product"
3. Fill form and submit
4. Product should appear in the list

## 🐛 Troubleshooting

### Error: "Missing Supabase environment variables"
- Check `.env.local` has all three keys:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- Restart dev server after updating `.env.local`

### Error: "Failed to upload image to storage"
- Verify storage bucket `images` exists
- Check bucket is set to **Public**
- Verify storage policies allow uploads

### Error: "Authentication required" on admin pages
- Run the setup-admin script to create admin user
- Check admin_users table has your email

### Error: "Invalid or expired session"
- Clear browser cookies
- Login again at `/admin/login`
