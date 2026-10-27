import type { NextConfig } from "next";

const backendOrigin = (
  process.env.API_PROXY_TARGET?.trim() ||
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ||
  "http://localhost:8080"
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async rewrites() {
    // Same-origin /api/* → Spring Boot. Avoids browser CORS preflight gaps
    // (backend CorsConfig currently omits PATCH, which blocks settings saves).
    return [
      {
        source: "/api/:path*",
        destination: `${backendOrigin}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
