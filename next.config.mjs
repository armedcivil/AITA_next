/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'aita_nest_app',
        port: '3001',
        pathname: '/uploaded/**'
      }
    ]
  }
};

export default nextConfig;
