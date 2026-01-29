#!/bin/bash
# Update DigitalOcean server with latest changes

SERVER_IP="64.225.112.70"
SERVER_USER="trendy"
SERVER_PASSWORD="Trendy@254Fashions"
APP_DIR="/home/trendy/trendyfashions"

echo "🚀 Updating DigitalOcean server..."
echo "   Server: $SERVER_IP"
echo "   User: $SERVER_USER"
echo "   Directory: $APP_DIR"
echo ""

# SSH into server and update
sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" << SERVER_COMMANDS
echo "📡 Connected to server successfully!"
echo ""

cd "$APP_DIR" || exit 1

echo "📥 Pulling latest changes..."
git pull origin main || {
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
echo "🔄 Restarting PM2 process..."
pm2 restart trendyfashions || pm2 start npm --name trendyfashions -- run dev || {
    echo "⚠️  PM2 restart failed"
}

echo ""
echo "📊 Checking PM2 status..."
pm2 status

echo ""
echo "✅ Server update completed!"
echo "   Your app should be running at: http://64.225.112.70"
SERVER_COMMANDS

echo ""
echo "🎉 Server update process completed!"
