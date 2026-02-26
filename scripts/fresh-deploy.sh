#!/bin/bash

# Fresh Deployment Script - Complete Server Setup
# This script will DELETE everything and start fresh

set -e

# Configuration
DROPLET_IP="178.128.47.122"
ROOT_PASSWORD="Trendy@254Zone"
GIT_REPO="trendyfashions.git"
USERNAME="frank"
FULL_NAME="NelsonFrank"
PHONE="0721417489"
USER_PASSWORD="Frank.Ne"
APP_NAME="trendyfashionzone"
APP_DIR="/home/${USERNAME}/${APP_NAME}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🚀 Starting Fresh Deployment${NC}"
echo "  IP: $DROPLET_IP"
echo "  User: $USERNAME"
echo "  Repo: $GIT_REPO"
echo ""

# Install sshpass if not available
if ! command -v sshpass &> /dev/null; then
    echo -e "${YELLOW}Installing sshpass...${NC}"
    sudo apt-get update && sudo apt-get install -y sshpass
fi

# Function to run commands on server
run_remote() {
    sshpass -p "$ROOT_PASSWORD" ssh -o StrictHostKeyChecking=no root@$DROPLET_IP "$1"
}

# Function to copy files to server
copy_to_server() {
    sshpass -p "$ROOT_PASSWORD" scp -o StrictHostKeyChecking=no "$1" root@$DROPLET_IP:"$2"
}

