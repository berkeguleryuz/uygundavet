import { buildFeed } from "@/lib/blog/build-feed";

export const revalidate = 3600;

export async function GET() {
  const feed = await buildFeed();
  return new Response(feed.atom1(), {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
