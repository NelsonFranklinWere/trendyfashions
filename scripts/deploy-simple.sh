#!/bin/bash

# Simple Deployment Script - Manual password entry
# Run this script and enter password when prompted

set -e

SERVER_IP="178.128.47.122"
SERVER_USER="root"
APP_NAME="trendyfashions"

echo "🚀 Deploying Trendy Fashion Zone to DigitalOcean"
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
    --exclude='tests' \
    -czf deploy.tar.gz .

echo "✅ Package created: deploy.tar.gz"
echo ""

# Step 2: Upload files
echo "📤 Uploading files to server..."
echo "You will be prompted for the password: Trendy@254Zone"
echo ""

scp deploy.tar.gz \
    scripts/server-setup.sh \
    ecosystem.config.js \
    ${SERVER_USER}@${SERVER_IP}:/tmp/

echo ""
echo "✅ Files uploaded!"
echo ""

# Step 3: Run setup
echo "⚙️  Running setup on server..."
echo "You will be prompted for the password again: Trendy@254Zone"
echo ""

ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
    chmod +x /tmp/server-setup.sh
    /tmp/server-setup.sh
ENDSSH

# Step 4: Cleanup
echo "🧹 Cleaning up..."
rm -f deploy.tar.gz

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your app should be available at: http://${SERVER_IP}"
echo ""
echo "📝 To check status, SSH into server:"
echo "   ssh ${SERVER_USER}@${SERVER_IP}"
echo "   pm2 status"
echo "   pm2 logs ${APP_NAME}"
