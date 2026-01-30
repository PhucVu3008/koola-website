/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/uploads/**',
      },
    ],
  },
  async rewrites() {
    // Proxy /uploads requests to API server
    // This allows Next.js Image Optimization to fetch from API
    return [
      {
        source: '/uploads/:path*',
        destination: `${process.env.API_BASE_URL_SERVER || 'http://api:4000'}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
