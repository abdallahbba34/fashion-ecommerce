module.exports = {
  apps: [{
    name: 'fashion-ecommerce',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 3000',
    cwd: '/home/votre_user/fashion-ecommerce', // Modifier selon votre path
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/home/votre_user/logs/fashion-ecommerce-error.log',
    out_file: '/home/votre_user/logs/fashion-ecommerce-out.log',
    time: true
  }]
}
