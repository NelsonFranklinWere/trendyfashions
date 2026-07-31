#!/bin/bash
# Run this ONCE on your DigitalOcean droplet as root (or with sudo).
# It installs SSH keys so the deploy machine can access the server securely.
# Usage (on the droplet):
#   curl -fsSL https://raw.githubusercontent.com/...   OR paste this whole script
#   bash grant-ssh-access.sh

set -euo pipefail

DEPLOY_USER="${DEPLOY_USER:-root}"
AUTH_FILE="/root/.ssh/authorized_keys"

if [ "$DEPLOY_USER" != "root" ]; then
  AUTH_FILE="/home/${DEPLOY_USER}/.ssh/authorized_keys"
  mkdir -p "/home/${DEPLOY_USER}/.ssh"
  chown -R "${DEPLOY_USER}:${DEPLOY_USER}" "/home/${DEPLOY_USER}/.ssh"
  chmod 700 "/home/${DEPLOY_USER}/.ssh"
else
  mkdir -p /root/.ssh
  chmod 700 /root/.ssh
fi

touch "$AUTH_FILE"
chmod 600 "$AUTH_FILE"

# Public keys from the developer machine (no private keys are shared)
KEYS=(
  "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIIK2zF5vGxPimVK/JJoTGFSlHwm0Qvb0VlPy4kA87r1h airm1@Nelson-Frank.local"
  "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEegAyqEFMvAtjPpz/5Lt4BDqf7t/N8WLyB1UaaEgqXs digitalocean-trendyfashion"
)

echo "==> Adding SSH deploy keys to ${AUTH_FILE}"
for KEY in "${KEYS[@]}"; do
  if grep -qxF "$KEY" "$AUTH_FILE" 2>/dev/null; then
    echo "  already present: ${KEY:0:40}..."
  else
    echo "$KEY" >> "$AUTH_FILE"
    echo "  added: ${KEY:0:40}..."
  fi
done

if [ "$DEPLOY_USER" != "root" ]; then
  chown "${DEPLOY_USER}:${DEPLOY_USER}" "$AUTH_FILE"
fi

# Open SSH if ufw is active
if command -v ufw >/dev/null 2>&1; then
  ufw allow OpenSSH >/dev/null 2>&1 || true
fi

echo ""
echo "✅ SSH access granted."
echo "Reply in Cursor with your droplet IP (and username if not root), e.g.:"
echo "   IP: 167.x.x.x"
echo "   USER: root"
echo ""
echo "Then the assistant can SSH in and deploy Trendy Fashion Zone."
