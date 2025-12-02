# Quick Deploy to DigitalOcean

## Fastest Method (3 Steps)

### Step 1: Run Deployment Script

```bash
cd "/home/frank/Documents/Vs Code/trendyfashions"
./scripts/deploy-simple.sh
```

When prompted, enter password: `Trendy@254Zone`

### Step 2: Wait for Setup

The script will:
- Upload your files
- Install Node.js, PM2, Nginx
- Build your Next.js app
- Start the application

This takes about 5-10 minutes.

### Step 3: Visit Your Site

Open in browser: **http://178.128.47.122**

---

## What You Need

✅ **Server IP**: 178.128.47.122  
✅ **Password**: Trendy@254Zone  
✅ **Local machine** with SSH access

---

## If Script Fails

### Manual Deployment (Step by Step)

#### 1. Create deployment package locally:
```bash
cd "/home/frank/Documents/Vs Code/trendyfashions"
tar --exclude='.git' --exclude='node_modules' --exclude='.next' -czf deploy.tar.gz .
```

#### 2. Upload to server:
```bash
scp deploy.tar.gz root@178.128.47.122:/tmp/
scp scripts/server-setup.sh root@178.128.47.122:/tmp/
scp ecosystem.config.js root@178.128.47.122:/tmp/
```
Password: `Trendy@254Zone`

#### 3. SSH into server:
```bash
ssh root@178.128.47.122
```
Password: `Trendy@254Zone`

#### 4. Run setup:
```bash
chmod +x /tmp/server-setup.sh
/tmp/server-setup.sh
```

#### 5. Visit: http://178.128.47.122

---

## Verify It's Working

SSH into server and run:
```bash
pm2 status          # Should show "trendyfashions" as online
pm2 logs trendyfashions  # Check for errors
systemctl status nginx   # Should be active
```

---

## Common Issues

**"Connection refused"**
- Wait 2-3 minutes after deployment
- Check: `pm2 status` on server

**"502 Bad Gateway"**
- App might still be building
- Check: `pm2 logs trendyfashions`

**"Out of memory"**
- Server has 1GB RAM, build might be slow
- Wait longer, or check swap: `swapon --show`

---

## Next Steps After Deployment

1. ✅ **Test the site**: http://178.128.47.122
2. ⬜ **Set up domain** (optional)
3. ⬜ **Add SSL certificate** (optional)
4. ⬜ **Set up monitoring** (optional)

See `DEPLOYMENT_DIGITALOCEAN.md` for detailed instructions.
