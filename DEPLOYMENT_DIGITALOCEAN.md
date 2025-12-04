# DigitalOcean Deployment Guide - Trendy Fashion Zone

Complete step-by-step guide to deploy Trendy Fashion Zone to DigitalOcean using PM2, NGINX, and Let's Encrypt SSL.

## Prerequisites
- DigitalOcean account
- Domain: `trendyfashionzone.co.ke` (already configured)
- GitHub repository with your code
- SSH access to your droplet

---

## Step 1: Create Droplet and Initial Setup

### 1.1 Create Droplet
1. Go to DigitalOcean Dashboard
2. Click **"Create"** → **"Droplets"**
3. Choose:
   - **Image**: Ubuntu 22.04 LTS
   - **Plan**: Basic (at least 2GB RAM recommended for Next.js)
   - **Region**: Choose closest to your users
   - **Authentication**: SSH keys (recommended) or root password
4. Click **"Create Droplet"**

### 1.2 SSH into Droplet
```bash
ssh root@YOUR_DROPLET_IP
```

---

## Step 2: Create Non-Root User Account

### 2.1 Create User
```bash
# Create user named 'trendyfashion' (or your preferred name)
adduser trendyfashion

# Add user to sudo group
usermod -aG sudo trendyfashion

# Switch to new user
su - trendyfashion
```

### 2.2 Setup SSH for New User (Optional but Recommended)
```bash
# On your local machine, copy your SSH key
ssh-copy-id trendyfashion@YOUR_DROPLET_IP

# Test login
ssh trendyfashion@YOUR_DROPLET_IP
```

---

## Step 3: Install Node.js and NPM

```bash
# Update system packages
sudo apt update
sudo apt upgrade -y

# Install Node.js 20.x (LTS - recommended for Next.js)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version

# Should show:
# v20.x.x
# 10.x.x
```

---

## Step 4: Install Git and Clone Repository

```bash
# Install Git
sudo apt install git -y

# Clone your repository
cd ~
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git trendyfashionzone

# Navigate to project
cd trendyfashionzone

# Verify files
ls -la
```

**Note**: Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub details.

---

## Step 5: Install Dependencies and Build

```bash
# Install project dependencies
npm install

# Build the Next.js application for production
npm run build

# Test the production build locally (optional)
npm start

# Press Ctrl+C to stop after testing
```

**Expected output**: Should see "Ready on http://localhost:3000" (or your configured port)

---

## Step 6: Setup Environment Variables

```bash
# Create .env.local file
nano .env.local
```

**Add your environment variables:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://zdeupdkbsueczuoercmm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key_here

