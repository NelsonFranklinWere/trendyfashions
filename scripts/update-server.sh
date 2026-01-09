#!/bin/bash

# Server Update Script - Pull from GitHub, Update .env, Rebuild, Restart
# Run this on the server or via SSH

set -e

# Configuration
APP_NAME="trendyfashionzone"
APP_DIR="/home/frank/${APP_NAME}"
POSTGRES_PASSWORD="${1:-}"

if [ -z "$POSTGRES_PASSWORD" ]; then
    echo "Usage: ./update-server.sh [POSTGRES_PASSWORD]"
    echo "   or: POSTGRES_PASSWORD=your_password ./update-server.sh"
    exit 1
fi

echo "🔄 Updating server application..."
echo ""

cd "$APP_DIR" || {
    echo "❌ Error: Directory $APP_DIR not found"
    exit 1
}

# Step 1: Pull latest from GitHub
echo "📥 Step 1: Pulling latest code from GitHub..."
git pull origin main || {
    echo "⚠️  Git pull failed - continuing with existing code"
}

# Step 2: Update .env.local with PostgreSQL connection string
echo "⚙️  Step 2: Updating .env.local with PostgreSQL connection..."
if [ -f .env.local ]; then
    # Backup existing .env.local
    cp .env.local .env.local.backup.$(date +%Y%m%d_%H%M%S)
    
    # Remove old DATABASE_URL if exists
    sed -i '/^DATABASE_URL=/d' .env.local
    
    # Add PostgreSQL connection string
    echo "" >> .env.local
    echo "# PostgreSQL Database Connection" >> .env.local
    echo "DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@db.zdeupdkbsueczuoercmm.supabase.co:5432/postgres" >> .env.local
    
    echo "✅ .env.local updated"
else
    echo "⚠️  .env.local not found - creating new one..."
    cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://zdeupdkbsueczuoercmm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkZXVwZGtic3VlY3p1b2VyY21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NzQ2OTQsImV4cCI6MjA4MDM1MDY5NH0.3pK1yIk1pVFSKWx0w86ICy1v5TdiR-h0zfi-XUnMsJY
SUPABASE_SERVICE_ROLE_KEY=sb_secret_8p9yjp2-zwEEUcq5kozNHQ_MWeFBSAQ
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_dJC-8z_4jTFnRcahVAjegQ_aDixqmyh

# PostgreSQL Database Connection
DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@db.zdeupdkbsueczuoercmm.supabase.co:5432/postgres

PORT=3000
NODE_ENV=production
EOF
    chmod 600 .env.local
    echo "✅ .env.local created"
fi

# Step 3: Install dependencies
echo "📦 Step 3: Installing dependencies..."
npm install

# Step 4: Build application
echo "🔨 Step 4: Building application..."
npm run build

# Step 5: Restart PM2
echo "🔄 Step 5: Restarting application..."
pm2 restart ${APP_NAME} || pm2 start ecosystem.config.js

# Step 6: Save PM2 state
pm2 save

echo ""
echo "✅ Update complete!"
echo ""
echo "Application status:"
pm2 status ${APP_NAME}
echo ""
echo "Recent logs:"
pm2 logs ${APP_NAME} --lines 10 --nostream
