#!/usr/bin/expect -f
# Automated Server Update using Expect
# This script will automatically provide the SSH password

set timeout 60
set server "frank@178.128.47.122"
set password "Trendy@254Zone"

spawn ssh -o StrictHostKeyChecking=no $server

expect {
    "password:" {
        send "$password\r"
        exp_continue
    }
    "Permission denied" {
        puts "❌ Authentication failed"
        exit 1
    }
    "$ " {
        puts "✅ Connected"
    }
    "# " {
        puts "✅ Connected"
    }
}

# Run update commands
send "cd ~/trendyfashionzone || cd ~/trendyfashions\r"
expect "$ "
expect "# "

send "pwd\r"
expect "$ "
expect "# "

send "echo '📥 Pulling latest code...'\r"
expect "$ "
expect "# "

send "git pull origin main || git pull origin master\r"
expect "$ "
expect "# "

send "echo '📦 Installing dependencies...'\r"
expect "$ "
expect "# "

send "npm install\r"
expect "$ "
expect "# "

send "echo '⚙️  Updating .env.local...'\r"
expect "$ "
expect "# "

send "if ! grep -q '^DO_SPACES_ENDPOINT=' .env.local 2>/dev/null; then echo '' >> .env.local && echo '# DigitalOcean Spaces Configuration' >> .env.local && echo 'DO_SPACES_ENDPOINT=https://lon1.digitaloceanspaces.com' >> .env.local && echo 'DO_SPACES_KEY=DO00K776LV6P72227KML' >> .env.local && echo 'DO_SPACES_SECRET=3L/uwRaSV4sfoi0onGKP/dxvCfPWFTfuK2d1Cmfad+A' >> .env.local && echo 'DO_SPACES_BUCKET=trendyfashions' >> .env.local && echo 'DO_SPACES_CDN_URL=https://trendyfashions.lon1.cdn.digitaloceanspaces.com' >> .env.local; fi\r"
expect "$ "
expect "# "

send "echo '🔨 Building application...'\r"
expect "$ "
expect "# "

send "npm run build\r"
expect "$ "
expect "# "

send "echo '🔄 Restarting PM2...'\r"
expect "$ "
expect "# "

send "pm2 restart trendyfashionzone || pm2 restart trendyfashions || pm2 start npm --name trendyfashionzone -- start\r"
expect "$ "
expect "# "

send "pm2 save\r"
expect "$ "
expect "# "

send "pm2 status\r"
expect "$ "
expect "# "

send "exit\r"
expect eof

puts "\n✅ Server update completed!"

