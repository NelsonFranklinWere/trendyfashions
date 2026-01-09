#!/bin/bash

# DigitalOcean Deployment Script for Trendy Fashion Zone
# This script automates the deployment process

set -e

echo "🚀 Starting DigitalOcean Deployment for Trendy Fashion Zone"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration - UPDATE THESE VALUES
DROPLET_IP="${DROPLET_IP:-}"
DROPLET_USER="${DROPLET_USER:-trendyfashion}"
APP_NAME="trendyfashionzone"
APP_DIR="/home/${DROPLET_USER}/${APP_NAME}"
GIT_REPO="${GIT_REPO:-}"

if [ -z "$DROPLET_IP" ]; then
    echo -e "${RED}❌ Error: DROPLET_IP environment variable not set${NC}"
    echo "Usage: DROPLET_IP=your_ip DROPLET_USER=username ./scripts/deploy-to-digitalocean.sh"
    exit 1
fi

echo -e "${GREEN}📋 Deployment Configuration:${NC}"
echo "  Droplet IP: $DROPLET_IP"
echo "  User: $DROPLET_USER"
echo "  App Directory: $APP_DIR"
echo ""

# Step 1: Build locally
echo -e "${YELLOW}📦 Step 1: Building application locally...${NC}"
npm run build
echo -e "${GREEN}✅ Build complete${NC}"
echo ""

# Step 2: Create deployment package
echo -e "${YELLOW}📦 Step 2: Creating deployment package...${NC}"
tar --exclude='.git' \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='.vscode' \
    --exclude='*.log' \
    --exclude='.env.local' \
    -czf /tmp/${APP_NAME}-deploy.tar.gz .
echo -e "${GREEN}✅ Package created: /tmp/${APP_NAME}-deploy.tar.gz${NC}"
echo ""

# Step 3: Upload to server
echo -e "${YELLOW}📤 Step 3: Uploading to server...${NC}"
scp /tmp/${APP_NAME}-deploy.tar.gz ${DROPLET_USER}@${DROPLET_IP}:/tmp/
scp ecosystem.config.js ${DROPLET_USER}@${DROPLET_IP}:/tmp/
echo -e "${GREEN}✅ Upload complete${NC}"
echo ""

# Step 4: Deploy on server
echo -e "${YELLOW}🚀 Step 4: Deploying on server...${NC}"
ssh ${DROPLET_USER}@${DROPLET_IP} << ENDSSH
set -e

echo "📁 Extracting files..."
mkdir -p ${APP_DIR}
cd ${APP_DIR}
tar -xzf /tmp/${APP_NAME}-deploy.tar.gz
rm /tmp/${APP_NAME}-deploy.tar.gz

echo "📦 Installing dependencies..."
npm ci --production

echo "🔨 Building application..."
npm run build

echo "⚙️  Updating PM2 configuration..."
cp /tmp/ecosystem.config.js .
sed -i "s|/home/trendyfashion/trendyfashionzone|${APP_DIR}|g" ecosystem.config.js

echo "🔄 Restarting application..."
pm2 delete ${APP_NAME} 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

echo "✅ Deployment complete!"
pm2 status
ENDSSH

echo ""
echo -e "${GREEN}🎉 Deployment successful!${NC}"
echo ""
echo "Your app should be running at:"
echo "  http://${DROPLET_IP}"
echo "  https://trendyfashionzone.co.ke"
echo ""
echo "To check logs: ssh ${DROPLET_USER}@${DROPLET_IP} 'pm2 logs ${APP_NAME}'"

