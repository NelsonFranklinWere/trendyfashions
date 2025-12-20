# Migration Summary: Supabase to PostgreSQL

## ✅ Completed Tasks

### 1. PostgreSQL Database Setup
- ✅ Created PostgreSQL connection library (`lib/db/postgres.ts`)
- ✅ Created database schema file (`database/postgres-schema.sql`)
- ✅ Added `pg` package dependency

### 2. Database Service Layer
- ✅ Created `lib/db/images.ts` - Image database service
- ✅ Created `lib/db/products.ts` - Product database service  
- ✅ Created `lib/db/admin.ts` - Admin users and sessions service

### 3. Migration Scripts
- ✅ Created `scripts/migrate-images-from-supabase.ts` - Downloads all images from Supabase Storage
- ✅ Created `scripts/migrate-database-from-supabase.ts` - Migrates database from Supabase to PostgreSQL
- ✅ Added npm scripts: `migrate:images`, `migrate:database`, `migrate:all`

### 4. Code Updates
- ✅ Updated `pages/api/images/index.ts` to use PostgreSQL
- ✅ Updated `pages/api/admin/products/index.ts` to use PostgreSQL
- ✅ Updated `pages/api/admin/products/[id].ts` to use PostgreSQL
- ✅ Updated `lib/auth/admin.ts` to use PostgreSQL

### 5. Documentation
- ✅ Created `MIGRATION_GUIDE.md` - Complete migration instructions
- ✅ Created `.env.example` - Environment variable template
- ✅ Created `scripts/setup-postgres-digitalocean.sh` - DigitalOcean setup script

## 📋 Next Steps

### Step 1: Set Up PostgreSQL Database

**On DigitalOcean Server:**
```bash
# Run the setup script
bash scripts/setup-postgres-digitalocean.sh
```

**Or manually:**
```bash
sudo apt install postgresql postgresql-contrib
sudo -u postgres psql
CREATE DATABASE trendyfashions;
CREATE USER trendyfashion_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE trendyfashions TO trendyfashion_user;
```

### Step 2: Configure Environment Variables

Add to `.env.local`:
```env
DATABASE_URL=postgresql://trendyfashion_user:your_password@localhost:5432/trendyfashions
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Step 3: Run Migrations

```bash
# Download images from Supabase Storage
npm run migrate:images

# Migrate database from Supabase to PostgreSQL
npm run migrate:database

# Or run both at once
npm run migrate:all
```

### Step 4: Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000` and verify:
- Images load correctly
- Products display correctly
- Admin panel works

### Step 5: Push to GitHub

```bash
git add .
git commit -m "Migrate from Supabase to PostgreSQL"
git push origin main
```

### Step 6: Deploy to DigitalOcean

On your DigitalOcean server:
```bash
git pull origin main
npm install
npm run migrate:all  # If not done locally
npm run build
pm2 restart trendyfashions
```

## 🔄 Files Changed

### New Files Created:
- `lib/db/postgres.ts` - PostgreSQL connection
- `lib/db/images.ts` - Image database service
- `lib/db/products.ts` - Product database service
- `lib/db/admin.ts` - Admin database service
- `database/postgres-schema.sql` - PostgreSQL schema
- `scripts/migrate-images-from-supabase.ts` - Image migration script
- `scripts/migrate-database-from-supabase.ts` - Database migration script
- `scripts/setup-postgres-digitalocean.sh` - DigitalOcean setup script
- `MIGRATION_GUIDE.md` - Migration documentation
- `MIGRATION_SUMMARY.md` - This file

### Files Updated:
- `package.json` - Added migration scripts and `pg` dependency
- `pages/api/images/index.ts` - Now uses PostgreSQL
- `pages/api/admin/products/index.ts` - Now uses PostgreSQL
- `pages/api/admin/products/[id].ts` - Now uses PostgreSQL
- `lib/auth/admin.ts` - Now uses PostgreSQL
- `types/supabase.ts` - Added `thumbnail_url` to ImageRecord

## ⚠️ Important Notes

1. **Supabase Still Required**: During migration, you still need Supabase credentials to download images and export data. After migration is complete, you can remove Supabase.

2. **Image Storage**: Images are now stored locally in `public/images/migrated/{category}/{filename}`. Make sure this directory is accessible and backed up.

3. **Database Backup**: Always backup your PostgreSQL database before making changes:
   ```bash
   pg_dump -U trendyfashion_user trendyfashions > backup.sql
   ```

4. **Environment Variables**: Make sure `DATABASE_URL` is set correctly. The format is:
   ```
   postgresql://user:password@host:port/database
   ```

## 🐛 Troubleshooting

### Connection Issues
- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Verify connection string format
- Check firewall: `sudo ufw allow 5432/tcp`

### Migration Issues
- Check Supabase credentials are correct
- Verify PostgreSQL database exists
- Check migration logs: `migration-images-log.json`

### Image Loading Issues
- Verify images were downloaded: `ls -la public/images/migrated/`
- Check image paths in database match local paths
- Verify Next.js is serving static files correctly

## 📞 Support

If you encounter issues:
1. Check `MIGRATION_GUIDE.md` for detailed instructions
2. Review migration logs
3. Check PostgreSQL logs: `sudo tail -f /var/log/postgresql/postgresql-*.log`
4. Verify all environment variables are set correctly

