#!/bin/bash

# Create .env.local from server environment variables
# This script uses values found in deployment scripts and ecosystem.config.js

set -e

ENV_FILE=".env.local"
BACKUP_DIR="./env-backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "📝 Creating .env.local from server configuration..."
echo ""

# Create backup of existing .env.local if it exists
if [ -f "${ENV_FILE}" ]; then
    mkdir -p "${BACKUP_DIR}"
    cp "${ENV_FILE}" "${BACKUP_DIR}/.env.local.backup-${TIMESTAMP}"
    echo "✅ Backed up existing .env.local to ${BACKUP_DIR}/.env.local.backup-${TIMESTAMP}"
fi

# Create .env.local with values from server (found in ecosystem.config.js and update-server.sh)
cat > "${ENV_FILE}" << 'EOF'
# Environment Variables - Synced from Production Server (64.225.112.70)
# Generated on: TIMESTAMP_PLACEHOLDER

# PostgreSQL Database Connection (from ecosystem.config.js)
DATABASE_URL=postgresql://postgres:TrendyFashions%40254@db.zdeupdkbsueczuoercmm.supabase.co:5432/postgres

# Supabase Configuration (from update-server.sh)
NEXT_PUBLIC_SUPABASE_URL=https://zdeupdkbsueczuoercmm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkZXVwZGtic3VlY3p1b2VyY21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NzQ2OTQsImV4cCI6MjA4MDM1MDY5NH0.3pK1yIk1pVFSKWx0w86ICy1v5TdiR-h0zfi-XUnMsJY
SUPABASE_SERVICE_ROLE_KEY=sb_secret_8p9yjp2-zwEEUcq5kozNHQ_MWeFBSAQ
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_dJC-8z_4jTFnRcahVAjegQ_aDixqmyh

# DigitalOcean Spaces Configuration (from ecosystem.config.js)
DO_SPACES_ENDPOINT=https://sfo3.digitaloceanspaces.com
DO_SPACES_KEY=DO801PHKGXPLL39YE3ZC
DO_SPACES_SECRET=sQmzYONdRjIRfQrHP2u7e0dF0uOEKO/8mr5DUrFK2Ns
DO_SPACES_BUCKET=trendyfashion
DO_SPACES_CDN_URL=https://trendyfashion.sfo3.cdn.digitaloceanspaces.com

# Application Settings
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
PORT=3000

# Note: M-Pesa and Email variables should be added manually if needed
# MPESA_CONSUMER_KEY=
# MPESA_CONSUMER_SECRET=
# MPESA_SHORTCODE=
# MPESA_PASSKEY=
# SENDGRID_API_KEY=
# RESEND_API_KEY=
EOF

# Replace timestamp placeholder
sed -i "s/TIMESTAMP_PLACEHOLDER/$(date)/" "${ENV_FILE}"

echo "✅ Created ${ENV_FILE} with server environment variables"
echo ""
echo "⚠️  IMPORTANT: Please verify these values match your production server!"
echo "   If you need to fetch directly from server, run:"
echo "   ./scripts/fetch-server-env.sh"
echo ""
echo "📋 To review the file:"
echo "   cat ${ENV_FILE}"
echo ""
