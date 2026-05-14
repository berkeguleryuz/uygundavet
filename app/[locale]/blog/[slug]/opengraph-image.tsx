import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/blog/queries";

export const runtime = "nodejs";
export const alt = "Uygun Davet Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const title = post?.title ?? "Uygun Davet Blog";

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #252224 0%, #1c1a1b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
        }}
      >
        <div
          style={{
            color: "#d5d1ad",
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: "0.1em",
          }}
        >
          UYGUN DAVET BLOG
        </div>
        <div
          style={{
            color: "white",
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.2,
            display: "flex",
          }}
        >
          {title}
        </div>
        <div
          style={{
            height: 6,
            background: "linear-gradient(90deg, #d5d1ad 0%, #a39d7a 100%)",
            borderRadius: 3,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
