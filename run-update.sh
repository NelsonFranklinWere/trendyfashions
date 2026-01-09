#!/bin/bash

# Quick Update Command
# Usage: POSTGRES_PASSWORD=your_password ./run-update.sh

DROPLET_IP="178.128.47.122"
DROPLET_USER="frank"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-}"

if [ -z "$POSTGRES_PASSWORD" ]; then
    echo "❌ PostgreSQL password required"
    echo ""
    echo "Usage:"
    echo "  POSTGRES_PASSWORD=your_password ./run-update.sh"
    echo ""
    echo "Or run on server directly:"
    echo "  ssh frank@178.128.47.122 'cd ~/trendyfashionzone && git pull && npm install && npm run build && pm2 restart trendyfashionzone'"
    exit 1
fi

echo "🔄 Updating server..."
ssh ${DROPLET_USER}@${DROPLET_IP} << ENDSSH
cd ~/trendyfashionzone

echo "📥 Pulling from GitHub..."
git pull origin main

echo "⚙️  Updating .env.local..."
if [ -f .env.local ]; then
    sed -i '/^DATABASE_URL=/d' .env.local
    echo "DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@db.zdeupdkbsueczuoercmm.supabase.co:5432/postgres" >> .env.local
else
    echo "⚠️  .env.local not found"
fi

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building..."
npm run build

echo "🔄 Restarting..."
pm2 restart trendyfashionzone

echo "✅ Update complete!"
pm2 status
ENDSSH

echo ""
echo "✅ Server updated successfully!"
