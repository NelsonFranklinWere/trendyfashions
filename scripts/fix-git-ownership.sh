#!/bin/bash
# Fix Git Ownership Issues on Server
# Run this once to fix the "dubious ownership" error

APP_DIR="/var/www/trendyfashions"

echo "🔧 Fixing Git ownership issues..."

# Option 1: Add safe directory exception (quick fix)
echo "📝 Adding safe directory exception..."
git config --global --add safe.directory "$APP_DIR"

# Option 2: Fix ownership (if you know the correct user)
# Uncomment and modify if needed:
# chown -R trendy:trendy "$APP_DIR"

echo "✅ Git ownership issue fixed!"
echo ""
echo "Now you can run the update commands:"
echo "cd $APP_DIR && git pull origin main && npm install && npm run build && pm2 restart trendy-fashion-zone && pm2 save"
