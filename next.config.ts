import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  productionBrowserSourceMaps: false,
  experimental: {
    workerThreads: false,
  },
};

export default nextConfig;
