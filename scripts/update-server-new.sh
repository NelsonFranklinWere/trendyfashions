#!/bin/bash

# Server Update Script - Updated for PostgreSQL + DigitalOcean Spaces
# Run this on the server or via SSH

set -e

# Configuration
APP_NAME="trendyfashionzone"
APP_DIR="/home/frank/${APP_NAME}"

echo "🔄 Updating server application..."
echo ""

cd "$APP_DIR" || {
    echo "❌ Error: Directory $APP_DIR not found"
    exit 1
}

# Step 1: Pull latest from GitHub
echo "📥 Step 1: Pulling latest code from GitHub..."
git pull origin main || {
    echo "⚠️  Git pull failed - continuing with existing code"
}

# Step 2: Backup and update .env.local
echo "⚙️  Step 2: Updating .env.local..."
if [ -f .env.local ]; then
    # Backup existing .env.local
    cp .env.local .env.local.backup.$(date +%Y%m%d_%H%M%S)
    echo "✅ Backup created"
else
    echo "⚠️  .env.local not found - creating new one..."
    touch .env.local
    chmod 600 .env.local
fi

# Ensure required environment variables are present
# Note: These should already be set, but we'll verify they exist
if ! grep -q "^DATABASE_URL=" .env.local; then
    echo "⚠️  Warning: DATABASE_URL not found in .env.local"
    echo "   Please add: DATABASE_URL=postgresql://user:password@host:port/database"
fi

if ! grep -q "^DO_SPACES_ENDPOINT=" .env.local; then
    echo "⚠️  Warning: DO_SPACES_ENDPOINT not found in .env.local"
fi

if ! grep -q "^DO_SPACES_KEY=" .env.local; then
    echo "⚠️  Warning: DO_SPACES_KEY not found in .env.local"
fi

if ! grep -q "^DO_SPACES_SECRET=" .env.local; then
    echo "⚠️  Warning: DO_SPACES_SECRET not found in .env.local"
fi

if ! grep -q "^DO_SPACES_BUCKET=" .env.local; then
    echo "⚠️  Warning: DO_SPACES_BUCKET not found in .env.local"
fi

if ! grep -q "^DO_SPACES_CDN_URL=" .env.local; then
    echo "⚠️  Warning: DO_SPACES_CDN_URL not found in .env.local"
fi

# Step 3: Install dependencies
echo "📦 Step 3: Installing dependencies..."
npm install

# Step 4: Build application
echo "🔨 Step 4: Building application..."
npm run build

# Step 5: Restart PM2
echo "🔄 Step 5: Restarting application..."
pm2 restart ${APP_NAME} || {
    echo "⚠️  PM2 process not found, starting new one..."
    pm2 start ecosystem.config.js || pm2 start npm --name ${APP_NAME} -- start
}

# Step 6: Save PM2 state
pm2 save

echo ""
echo "✅ Update complete!"
echo ""
echo "Application status:"
pm2 status ${APP_NAME} || pm2 list
echo ""
echo "Recent logs:"
pm2 logs ${APP_NAME} --lines 20 --nostream || echo "No logs available"

