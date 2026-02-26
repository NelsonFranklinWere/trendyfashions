#!/bin/bash
# Cleanup Disk Space on Server
# Run this on the server console to free up space

echo "🧹 Cleaning up disk space..."
echo ""

# Check current disk usage
echo "📊 Current disk usage:"
df -h /
echo ""

APP_DIR="/var/www/trendyfashions"

# 1. Clean npm cache
echo "🧹 Step 1: Cleaning npm cache..."
npm cache clean --force 2>/dev/null || true
echo "✅ npm cache cleaned"

# 2. Clean PM2 logs (keep last 1000 lines)
echo ""
echo "🧹 Step 2: Cleaning PM2 logs..."
if [ -d "$APP_DIR/logs" ]; then
    cd "$APP_DIR/logs"
    # Keep only last 1000 lines of each log file
    for logfile in *.log; do
        if [ -f "$logfile" ]; then
            tail -n 1000 "$logfile" > "${logfile}.tmp" && mv "${logfile}.tmp" "$logfile"
        fi
    done
    echo "✅ PM2 logs cleaned"
fi

# 3. Remove old build artifacts
echo ""
echo "🧹 Step 3: Cleaning old build artifacts..."
cd "$APP_DIR" || exit 1
if [ -d ".next" ]; then
    rm -rf .next/cache
    echo "✅ Next.js cache cleaned"
fi

# 4. Remove node_modules and reinstall (if needed, but skip for now)
# This is optional - only do if still low on space

# 5. Clean system package cache
echo ""
echo "🧹 Step 4: Cleaning system package cache..."
apt-get clean 2>/dev/null || true
apt-get autoclean 2>/dev/null || true
echo "✅ System cache cleaned"

# 6. Remove old log files
echo ""
echo "🧹 Step 5: Removing old log files..."
find /var/log -name "*.log" -type f -mtime +7 -delete 2>/dev/null || true
find /var/log -name "*.gz" -type f -delete 2>/dev/null || true
echo "✅ Old log files removed"

# 7. Clean temporary files
echo ""
echo "🧹 Step 6: Cleaning temporary files..."
rm -rf /tmp/* 2>/dev/null || true
rm -rf /var/tmp/* 2>/dev/null || true
echo "✅ Temporary files cleaned"

# Final disk usage
echo ""
echo "📊 Disk usage after cleanup:"
df -h /

echo ""
echo "✅ Cleanup completed!"
