#!/bin/bash
# Remote Server Setup - Run this from your local machine
# This will SSH into the server as root and run the setup

set -e

DROPLET_IP="178.128.47.122"
ROOT_PASSWORD="Trendy@254Zone"

echo "🚀 Starting complete server setup..."
echo "   Server: ${DROPLET_IP}"
echo "   This will:"
echo "   • Delete user 'frank'"
echo "   • Create user 'trendy'"
echo "   • Install Node.js, PM2, NGINX"
echo "   • Deploy the application"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# Upload setup script
echo "📤 Uploading setup script..."
sshpass -p "${ROOT_PASSWORD}" scp -o StrictHostKeyChecking=no scripts/setup-server-complete.sh root@${DROPLET_IP}:/tmp/setup.sh

# Run setup script
echo "⚙️  Running setup on server..."
sshpass -p "${ROOT_PASSWORD}" ssh -o StrictHostKeyChecking=no root@${DROPLET_IP} << 'ENDSSH'
chmod +x /tmp/setup.sh
/tmp/setup.sh
ENDSSH

echo ""
echo "✅ Server setup completed!"
echo ""
echo "📝 Next steps:"
echo "   1. SSH as new user: ssh trendy@${DROPLET_IP}"
echo "   2. Clone your repo: cd ~ && git clone YOUR_REPO trendyfashionzone"
echo "   3. Run: cd trendyfashionzone && bash scripts/run-on-server.sh"

