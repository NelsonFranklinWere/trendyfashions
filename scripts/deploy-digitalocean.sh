#!/bin/bash

# DigitalOcean Deployment Script for Trendy Fashion Zone
# Run this script on your local machine to deploy to DigitalOcean

set -e

# Configuration
SERVER_IP="178.128.47.122"
SERVER_USER="root"
SERVER_PASSWORD="Trendy@254Zone"
APP_NAME="trendyfashions"
APP_DIR="/var/www/${APP_NAME}"
DOMAIN="" # Set your domain here if you have one, otherwise leave empty

echo "🚀 Starting deployment to DigitalOcean..."
echo "Server: ${SERVER_IP}"
echo ""

# Step 1: Create deployment package
echo "📦 Creating deployment package..."
tar --exclude='.git' \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='.vscode' \
    --exclude='*.log' \
    --exclude='.DS_Store' \
    -czf deploy.tar.gz .

# Step 2: Upload to server
echo "📤 Uploading files to server..."
sshpass -p "${SERVER_PASSWORD}" scp -o StrictHostKeyChecking=no \
    deploy.tar.gz \
    scripts/server-setup.sh \
    ecosystem.config.js \
    ${SERVER_USER}@${SERVER_IP}:/tmp/

# Step 3: Run setup on server
echo "⚙️  Running setup on server..."
sshpass -p "${SERVER_PASSWORD}" ssh -o StrictHostKeyChecking=no \
    ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
    chmod +x /tmp/server-setup.sh
    /tmp/server-setup.sh
ENDSSH

# Step 4: Cleanup
echo "🧹 Cleaning up..."
rm -f deploy.tar.gz

echo "✅ Deployment complete!"
echo ""
echo "🌐 Your app should be available at: http://${SERVER_IP}:3000"
if [ ! -z "$DOMAIN" ]; then
    echo "   Or: http://${DOMAIN}"
fi
echo ""
echo "📝 Next steps:"
echo "   1. SSH into server: ssh root@${SERVER_IP}"
echo "   2. Check app status: pm2 status"
echo "   3. View logs: pm2 logs ${APP_NAME}"
echo "   4. Set up domain and SSL (see DEPLOYMENT_DIGITALOCEAN.md)"
