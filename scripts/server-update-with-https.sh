#!/bin/bash
# Server Update Script - Using HTTPS for Git
# Run this directly on the server console

set -e

APP_DIR="/var/www/trendyfashions"
PM2_APP_NAME="trendy-fashion-zone"

echo "🚀 Updating server from latest git push..."
echo ""

# Fix Git ownership issue first (if needed)
if ! git config --global --get safe.directory | grep -q "$APP_DIR"; then
    echo "🔧 Fixing Git ownership issue..."
    git config --global --add safe.directory "$APP_DIR"
fi

# Navigate to app directory
cd "$APP_DIR" || {
    echo "❌ Error: Directory $APP_DIR not found"
    exit 1
}

# Check and fix remote URL if it's using SSH
REMOTE_URL=$(git config --get remote.origin.url)
if [[ "$REMOTE_URL" == git@* ]]; then
    echo "🔧 Converting SSH remote to HTTPS..."
    # Extract repo path from SSH URL
    REPO_PATH=$(echo "$REMOTE_URL" | sed 's/.*github.com[:/]\(.*\)\.git/\1/')
    git remote set-url origin "https://github.com/${REPO_PATH}.git"
    echo "✅ Remote URL updated to HTTPS"
fi

# Step 1: Pull latest changes from git
echo ""
echo "📥 Step 1: Pulling latest changes from git..."
git pull origin main || {
    echo "⚠️  Git pull failed - check if you have uncommitted changes"
    echo "   Run 'git status' to see what's blocking"
    exit 1
}

# Step 2: Install/update dependencies
echo ""
echo "📦 Step 2: Installing dependencies..."
npm install

# Step 3: Build application
echo ""
echo "🔨 Step 3: Building application..."
npm run build

# Step 4: Restart PM2 application
echo ""
echo "🔄 Step 4: Restarting PM2 application..."
pm2 restart "$PM2_APP_NAME" || {
    echo "⚠️  PM2 restart failed, trying to start..."
    pm2 start ecosystem.config.js
}

# Step 5: Save PM2 state
pm2 save

# Step 6: Show status
echo ""
echo "📊 Step 5: Application status:"
pm2 status "$PM2_APP_NAME"

echo ""
echo "✅ Server update completed successfully!"
