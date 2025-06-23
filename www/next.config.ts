import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  assetPrefix: "/",
  allowedDevOrigins: ['localhost', '*.digitalregion.jp'],
};

export default nextConfig;