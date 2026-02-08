import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: true,
  transpilePackages: ["@todo-app/shared"],
  images: {
    unoptimized: true,
  },
  basePath: '/phase2',
  assetPrefix: '/phase2/',
};

export default nextConfig;
