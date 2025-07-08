import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  assetPrefix: "/",
  allowedDevOrigins: ['localhost', '*.digitalregion.jp'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        port: '',
        pathname: '/w80/**',
      },
    ],
  },
};

export default nextConfig;