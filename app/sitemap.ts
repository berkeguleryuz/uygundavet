import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://uygundavet.com";

  const publicPages = [
    { path: "/", changeFrequency: "weekly" as const, priority: 1.0 },
    { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly" as const, priority: 0.3 },
    {
      path: "/data-deletion",
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
  ];

  return publicPages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
    alternates: {
      languages: {
        tr: `${baseUrl}${page.path}`,
        en: `${baseUrl}${page.path}`,
        de: `${baseUrl}${page.path}`,
        "x-default": `${baseUrl}${page.path}`,
      },
    },
  }));
}
