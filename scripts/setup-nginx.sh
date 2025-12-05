#!/bin/bash

# NGINX Configuration Script
# Run this on the server after initial setup

set -e

DOMAIN="trendyfashionzone.co.ke"
APP_PORT=3000

echo "🔧 Configuring NGINX for ${DOMAIN}"
echo ""

# Remove default site
sudo rm -f /etc/nginx/sites-enabled/default

# Create NGINX config
sudo tee /etc/nginx/sites-available/trendyfashionzone > /dev/null <<EOF
server {
    listen 80;
    listen [::]:80;
    
    server_name ${DOMAIN} www.${DOMAIN};

    # Increase body size for image uploads
    client_max_body_size 20M;

    location / {
        proxy_pass http://localhost:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeouts for long requests
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Serve static files directly from NGINX
    location /_next/static {
        proxy_pass http://localhost:${APP_PORT};
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/trendyfashionzone /etc/nginx/sites-enabled/

# Test configuration
echo "🧪 Testing NGINX configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ NGINX configuration is valid"
    sudo systemctl restart nginx
    echo "✅ NGINX restarted"
else
    echo "❌ NGINX configuration has errors"
    exit 1
fi

echo ""
echo "✅ NGINX configured successfully!"
echo "Your app should now be accessible at: http://${DOMAIN}"

