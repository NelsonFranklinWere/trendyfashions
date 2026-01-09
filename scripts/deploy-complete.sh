#!/bin/bash

# Complete Deployment Script - GitHub to DigitalOcean
# This script handles everything: server setup, GitHub clone, and .env upload

set -e

SERVER_IP="178.128.47.122"
SERVER_USER="root"
SERVER_PASSWORD="Trendy@254Zone"
APP_NAME="trendyfashions"
APP_DIR="/var/www/${APP_NAME}"
GITHUB_REPO="https://github.com/NelsonFranklinWere/trendyfashions.git"

echo "🚀 Complete Deployment to DigitalOcean"
echo "========================================"
echo "Server: ${SERVER_IP}"
echo "Repository: ${GITHUB_REPO}"
echo ""

# Step 1: Upload setup scripts
echo "📤 Step 1: Uploading setup scripts..."
echo "You will be prompted for password: ${SERVER_PASSWORD}"
scp -o StrictHostKeyChecking=no \
    scripts/github-server-setup.sh \
    ecosystem.config.js \
    ${SERVER_USER}@${SERVER_IP}:/tmp/

# Step 2: Run server setup
echo ""
echo "⚙️  Step 2: Setting up server (this may take 5-10 minutes)..."
echo "You will be prompted for the password: ${SERVER_PASSWORD}"
echo ""

ssh ${SERVER_USER}@${SERVER_IP} << ENDSSH
    export GITHUB_REPO="${GITHUB_REPO}"
    export APP_NAME="${APP_NAME}"
    export APP_DIR="${APP_DIR}"
    chmod +x /tmp/github-server-setup.sh
    /tmp/github-server-setup.sh
ENDSSH

# Step 3: Upload .env file if it exists
echo ""
if [ -f ".env" ]; then
    echo "📤 Step 3: Uploading .env file..."
    scp -o StrictHostKeyChecking=no .env ${SERVER_USER}@${SERVER_IP}:/tmp/.env
    
    ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
        APP_DIR="/var/www/trendyfashions"
        if [ -f /tmp/.env ]; then
            mv /tmp/.env ${APP_DIR}/.env
            chmod 600 ${APP_DIR}/.env
            echo "✅ .env file uploaded!"
            
            # Restart app
            pm2 restart trendyfashions
            echo "✅ Application restarted with new environment variables"
        fi
ENDSSH
else
    echo "⚠️  Step 3: No .env file found. Skipping..."
    echo "   Create a .env file and run: ./scripts/upload-env.sh"
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your app should be available at: http://${SERVER_IP}"
echo ""
echo "📝 Useful commands:"
echo "   SSH: ssh ${SERVER_USER}@${SERVER_IP}"
echo "   Check status: pm2 status"
echo "   View logs: pm2 logs ${APP_NAME}"
echo "   Restart: pm2 restart ${APP_NAME}"
