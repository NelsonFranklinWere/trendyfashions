# Quick Deployment Guide

## Prerequisites
- DigitalOcean droplet created
- SSH access to droplet
- GitHub repository URL

## Step 1: Initial Server Setup (Run ONCE on server)

```bash
# SSH into your server
ssh root@YOUR_DROPLET_IP

# Create user (if not exists)
adduser trendyfashion
usermod -aG sudo trendyfashion
su - trendyfashion

# Upload and run setup script
# (Copy server-initial-setup.sh to server, then:)
chmod +x server-initial-setup.sh
./server-initial-setup.sh trendyfashion
```

## Step 2: Clone Repository and Setup

```bash
# On server, as trendyfashion user
cd ~
git clone YOUR_GITHUB_REPO_URL trendyfashionzone
cd trendyfashionzone

# Create .env.local
nano .env.local
# Add your Supabase keys

# Install and build
npm install
npm run build
```

## Step 3: Start with PM2

```bash
# Update ecosystem.config.js path if needed
nano ecosystem.config.js
# Change cwd to: /home/trendyfashion/trendyfashionzone

# Start app
pm2 start ecosystem.config.js
pm2 save

# Setup startup (run the command PM2 shows)
pm2 startup
```

## Step 4: Configure NGINX

```bash
# Run NGINX setup script
chmod +x scripts/setup-nginx.sh
./scripts/setup-nginx.sh
```

## Step 5: Setup SSL

```bash
sudo certbot --nginx -d trendyfashionzone.co.ke -d www.trendyfashionzone.co.ke
```

## Step 6: Verify

Visit: https://trendyfashionzone.co.ke

## Future Deployments

From your local machine:
```bash
export DROPLET_IP=YOUR_IP
export DROPLET_USER=trendyfashion
./scripts/deploy-to-digitalocean.sh
```

