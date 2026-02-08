#!/bin/bash

# Script to fetch environment variables from production server using password authentication
# Usage: ./scripts/fetch-server-env-with-password.sh

set -e

SERVER_IP="64.225.112.70"
SERVER_USER="trendy"
PASSWORD="Trendy@254Fashions"
APP_DIR="/var/www/trendyfashions"
BACKUP_DIR="./env-backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/server-env-${TIMESTAMP}.env"

echo "🔍 Fetching environment variables from server ${SERVER_IP}..."
echo ""

# Create backup directory
mkdir -p "${BACKUP_DIR}"

# Check if sshpass is available
if command -v sshpass &> /dev/null; then
    SSH_CMD="sshpass -p '${PASSWORD}' ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"
    SCP_CMD="sshpass -p '${PASSWORD}' scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"
else
    echo "⚠️  sshpass not found. Creating expect script..."
    # Create expect script
    cat > /tmp/ssh-fetch-env.exp << 'EXPSCRIPT'
#!/usr/bin/expect -f
set timeout 30
set server_ip [lindex $argv 0]
set server_user [lindex $argv 1]
set password [lindex $argv 2]
set command [lindex $argv 3]

spawn ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null ${server_user}@${server_ip} "$command"
expect {
    "password:" {
        send "${password}\r"
        exp_continue
    }
    "Password:" {
        send "${password}\r"
        exp_continue
    }
    eof
}
EXPSCRIPT
    chmod +x /tmp/ssh-fetch-env.exp
    SSH_CMD="/tmp/ssh-fetch-env.exp"
fi

# Function to execute remote command
execute_remote() {
    local cmd="$1"
    if command -v sshpass &> /dev/null; then
        sshpass -p "${PASSWORD}" ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null ${SERVER_USER}@${SERVER_IP} "$cmd" 2>/dev/null || echo ""
    else
        /tmp/ssh-fetch-env.exp ${SERVER_IP} ${SERVER_USER} "${PASSWORD}" "$cmd" 2>/dev/null | tail -n +2 || echo ""
    fi
}

# Try to fetch from PM2 ecosystem config
echo "📋 Method 1: Fetching from PM2 ecosystem.config.js..."
ECOSYSTEM_ENV=$(execute_remote "cd ${APP_DIR} && cat ecosystem.config.js 2>/dev/null | grep -A 30 'env:' | grep -E '^\s+[A-Z_]+:' | sed 's/^\s*//;s/://;s/,$//' | sed \"s/'//g\" | sed 's/^/export /'")
if [ ! -z "$ECOSYSTEM_ENV" ]; then
    echo "$ECOSYSTEM_ENV" > "${BACKUP_FILE}.pm2"
    echo "✅ Fetched from PM2 config"
else
    echo "⚠️  Could not fetch from PM2 config"
fi

# Try to fetch from .env file
echo "📋 Method 2: Fetching from .env file..."
ENV_FILE_CONTENT=$(execute_remote "cd ${APP_DIR} && cat .env 2>/dev/null || cat .env.local 2>/dev/null || cat .env.production 2>/dev/null || echo ''")
if [ ! -z "$ENV_FILE_CONTENT" ] && [ "$ENV_FILE_CONTENT" != "" ]; then
    echo "$ENV_FILE_CONTENT" > "${BACKUP_FILE}.envfile"
    echo "✅ Fetched from .env file"
else
    echo "⚠️  Could not fetch from .env file"
fi

# Try to fetch from PM2 process environment
echo "📋 Method 3: Fetching from PM2 process environment..."
PM2_ENV=$(execute_remote "pm2 env 0 2>/dev/null | grep -E '^[A-Z_]+=' || pm2 show trendy-fashion-zone 2>/dev/null | grep -A 100 'env:' | grep -E '^\s+[A-Z_]+:' | sed 's/^\s*//;s/://;s/,$//' | sed \"s/'//g\" | sed 's/^/export /' || echo ''")
if [ ! -z "$PM2_ENV" ]; then
    echo "$PM2_ENV" > "${BACKUP_FILE}.pm2env"
    echo "✅ Fetched from PM2 process"
else
    echo "⚠️  Could not fetch from PM2 process"
fi

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
rm -f /tmp/ssh-fetch-env.exp

echo ""
echo "✅ Backup created: ${BACKUP_FILE}"
echo ""
echo "📝 Review the backup file and then update .env.local:"
echo "   cat ${BACKUP_FILE}"
echo "   cp ${BACKUP_FILE} .env.local"
echo ""
