// SWAIS standard pm2 config — deployment is `pm2 start ecosystem.config.js && pm2 save`.
//
// The three lines that prevented/ended the July 2026 outage:
//   script      : absolute path to the VENV's uvicorn (system uvicorn does not exist)
//   interpreter : "none" (otherwise pm2 runs the Python script with Node.js and crash-loops)
//   cwd         : the repo root (so the `app` module resolves)
module.exports = {
  apps: [
    {
      name: "CHANGE-ME-project-role-backend",
      cwd: "/home/ubuntu/CHANGE-ME-project-role-backend",
      script: "/home/ubuntu/CHANGE-ME-project-role-backend/.venv/bin/uvicorn",
      args: "app.main:app --host 0.0.0.0 --port 8001",
      interpreter: "none",
      autorestart: true,
      max_restarts: 10,
    },
  ],
};
