#!/bin/bash

# Setup PostgreSQL on DigitalOcean Droplet
# Run this script on your DigitalOcean server

set -e

echo "🚀 Setting up PostgreSQL for Trendy Fashion Zone..."
echo ""

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
  echo "⚠️  Please run this script as a regular user, not root"
  exit 1
fi

# Update system
echo "📦 Updating system packages..."
sudo apt update
sudo apt upgrade -y

# Install PostgreSQL
echo "📦 Installing PostgreSQL..."
sudo apt install postgresql postgresql-contrib -y

# Start PostgreSQL service
echo "🔄 Starting PostgreSQL service..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
echo "📝 Creating database and user..."
read -p "Enter database name (default: trendyfashions): " DB_NAME
DB_NAME=${DB_NAME:-trendyfashions}

read -p "Enter database user (default: trendyfashion_user): " DB_USER
DB_USER=${DB_USER:-trendyfashion_user}

read -sp "Enter database password: " DB_PASSWORD
echo ""

# Create database and user
sudo -u postgres psql <<EOF
CREATE DATABASE $DB_NAME;
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
ALTER USER $DB_USER CREATEDB;
\q
EOF

# Update pg_hba.conf to allow local connections
echo "🔧 Configuring PostgreSQL authentication..."
sudo sed -i 's/local   all             all                                     peer/local   all             all                                     md5/' /etc/postgresql/*/main/pg_hba.conf

# Restart PostgreSQL
echo "🔄 Restarting PostgreSQL..."
sudo systemctl restart postgresql

# Create connection string
CONNECTION_STRING="postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"

echo ""
echo "✅ PostgreSQL setup complete!"
echo ""
echo "📋 Connection Details:"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"
echo "   Connection String: $CONNECTION_STRING"
echo ""
echo "📝 Add this to your .env.local file:"
echo "   DATABASE_URL=$CONNECTION_STRING"
echo ""
echo "🔧 Next steps:"
echo "   1. Add DATABASE_URL to your .env.local file"
echo "   2. Run: npm run migrate:all"
echo "   3. Verify database: psql -U $DB_USER -d $DB_NAME"
echo ""

