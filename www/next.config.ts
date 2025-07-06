import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  assetPrefix: "/",
  allowedDevOrigins: ['localhost', '*.digitalregion.jp'],
  // /health を /api/health へリライト
  async rewrites() {
    return [
      { source: '/health', destination: '/api/health' }
    ];
  },
};

export default nextConfig;