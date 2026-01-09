#!/bin/bash
# Server-Side Deployment Script
# Run this directly on the server after SSH'ing in
# Usage: bash deploy-on-server.sh

set -e

DROPLET_USER="trendy"
APP_NAME="trendyfashions"
APP_PORT=3000
APP_DIR="/home/${DROPLET_USER}/${APP_NAME}"
GIT_REPO="https://github.com/NelsonFranklinWere/trendyfashions.git"

echo "🚀 Starting deployment on server..."
echo "   User: ${DROPLET_USER}"
echo "   App: ${APP_NAME}"
echo "   Directory: ${APP_DIR}"
echo ""

# ============================================
# SERVER-SIDE DEPLOYMENT SCRIPT
# ============================================

echo "📦 Step 1: Installing Node.js 18.x LTS..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo "✅ Node.js installed: $(node --version)"
else
    echo "✅ Node.js already installed: $(node --version)"
fi

echo ""
echo "📦 Step 2: Installing PostgreSQL..."
if ! command -v psql &> /dev/null; then
    sudo apt-get update
    sudo apt-get install -y postgresql postgresql-contrib
    echo "✅ PostgreSQL installed"
else
    echo "✅ PostgreSQL already installed"
fi

echo ""
echo "🗄️  Step 3: Setting up PostgreSQL database..."
sudo -u postgres psql << PGSQL
-- Create database
SELECT 'CREATE DATABASE trendyfashions' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'trendyfashions')\gexec

-- Create user if not exists
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'trendy') THEN
        CREATE USER trendy WITH PASSWORD 'Trendy@254Fashions';
    END IF;
END
\$\$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE trendyfashions TO trendy;
ALTER DATABASE trendyfashions OWNER TO trendy;
PGSQL

echo "✅ Database and user created"

echo ""
echo "📁 Step 4: Setting up application directory..."
cd ~
if [ ! -d "${APP_NAME}" ]; then
    echo "   Cloning from GitHub..."
    git clone ${GIT_REPO} || {
        echo "⚠️  Git clone failed - you may need to clone manually"
        mkdir -p ${APP_NAME}
    }
else
    echo "✅ App directory exists"
    cd ${APP_NAME}
    if [ -d ".git" ]; then
        echo "   Pulling latest changes..."
        git pull origin main || git pull origin master || echo "   Git pull skipped"
    fi
fi

cd ${APP_DIR}
echo "✅ Working in: $(pwd)"

echo ""
echo "📦 Step 5: Installing dependencies..."
npm install
echo "✅ Dependencies installed"

echo ""
echo "⚙️  Step 6: Creating .env.local..."
if [ ! -f .env.local ]; then
    cat > .env.local << 'ENVEOF'
# PostgreSQL Database
DATABASE_URL=postgresql://trendy:Trendy@254Fashions@localhost:5432/trendyfashions

# DigitalOcean Spaces (UPDATE LATER)
DO_SPACES_ENDPOINT=https://lon1.digitaloceanspaces.com
DO_SPACES_KEY=YOUR_NEW_KEY_HERE
DO_SPACES_SECRET=YOUR_NEW_SECRET_HERE
DO_SPACES_BUCKET=trendyfashions
DO_SPACES_CDN_URL=https://trendyfashions.lon1.cdn.digitaloceanspaces.com

# App Configuration
NODE_ENV=production
PORT=3000
ENVEOF
    chmod 600 .env.local
    echo "✅ .env.local created - PLEASE UPDATE DigitalOcean Spaces credentials"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "🗄️  Step 7: Setting up database schema..."
if [ -f "database/postgres-schema.sql" ]; then
    echo "   Running database schema..."
    PGPASSWORD='Trendy@254Fashions' psql -U trendy -d trendyfashions -f database/postgres-schema.sql || {
        echo "⚠️  Schema setup failed, trying alternative method..."
        sudo -u postgres psql trendyfashions < database/postgres-schema.sql || echo "⚠️  Schema setup skipped"
    }
    echo "✅ Database schema setup complete"
else
    echo "⚠️  Schema file not found - you may need to run migrations manually"
fi

echo ""
echo "🔨 Step 8: Building application..."
npm run build
echo "✅ Build complete"

echo ""
echo "📦 Step 9: Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
    echo "✅ PM2 installed"
else
    echo "✅ PM2 already installed"
fi

echo ""
echo "⚙️  Step 10: Creating PM2 ecosystem config..."
cat > ecosystem.config.js << PM2EOF
module.exports = {
  apps: [{
    name: '${APP_NAME}',
    script: 'npm',
    args: 'start',
    cwd: '${APP_DIR}',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: ${APP_PORT}
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000,
  }]
};
PM2EOF
echo "✅ ecosystem.config.js created"

echo ""
echo "🚀 Step 11: Starting application with PM2..."
pm2 delete ${APP_NAME} 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
echo "✅ Application started"

echo ""
echo "⚙️  Step 12: Setting up PM2 startup..."
pm2 startup systemd -u ${DROPLET_USER} --hp /home/${DROPLET_USER} | grep "sudo" | bash || true
echo "✅ PM2 startup configured"

echo ""
echo "🔥 Step 13: Configuring UFW firewall..."
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw status
echo "✅ Firewall configured"

echo ""
echo "🌐 Step 14: Installing and configuring NGINX..."
if ! command -v nginx &> /dev/null; then
    sudo apt-get install -y nginx
fi

# Backup existing config
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup.$(date +%Y%m%d_%H%M%S)

# Create NGINX config
sudo tee /etc/nginx/sites-available/default > /dev/null << NGINXEOF
server {
    listen 80;
    listen [::]:80;
    
    server_name _;  # Replace with your domain later
    
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
NGINXEOF

# Test NGINX config
sudo nginx -t

# Restart NGINX
sudo systemctl restart nginx
sudo systemctl enable nginx
echo "✅ NGINX configured and started"

echo ""
echo "🔒 Step 15: Installing Certbot for SSL..."
if ! command -v certbot &> /dev/null; then
    sudo apt-get update
    sudo apt-get install -y certbot python3-certbot-nginx
    echo "✅ Certbot installed"
else
    echo "✅ Certbot already installed"
fi

echo ""
echo "=========================================="
echo "✅ DEPLOYMENT COMPLETE!"
echo "=========================================="
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Add your domain in DigitalOcean Networking:"
echo "   - Add A record for @ pointing to 64.225.112.70"
echo "   - Add A record for www pointing to 64.225.112.70"
echo ""
echo "2. Update NGINX config with your domain:"
echo "   sudo nano /etc/nginx/sites-available/default"
echo "   Change 'server_name _;' to 'server_name yourdomain.com www.yourdomain.com;'"
echo "   sudo nginx -t && sudo systemctl restart nginx"
echo ""
echo "3. Get SSL certificate:"
echo "   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com"
echo ""
echo "4. Test SSL renewal:"
echo "   sudo certbot renew --dry-run"
echo ""
echo "5. Update DigitalOcean Spaces credentials in .env.local:"
echo "   nano ${APP_DIR}/.env.local"
echo "   (Update DO_SPACES_KEY, DO_SPACES_SECRET, etc.)"
echo ""
echo "6. Check application status:"
echo "   pm2 status"
echo "   pm2 logs ${APP_NAME}"
echo ""
echo "7. Access your app:"
echo "   http://64.225.112.70 (until domain is configured)"
echo ""

