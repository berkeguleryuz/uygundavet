import type { NextConfig } from "next";

const UYGUNDAVET_API =
  process.env.UYGUNDAVET_API_URL || "https://uygundavet.com";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/public/:path*",
        destination: `${UYGUNDAVET_API}/api/public/:path*`,
      },
    ];
  },
};

export default nextConfig;
