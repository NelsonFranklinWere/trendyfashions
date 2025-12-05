# Update Server - Quick Guide

## Option 1: Run on Server Directly

SSH into server and run:

```bash
ssh frank@178.128.47.122
cd ~/trendyfashionzone

# Pull latest code
git pull origin main

# Update .env.local with PostgreSQL password
# Replace [YOUR_PASSWORD] with actual password
nano .env.local
# Add or update:
# DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.zdeupdkbsueczuoercmm.supabase.co:5432/postgres

# Install, build, restart
npm install
npm run build
pm2 restart trendyfashionzone
```

## Option 2: Use Update Script (On Server)

```bash
ssh frank@178.128.47.122
cd ~/trendyfashionzone

# Upload update script first, then:
chmod +x scripts/update-server.sh
./scripts/update-server.sh YOUR_POSTGRES_PASSWORD
```

## Option 3: Remote Update (From Local Machine)

```bash
# From your local machine
./scripts/remote-update.sh YOUR_POSTGRES_PASSWORD
```

## What the Update Does:

1. ✅ Pulls latest code from GitHub
2. ✅ Updates .env.local with PostgreSQL connection string
3. ✅ Installs new dependencies (if any)
4. ✅ Rebuilds the application
5. ✅ Restarts PM2 process

## Get PostgreSQL Password:

The password is in your Supabase dashboard:
1. Go to: https://supabase.com/dashboard/project/zdeupdkbsueczuoercmm/settings/database
2. Find "Connection string" or "Database password"
3. Use that password in the connection string
