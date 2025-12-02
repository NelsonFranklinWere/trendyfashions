// PM2 Ecosystem Configuration for Trendy Fashion Zone
module.exports = {
  apps: [
    {
      name: 'trendyfashions',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/trendyfashions',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      // Logging
      error_file: '/var/log/pm2/trendyfashions-error.log',
      out_file: '/var/log/pm2/trendyfashions-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Auto-restart settings
      max_memory_restart: '800M', // Restart if memory exceeds 800MB (leave room for system)
      min_uptime: '10s',
      max_restarts: 10,
      
      // Watch mode (disabled in production)
      watch: false,
      
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
    },
  ],
};
