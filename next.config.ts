import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages compatibility
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Image optimization is not supported on Cloudflare Pages
  images: {
    unoptimized: true,
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Output file tracing root to avoid multiple lockfile warning
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
