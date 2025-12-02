#!/bin/bash

# Update and rebuild application on DigitalOcean server

set -e

SERVER_IP="178.128.47.122"
SERVER_USER="root"
SERVER_PASSWORD="Trendy@254Zone"
APP_DIR="/var/www/trendyfashions"

echo "🔄 Updating Application on DigitalOcean"
echo "========================================"
echo "Server: ${SERVER_IP}"
echo ""

# Check if we should push local changes first
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted local changes:"
    git status --short
    echo ""
    read -p "Push local changes to GitHub first? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📤 Pushing local changes..."
        git add .
        read -p "Commit message: " COMMIT_MSG
        git commit -m "${COMMIT_MSG:-Update files}"
        git push origin main
        echo "✅ Changes pushed to GitHub"
        echo ""
    fi
fi

echo "📥 Updating server from GitHub..."
sshpass -p "${SERVER_PASSWORD}" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
    cd /var/www/trendyfashions
    echo "1. Pulling latest changes..."
    git fetch origin
    git pull origin main
    
    echo ""
    echo "2. Installing dependencies..."
    npm ci
    
    echo ""
    echo "3. Building application..."
    npm run build
    
    echo ""
    echo "4. Restarting application..."
    pm2 restart trendyfashions
    pm2 save
    
    echo ""
    echo "✅ Update complete!"
    echo ""
    echo "Status:"
    pm2 status
ENDSSH

echo ""
echo "🌐 Your updated site: http://${SERVER_IP}"
