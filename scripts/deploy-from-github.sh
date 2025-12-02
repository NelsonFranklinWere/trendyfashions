#!/bin/bash

# Deploy from GitHub to DigitalOcean
# This script sets up the server and deploys from GitHub

set -e

SERVER_IP="178.128.47.122"
SERVER_USER="root"
SERVER_PASSWORD="Trendy@254Zone"
APP_NAME="trendyfashions"
APP_DIR="/var/www/${APP_NAME}"

# Get GitHub repo URL (you'll need to provide this)
echo "📋 GitHub Deployment Setup"
echo ""
read -p "Enter your GitHub repository URL (e.g., https://github.com/username/repo.git): " GITHUB_REPO

if [ -z "$GITHUB_REPO" ]; then
    echo "❌ GitHub repository URL is required!"
    exit 1
fi

echo ""
echo "🚀 Deploying ${APP_NAME} from GitHub to DigitalOcean"
echo "Server: ${SERVER_IP}"
echo "Repository: ${GITHUB_REPO}"
echo ""

# Upload server setup script
echo "📤 Uploading setup scripts..."
scp scripts/github-server-setup.sh \
    ecosystem.config.js \
    ${SERVER_USER}@${SERVER_IP}:/tmp/

# Run setup on server
echo "⚙️  Running setup on server..."
echo "You will be prompted for the password: ${SERVER_PASSWORD}"
echo ""

ssh ${SERVER_USER}@${SERVER_IP} << ENDSSH
    export GITHUB_REPO="${GITHUB_REPO}"
    export APP_NAME="${APP_NAME}"
    export APP_DIR="${APP_DIR}"
    chmod +x /tmp/github-server-setup.sh
    /tmp/github-server-setup.sh
ENDSSH

echo ""
echo "✅ Server setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Upload your .env file: ./scripts/upload-env.sh"
echo "   2. SSH into server: ssh ${SERVER_USER}@${SERVER_IP}"
echo "   3. Check status: pm2 status"
echo "   4. Visit: http://${SERVER_IP}"
