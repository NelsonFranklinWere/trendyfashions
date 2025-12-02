# Deploy from GitHub to DigitalOcean

## Quick Start

### Option 1: Complete Automated Deployment (Recommended)

```bash
cd "/home/frank/Documents/Vs Code/trendyfashions"
./scripts/deploy-complete.sh
```

This will:
1. ✅ Set up the server (Node.js, PM2, Nginx)
2. ✅ Clone from GitHub
3. ✅ Build and start the app
4. ✅ Upload .env file (if it exists)

**Password when prompted**: `Trendy@254Zone`

---

### Option 2: Step-by-Step Deployment

#### Step 1: Deploy from GitHub

```bash
./scripts/deploy-from-github.sh
```

When prompted, enter your GitHub repo URL (or it will use the default):
```
https://github.com/NelsonFranklinWere/trendyfashions.git
```

#### Step 2: Create and Upload .env File

1. **Create .env file** (copy from .env.example):
   ```bash
   cp .env.example .env
   nano .env
   ```

2. **Fill in your environment variables**:
   ```env
   # Resend Email Service
   RESEND_API_KEY=your_actual_resend_api_key
   RESEND_FROM=StriveGo <onboarding@resend.dev>
   
   # M-Pesa Payment Gateway
   MPESA_CONSUMER_KEY=your_mpesa_consumer_key
   MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
   MPESA_SHORTCODE=4133452
   MPESA_PASSKEY=your_mpesa_passkey
   MPESA_CALLBACK_URL=https://178.128.47.122/api/mpesa/callback
   
   # Node Environment
   NODE_ENV=production
   PORT=3000
   ```

3. **Upload .env file**:
   ```bash
   ./scripts/upload-env.sh
   ```

---

## Manual Deployment (SSH)

### 1. SSH into Server

```bash
ssh root@178.128.47.122
# Password: Trendy@254Zone
```

### 2. Initial Server Setup (One-time)

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

# Install Git
apt-get install -y git

# Create swap file (important for 1GB RAM)
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

### 3. Clone and Deploy

```bash
# Create app directory
mkdir -p /var/www/trendyfashions
cd /var/www/trendyfashions

# Clone repository
git clone https://github.com/NelsonFranklinWere/trendyfashions.git .

# Install dependencies
npm ci

# Build application
npm run build

# Start with PM2
pm2 start npm --name "trendyfashions" -- start
pm2 save
pm2 startup systemd -u root --hp /root
```

### 4. Configure Nginx

```bash
nano /etc/nginx/sites-available/trendyfashions
```

Paste this configuration:
```nginx
server {
    listen 80;
    server_name 178.128.47.122;

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

### 5. Upload .env File

From your local machine:
```bash
scp .env root@178.128.47.122:/var/www/trendyfashions/.env
```

On server:
```bash
cd /var/www/trendyfashions
chmod 600 .env
pm2 restart trendyfashions
```

### 6. Configure Firewall

```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
```

---

## Updating the Application

### Automatic Update (from local machine)

```bash
ssh root@178.128.47.122 << 'ENDSSH'
cd /var/www/trendyfashions
git pull origin main
npm ci
npm run build
pm2 restart trendyfashions
ENDSSH
```

### Manual Update (SSH into server)

```bash
ssh root@178.128.47.122
cd /var/www/trendyfashions
git pull origin main
npm ci
npm run build
pm2 restart trendyfashions
```

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `RESEND_API_KEY` | Resend email service API key | `re_xxxxxxxxxxxxx` |
| `RESEND_FROM` | Email sender address | `StriveGo <onboarding@resend.dev>` |
| `MPESA_CONSUMER_KEY` | M-Pesa consumer key | `xxxxxxxxxxxxx` |
| `MPESA_CONSUMER_SECRET` | M-Pesa consumer secret | `xxxxxxxxxxxxx` |
| `MPESA_SHORTCODE` | M-Pesa business shortcode | `4133452` |
| `MPESA_PASSKEY` | M-Pesa passkey | `xxxxxxxxxxxxx` |
| `MPESA_CALLBACK_URL` | M-Pesa callback URL | `https://178.128.47.122/api/mpesa/callback` |

### Creating .env File

1. Copy the example:
   ```bash
   cp .env.example .env
   ```

2. Edit with your values:
   ```bash
   nano .env
   ```

3. Upload to server:
   ```bash
   ./scripts/upload-env.sh
   ```

---

## Verification

### Check Application Status

```bash
ssh root@178.128.47.122

# Check PM2
pm2 status
pm2 logs trendyfashions

# Check Nginx
systemctl status nginx

# Check if app is running
curl http://localhost:3000
```

### Visit Your Site

Open in browser: **http://178.128.47.122**

---

## Troubleshooting

### App Not Starting

```bash
# Check PM2 logs
pm2 logs trendyfashions

# Check if port is in use
netstat -tulpn | grep 3000

# Restart app
pm2 restart trendyfashions
```

### Environment Variables Not Loading

```bash
# Verify .env file exists
ls -la /var/www/trendyfashions/.env

# Check file permissions
chmod 600 /var/www/trendyfashions/.env

# Restart app
pm2 restart trendyfashions
```

### Out of Memory

```bash
# Check swap
swapon --show

# Check memory
free -h

# Restart if needed
pm2 restart trendyfashions
```

### Nginx 502 Bad Gateway

```bash
# Check if app is running
pm2 status

# Check app logs
pm2 logs trendyfashions

# Restart services
pm2 restart trendyfashions
systemctl restart nginx
```

---

## Useful Commands

### PM2 Commands
```bash
pm2 status                    # Check status
pm2 logs trendyfashions      # View logs
pm2 restart trendyfashions    # Restart app
pm2 stop trendyfashions       # Stop app
pm2 delete trendyfashions     # Remove from PM2
pm2 monit                     # Monitor resources
```

### Git Commands (on server)
```bash
cd /var/www/trendyfashions
git status                    # Check status
git pull origin main          # Pull latest changes
git log --oneline -5          # View recent commits
```

### System Commands
```bash
# Check disk space
df -h

# Check memory
free -h

# Check system logs
journalctl -u nginx -f
```

---

## Next Steps

1. ✅ Deploy application
2. ✅ Upload .env file
3. ⬜ Test the site: http://178.128.47.122
4. ⬜ Set up domain name (optional)
5. ⬜ Configure SSL certificate (optional)
6. ⬜ Set up automated deployments (optional)

---

## Support

If you encounter issues:
1. Check PM2 logs: `pm2 logs trendyfashions`
2. Check Nginx logs: `tail -f /var/log/nginx/error.log`
3. Verify environment variables are set correctly
4. Check server resources: `free -h` and `df -h`
