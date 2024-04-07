/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'aita_nest_app',
        port: '3001',
        pathname: '/uploaded/**'
      },
      {
        protocol: 'http',
        hostname: 'aita_nest_app',
        port: '3001',
        pathname: '/models/**'
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/uploaded/**'
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/models/**'
      }
    ]
  }
};

export default nextConfig;
