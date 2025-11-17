module.exports = {
  apps: [
    {
      name: "kuajie-backend",
      script: "dist/index.js",
      env: { NODE_ENV: "production", PORT: 5000 }
    }
  ]
}