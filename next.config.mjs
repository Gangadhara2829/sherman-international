/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.aryawebsolutions.online',
      },
      {
        protocol: 'https',
        hostname: 'aryawebsolutions.online',
      },
      {
        protocol: 'http',
        hostname: 'www.aryawebsolutions.online',
      },
      {
        protocol: 'http',
        hostname: 'aryawebsolutions.online',
      },
      {
        protocol: 'https',
        hostname: 'sherman-india.com',
      },
      {
        protocol: 'https',
        hostname: 'www.sherman-india.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
