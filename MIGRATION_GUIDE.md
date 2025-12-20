# Migration Guide: Supabase to PostgreSQL

This guide will help you migrate from Supabase to PostgreSQL on DigitalOcean.

## Prerequisites

1. **DigitalOcean Droplet** with PostgreSQL installed
2. **PostgreSQL database** created
3. **Environment variables** configured

## Step 1: Set Up PostgreSQL Database

### On DigitalOcean Server:

```bash
# Install PostgreSQL (if not already installed)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
```

In PostgreSQL:
```sql
CREATE DATABASE trendyfashions;
CREATE USER trendyfashion_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE trendyfashions TO trendyfashion_user;
\q
```

### Connection String Format:
```
postgresql://trendyfashion_user:your_secure_password@localhost:5432/trendyfashions
```

## Step 2: Configure Environment Variables

Create or update `.env.local`:

```env
# PostgreSQL Database (REQUIRED)
DATABASE_URL=postgresql://trendyfashion_user:your_secure_password@localhost:5432/trendyfashions

# Supabase (for migration only - can be removed after)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Step 3: Run Migration Scripts

### 3.1 Migrate Images from Supabase Storage

This downloads all images from Supabase Storage to your local filesystem:

```bash
npm run migrate:images
```

Images will be saved to: `public/images/migrated/{category}/{filename}`

### 3.2 Migrate Database from Supabase

This exports all data from Supabase and imports to PostgreSQL:

```bash
npm run migrate:database
```

Or run both migrations at once:

```bash
npm run migrate:all
```

## Step 4: Verify Migration

### Check Database:

```bash
# Connect to PostgreSQL
psql -U trendyfashion_user -d trendyfashions

# Check tables
\dt

# Check image count
SELECT COUNT(*) FROM images;

# Check product count
SELECT COUNT(*) FROM products;
```

### Check Images:

```bash
# Check migrated images
ls -la public/images/migrated/

# Check total size
du -sh public/images/migrated/
```

## Step 5: Update Code (Already Done)

The code has been updated to use PostgreSQL instead of Supabase:
- ✅ `lib/db/postgres.ts` - PostgreSQL connection
- ✅ `lib/db/images.ts` - Image database service
- ✅ `lib/db/products.ts` - Product database service
- ✅ API routes updated to use PostgreSQL

## Step 6: Test Locally

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Test image loading:
   - Visit `http://localhost:3000`
   - Check browser console for errors
   - Verify images load correctly

3. Test admin panel:
   - Visit `http://localhost:3000/admin/products`
   - Try creating/editing products

## Step 7: Deploy to DigitalOcean

### 7.1 Push to GitHub

```bash
git add .
git commit -m "Migrate from Supabase to PostgreSQL"
git push origin main
```

### 7.2 On DigitalOcean Server

```bash
# Pull latest code
cd /path/to/trendyfashions
git pull origin main

# Install dependencies (if needed)
npm install

# Set environment variables
nano .env.local
# Add DATABASE_URL

# Run migrations (if not done locally)
npm run migrate:all

# Restart application
pm2 restart trendyfashions
# or
npm run build
npm start
```

## Step 8: Clean Up (After Verification)

Once everything is working:

1. **Remove Supabase dependencies** (optional):
   ```bash
   npm uninstall @supabase/supabase-js
   ```

2. **Remove Supabase environment variables** from `.env.local`

3. **Delete Supabase project** (if no longer needed)

## Troubleshooting

### Connection Issues

**Error: "Connection refused"**
- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Check firewall: `sudo ufw allow 5432/tcp`
- Verify connection string format

**Error: "Authentication failed"**
- Check username and password
- Verify user has correct permissions

### Migration Issues

**Images not downloading:**
- Check Supabase credentials in `.env.local`
- Verify bucket exists and is accessible
- Check network connection

**Database import fails:**
- Check PostgreSQL is running
- Verify DATABASE_URL is correct
- Check table schema matches

### Performance Issues

**Slow queries:**
- Add indexes (already included in schema)
- Check connection pool settings
- Monitor database performance

## Support

If you encounter issues:
1. Check migration logs: `migration-images-log.json`
2. Check PostgreSQL logs: `sudo tail -f /var/log/postgresql/postgresql-*.log`
3. Verify environment variables are set correctly

