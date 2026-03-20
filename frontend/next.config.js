/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Environment variables for API URL
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.paketciniz.com',
  },
  
  // Rewrites for API calls
  async rewrites() {
    const isDev = process.env.NODE_ENV === 'development';
    
    return [
      {
        source: '/api/:path*',
        destination: isDev 
          ? 'http://localhost:4000/:path*' 
          : 'https://api.paketciniz.com/:path*',
      },
    ];
  },
  
  // Image domains (if using external images)
  images: {
    domains: ['api.paketciniz.com', 'localhost'],
  },
  
  // Output configuration
  output: 'standalone',
};

module.exports = nextConfig;
