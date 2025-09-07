// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ✅ Don’t fail the production build if ESLint errors exist
    ignoreDuringBuilds: true,
  },
  // you can add other Next.js config options here later if needed
};

export default nextConfig;
