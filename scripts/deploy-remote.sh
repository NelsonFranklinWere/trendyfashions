#!/bin/bash
# Remote deployment using sshpass
# This will SSH into the server and run the deployment

set -e

DROPLET_IP="64.225.112.70"
DROPLET_USER="trendy"
PASSWORD="Trendy@254Fashions"

echo "🚀 Deploying to ${DROPLET_USER}@${DROPLET_IP}..."
echo ""

# Add server to known_hosts to avoid prompt
ssh-keyscan -H ${DROPLET_IP} >> ~/.ssh/known_hosts 2>/dev/null || true

# Run deployment command via SSH
sshpass -p "${PASSWORD}" ssh -tt -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null ${DROPLET_USER}@${DROPLET_IP} << 'ENDSSH'
cd ~
git clone https://github.com/NelsonFranklinWere/trendyfashions.git 2>/dev/null || (cd trendyfashions && git pull)
cd trendyfashions
chmod +x scripts/deploy-on-server.sh
bash scripts/deploy-on-server.sh
ENDSSH

echo ""
echo "✅ Deployment command executed!"
