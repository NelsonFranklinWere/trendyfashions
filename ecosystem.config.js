// Update the 'cwd' path to match your server user's home directory
// Example: /home/trendyfashion/trendyfashionzone (replace 'trendyfashion' with your username)

module.exports = {
  apps: [
    {
      name: 'trendy-fashion-zone',
      script: 'npm',
      args: 'start',
      cwd: "/var/www/trendyfashions",
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        DATABASE_URL:"postgresql://postgres:TrendyFashions%40254@db.zdeupdkbsueczuoercmm.supabase.co:5432/postgres",
       DO_SPACES_ENDPOINT:"https://sfo3.digitaloceanspaces.com",
       DO_SPACES_KEY:'DO801PHKGXPLL39YE3ZC',
       DO_SPACES_SECRET:'sQmzYONdRjIRfQrHP2u7e0dF0uOEKO/8mr5DUrFK2Ns',
       DO_SPACES_BUCKET:'trendyfashion',
       DO_SPACES_CDN_URL:'https://trendyfashion.sfo3.cdn.digitaloceanspaces.com',

      },
      // Logging
       error_file: '/var/www/trendyfashions/logs/err.log',
      out_file: '/var/www/trendyfashions/logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Auto-restart settings
      max_memory_restart: '1G', // Restart if memory exceeds 1GB
      min_uptime: '10s',
      max_restarts: 10,
      autorestart: true,
      
      // Watch mode (disabled in production)
      watch: false,
      
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
    },
  ],
};
