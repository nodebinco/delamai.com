module.exports = {
  apps: [
    {
      name: "app",
      script: "node --env-file=.env index.js",
      instances: 2,
      exec_mode: "cluster",
      env: {
        PORT: 3000,
        NODE_ENV: "production",
      },
    },
  ],
};
