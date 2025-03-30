module.exports = {
  apps: [
    {
      name: 'delamai',
      script: './index.js',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        PORT: 3000,
        NODE_ENV: 'production'
      },
      env_file: '.env'
    }
  ]
};
