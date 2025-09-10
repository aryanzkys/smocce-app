/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_ELECTION_YEAR: process.env.NEXT_PUBLIC_ELECTION_YEAR,
  },
  
  // API proxy only in development; in production, Netlify redirects handle /api to functions
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/:path*`,
        },
      ];
    }
    return [];
  },
  
  // Image optimization
  images: {
    domains: [
      'localhost',
      'smocce-backend.onrender.com',
  'res.cloudinary.com',
      'via.placeholder.com',
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  
  // Compression
  compress: true,
  
  // Build optimization
  swcMinify: true,
  
  // Static optimization
  trailingSlash: false,
  
  // PWA support (optional)
  // Uncomment if you want PWA features
  /*
  async generateBuildId() {
    return 'smocce-2025-' + Date.now();
  },
  */
};

export default nextConfig;
