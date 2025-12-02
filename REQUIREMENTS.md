# Requirements for DigitalOcean Deployment

## What You Need Before Deploying

### ✅ 1. Server Access
- **IP Address**: 178.128.47.122 ✅ (You have this)
- **Username**: root ✅ (Default)
- **Password**: Trendy@254Zone ✅ (You have this)
- **SSH Access**: Working on your local machine

### ✅ 2. Local Machine Requirements

#### Required Software:
```bash
# Check if you have these installed:
ssh --version          # SSH client (usually pre-installed)
git --version          # Git (for GitHub repo)
node --version         # Node.js (for local development, not required for deployment)
```

#### Install if Missing:
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install openssh-client git

# macOS (usually pre-installed)
# If needed: brew install git
```

### ✅ 3. GitHub Repository
- **Repository URL**: https://github.com/NelsonFranklinWere/trendyfashions.git ✅
- **Access**: Public or you have SSH keys set up

### ⚠️ 4. Environment Variables (.env file)

**Required for full functionality:**

#### Email Service (Resend)
- `RESEND_API_KEY` - Get from https://resend.com/api-keys
- `RESEND_FROM` - Your sender email (e.g., `StriveGo <onboarding@resend.dev>`)

#### M-Pesa Payment Gateway
- `MPESA_CONSUMER_KEY` - From Safaricom Developer Portal
- `MPESA_CONSUMER_SECRET` - From Safaricom Developer Portal
- `MPESA_SHORTCODE` - Your business shortcode (default: `4133452`)
- `MPESA_PASSKEY` - From Safaricom Developer Portal
- `MPESA_CALLBACK_URL` - `https://178.128.47.122/api/mpesa/callback`

#### Optional
- `NODE_ENV=production`
- `PORT=3000`

**Create .env file:**
```bash
cp .env.example .env
nano .env  # Edit with your actual values
```

### ✅ 5. Deployment Scripts (Already Created)
- ✅ `scripts/deploy-complete.sh` - Full automated deployment
- ✅ `scripts/deploy-from-github.sh` - GitHub deployment
- ✅ `scripts/github-server-setup.sh` - Server setup
- ✅ `scripts/upload-env.sh` - Upload .env file
- ✅ `ecosystem.config.js` - PM2 configuration

---

## Quick Checklist

Before running deployment:

- [ ] SSH access working: `ssh root@178.128.47.122` (test connection)
- [ ] GitHub repo accessible: https://github.com/NelsonFranklinWere/trendyfashions.git
- [ ] .env file created with your API keys (optional but recommended)
- [ ] Deployment scripts are executable
- [ ] You're in the project directory

---

## Test SSH Connection First

```bash
# Test if you can connect
ssh root@178.128.47.122
# Enter password: Trendy@254Zone
# Type 'exit' to disconnect
```

If SSH works, you're ready to deploy!

---

## Minimum Requirements (App will run without .env, but features won't work)

**Absolute Minimum:**
- ✅ Server IP and password
- ✅ SSH access
- ✅ GitHub repository

**For Full Functionality:**
- ✅ All of the above
- ⚠️ .env file with API keys (for email and payments)

---

## What Happens During Deployment

1. **Server Setup** (5-10 minutes):
   - Updates system packages
   - Installs Node.js 20
   - Installs PM2 (process manager)
   - Installs Nginx (web server)
   - Installs Git
   - Creates 2GB swap file (for 1GB RAM server)

2. **Application Deployment**:
   - Clones from GitHub
   - Installs npm dependencies
   - Builds Next.js application
   - Starts with PM2

3. **Configuration**:
   - Sets up Nginx reverse proxy
   - Configures firewall
   - Uploads .env file (if provided)

---

## Ready to Deploy?

If you have:
- ✅ Server access (IP + password)
- ✅ SSH working
- ✅ GitHub repo

**Run this command:**
```bash
cd "/home/frank/Documents/Vs Code/trendyfashions"
./scripts/deploy-complete.sh
```

Enter password when prompted: `Trendy@254Zone`

---

## Troubleshooting Pre-Deployment

### Can't SSH?
```bash
# Test connection
ping 178.128.47.122

# Check if port 22 is open
telnet 178.128.47.122 22
```

### Don't have .env file?
- App will deploy and run
- Email features won't work
- Payment features won't work
- You can add .env later with: `./scripts/upload-env.sh`

### GitHub repo private?
- Make sure you have access
- Or use SSH keys on server for private repos

---

## After Deployment

Your site will be available at:
- **HTTP**: http://178.128.47.122
- **Check status**: SSH in and run `pm2 status`
- **View logs**: `pm2 logs trendyfashions`
