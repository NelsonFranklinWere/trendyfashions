# Deployment Guide - New DigitalOcean Server

## Server Information
- **IP Address**: 64.225.112.70
- **Region**: SFO2
- **OS**: Ubuntu 24.04 (LTS) x64
- **User**: trendy
- **Password**: Trendy@254Fashions
- **Database User**: trendy
- **Database Password**: Trendy@254Fashions
- **Database Name**: trendyfashions

## Quick Deployment

### Option 1: Automated Script (Recommended)
```bash
# From your local machine
./scripts/deploy-new-server.sh
```

### Option 2: Manual Steps

#### 1. SSH into Server
```bash
ssh trendy@64.225.112.70
# Password: Trendy@254Fashions
```

#### 2. Install Node.js 18.x
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
```

#### 3. Install PostgreSQL
```bash
sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib
```

#### 4. Setup Database
```bash
sudo -u postgres psql
```
Then run:
```sql
CREATE DATABASE trendyfashions;
CREATE USER trendy WITH PASSWORD 'Trendy@254Fashions';
GRANT ALL PRIVILEGES ON DATABASE trendyfashions TO trendy;
ALTER DATABASE trendyfashions OWNER TO trendy;
\q
```

#### 5. Clone Repository
```bash
cd ~
git clone https://github.com/yourusername/trendyfashions.git
cd trendyfashions
```

#### 6. Install Dependencies
```bash
npm install
```

#### 7. Create .env.local
```bash
nano .env.local
```
Add:
```env
DATABASE_URL=postgresql://trendy:Trendy@254Fashions@localhost:5432/trendyfashions
DO_SPACES_ENDPOINT=https://lon1.digitaloceanspaces.com
DO_SPACES_KEY=YOUR_NEW_KEY_HERE
DO_SPACES_SECRET=YOUR_NEW_SECRET_HERE
DO_SPACES_BUCKET=trendyfashions
DO_SPACES_CDN_URL=https://trendyfashions.lon1.cdn.digitaloceanspaces.com
NODE_ENV=production
PORT=3000
```

#### 8. Build Application
```bash
npm run build
```

#### 9. Install PM2
```bash
sudo npm install -g pm2
```

#### 10. Start with PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
# Run the command that PM2 outputs
```

#### 11. Setup Firewall
```bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
```

#### 12. Install & Configure NGINX
```bash
sudo apt-get install -y nginx
sudo nano /etc/nginx/sites-available/default
```

Replace location block with:
```nginx
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
}
```

Test and restart:
```bash
sudo nginx -t
sudo systemctl restart nginx
```

#### 13. Add Domain in DigitalOcean
1. Go to DigitalOcean Networking
2. Add your domain
3. Add A record for `@` → `64.225.112.70`
4. Add A record for `www` → `64.225.112.70`

#### 14. Update NGINX with Domain
```bash
sudo nano /etc/nginx/sites-available/default
```
Change:
```nginx
server_name yourdomain.com www.yourdomain.com;
```

#### 15. Install SSL Certificate
```bash
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

#### 16. Test SSL Renewal
```bash
sudo certbot renew --dry-run
```

## Useful Commands

### PM2
```bash
pm2 status              # Check app status
pm2 logs trendyfashions  # View logs
pm2 restart trendyfashions
pm2 stop trendyfashions
pm2 delete trendyfashions
```

### NGINX
```bash
sudo nginx -t           # Test config
sudo systemctl restart nginx
sudo systemctl status nginx
```

### Database
```bash
sudo -u postgres psql trendyfashions
# Or as trendy user:
psql -U trendy -d trendyfashions
```

### Application
```bash
cd ~/trendyfashions
npm run build          # Rebuild
git pull               # Update code
npm install            # Update dependencies
```

## Troubleshooting

### App not accessible
1. Check PM2: `pm2 status`
2. Check logs: `pm2 logs trendyfashions`
3. Check NGINX: `sudo systemctl status nginx`
4. Check firewall: `sudo ufw status`
5. Check port: `sudo netstat -tlnp | grep 3000`

### Database connection issues
1. Check PostgreSQL: `sudo systemctl status postgresql`
2. Test connection: `psql -U trendy -d trendyfashions`
3. Check .env.local: `cat .env.local`

### SSL issues
1. Check certificate: `sudo certbot certificates`
2. Test renewal: `sudo certbot renew --dry-run`
3. Check NGINX config: `sudo nginx -t`

## Next Steps After Deployment

1. ✅ Update DigitalOcean Spaces credentials in `.env.local`
2. ✅ Run database migrations if needed
3. ✅ Test image uploads
4. ✅ Configure domain DNS
5. ✅ Setup SSL certificate
6. ✅ Test all functionality

