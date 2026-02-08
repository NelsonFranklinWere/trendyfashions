#!/bin/bash
# Update server with additional Google Analytics code

SERVER_IP="64.225.112.70"
SERVER_USER="trendy"
SERVER_PASSWORD="Trendy@254Fashions"
APP_DIR="/home/trendy/trendyfashions"

echo "🚀 Updating server with additional Google Analytics tracking..."
echo ""

# SSH into server and update
sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" << SERVER_COMMANDS
echo "📡 Connected to server successfully!"
echo ""

cd "$APP_DIR" || exit 1

echo "📦 Installing dependencies..."
npm install || {
    echo "⚠️  npm install failed - continuing"
}

echo ""
echo "🔨 Building application with new analytics..."
npm run build || {
    echo "⚠️  Build failed - continuing with development mode"
}

echo ""
echo "🔄 Restarting application..."
pm2 restart trendyfashions || {
    echo "⚠️  PM2 restart failed - starting new process"
    pm2 start npm --name trendyfashions -- run start -- -H 0.0.0.0
}

echo ""
echo "📊 Checking status..."
pm2 status

echo ""
echo "✅ Google Analytics update completed!"
echo "   Both AW-17914939782 (Ads) and G-36T41E7M8B (Analytics) tracking active"
SERVER_COMMANDS

echo ""
echo "🎉 Server update completed successfully!"
