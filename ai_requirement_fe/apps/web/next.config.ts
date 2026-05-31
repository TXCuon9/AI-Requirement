import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.2.11", "localhost", "127.0.0.1"],
  transpilePackages: ["@ai-requirement/ui", "@ai-requirement/utils", "@ai-requirement/types"],
};

export default nextConfig;
