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
        // Supabase: set DATABASE_URL in server environment (see docs/DATABASE-SUPABASE.md). Do not commit real password here.
        DATABASE_URL: process.env.DATABASE_URL || "",
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
