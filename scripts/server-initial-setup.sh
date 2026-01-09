#!/bin/bash

# Initial Server Setup Script for DigitalOcean
# Run this ONCE on a fresh server

set -e

echo "🔧 Starting Initial Server Setup for Trendy Fashion Zone"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
USERNAME="${1:-trendyfashion}"
APP_NAME="trendyfashionzone"

echo -e "${YELLOW}📋 Setup Configuration:${NC}"
echo "  Username: $USERNAME"
echo "  App Name: $APP_NAME"
echo ""

# Step 1: Update system
echo -e "${YELLOW}📦 Step 1: Updating system packages...${NC}"
sudo apt update
sudo apt upgrade -y
echo -e "${GREEN}✅ System updated${NC}"
echo ""

# Step 2: Install Node.js 20.x
echo -e "${YELLOW}📦 Step 2: Installing Node.js 20.x...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version
npm --version
echo -e "${GREEN}✅ Node.js installed${NC}"
echo ""

# Step 3: Install Git
echo -e "${YELLOW}📦 Step 3: Installing Git...${NC}"
sudo apt install -y git
echo -e "${GREEN}✅ Git installed${NC}"
echo ""

# Step 4: Install PM2
echo -e "${YELLOW}📦 Step 4: Installing PM2...${NC}"
sudo npm install -g pm2
pm2 --version
echo -e "${GREEN}✅ PM2 installed${NC}"
echo ""

# Step 5: Install NGINX
echo -e "${YELLOW}📦 Step 5: Installing NGINX...${NC}"
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
echo -e "${GREEN}✅ NGINX installed${NC}"
echo ""

# Step 6: Install Certbot
echo -e "${YELLOW}📦 Step 6: Installing Certbot...${NC}"
sudo apt install -y certbot python3-certbot-nginx
echo -e "${GREEN}✅ Certbot installed${NC}"
echo ""

# Step 7: Configure Firewall
echo -e "${YELLOW}🔒 Step 7: Configuring firewall...${NC}"
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw --force enable
sudo ufw status
echo -e "${GREEN}✅ Firewall configured${NC}"
echo ""

# Step 8: Create app directory
echo -e "${YELLOW}📁 Step 8: Creating application directory...${NC}"
mkdir -p ~/${APP_NAME}
cd ~/${APP_NAME}
echo -e "${GREEN}✅ Directory created: ~/${APP_NAME}${NC}"
echo ""

# Step 9: Setup PM2 startup
echo -e "${YELLOW}⚙️  Step 9: Setting up PM2 startup...${NC}"
pm2 startup
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Copy and run the command shown above to enable PM2 on boot${NC}"
echo ""

echo -e "${GREEN}✅ Initial setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Clone your repository: cd ~/${APP_NAME} && git clone YOUR_REPO_URL ."
echo "  2. Create .env.local file with your environment variables"
echo "  3. Run: npm install && npm run build"
echo "  4. Start with PM2: pm2 start ecosystem.config.js"
echo "  5. Configure NGINX (see deployment guide)"
echo "  6. Setup SSL: sudo certbot --nginx -d trendyfashionzone.co.ke -d www.trendyfashionzone.co.ke"

