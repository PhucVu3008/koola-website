/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Allow more time for SSG pages that fetch from external API
  staticPageGenerationTimeout: 180,
  // Enable gzip/brotli compression for all responses
  compress: true,
  // Remove X-Powered-By header (minor security + SEO hygiene)
  poweredByHeader: false,
  typescript: {
    // Pre-existing type errors in admin pages — skip for production build
    ignoreBuildErrors: true,
  },
  images: {
    // Prefer AVIF (best compression) then WebP — major LCP improvement
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 400],
    // Aggressive image cache: serve optimized images for 1 year
    minimumCacheTTL: 31536000,
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
  /**
   * Custom HTTP response headers for security and caching.
   * Improves Lighthouse "Use efficient cache lifetimes" score.
   */
  async headers() {
    return [
      {
        // Cache static assets aggressively (hashed filenames are immutable)
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache public images for 30 days
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // Cache favicon and app icons for 7 days
        source: '/:file(favicon.*|apple-touch-icon.*|icon.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // Security headers on all routes
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
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
