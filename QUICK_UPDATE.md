# Quick Server Update - Copy & Paste

Since automated SSH requires interactive password, here are the exact commands to run:

## Option 1: One-Line Command (Copy All)

```bash
ssh frank@178.128.47.122 'cd ~/trendyfashionzone && git pull origin main && npm install && npm run build && pm2 restart trendyfashionzone && pm2 status'
```

When prompted, enter password: `Trendy@254Zone`

## Option 2: Step-by-Step (Recommended)

```bash
# 1. Connect to server
ssh frank@178.128.47.122
# Password: Trendy@254Zone

# 2. Navigate to app
cd ~/trendyfashionzone

# 3. Pull latest code
git pull origin main

# 4. Install dependencies
npm install

# 5. Update .env.local (if needed)
nano .env.local
# Add these if missing:
# DO_SPACES_ENDPOINT=https://lon1.digitaloceanspaces.com
# DO_SPACES_KEY=DO00K776LV6P72227KML
# DO_SPACES_SECRET=3L/uwRaSV4sfoi0onGKP/dxvCfPWFTfuK2d1Cmfad+A
# DO_SPACES_BUCKET=trendyfashions
# DO_SPACES_CDN_URL=https://trendyfashions.lon1.cdn.digitaloceanspaces.com

# 6. Build
npm run build

# 7. Restart
pm2 restart trendyfashionzone

# 8. Check status
pm2 status
pm2 logs trendyfashionzone --lines 20
```

## Option 3: Use the Script on Server

After SSH'ing in:
```bash
cd ~/trendyfashionzone
bash scripts/run-on-server.sh
```

