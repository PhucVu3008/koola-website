// =============================================================================
// ecosystem.config.cjs — PM2 Process Manager config cho cPanel
//
// Deploy 2 process:
//   1. koola-api  : Fastify API chạy trên port 4001
//   2. koola-web  : Next.js standalone chạy trên port 3001
//
// Usage trên server cPanel (SSH):
//   pm2 start ecosystem.config.cjs
//   pm2 save
//   pm2 startup   (để auto-restart khi server reboot)
// =============================================================================

module.exports = {
  apps: [
    // ─────────────────────────────────────────────────────────────────────────
    // 1. Fastify API Backend
    // Path: ~/koola.vn/api/
    // ─────────────────────────────────────────────────────────────────────────
    {
      name: 'koola-api',
      // Chạy compiled JavaScript (sau khi `tsc` build xong)
      script: 'dist/index.js',
      cwd: '/home/anbinhfo1/koola.vn/api',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',
      env: {
        NODE_ENV: 'production',
        PORT: '4001',
        HOST: '127.0.0.1',
      },
      // Log files
      out_file: '/home/anbinhfo1/logs/koola-api-out.log',
      error_file: '/home/anbinhfo1/logs/koola-api-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 2. Next.js Frontend
    // Path: ~/koola.vn/web/
    // Standalone build: server.js tích hợp sẵn (không cần next start)
    // ─────────────────────────────────────────────────────────────────────────
    {
      name: 'koola-web',
      // Next.js standalone output tạo ra server.js tự chứa
      script: 'server.js',
      cwd: '/home/anbinhfo1/koola.vn/web',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: '3001',
        HOSTNAME: '127.0.0.1',
        // Server-side API URL (Next.js SSR gọi Fastify trực tiếp qua localhost)
        API_BASE_URL_SERVER: 'http://127.0.0.1:4001',
        // Public URL (browser gọi qua domain — được rewrite bởi Next.js)
        NEXT_PUBLIC_API_BASE_URL: 'https://koola.vn/api',
      },
      // Log files
      out_file: '/home/anbinhfo1/logs/koola-web-out.log',
      error_file: '/home/anbinhfo1/logs/koola-web-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
  ],
};
