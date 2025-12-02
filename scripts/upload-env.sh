#!/bin/bash

# Upload .env file to DigitalOcean server

set -e

SERVER_IP="178.128.47.122"
SERVER_USER="root"
APP_DIR="/var/www/trendyfashions"
ENV_FILE=".env"

echo "📤 Uploading .env file to DigitalOcean"
echo ""

# Check if .env file exists
if [ ! -f "${ENV_FILE}" ]; then
    echo "❌ Error: ${ENV_FILE} file not found!"
    echo ""
    echo "Create a ${ENV_FILE} file with your environment variables."
    echo "You can use .env.example as a template."
    exit 1
fi

echo "Uploading ${ENV_FILE} to server..."
echo "You will be prompted for the password: Trendy@254Zone"
echo ""

# Upload .env file
scp ${ENV_FILE} ${SERVER_USER}@${SERVER_IP}:/tmp/.env

# Move to app directory and restart
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
    APP_DIR="/var/www/trendyfashions"
    if [ -f /tmp/.env ]; then
        mv /tmp/.env ${APP_DIR}/.env
        chmod 600 ${APP_DIR}/.env
        echo "✅ .env file uploaded successfully!"
        
        # Restart app to load new environment variables
        echo "🔄 Restarting application..."
        pm2 restart trendyfashions
        
        echo ""
        echo "✅ Environment variables loaded!"
        echo "Check logs: pm2 logs trendyfashions"
    else
        echo "❌ Error: .env file not found on server"
        exit 1
    fi
ENDSSH

echo ""
echo "✅ .env file uploaded and application restarted!"