# Optional: Set port (default is 3000)
PORT=3000
NODE_ENV=production
```

**Save and exit**: `Ctrl+X`, then `Y`, then `Enter`

---

## Step 7: Install and Configure PM2

### 7.1 Install PM2 Globally
```bash
sudo npm install -g pm2
```

### 7.2 Create PM2 Ecosystem File
```bash
# The ecosystem.config.js file should already exist in your project
# Verify it exists
cat ecosystem.config.js
```

**If it doesn't exist or needs updating, create it:**
```bash
nano ecosystem.config.js
```

**Add this configuration:**
```javascript
module.exports = {
  apps: [{
    name: 'trendyfashionzone',
    script: 'npm',
    args: 'start',
    cwd: '/home/trendyfashion/trendyfashionzone',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
}
```

### 7.3 Start Application with PM2
```bash
# Start the app
pm2 start ecosystem.config.js

# Or if ecosystem file doesn't work:
pm2 start npm --name "trendyfashionzone" -- start

# Check status
pm2 status

# View logs
pm2 logs trendyfashionzone

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system reboot
pm2 startup

# Copy and run the command that PM2 outputs (it will look like):
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u trendyfashion --hp /home/trendyfashion
```

### 7.4 Verify App is Running
```bash
# Check if app is accessible on port 3000
curl http://localhost:3000

# Should return HTML content
```

---

## Step 8: Configure UFW Firewall

```bash
# Enable firewall
sudo ufw enable

# Check status
sudo ufw status

# Allow SSH (important - do this first!)
sudo ufw allow ssh
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow http
sudo ufw allow https
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Optionally, allow your app port directly (not needed if using NGINX)
# sudo ufw allow 3000/tcp

# Check status again
sudo ufw status verbose
```

**Expected output**: Should show SSH, HTTP (80), and HTTPS (443) as allowed.

---

## Step 9: Install and Configure NGINX

### 9.1 Install NGINX
```bash
sudo apt install nginx -y

# Check NGINX status
sudo systemctl status nginx

# Start and enable NGINX
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 9.2 Create NGINX Configuration
```bash
# Remove default configuration
sudo rm /etc/nginx/sites-enabled/default

# Create new configuration file
sudo nano /etc/nginx/sites-available/trendyfashionzone
```

**Add this configuration:**
```nginx
server {
    listen 80;
    listen [::]:80;
    
    server_name trendyfashionzone.co.ke www.trendyfashionzone.co.ke;

    # Increase body size for image uploads
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
        
        # Timeouts for long requests
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Optional: Serve static files directly from NGINX
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }
}
```

**Save and exit**: `Ctrl+X`, then `Y`, then `Enter`

### 9.3 Enable Site and Test Configuration
```bash
# Create symbolic link to enable site
sudo ln -s /etc/nginx/sites-available/trendyfashionzone /etc/nginx/sites-enabled/

# Test NGINX configuration
sudo nginx -t

# If test passes, restart NGINX
sudo systemctl restart nginx

# Check NGINX status
sudo systemctl status nginx
```

### 9.4 Verify Setup
```bash
# Test from server
curl http://localhost

# Should return your Next.js app HTML
```

**You should now be able to access your app via:**
- `http://YOUR_DROPLET_IP`
- `http://trendyfashionzone.co.ke` (if DNS is configured)

---

## Step 10: Configure Domain DNS (If Not Already Done)

### 10.1 In DigitalOcean Dashboard
1. Go to **Networking** → **Domains**
2. Add domain: `trendyfashionzone.co.ke`
3. Add **A Records**:
   - **Hostname**: `@` → Points to: `YOUR_DROPLET_IP`
   - **Hostname**: `www` → Points to: `YOUR_DROPLET_IP`
4. Save changes

### 10.2 At Your Domain Registrar
1. Log into your domain registrar (where you bought trendyfashionzone.co.ke)
2. Go to DNS settings
3. Set **Nameservers** to:
   ```
   ns1.digitalocean.com
   ns2.digitalocean.com
   ns3.digitalocean.com
   ```
4. Wait for DNS propagation (can take 5 minutes to 48 hours)

### 10.3 Verify DNS
```bash
# Check if DNS is resolving
dig trendyfashionzone.co.ke
nslookup trendyfashionzone.co.ke

# Should show your droplet IP
```

---

## Step 11: Install SSL Certificate with Let's Encrypt

### 11.1 Install Certbot
```bash
# Update package list
sudo apt update

# Install Certbot and NGINX plugin
sudo apt install certbot python3-certbot-nginx -y
```

### 11.2 Obtain SSL Certificate
```bash
# Get certificate for both domain and www subdomain
sudo certbot --nginx -d trendyfashionzone.co.ke -d www.trendyfashionzone.co.ke

# Follow the prompts:
# - Enter email address (for renewal notices)
# - Agree to terms (A)
# - Choose whether to redirect HTTP to HTTPS (recommended: 2 for redirect)
```

### 11.3 Verify SSL Installation
```bash
# Test certificate renewal (dry run)
sudo certbot renew --dry-run

# Check certificate status
sudo certbot certificates
```

### 11.4 Auto-Renewal Setup
Certbot automatically sets up a renewal timer, but verify it:
```bash
# Check renewal timer
sudo systemctl status certbot.timer

# Test renewal manually
sudo certbot renew --dry-run
```

---

## Step 12: Final Verification and Testing

### 12.1 Check All Services
```bash
# Check PM2
pm2 status
pm2 logs trendyfashionzone --lines 50

# Check NGINX
sudo systemctl status nginx

# Check firewall
sudo ufw status
```

### 12.2 Test Website
1. Visit: `https://trendyfashionzone.co.ke`
2. Visit: `https://www.trendyfashionzone.co.ke`
3. Check:
   - ✅ Site loads correctly
   - ✅ SSL certificate is valid (green lock icon)
   - ✅ Images load from Supabase
   - ✅ Admin panel works: `https://trendyfashionzone.co.ke/admin/login`
   - ✅ Image uploads work

### 12.3 Monitor Logs
```bash
# PM2 logs
pm2 logs trendyfashionzone

# NGINX error logs
sudo tail -f /var/log/nginx/error.log

# NGINX access logs
sudo tail -f /var/log/nginx/access.log
```

---

## Step 13: Useful Commands Reference

### PM2 Commands
```bash
pm2 status                    # Check app status
pm2 restart trendyfashionzone # Restart app
pm2 stop trendyfashionzone    # Stop app
pm2 start trendyfashionzone   # Start app
pm2 logs trendyfashionzone   # View logs
pm2 logs trendyfashionzone --lines 100  # Last 100 lines
pm2 monit                     # Monitor dashboard
pm2 save                      # Save current process list
```

### NGINX Commands
```bash
sudo systemctl restart nginx  # Restart NGINX
sudo systemctl reload nginx   # Reload config (no downtime)
sudo nginx -t                 # Test configuration
sudo tail -f /var/log/nginx/error.log  # View errors
```

### Deployment Workflow
```bash
# 1. SSH into server
ssh trendyfashion@YOUR_DROPLET_IP

# 2. Navigate to project
cd ~/trendyfashionzone

# 3. Pull latest changes
git pull origin main

# 4. Install new dependencies (if any)
npm install

# 5. Rebuild application
npm run build

# 6. Restart PM2
pm2 restart trendyfashionzone

# 7. Check logs
pm2 logs trendyfashionzone --lines 50
```

---

## Troubleshooting

### App Not Loading
```bash
# Check if app is running
pm2 status

# Check if port 3000 is in use
sudo lsof -i :3000

# Check NGINX configuration
sudo nginx -t

# Check NGINX error logs
sudo tail -50 /var/log/nginx/error.log
```

### SSL Certificate Issues
```bash
# Renew certificate manually
sudo certbot renew

# Check certificate expiry
sudo certbot certificates
```

### Permission Issues
```bash
# Fix file permissions
sudo chown -R trendyfashion:trendyfashion ~/trendyfashionzone

# Fix PM2 permissions
sudo chown -R trendyfashion:trendyfashion ~/.pm2
```

### Out of Memory
```bash
# Check memory usage
free -h

# Restart app to free memory
pm2 restart trendyfashionzone

# Or increase droplet size in DigitalOcean dashboard
```

---

## Security Checklist

- [x] Created non-root user
- [x] Configured UFW firewall
- [x] Installed SSL certificate
- [x] NGINX configured with security headers
- [ ] Set up automatic backups (recommended)
- [ ] Configured fail2ban (optional but recommended)
- [ ] Set up monitoring/alerts (optional)

---

## Next Steps (Optional Enhancements)

1. **Set up automatic backups** of your database and files
2. **Configure monitoring** (e.g., UptimeRobot, Pingdom)
3. **Set up CI/CD** for automatic deployments from GitHub
4. **Configure CDN** for faster image delivery
5. **Set up database backups** for Supabase data

---

## Support

If you encounter issues:
1. Check PM2 logs: `pm2 logs trendyfashionzone`
2. Check NGINX logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify environment variables are set correctly
4. Ensure all services are running: `pm2 status` and `sudo systemctl status nginx`

---

**Your app should now be live at: https://trendyfashionzone.co.ke** 🚀
