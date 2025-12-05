#!/bin/bash

# Master Deployment Script - Trendy Fashion Zone
# Usage: ./deploy.sh [server_ip] [username]

set -e

DROPLET_IP="${1:-${DROPLET_IP}}"
DROPLET_USER="${2:-${DROPLET_USER:-trendyfashion}}"
APP_NAME="trendyfashionzone"

if [ -z "$DROPLET_IP" ]; then
    echo "Usage: ./deploy.sh [server_ip] [username]"
    echo "   or: DROPLET_IP=ip DROPLET_USER=user ./deploy.sh"
    exit 1
fi

echo "🚀 Deploying Trendy Fashion Zone to $DROPLET_IP"
echo ""

# Build locally
echo "📦 Building application..."
npm run build

# Create deployment package
echo "📦 Creating deployment package..."
tar --exclude='.git' \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='.vscode' \
    --exclude='*.log' \
    -czf /tmp/${APP_NAME}.tar.gz .

# Upload
echo "📤 Uploading to server..."
scp /tmp/${APP_NAME}.tar.gz ${DROPLET_USER}@${DROPLET_IP}:/tmp/
scp ecosystem.config.js ${DROPLET_USER}@${DROPLET_IP}:/tmp/

# Deploy
echo "🚀 Deploying on server..."
ssh ${DROPLET_USER}@${DROPLET_IP} <<ENDSSH
cd ~/${APP_NAME}
tar -xzf /tmp/${APP_NAME}.tar.gz
npm ci --production
npm run build
cp /tmp/ecosystem.config.js .
sed -i "s|/home/trendyfashion/trendyfashionzone|\$HOME/${APP_NAME}|g" ecosystem.config.js
pm2 delete ${APP_NAME} 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
ENDSSH

echo ""
echo "✅ Deployment complete!"
echo "Visit: https://trendyfashionzone.co.ke"

