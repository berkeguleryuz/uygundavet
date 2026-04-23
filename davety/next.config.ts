import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Prevent Next from trying to bundle these; they have native bindings / large deps.
  serverExternalPackages: ["@prisma/client", "sharp"],
  // @davety/* packages are resolved via tsconfig paths + file: dependency in package.json.
  transpilePackages: ["@davety/renderer", "@davety/schema"],
  turbopack: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    root: __dirname as any,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.r2.dev" },
      { protocol: "https", hostname: "imagedelivery.net" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default withNextIntl(nextConfig);
