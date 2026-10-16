// SWAIS standard pm2 config — deployment is `pm2 start ecosystem.config.js && pm2 save`.
// Absolute paths only. Name = repo name = server folder name.
module.exports = {
  apps: [
    {
      name: "CHANGE-ME-project-role-frontend",
      cwd: "/home/ubuntu/CHANGE-ME-project-role-frontend",
      script: "npm",
      args: "start",
      env: {
        PORT: 3009, // must match the Port Registry
      },
      autorestart: true,
      max_restarts: 10,
    },
  ],
};
