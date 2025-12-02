# DigitalOcean Deployment Guide

## Server Information
- **IP Address**: 178.128.47.122
- **OS**: Ubuntu 24.04 (LTS) x64
- **Specs**: 1 GB Memory / 1 AMD vCPU / 25 GB Disk
- **Location**: LON1 (London)

## Prerequisites

### On Your Local Machine
1. **Install SSH client** (usually pre-installed on Linux/Mac)
2. **Install sshpass** (for automated password entry):
   ```bash
   # Ubuntu/Debian
   sudo apt-get install sshpass
   
   # macOS
   brew install sshpass
   ```

### On DigitalOcean Server
- Root access with password: `Trendy@254Zone`

## Deployment Methods

### Method 1: Automated Deployment (Recommended)

1. **Make scripts executable**:
   ```bash
   chmod +x scripts/deploy-digitalocean.sh
   chmod +x scripts/server-setup.sh
   ```

2. **Run deployment script**:
   ```bash
   ./scripts/deploy-digitalocean.sh
   ```

This will:
- Create a deployment package
- Upload files to server
- Set up Node.js, PM2, Nginx
- Build and start the application

### Method 2: Manual Deployment

#### Step 1: Initial Server Setup (One-time)

SSH into your server:
```bash
ssh root@178.128.47.122
# Password: Trendy@254Zone
```

Run the setup script:
```bash
# Copy server-setup.sh to server first, then:
chmod +x server-setup.sh
./server-setup.sh
```

Or manually:

```bash
# Update system
apt-get update && apt-get upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Install Nginx
apt-get install -y nginx

# Create swap file (important for 1GB RAM)
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

#### Step 2: Deploy Application

On your local machine:
```bash
# Create deployment package
tar --exclude='.git' \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='.vscode' \
    -czf deploy.tar.gz .

# Upload to server
scp deploy.tar.gz root@178.128.47.122:/tmp/
scp ecosystem.config.js root@178.128.47.122:/tmp/
```

On the server:
```bash
# Create app directory
mkdir -p /var/www/trendyfashions
cd /var/www/trendyfashions

# Extract files
tar -xzf /tmp/deploy.tar.gz

# Install dependencies
npm ci

# Build application
npm run build

# Start with PM2
cp /tmp/ecosystem.config.js .
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root
```

#### Step 3: Configure Nginx

Create Nginx config:
```bash
nano /etc/nginx/sites-available/trendyfashions
```

Paste this configuration:
```nginx
server {
    listen 80;
    server_name 178.128.47.122; # Replace with your domain when ready

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
```

Enable site:
```bash
ln -s /etc/nginx/sites-available/trendyfashions /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

#### Step 4: Configure Firewall

```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
```

## Verify Deployment

1. **Check PM2 status**:
   ```bash
   pm2 status
   pm2 logs trendyfashions
   ```

2. **Check Nginx**:
   ```bash
   systemctl status nginx
   ```

3. **Visit your site**:
   - http://178.128.47.122

## Updating the Application

### Quick Update Script

Create `scripts/update-app.sh`:
```bash
#!/bin/bash
ssh root@178.128.47.122 << 'ENDSSH'
cd /var/www/trendyfashions
git pull origin main  # If using git
# OR upload new files manually
npm ci
npm run build
pm2 restart trendyfashions
ENDSSH
```

Or manually:
```bash
# SSH into server
ssh root@178.128.47.122

# Navigate to app directory
cd /var/www/trendyfashions

# Pull latest changes (if using git)
git pull origin main

# Or upload new files via SCP
# Then:
npm ci
npm run build
pm2 restart trendyfashions
```

## Setting Up Domain & SSL (Optional but Recommended)

### 1. Point Domain to Server

In your domain's DNS settings, add an A record:
```
Type: A
Name: @ (or www)
Value: 178.128.47.122
TTL: 3600
```

### 2. Install Certbot

```bash
apt-get install -y certbot python3-certbot-nginx
```

### 3. Get SSL Certificate

```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts. Certbot will automatically:
- Get SSL certificate
- Update Nginx config
- Set up auto-renewal

### 4. Update Nginx Config

Certbot will modify your Nginx config automatically. Or manually update:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # ... rest of config
}
```

## Monitoring & Maintenance

### PM2 Commands
```bash
pm2 status              # Check app status
pm2 logs trendyfashions  # View logs
pm2 restart trendyfashions  # Restart app
pm2 stop trendyfashions      # Stop app
pm2 delete trendyfashions     # Remove from PM2
```

### System Monitoring
```bash
# Check memory usage
free -h

# Check disk usage
df -h

# Check CPU usage
top

# Check swap
swapon --show
```

### Logs
```bash
# PM2 logs
pm2 logs trendyfashions

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# System logs
journalctl -u nginx -f
```

## Troubleshooting

### App Not Starting
1. Check PM2 logs: `pm2 logs trendyfashions`
2. Check if port 3000 is in use: `netstat -tulpn | grep 3000`
3. Verify build: `cd /var/www/trendyfashions && npm run build`

### Out of Memory
- Check swap: `swapon --show`
- Increase swap if needed
- Consider upgrading droplet to 2GB RAM

### Nginx 502 Bad Gateway
- Check if app is running: `pm2 status`
- Check app logs: `pm2 logs trendyfashions`
- Verify proxy_pass URL in Nginx config

### Images Not Loading
- Check file permissions: `ls -la /var/www/trendyfashions/public/images`
- Verify image paths in code
- Check Nginx static file serving config

## Security Recommendations

1. **Change default SSH port** (optional):
   ```bash
   nano /etc/ssh/sshd_config
   # Change Port 22 to Port 2222
   systemctl restart sshd
   ```

2. **Set up SSH keys** (recommended):
   ```bash
   # On local machine
   ssh-copy-id root@178.128.47.122
   ```

3. **Disable root login** (recommended):
   ```bash
   # Create new user
   adduser deploy
   usermod -aG sudo deploy
   # Then disable root login in /etc/ssh/sshd_config
   ```

4. **Keep system updated**:
   ```bash
   apt-get update && apt-get upgrade -y
   ```

## Performance Optimization

### For 1GB RAM Server

1. **Enable swap** (already done in setup script)
2. **Optimize Node.js**:
   ```bash
   export NODE_OPTIONS="--max-old-space-size=512"
   ```
3. **Use PM2 cluster mode** (if needed):
   ```javascript
   // In ecosystem.config.js
   instances: 1, // Keep at 1 for 1GB RAM
   ```
4. **Monitor memory**:
   ```bash
   pm2 monit
   ```

## Backup Strategy

1. **Backup application files**:
   ```bash
   tar -czf /root/backup-$(date +%Y%m%d).tar.gz /var/www/trendyfashions
   ```

2. **Backup PM2 config**:
   ```bash
   pm2 save
   cp ~/.pm2/dump.pm2 /root/
   ```

3. **Set up automated backups** (cron):
   ```bash
   crontab -e
   # Add: 0 2 * * * tar -czf /root/backup-$(date +\%Y\%m\%d).tar.gz /var/www/trendyfashions
   ```

## Next Steps

1. ✅ Deploy application
2. ⬜ Set up domain name
3. ⬜ Configure SSL certificate
4. ⬜ Set up monitoring (optional)
5. ⬜ Configure backups
6. ⬜ Set up CI/CD (optional)

## Support

If you encounter issues:
1. Check PM2 logs: `pm2 logs trendyfashions`
2. Check Nginx logs: `tail -f /var/log/nginx/error.log`
3. Verify all services: `systemctl status nginx pm2-root`
