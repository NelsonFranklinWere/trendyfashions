#!/bin/bash

# Quick one-liner to get all environment variables from server
# Run this in Droplet Console

cd /var/www/trendyfashions && {
  echo "# Environment Variables from Server - $(date)"
  echo ""
  echo "# From ecosystem.config.js:"
  cat ecosystem.config.js | grep -A 30 'env:' | grep -E '^\s+[A-Z_]+:' | sed 's/^\s*//;s/://;s/,$//' | sed "s/'//g"
  echo ""
  echo "# From .env file:"
  cat .env 2>/dev/null || cat .env.local 2>/dev/null || echo "# No .env file"
  echo ""
  echo "# From PM2:"
  pm2 env 0 2>/dev/null | grep -E '^[A-Z_]+=' || echo "# PM2 env unavailable"
} | tee /tmp/env-vars.txt && echo "" && echo "✅ Saved to /tmp/env-vars.txt - Copy the content above"
