#!/bin/bash
# Complete Server Setup Script
# This script will be run on the server as root

set -e

echo "🚀 Complete Server Setup for Trendy Fashion Zone"
echo ""

# Configuration
NEW_USER="trendy"
NEW_USER_PASSWORD="Trendy@254Zone"
APP_NAME="trendyfashionzone"
APP_DIR="/home/${NEW_USER}/${APP_NAME}"
NODE_VERSION="20"  # Using Node 20 LTS instead of 12 (more secure and compatible)
APP_PORT="3000"

# Step 1: Delete old user frank
echo "🗑️  Step 1: Removing old user 'frank'..."
if id "frank" &>/dev/null; then
    # Kill all processes by user frank
    pkill -u frank || true
    sleep 2
    
    # Remove user and home directory
    userdel -r frank 2>/dev/null || {
        # If userdel fails, try manual cleanup
        rm -rf /home/frank
        userdel frank 2>/dev/null || true
    }
    echo "✅ User 'frank' removed"
else
    echo "ℹ️  User 'frank' does not exist"
fi

# Step 2: Create new user trendy
echo "👤 Step 2: Creating new user '${NEW_USER}'..."
if id "${NEW_USER}" &>/dev/null; then
    echo "ℹ️  User '${NEW_USER}' already exists"
else
    useradd -m -s /bin/bash ${NEW_USER}
    echo "${NEW_USER}:${NEW_USER_PASSWORD}" | chpasswd
    usermod -aG sudo ${NEW_USER}
    echo "✅ User '${NEW_USER}' created with sudo privileges"
fi

# Step 3: Update system
echo "📦 Step 3: Updating system packages..."
apt update
apt upgrade -y

# Step 4: Install Node.js
echo "📦 Step 4: Installing Node.js ${NODE_VERSION}.x..."
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
apt install -y nodejs
node --version
npm --version
echo "✅ Node.js installed"

# Step 5: Install Git
echo "📦 Step 5: Installing Git..."
apt install -y git
echo "✅ Git installed"

# Step 6: Clone/Update project
echo "📥 Step 6: Setting up project..."
mkdir -p ${APP_DIR}
chown ${NEW_USER}:${NEW_USER} ${APP_DIR}

# If directory is empty or doesn't have .git, clone it
if [ ! -d "${APP_DIR}/.git" ]; then
    echo "   Cloning repository..."
    # Clone from GitHub
    su - ${NEW_USER} -c "cd ~ && git clone https://github.com/NelsonFranklinWere/trendyfashions.git ${APP_NAME} || echo 'Repository clone attempted'"
else
    echo "   Repository already exists"
fi

# Step 7: Install PM2 globally
echo "📦 Step 7: Installing PM2..."
npm install -g pm2
pm2 --version
echo "✅ PM2 installed"

# Step 8: Setup firewall
echo "🔥 Step 8: Configuring firewall..."
ufw --force enable
ufw allow ssh
ufw allow http
ufw allow https
ufw status
echo "✅ Firewall configured"

# Step 9: Install NGINX
echo "📦 Step 9: Installing NGINX..."
apt install -y nginx
systemctl enable nginx
systemctl start nginx
echo "✅ NGINX installed"

# Step 10: Configure NGINX
echo "⚙️  Step 10: Configuring NGINX..."
cat > /etc/nginx/sites-available/${APP_NAME} << EOF
server {
    listen 80;
    server_name _;  # Replace with your domain when ready
    
    location / {
        proxy_pass http://localhost:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/${APP_NAME} /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and restart NGINX
nginx -t
systemctl restart nginx
echo "✅ NGINX configured"

# Step 11: Install Certbot for SSL (optional, for later)
echo "📦 Step 11: Installing Certbot (for SSL)..."
apt install -y certbot python3-certbot-nginx
echo "✅ Certbot installed (ready for SSL setup)"

# Step 12: Setup app as trendy user
echo "📦 Step 12: Setting up application..."
su - ${NEW_USER} << ENDUSER
cd ~/${APP_NAME} || exit 1

# Pull latest code if .git exists
if [ -d .git ]; then
    echo "   Pulling latest code..."
    git pull origin main || git pull origin master || echo "   Git pull skipped"
fi

# Install dependencies
echo "   Installing dependencies..."
npm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "   Creating .env.local..."
    cat > .env.local << 'ENVEOF'
# PostgreSQL Database
DATABASE_URL=postgresql://trendyfashion_user:Trendy@Zone254@localhost:5432/trendyfashions

# DigitalOcean Spaces
DO_SPACES_ENDPOINT=https://lon1.digitaloceanspaces.com
DO_SPACES_KEY=DO00K776LV6P72227KML
DO_SPACES_SECRET=3L/uwRaSV4sfoi0onGKP/dxvCfPWFTfuK2d1Cmfad+A
DO_SPACES_BUCKET=trendyfashions
DO_SPACES_CDN_URL=https://trendyfashions.lon1.cdn.digitaloceanspaces.com

# App Configuration
NODE_ENV=production
PORT=${APP_PORT}
ENVEOF
    chmod 600 .env.local
    echo "   ✅ .env.local created"
fi

# Build application
echo "   Building application..."
npm run build

# Create PM2 ecosystem config if it doesn't exist
if [ ! -f ecosystem.config.js ]; then
    cat > ecosystem.config.js << 'PM2EOF'
module.exports = {
  apps: [{
    name: '${APP_NAME}',
    script: 'npm',
    args: 'start',
    cwd: '/home/${NEW_USER}/${APP_NAME}',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: ${APP_PORT}
    }
  }]
};
PM2EOF
    echo "   ✅ ecosystem.config.js created"
fi

# Start with PM2
echo "   Starting application with PM2..."
pm2 delete ${APP_NAME} 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

echo "   ✅ Application started"
ENDUSER

# Setup PM2 startup
echo "⚙️  Step 13: Setting up PM2 startup..."
su - ${NEW_USER} -c "pm2 startup systemd -u ${NEW_USER} --hp /home/${NEW_USER}" | grep "sudo" | bash || true
echo "✅ PM2 startup configured"

echo ""
echo "✅ Server setup complete!"
echo ""
echo "📋 Summary:"
echo "   • User 'frank' removed"
echo "   • User '${NEW_USER}' created"
echo "   • Node.js ${NODE_VERSION}.x installed"
echo "   • PM2 installed and configured"
echo "   • NGINX configured as reverse proxy"
echo "   • Firewall configured"
echo "   • Application deployed"
echo ""
echo "🌐 Access your app at:"
echo "   http://178.128.47.122"
echo ""
echo "📝 Next steps:"
echo "   1. Update NGINX config with your domain"
echo "   2. Run: sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com"
echo "   3. Check app status: sudo -u ${NEW_USER} pm2 status"
echo "   4. View logs: sudo -u ${NEW_USER} pm2 logs ${APP_NAME}"

