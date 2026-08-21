import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Allow phones and other devices on the local network to use the dev HMR client.
  // Keep this scoped to known development hosts rather than enabling public CORS.
  allowedDevOrigins: ["192.168.1.36"],
};

export default nextConfig;
