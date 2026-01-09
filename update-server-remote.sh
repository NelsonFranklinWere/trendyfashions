#!/bin/bash
# Remote Server Update Script
# This will SSH into the server and run the update

DROPLET_IP="178.128.47.122"
DROPLET_USER="frank"
APP_DIR="~/trendyfashionzone"

echo "🔄 Updating server at ${DROPLET_IP}..."
echo ""
echo "You will be prompted for SSH password"
echo ""

ssh ${DROPLET_USER}@${DROPLET_IP} << 'ENDSSH'
set -e

cd ~/trendyfashionzone || cd ~/trendyfashions || {
    echo "❌ App directory not found"
    exit 1
}

echo "📥 Pulling latest code from GitHub..."
git pull origin main || git pull origin master || {
    echo "⚠️  Git pull failed - check if you're in the right directory"
    exit 1
}

echo "📦 Installing dependencies..."
npm install

echo "⚙️  Checking .env.local..."
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found - creating template..."
    cat > .env.local << 'ENVEOF'
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
ENVEOF
    chmod 600 .env.local
    echo "✅ Created .env.local template - PLEASE UPDATE WITH CORRECT VALUES"
else
    echo "✅ .env.local exists"
    # Add missing DO_SPACES variables if not present
    if ! grep -q "^DO_SPACES_ENDPOINT=" .env.local; then
        echo "" >> .env.local
        echo "# DigitalOcean Spaces" >> .env.local
        echo "DO_SPACES_ENDPOINT=https://lon1.digitaloceanspaces.com" >> .env.local
        echo "DO_SPACES_KEY=DO00K776LV6P72227KML" >> .env.local
        echo "DO_SPACES_SECRET=3L/uwRaSV4sfoi0onGKP/dxvCfPWFTfuK2d1Cmfad+A" >> .env.local
        echo "DO_SPACES_BUCKET=trendyfashions" >> .env.local
        echo "DO_SPACES_CDN_URL=https://trendyfashions.lon1.cdn.digitaloceanspaces.com" >> .env.local
        echo "✅ Added DigitalOcean Spaces variables"
    fi
fi

echo "🔨 Building application..."
npm run build

echo "🔄 Restarting PM2..."
pm2 restart trendyfashionzone || pm2 restart trendyfashions || {
    echo "⚠️  PM2 process not found, trying to start..."
    if [ -f ecosystem.config.js ]; then
        pm2 start ecosystem.config.js
    else
        pm2 start npm --name trendyfashionzone -- start
    fi
}

pm2 save

echo ""
echo "✅ Update complete!"
echo ""
echo "Application status:"
pm2 status
echo ""
echo "Recent logs:"
pm2 logs --lines 20 --nostream
ENDSSH

echo ""
echo "✅ Server update completed!"
