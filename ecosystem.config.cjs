module.exports = {
  apps: [
    {
      name: 'Memoz',
      port: '4572',
      exec_mode: 'fork',
      // instances: 'max',
      script: './server/index.mjs',
    }
  ]
}
