#!/bin/bash
# Fix Git Remote URL - Switch from SSH to HTTPS
# Run this on the server console

APP_DIR="/var/www/trendyfashions"

echo "🔧 Fixing Git remote URL..."

cd "$APP_DIR" || exit 1

# Check current remote URL
echo "Current remote URL:"
git remote -v

# Change remote from SSH to HTTPS
echo ""
echo "Changing remote URL to HTTPS..."
git remote set-url origin https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\(.*\)\.git/\1/').git

# Verify the change
echo ""
echo "Updated remote URL:"
git remote -v

echo ""
echo "✅ Git remote fixed! Now you can pull using HTTPS."
