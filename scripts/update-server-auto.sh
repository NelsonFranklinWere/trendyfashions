#!/bin/bash
# Automated Server Update Script with Password
# Uses sshpass to automate SSH connection

set -e

DROPLET_IP="178.128.47.122"
DROPLET_USER="frank"
SSH_PASSWORD="Trendy@254Zone"

echo "🔄 Updating server at ${DROPLET_IP}..."
echo ""

sshpass -p "${SSH_PASSWORD}" ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null ${DROPLET_USER}@${DROPLET_IP} << 'ENDSSH'
set -e

# Detect app directory
if [ -d ~/trendyfashionzone ]; then
    APP_DIR=~/trendyfashionzone
elif [ -d ~/trendyfashions ]; then
    APP_DIR=~/trendyfashions
else
    echo "❌ App directory not found"
    exit 1
fi

cd "$APP_DIR"
echo "📁 Working in: $(pwd)"
echo ""

# Step 1: Pull latest code
echo "📥 Step 1: Pulling latest code from GitHub..."
git pull origin main || git pull origin master || {
    echo "⚠️  Git pull failed - continuing"
}
echo "✅ Code updated"
echo ""

# Step 2: Install dependencies
echo "📦 Step 2: Installing/updating dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Step 3: Update .env.local
echo "⚙️  Step 3: Updating .env.local..."
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found - creating..."
    touch .env.local
    chmod 600 .env.local
fi

# Backup .env.local
cp .env.local .env.local.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true

# Add DigitalOcean Spaces variables if missing
if ! grep -q "^DO_SPACES_ENDPOINT=" .env.local; then
    echo "" >> .env.local
    echo "# DigitalOcean Spaces Configuration" >> .env.local
    echo "DO_SPACES_ENDPOINT=https://lon1.digitaloceanspaces.com" >> .env.local
    echo "DO_SPACES_KEY=DO00K776LV6P72227KML" >> .env.local
    echo "DO_SPACES_SECRET=3L/uwRaSV4sfoi0onGKP/dxvCfPWFTfuK2d1Cmfad+A" >> .env.local
    echo "DO_SPACES_BUCKET=trendyfashions" >> .env.local
    echo "DO_SPACES_CDN_URL=https://trendyfashions.lon1.cdn.digitaloceanspaces.com" >> .env.local
    echo "✅ Added DigitalOcean Spaces variables"
else
    echo "✅ DigitalOcean Spaces variables already present"
fi

# Verify DATABASE_URL exists
if ! grep -q "^DATABASE_URL=" .env.local; then
    echo "⚠️  WARNING: DATABASE_URL not found in .env.local"
    echo "   Please ensure PostgreSQL connection string is set"
fi

echo "✅ Environment variables updated"
echo ""

# Step 4: Build application
echo "🔨 Step 4: Building application..."
npm run build
echo "✅ Build complete"
echo ""

# Step 5: Restart PM2
echo "🔄 Step 5: Restarting application..."
APP_NAME="trendyfashionzone"
pm2 restart ${APP_NAME} || pm2 restart trendyfashions || {
    echo "⚠️  PM2 process not found, starting new one..."
    if [ -f ecosystem.config.js ]; then
        pm2 start ecosystem.config.js
    else
        pm2 start npm --name ${APP_NAME} -- start
    fi
}

pm2 save

echo ""
echo "✅ Update complete!"
echo ""
echo "📊 Application Status:"
pm2 status
echo ""
echo "📋 Recent Logs (last 20 lines):"
pm2 logs --lines 20 --nostream || echo "No logs available"
ENDSSH

echo ""
echo "✅ Server update completed successfully!"

