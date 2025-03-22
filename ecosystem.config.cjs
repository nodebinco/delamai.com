module.exports = {
  apps: [
    {
      name: "app",
      script: "./index.js",
      instances: 2,
      exec_mode: "cluster",
      env: {
        PORT: 3000,
        NODE_ENV: "production",
      },
      node_args: "--env-file=.env"
    },
  ],
};
