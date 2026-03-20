module.exports = {
  apps: [
    {
      name: 'paketci-api',
      cwd: '/home/deploy/paketci-app/kurye-sistemi/backend',
      script: 'dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      max_memory_restart: '500M',
      restart_delay: 3000,
      max_restarts: 5,
      min_uptime: '10s',
    },
    {
      name: 'paketci-frontend',
      cwd: '/home/deploy/paketci-app/kurye-sistemi/frontend',
      script: 'node_modules/.bin/next',
      args: 'start',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      max_memory_restart: '300M',
    },
  ],
  deploy: {
    production: {
      user: 'deploy',
      host: ['paketci.app'],
      ref: 'origin/master',
      repo: 'https://github.com/hunkarylmaz/paketci-app.git',
      path: '/home/deploy/paketci-app',
      'post-deploy': [
        'cd kurye-sistemi/backend && npm install && npm run build',
        'cd kurye-sistemi/frontend && npm install && npm run build',
        'pm2 reload ecosystem.config.js',
      ].join(' && '),
    },
  },
};
