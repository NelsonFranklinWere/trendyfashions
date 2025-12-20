# Server Update Instructions

## Quick Update (Run on Server)

SSH into your server and run these commands:

```bash
# 1. Connect to server
ssh frank@178.128.47.122

# 2. Navigate to app directory
cd ~/trendyfashionzone

# 3. Pull latest code
git pull origin main

# 4. Install/update dependencies
npm install

# 5. Verify .env.local has all required variables
cat .env.local | grep -E "(DATABASE_URL|DO_SPACES)"

# 6. If missing, add DigitalOcean Spaces variables:
nano .env.local
# Add these lines:
# DO_SPACES_ENDPOINT=https://lon1.digitaloceanspaces.com
# DO_SPACES_KEY=DO00K776LV6P72227KML
# DO_SPACES_SECRET=3L/uwRaSV4sfoi0onGKP/dxvCfPWFTfuK2d1Cmfad+A
# DO_SPACES_BUCKET=trendyfashions
# DO_SPACES_CDN_URL=https://trendyfashions.lon1.cdn.digitaloceanspaces.com

# 7. Build the application
npm run build

# 8. Restart PM2
pm2 restart trendyfashionzone

# 9. Check status
pm2 status
pm2 logs trendyfashionzone --lines 20
```

## Required Environment Variables

Make sure `.env.local` contains:

```env
# PostgreSQL Database
DATABASE_URL=postgresql://trendyfashion_user:Trendy@Zone254@localhost:5432/trendyfashions

# DigitalOcean Spaces
DO_SPACES_ENDPOINT=https://lon1.digitaloceanspaces.com
DO_SPACES_KEY=DO00K776LV6P72227KML
DO_SPACES_SECRET=3L/uwRaSV4sfoi0onGKP/dxvCfPWFTfuK2d1Cmfad+A
DO_SPACES_BUCKET=trendyfashions
DO_SPACES_CDN_URL=https://trendyfashions.lon1.cdn.digitaloceanspaces.com

# App Configuration
NODE_ENV=production
PORT=3000
```