echo -e "${YELLOW}📦 Step 1: Cleaning server...${NC}"
run_remote "
    # Stop all services
    pm2 delete all 2>/dev/null || true
    systemctl stop nginx 2>/dev/null || true
    
    # Remove old user if exists
    userdel -r $USERNAME 2>/dev/null || true
    
    # Clean app directories
    rm -rf /var/www/* /home/*/trendyfashionzone /home/*/trendyfashions
    
    # Clean PM2
    pm2 kill 2>/dev/null || true
    rm -rf /root/.pm2
    
    echo '✅ Server cleaned'
"

echo -e "${YELLOW}👤 Step 2: Creating user $USERNAME...${NC}"
run_remote "
    # Create user with password
    useradd -m -s /bin/bash -c '$FULL_NAME' $USERNAME
    echo '$USERNAME:$USER_PASSWORD' | chpasswd
    
    # Add to sudo group
    usermod -aG sudo $USERNAME
    
    # Create .ssh directory
    mkdir -p /home/$USERNAME/.ssh
    chmod 700 /home/$USERNAME/.ssh
    chown -R $USERNAME:$USERNAME /home/$USERNAME
    
    echo '✅ User created'
"

echo -e "${YELLOW}📦 Step 3: Installing system packages...${NC}"
run_remote "
    apt-get update
    apt-get upgrade -y
    apt-get install -y curl git nginx certbot python3-certbot-nginx ufw
    
    # Install Node.js 20.x
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
    
    # Install PM2 globally
    npm install -g pm2
    
    echo '✅ Packages installed'
    node --version
    npm --version
"

echo -e "${YELLOW}🔒 Step 4: Configuring firewall...${NC}"
run_remote "
    ufw --force reset
    ufw allow ssh
    ufw allow http
    ufw allow https
    ufw --force enable
    ufw status
    echo '✅ Firewall configured'
"

echo -e "${YELLOW}📥 Step 5: Cloning repository...${NC}"
run_remote "
    su - $USERNAME << 'ENDUSER'
        cd ~
        rm -rf $APP_NAME
        git clone https://github.com/YOUR_USERNAME/$GIT_REPO $APP_NAME || {
            echo '⚠️  Git clone failed - you may need to update the repo URL'
            mkdir -p $APP_NAME
        }
        cd $APP_NAME
        pwd
        ls -la
    ENDUSER
    echo '✅ Repository cloned'
"

echo -e "${YELLOW}📤 Step 6: Uploading files...${NC}"
# Build locally first
echo "Building application locally..."
npm run build

# Create deployment package
echo "Creating deployment package..."
tar --exclude='.git' \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='.vscode' \
    --exclude='*.log' \
    -czf /tmp/${APP_NAME}-deploy.tar.gz .

# Upload files
copy_to_server "/tmp/${APP_NAME}-deploy.tar.gz" "/tmp/"
copy_to_server "ecosystem.config.js" "/tmp/"
copy_to_server ".env.local" "/tmp/.env.local.production" 2>/dev/null || echo "⚠️  .env.local not found - will need to create on server"

echo -e "${GREEN}✅ Files uploaded${NC}"

echo -e "${YELLOW}⚙️  Step 7: Setting up application...${NC}"
run_remote "
    su - $USERNAME << 'ENDUSER'
        cd ~/$APP_NAME
        
        # Extract files if git clone failed
        if [ ! -f package.json ]; then
            tar -xzf /tmp/${APP_NAME}-deploy.tar.gz
        fi
        
        # Create logs directory
        mkdir -p logs
        
        # Copy environment file
        if [ -f /tmp/.env.local.production ]; then
            cp /tmp/.env.local.production .env.local
            chmod 600 .env.local
        else
            echo '⚠️  Creating .env.local from template...'
            cat > .env.local << 'ENVEOF'
NEXT_PUBLIC_SUPABASE_URL=https://zdeupdkbsueczuoercmm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkZXVwZGtic3VlY3p1b2VyY21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NzQ2OTQsImV4cCI6MjA4MDM1MDY5NH0.3pK1yIk1pVFSKWx0w86ICy1v5TdiR-h0zfi-XUnMsJY
SUPABASE_SERVICE_ROLE_KEY=sb_secret_8p9yjp2-zwEEUcq5kozNHQ_MWeFBSAQ
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_dJC-8z_4jTFnRcahVAjegQ_aDixqmyh
PORT=3000
NODE_ENV=production
ENVEOF
            chmod 600 .env.local
        fi
        
        # Update ecosystem.config.js
        cp /tmp/ecosystem.config.js .
        sed -i \"s|/home/trendyfashion/trendyfashionzone|$APP_DIR|g\" ecosystem.config.js
        
        # Install dependencies
        npm install
        
        # Build application
        npm run build
        
        echo '✅ Application setup complete'
    ENDUSER
"

echo -e "${YELLOW}🚀 Step 8: Starting with PM2...${NC}"
run_remote "
    su - $USERNAME << 'ENDUSER'
        cd ~/$APP_NAME
        
        # Start with PM2
        pm2 delete $APP_NAME 2>/dev/null || true
        pm2 start ecosystem.config.js
        pm2 save
        
        # Setup PM2 startup
        sudo env PATH=\$PATH:/usr/bin pm2 startup systemd -u $USERNAME --hp /home/$USERNAME
        
        echo '✅ PM2 configured'
        pm2 status
    ENDUSER
"

echo -e "${YELLOW}🌐 Step 9: Configuring NGINX...${NC}"
run_remote "
    # Remove default site
    rm -f /etc/nginx/sites-enabled/default
    
    # Create NGINX config
    cat > /etc/nginx/sites-available/$APP_NAME << 'NGINXEOF'
server {
    listen 80;
    listen [::]:80;
    
    server_name trendyfashionzone.co.ke www.trendyfashionzone.co.ke;

    client_max_body_size 20M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control \"public, immutable\";
    }
}
NGINXEOF

    # Enable site
    ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
    
    # Test and restart
    nginx -t && systemctl restart nginx
    systemctl enable nginx
    
    echo '✅ NGINX configured'
"

echo -e "${YELLOW}🔐 Step 10: Setting up SSL...${NC}"
run_remote "
    certbot --nginx -d trendyfashionzone.co.ke -d www.trendyfashionzone.co.ke --non-interactive --agree-tos --email nelsonfrank@trendyfashionzone.co.ke --redirect || {
        echo '⚠️  SSL setup may need manual intervention'
    }
    echo '✅ SSL configured'
"

echo ""
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo ""
echo "Server Details:"
echo "  IP: $DROPLET_IP"
echo "  User: $USERNAME"
echo "  Password: $USER_PASSWORD"
echo "  App Directory: $APP_DIR"
echo ""
echo "Access:"
echo "  SSH: ssh $USERNAME@$DROPLET_IP"
echo "  Website: https://trendyfashionzone.co.ke"
echo ""
echo "Useful Commands:"
echo "  Check app: ssh $USERNAME@$DROPLET_IP 'pm2 status'"
echo "  View logs: ssh $USERNAME@$DROPLET_IP 'pm2 logs $APP_NAME'"
echo "  Restart: ssh $USERNAME@$DROPLET_IP 'pm2 restart $APP_NAME'"
