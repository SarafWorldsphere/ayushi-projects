import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow your local network IP to access the dev server
  allowedDevOrigins: ["10.86.188.133", "localhost"],
};

export default nextConfig;