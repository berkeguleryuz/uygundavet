import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://uygundavet.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/clodron/",
          "/api/",
          "/login",
          "/reset-password",
          "/verified",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
