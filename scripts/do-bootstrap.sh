#!/bin/bash
# Full DigitalOcean bootstrap for Trendy Fashion Zone (run as root on the droplet).
# After SSH keys are in place, the assistant can also run this remotely.
set -euo pipefail

APP_USER="${APP_USER:-trendy}"
APP_DIR="/var/www/trendyfashionzone"
REPO_URL="${REPO_URL:-https://github.com/NelsonFranklinWere/trendyfashions.git}"
NODE_MAJOR=20

export DEBIAN_FRONTEND=noninteractive

echo "==> Updating system packages"
apt-get update -y
apt-get install -y curl git build-essential nginx ufw

if ! command -v node >/dev/null 2>&1 || ! node -v | grep -q "v${NODE_MAJOR}"; then
  echo "==> Installing Node.js ${NODE_MAJOR}"
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
  apt-get install -y nodejs
fi

if ! command -v pm2 >/dev/null 2>&1; then
  echo "==> Installing PM2"
  npm install -g pm2
fi

if ! id "$APP_USER" >/dev/null 2>&1; then
  echo "==> Creating user ${APP_USER}"
  adduser --disabled-password --gecos "" "$APP_USER"
fi

mkdir -p "$APP_DIR"
chown -R "${APP_USER}:${APP_USER}" "$APP_DIR"

if [ ! -d "${APP_DIR}/.git" ]; then
  echo "==> Cloning repository"
  sudo -u "$APP_USER" git clone "$REPO_URL" "$APP_DIR"
else
  echo "==> Pulling latest"
  cd "$APP_DIR"
  sudo -u "$APP_USER" git fetch --all
  sudo -u "$APP_USER" git reset --hard origin/main
fi

echo "==> IMPORTANT: copy .env.local into ${APP_DIR}/.env.local before build"
echo "    Then run: cd ${APP_DIR} && npm ci && npm run build && pm2 start npm --name trendyfashionzone -- start"

ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable || true

echo "✅ Bootstrap complete. Node: $(node -v)  npm: $(npm -v)"
