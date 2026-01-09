#!/bin/bash

# Server Setup Script for GitHub Deployment
# Run this on the DigitalOcean server

set -e

APP_NAME="trendyfashions"
APP_DIR="/var/www/${APP_NAME}"
NODE_VERSION="20"
GITHUB_REPO="${GITHUB_REPO}"

if [ -z "$GITHUB_REPO" ]; then
    echo "❌ GITHUB_REPO environment variable is required!"
    exit 1
fi

echo "🔧 Setting up server for ${APP_NAME}..."
echo "Repository: ${GITHUB_REPO}"

# Update system
echo "📦 Updating system packages..."
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get upgrade -y

# Install Node.js
echo "📦 Installing Node.js ${NODE_VERSION}..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
    apt-get install -y nodejs
fi

# Install PM2
echo "📦 Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

# Install Nginx
echo "📦 Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    apt-get install -y nginx
fi

# Install Git
echo "📦 Installing Git..."
if ! command -v git &> /dev/null; then
    apt-get install -y git
fi

# Create swap file (important for 1GB RAM)
echo "💾 Setting up swap file..."
if [ ! -f /swapfile ]; then
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab
fi

# Create app directory
echo "📁 Creating app directory..."
mkdir -p ${APP_DIR}
cd ${APP_DIR}

# Clone or update repository
if [ -d ".git" ]; then
    echo "🔄 Updating repository..."
    git fetch origin
    git reset --hard origin/main || git reset --hard origin/master
    git pull origin main || git pull origin master
else
    echo "📥 Cloning repository..."
    git clone ${GITHUB_REPO} .
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the application
echo "🏗️  Building Next.js application..."
npm run build

# Set up PM2
echo "⚙️  Setting up PM2..."
if [ -f /tmp/ecosystem.config.js ]; then
    cp /tmp/ecosystem.config.js .
fi

if [ -f ecosystem.config.js ]; then
    pm2 delete ${APP_NAME} 2>/dev/null || true
    pm2 start ecosystem.config.js
    pm2 save
    pm2 startup systemd -u root --hp /root 2>/dev/null || true
else
    pm2 delete ${APP_NAME} 2>/dev/null || true
    pm2 start npm --name "${APP_NAME}" -- start
    pm2 save
    pm2 startup systemd -u root --hp /root 2>/dev/null || true
fi

# Set up Nginx
echo "⚙️  Configuring Nginx..."
cat > /etc/nginx/sites-available/${APP_NAME} << 'NGINX_CONFIG'
server {
    listen 80;
    server_name _; # Replace with your domain

    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }

    location /images {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 7d;
        add_header Cache-Control "public, max-age=604800";
    }
}
NGINX_CONFIG

# Enable site
ln -sf /etc/nginx/sites-available/${APP_NAME} /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
nginx -t
systemctl restart nginx
systemctl enable nginx

# Set up firewall
echo "🔥 Configuring firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo "✅ Server setup complete!"
echo ""
echo "📊 Check status:"
echo "   - PM2: pm2 status"
echo "   - Nginx: systemctl status nginx"
echo "   - App logs: pm2 logs ${APP_NAME}"
echo ""
echo "⚠️  Don't forget to upload your .env file!"
