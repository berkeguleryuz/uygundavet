import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Uygun Davet - Dijital Düğün Davetiyesi",
    short_name: "Uygun Davet",
    description:
      "Modern, şık ve tamamen kişiselleştirilebilir dijital düğün davetiyeleri.",
    start_url: "/",
    display: "standalone",
    background_color: "#252224",
    theme_color: "#d5d1ad",
    orientation: "portrait-primary",
    categories: ["lifestyle", "social"],
    lang: "tr",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
