#!/bin/bash
# Quick Deploy - Copy this entire file and run on server
# SSH: ssh trendy@64.225.112.70
# Password: Trendy@254Fashions

cd ~
git clone https://github.com/NelsonFranklinWere/trendyfashions.git 2>/dev/null || (cd trendyfashions && git pull)
cd trendyfashions
chmod +x scripts/deploy-on-server.sh
bash scripts/deploy-on-server.sh



