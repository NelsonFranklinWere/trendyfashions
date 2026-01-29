#!/bin/bash
# Setup PostgreSQL database for local development

echo "Setting up PostgreSQL database..."

# Create user and database
sudo -u postgres psql << 'PGSQL'
-- Create user if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'trendy') THEN
        CREATE USER trendy WITH PASSWORD 'Trendy@254Fashions';
    END IF;
END
$$;

-- Create database if not exists
SELECT 'CREATE DATABASE trendyfashions OWNER trendy' 
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'trendyfashions')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE trendyfashions TO trendy;
PGSQL

echo "Database setup complete."

# Run the schema
echo "Creating database schema..."
PGPASSWORD=Trendy@254Fashions psql -h localhost -U trendy -d trendyfashions -f database/postgres-schema.sql

echo "Database setup finished!"
