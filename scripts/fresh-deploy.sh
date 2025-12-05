#!/bin/bash

# Fresh Deployment Script - Complete Server Reset
# This will DELETE everything and start fresh

set -e

DROPLET_IP="178.128.47.122"
ROOT_PASSWORD="Trendy@254Zone"
NEW_USER="frank"
FULL_NAME="NelsonFrank"
USER_PASSWORD="Frank.Ne"
GIT_REPO="${GIT_REPO:-https://github.com/NelsonFranklinWere/trendyfashions.git}"
APP_NAME="trendyfashionzone"

echo "⚠️  WARNING: This will DELETE everything on the server!"
echo "IP: $DROPLET_IP"
echo "New User: $NEW_USER"
echo ""

# Auto-confirm if SKIP_CONFIRM is set
if [ "${SKIP_CONFIRM:-}" != "yes" ]; then
    read -p "Continue? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        echo "Aborted."
        exit 1
    fi
else
    echo "Auto-confirming (SKIP_CONFIRM=yes)..."
fi

echo "🚀 Starting fresh deployment..."
echo ""

# Step 1: Connect and clean server
echo "🧹 Step 1: Cleaning server..."
sshpass -p "$ROOT_PASSWORD" ssh -o StrictHostKeyChecking=no root@$DROPLET_IP << 'ENDSSH'
# Stop all services
pm2 delete all 2>/dev/null || true
systemctl stop nginx 2>/dev/null || true

# Remove old app directories
rm -rf /var/www/trendyfashions
rm -rf /home/*/trendyfashionzone
rm -rf /home/*/trendyfashions

# Remove old users (except root)
for user in $(awk -F: '$3 >= 1000 && $1 != "nobody" {print $1}' /etc/passwd); do
    if [ "$user" != "root" ]; then
        userdel -r $user 2>/dev/null || true
    fi
done

# Clean up
apt-get clean
rm -rf /tmp/*
ENDSSH

echo "✅ Server cleaned"
echo ""

# Step 2: Create new user
echo "👤 Step 2: Creating user '$NEW_USER'..."
sshpass -p "$ROOT_PASSWORD" ssh -o StrictHostKeyChecking=no root@$DROPLET_IP << ENDSSH
# Create user with full name
adduser --disabled-password --gecos "$FULL_NAME,,,$USER_PASSWORD" $NEW_USER

# Set password
echo "$NEW_USER:$USER_PASSWORD" | chpasswd

# Add to sudo group
usermod -aG sudo $NEW_USER

# Allow passwordless sudo (optional, for easier deployment)
echo "$NEW_USER ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/$NEW_USER
chmod 0440 /etc/sudoers.d/$NEW_USER
ENDSSH

echo "✅ User created"
echo ""

# Step 3: Initial server setup
echo "🔧 Step 3: Running initial server setup..."
sshpass -p "$USER_PASSWORD" ssh -o StrictHostKeyChecking=no ${NEW_USER}@$DROPLET_IP << 'ENDSSH'
# Update system
sudo apt update
sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Git
sudo apt install -y git

# Install PM2
sudo npm install -g pm2

# Install NGINX
sudo apt install -y nginx

# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Configure firewall
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw --force enable

# Create app directory
mkdir -p ~/$APP_NAME
ENDSSH

echo "✅ Server setup complete"
echo ""

# Step 4: Clone repository
echo "📥 Step 4: Cloning repository..."
sshpass -p "$USER_PASSWORD" ssh -o StrictHostKeyChecking=no ${NEW_USER}@$DROPLET_IP << ENDSSH
cd ~
if [ -d "$APP_NAME" ]; then
    rm -rf $APP_NAME
fi

# Clone repository
git clone $GIT_REPO $APP_NAME
ENDSSH

echo "✅ Repository cloned"
echo ""

# Step 5: Setup environment and build
echo "⚙️  Step 5: Setting up application..."
sshpass -p "$USER_PASSWORD" ssh -o StrictHostKeyChecking=no ${NEW_USER}@$DROPLET_IP << 'ENDSSH'
cd ~/$APP_NAME

# Create .env.local
cat > .env.local << 'ENVFILE'
NEXT_PUBLIC_SUPABASE_URL=https://zdeupdkbsueczuoercmm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkZXVwZGtic3VlY3p1b2VyY21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NzQ2OTQsImV4cCI6MjA4MDM1MDY5NH0.3pK1yIk1pVFSKWx0w86ICy1v5TdiR-h0zfi-XUnMsJY
SUPABASE_SERVICE_ROLE_KEY=sb_secret_8p9yjp2-zwEEUcq5kozNHQ_MWeFBSAQ
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_dJC-8z_4jTFnRcahVAjegQ_aDixqmyh
PORT=3000
NODE_ENV=production
ENVFILE

# Install dependencies
npm install

# Build application
npm run build
ENDSSH

echo "✅ Application built"
echo ""

# Step 6: Update PM2 config and start
echo "🚀 Step 6: Starting application with PM2..."
sshpass -p "$USER_PASSWORD" ssh -o StrictHostKeyChecking=no ${NEW_USER}@$DROPLET_IP << ENDSSH
cd ~/$APP_NAME

# Update ecosystem.config.js with correct path
sed -i "s|/home/trendyfashion/trendyfashionzone|/home/$NEW_USER/$APP_NAME|g" ecosystem.config.js || true

# Create logs directory
mkdir -p logs

# Start with PM2
pm2 delete $APP_NAME 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

# Setup PM2 startup
pm2 startup | grep -v "PM2" | bash || true
ENDSSH

echo "✅ Application started"
echo ""

# Step 7: Configure NGINX
echo "🌐 Step 7: Configuring NGINX..."
sshpass -p "$USER_PASSWORD" ssh -o StrictHostKeyChecking=no ${NEW_USER}@$DROPLET_IP << 'ENDSSH'
sudo rm -f /etc/nginx/sites-enabled/default

sudo tee /etc/nginx/sites-available/trendyfashionzone > /dev/null <<'NGINXCONF'
server {
    listen 80;
    listen [::]:80;
    
    server_name trendyfashionzone.co.ke www.trendyfashionzone.co.ke;

    client_max_body_size 20M;

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
}
NGINXCONF

sudo ln -sf /etc/nginx/sites-available/trendyfashionzone /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx
ENDSSH

echo "✅ NGINX configured"
echo ""

# Step 8: Setup SSL
echo "🔒 Step 8: Setting up SSL certificate..."
sshpass -p "$USER_PASSWORD" ssh -o StrictHostKeyChecking=no ${NEW_USER}@$DROPLET_IP << 'ENDSSH'
sudo certbot --nginx -d trendyfashionzone.co.ke -d www.trendyfashionzone.co.ke --non-interactive --agree-tos --email admin@trendyfashionzone.co.ke --redirect || echo "⚠️  SSL setup may require manual intervention"
ENDSSH

echo "✅ SSL configured"
echo ""

echo "🎉 Deployment complete!"
echo ""
echo "Server Details:"
echo "  IP: $DROPLET_IP"
echo "  User: $NEW_USER"
echo "  Password: $USER_PASSWORD"
echo "  App Directory: /home/$NEW_USER/$APP_NAME"
echo ""
echo "Access your app at:"
echo "  http://$DROPLET_IP"
echo "  https://trendyfashionzone.co.ke"
echo ""
echo "SSH Access:"
echo "  ssh $NEW_USER@$DROPLET_IP"
echo ""
echo "Check app status:"
echo "  ssh $NEW_USER@$DROPLET_IP 'pm2 status'"
echo "  ssh $NEW_USER@$DROPLET_IP 'pm2 logs $APP_NAME'"
