#!/bin/bash
# Emergency Disk Space Cleanup - Run this FIRST on server
# This aggressively frees up space

echo "🚨 EMERGENCY DISK CLEANUP"
echo ""

# Check current disk usage
echo "📊 Current disk usage:"
df -h /
echo ""

APP_DIR="/var/www/trendyfashions"

# 1. Remove node_modules (will reinstall later)
echo "🗑️  Step 1: Removing node_modules (will reinstall)..."
cd "$APP_DIR" || exit 1
if [ -d "node_modules" ]; then
    rm -rf node_modules
    echo "✅ node_modules removed"
fi

# 2. Remove .next build directory
echo ""
echo "🗑️  Step 2: Removing .next build directory..."
if [ -d ".next" ]; then
    rm -rf .next
    echo "✅ .next directory removed"
fi

# 3. Clean npm cache
echo ""
echo "🧹 Step 3: Cleaning npm cache..."
npm cache clean --force 2>/dev/null || true
rm -rf /root/.npm 2>/dev/null || true
echo "✅ npm cache cleaned"

# 4. Clean PM2 logs completely
echo ""
echo "🗑️  Step 4: Truncating PM2 logs..."
if [ -d "$APP_DIR/logs" ]; then
    cd "$APP_DIR/logs"
    > err.log 2>/dev/null || true
    > out.log 2>/dev/null || true
    echo "✅ PM2 logs cleared"
fi

# 5. Clean system logs
echo ""
echo "🗑️  Step 5: Cleaning system logs..."
journalctl --vacuum-time=1d 2>/dev/null || true
find /var/log -name "*.log" -type f -delete 2>/dev/null || true
find /var/log -name "*.gz" -type f -delete 2>/dev/null || true
echo "✅ System logs cleaned"

# 6. Clean package cache
echo ""
echo "🧹 Step 6: Cleaning package cache..."
apt-get clean 2>/dev/null || true
apt-get autoclean 2>/dev/null || true
apt-get autoremove -y 2>/dev/null || true
echo "✅ Package cache cleaned"

# 7. Clean temporary files
echo ""
echo "🗑️  Step 7: Cleaning temporary files..."
rm -rf /tmp/* 2>/dev/null || true
rm -rf /var/tmp/* 2>/dev/null || true
rm -rf /root/.npm/_logs/* 2>/dev/null || true
rm -rf /root/.npm/_cacache/* 2>/dev/null || true
echo "✅ Temporary files cleaned"

# 8. Find large files
echo ""
echo "🔍 Step 8: Finding largest directories..."
du -sh /var/www/* 2>/dev/null | sort -h | tail -5
du -sh /root/* 2>/dev/null | sort -h | tail -5

# Final disk usage
echo ""
echo "📊 Disk usage after cleanup:"
df -h /

echo ""
echo "✅ Emergency cleanup completed!"
echo ""
echo "Now you can run the update command."
