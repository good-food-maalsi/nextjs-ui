import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/dashboard/login",
        destination: "/login",
      },
      {
        source: "/dashboard/register",
        destination: "/register",
      },
      {
        source: "/dashboard/request-password-reset",
        destination: "/request-password-reset",
      },
      {
        source: "/dashboard/reset-password",
        destination: "/reset-password",
      },
    ];
  },
};

export default nextConfig;
