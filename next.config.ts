import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // This allows production builds to successfully complete 
    // even if your project has TypeScript errors.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
