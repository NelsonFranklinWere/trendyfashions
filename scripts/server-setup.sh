#!/bin/bash

# Server Setup Script - Run this on the DigitalOcean server
# This script sets up Node.js, PM2, Nginx, and deploys the app

set -e

APP_NAME="trendyfashions"
APP_DIR="/var/www/${APP_NAME}"
NODE_VERSION="20" # LTS version

echo "🔧 Setting up server for ${APP_NAME}..."

# Update system
echo "📦 Updating system packages..."
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get upgrade -y

# Install Node.js using NodeSource
echo "📦 Installing Node.js ${NODE_VERSION}..."
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
apt-get install -y nodejs

# Install PM2 globally
echo "📦 Installing PM2..."
npm install -g pm2

# Install Nginx
echo "📦 Installing Nginx..."
apt-get install -y nginx

# Create swap file (1GB RAM is tight for Next.js build)
echo "💾 Creating swap file..."
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

# Extract deployment package
echo "📦 Extracting application files..."
if [ -f /tmp/deploy.tar.gz ]; then
    tar -xzf /tmp/deploy.tar.gz
    rm /tmp/deploy.tar.gz
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# Build the application
echo "🏗️  Building Next.js application..."
npm run build

# Set up PM2
echo "⚙️  Setting up PM2..."
if [ -f ecosystem.config.js ]; then
    pm2 start ecosystem.config.js
    pm2 save
    pm2 startup systemd -u root --hp /root
else
    # Fallback: start manually
    pm2 start npm --name "${APP_NAME}" -- start
    pm2 save
    pm2 startup systemd -u root --hp /root
fi

# Set up Nginx
echo "⚙️  Configuring Nginx..."
cat > /etc/nginx/sites-available/${APP_NAME} << 'NGINX_CONFIG'
server {
    listen 80;
    server_name _; # Replace with your domain

    # Increase body size for image uploads
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
        
        # Timeouts for large image processing
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Cache static assets
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }

    # Cache images
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
echo "🌐 Your app is available at: http://$(curl -s ifconfig.me)"
