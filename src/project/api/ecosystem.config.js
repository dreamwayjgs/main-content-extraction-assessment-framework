module.exports = {
  apps: [{
    name: "api_dev",
    script: "src/app.ts",
    watch: true,
    ignore_watch: [
      "node_modules",
      "*.log",
      "static",
      "*.map"
    ]
  },
  {
    name: "api",
    script: "src/app.ts",
    watch: false,
  },
  {
    name: 'mhtml-server',
    script: 'mhtml-serve/index.js',
    watch: false
  }]
};
