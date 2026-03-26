import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "habboapi.site",
        pathname: "/api/image/**",
      },
    ],
  },
};

export default nextConfig;
