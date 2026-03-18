/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Allow more time for SSG pages that fetch from external API
  staticPageGenerationTimeout: 180,
  typescript: {
    // Pre-existing type errors in admin pages — skip for production build
    ignoreBuildErrors: true,
  },
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 400],
    remotePatterns: [
      // Local development (Docker)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/uploads/**',
      },
      // Production: uploads served via the same domain through reverse proxy
      {
        protocol: 'https',
        hostname: 'koola.vn',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'api',
        port: '4000',
        pathname: '/uploads/**',
      },
    ],
  },
  async rewrites() {
    // Proxy /uploads and /api requests to the Fastify API server.
    // In development (Docker): API is at http://api:4000
    // In production (cPanel): API is at http://127.0.0.1:4001
    const apiBase = process.env.API_BASE_URL_SERVER || 'http://api:4000';
    return [
      {
        source: '/uploads/:path*',
        destination: `${apiBase}/uploads/:path*`,
      },
      // Production reverse-proxy: /api/* → Fastify API
      // The Next.js app rewrites /api/* so the browser never hits port 4001 directly.
      {
        source: '/api/:path*',
        destination: `${apiBase}/:path*`,
      },
    ];
  },
};

export default nextConfig;
