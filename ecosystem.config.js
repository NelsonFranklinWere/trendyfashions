// PM2 Ecosystem Configuration for Trendy Fashion Zone
// Update the 'cwd' path to match your server user's home directory
// Example: /home/trendyfashion/trendyfashionzone (replace 'trendyfashion' with your username)

module.exports = {
  apps: [
    {
      name: 'trendyfashionzone',
      script: 'npm',
      args: 'start',
      cwd: '/home/trendyfashion/trendyfashionzone', // UPDATE THIS PATH to match your server setup
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      // Logging
      error_file: './logs/err.log',
      out_file: './logs/out.log',
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
