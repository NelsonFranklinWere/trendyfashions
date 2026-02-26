#!/bin/bash
# Server Update Script with Disk Space Cleanup
# Run this directly on the server console

set -e

APP_DIR="/var/www/trendyfashions"
PM2_APP_NAME="trendy-fashion-zone"

echo "🚀 Updating server from latest git push..."
echo ""

# Check disk space first
echo "📊 Checking disk space..."
df -h / | tail -1
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 90 ]; then
    echo "⚠️  Disk usage is ${DISK_USAGE}% - cleaning up first..."
    bash -c "$(cat << 'CLEANUP'
# Clean npm cache
npm cache clean --force 2>/dev/null || true

# Clean Next.js cache
cd /var/www/trendyfashions
if [ -d ".next" ]; then
    rm -rf .next/cache
fi

# Clean PM2 logs (keep last 500 lines)
if [ -d "/var/www/trendyfashions/logs" ]; then
    cd /var/www/trendyfashions/logs
    for logfile in *.log; do
        if [ -f "$logfile" ]; then
            tail -n 500 "$logfile" > "${logfile}.tmp" && mv "${logfile}.tmp" "$logfile"
        fi
    done
fi

# Clean system cache
apt-get clean 2>/dev/null || true
apt-get autoclean 2>/dev/null || true

# Clean temp files
rm -rf /tmp/* 2>/dev/null || true
rm -rf /var/tmp/* 2>/dev/null || true

echo "✅ Cleanup completed"
CLEANUP
)"
fi

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
    REPO_PATH=$(echo "$REMOTE_URL" | sed 's/.*github.com[:/]\(.*\)\.git/\1/' | sed 's/git@github.com://')
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

# Step 2: Clean npm cache before install
echo ""
echo "🧹 Cleaning npm cache..."
npm cache clean --force 2>/dev/null || true

# Step 3: Install/update dependencies
echo ""
echo "📦 Step 2: Installing dependencies..."
npm install --prefer-offline --no-audit || npm install --no-audit

# Step 4: Build application
echo ""
echo "🔨 Step 3: Building application..."
npm run build

# Step 5: Clean build cache after build
echo ""
echo "🧹 Cleaning build cache..."
rm -rf .next/cache 2>/dev/null || true

# Step 6: Restart PM2 application
echo ""
echo "🔄 Step 4: Restarting PM2 application..."
pm2 restart "$PM2_APP_NAME" || {
    echo "⚠️  PM2 restart failed, trying to start..."
    pm2 start ecosystem.config.js
}

# Step 7: Save PM2 state
pm2 save

# Step 8: Show status
echo ""
echo "📊 Step 5: Application status:"
pm2 status "$PM2_APP_NAME"

echo ""
echo "📊 Final disk usage:"
df -h / | tail -1

echo ""
echo "✅ Server update completed successfully!"
