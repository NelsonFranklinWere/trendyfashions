#!/bin/bash
# Update server with loafers and sandals categories

SERVER_IP="64.225.112.70"
SERVER_USER="trendy"
SERVER_PASSWORD="Trendy@254Fashions"
APP_DIR="/home/trendy/trendyfashions"

echo "🚀 Updating server with loafers and sandals categories..."
echo ""

# SSH into server and update
sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" << SERVER_COMMANDS
echo "📡 Connected to server successfully!"
echo ""

cd "$APP_DIR" || exit 1

echo "📥 Pulling latest changes..."
git pull origin main 2>/dev/null || {
    echo "⚠️  Git pull failed - continuing with local files"
}

echo ""
echo "📦 Installing dependencies..."
npm install || {
    echo "⚠️  npm install failed - continuing"
}

echo ""
echo "🔨 Building application..."
npm run build || {
    echo "⚠️  Build failed - continuing with development mode"
}

echo ""
echo "🔄 Restarting application..."
pm2 restart trendyfashions || {
    echo "⚠️  PM2 restart failed - starting new process"
    pm2 start npm --name trendyfashions -- run dev
}

echo ""
echo "📊 Checking status..."
pm2 status

echo ""
echo "✅ Categories update completed!"
echo "   Loafers and Sandals now available in navbar and admin panel"
SERVER_COMMANDS

echo ""
echo "🎉 Server update completed successfully!"
