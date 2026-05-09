import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // X-Powered-By header'ı kapatıyoruz; her response'tan birkaç byte
  // tasarruf + minimal fingerprinting azaltma.
  poweredByHeader: false,
  // Prevent Next from trying to bundle these; they have native bindings / large deps.
  serverExternalPackages: ["@prisma/client", "sharp"],
  // @davety/* packages are resolved via tsconfig paths + file: dependency in package.json.
  transpilePackages: ["@davety/renderer", "@davety/schema"],
  // Tree-shake icon/animation barrel imports — optimizePackageImports
  // tells Next to rewrite `import { X } from "lucide-react"` to per-icon
  // deep imports at compile time. Avoids pulling 1400+ icons into client
  // bundles. Same for framer-motion's many entry points.
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-dialog",
      "sonner",
    ],
  },
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
