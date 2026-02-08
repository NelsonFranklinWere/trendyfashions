#!/bin/bash

# Script to fetch environment variables from production server
# Usage: ./scripts/fetch-server-env.sh

set -e

SERVER_IP="64.225.112.70"
SERVER_USER="trendy"
APP_DIR="/var/www/trendyfashions"
BACKUP_DIR="./env-backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/server-env-${TIMESTAMP}.env"

echo "🔍 Fetching environment variables from server ${SERVER_IP}..."
echo ""

# Create backup directory
mkdir -p "${BACKUP_DIR}"

# Try to fetch from PM2 ecosystem config
echo "📋 Method 1: Fetching from PM2 ecosystem.config.js..."
ssh ${SERVER_USER}@${SERVER_IP} "cd ${APP_DIR} && cat ecosystem.config.js | grep -A 30 'env:' | grep -E '^\s+[A-Z_]+:' | sed 's/^\s*//;s/://;s/,$//' | sed \"s/'//g\" | sed 's/^/export /'" > "${BACKUP_FILE}.pm2" 2>/dev/null || echo "⚠️  Could not fetch from PM2 config"

# Try to fetch from .env file
echo "📋 Method 2: Fetching from .env file..."
ssh ${SERVER_USER}@${SERVER_IP} "cd ${APP_DIR} && cat .env 2>/dev/null || cat .env.local 2>/dev/null || echo '# No .env file found'" > "${BACKUP_FILE}.envfile" 2>/dev/null || echo "⚠️  Could not fetch from .env file"

# Try to fetch from PM2 process environment
echo "📋 Method 3: Fetching from PM2 process environment..."
ssh ${SERVER_USER}@${SERVER_IP} "pm2 env 0 2>/dev/null | grep -E '^[A-Z_]+=' || pm2 show trendy-fashion-zone 2>/dev/null | grep -A 100 'env:' | grep -E '^\s+[A-Z_]+:' | sed 's/^\s*//;s/://;s/,$//' | sed \"s/'//g\" | sed 's/^/export /'" > "${BACKUP_FILE}.pm2env" 2>/dev/null || echo "⚠️  Could not fetch from PM2 process"

# Combine all sources into one file
echo "# Environment Variables Backup from Server ${SERVER_IP}" > "${BACKUP_FILE}"
echo "# Fetched on: $(date)" >> "${BACKUP_FILE}"
echo "# Server: ${SERVER_USER}@${SERVER_IP}:${APP_DIR}" >> "${BACKUP_FILE}"
echo "" >> "${BACKUP_FILE}"

# Add PM2 config values
if [ -f "${BACKUP_FILE}.pm2" ] && [ -s "${BACKUP_FILE}.pm2" ]; then
    echo "# From PM2 ecosystem.config.js" >> "${BACKUP_FILE}"
    cat "${BACKUP_FILE}.pm2" >> "${BACKUP_FILE}"
    echo "" >> "${BACKUP_FILE}"
fi

# Add .env file values
if [ -f "${BACKUP_FILE}.envfile" ] && [ -s "${BACKUP_FILE}.envfile" ]; then
    echo "# From .env file" >> "${BACKUP_FILE}"
    cat "${BACKUP_FILE}.envfile" >> "${BACKUP_FILE}"
    echo "" >> "${BACKUP_FILE}"
fi

# Add PM2 process env values
if [ -f "${BACKUP_FILE}.pm2env" ] && [ -s "${BACKUP_FILE}.pm2env" ]; then
    echo "# From PM2 process environment" >> "${BACKUP_FILE}"
    cat "${BACKUP_FILE}.pm2env" >> "${BACKUP_FILE}"
    echo "" >> "${BACKUP_FILE}"
fi

# Clean up temp files
rm -f "${BACKUP_FILE}.pm2" "${BACKUP_FILE}.envfile" "${BACKUP_FILE}.pm2env"

echo "✅ Backup created: ${BACKUP_FILE}"
echo ""
echo "📝 Review the backup file and then run:"
echo "   cp ${BACKUP_FILE} .env.local"
echo ""
