#!/bin/bash

# Remote Update Script - Run from local machine to update server
# Usage: ./scripts/remote-update.sh [POSTGRES_PASSWORD]

set -e

DROPLET_IP="178.128.47.122"
DROPLET_USER="frank"
APP_NAME="trendyfashionzone"
POSTGRES_PASSWORD="${1:-}"

if [ -z "$POSTGRES_PASSWORD" ]; then
    echo "Usage: ./scripts/remote-update.sh [POSTGRES_PASSWORD]"
    echo "   or: POSTGRES_PASSWORD=your_password ./scripts/remote-update.sh"
    exit 1
fi

echo "🔄 Updating server at $DROPLET_IP..."
echo ""

# Upload update script
echo "📤 Uploading update script..."
scp scripts/update-server.sh ${DROPLET_USER}@${DROPLET_IP}:/tmp/

# Run update on server
echo "🚀 Running update on server..."
ssh ${DROPLET_USER}@${DROPLET_IP} << ENDSSH
chmod +x /tmp/update-server.sh
/tmp/update-server.sh ${POSTGRES_PASSWORD}
rm /tmp/update-server.sh
ENDSSH

echo ""
echo "✅ Server update complete!"
echo "Check status: ssh ${DROPLET_USER}@${DROPLET_IP} 'pm2 status'"
