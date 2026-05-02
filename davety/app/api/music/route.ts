import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

/**
 * Public catalog of curated background tracks. The editor's MusicTab
 * fetches this once and renders the picker. We filter by `enabled` and
 * order by title for a deterministic UI.
 *
 * Anonymous access is fine, the catalog is content the host browses
 * before signing up.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const mood = url.searchParams.get("mood");
  const tier = url.searchParams.get("tier");

  const tracks = await prisma.musicTrack.findMany({
    where: {
      enabled: true,
      ...(tier ? { tier } : {}),
      ...(mood ? { moods: { has: mood } } : {}),
    },
    orderBy: [{ tier: "asc" }, { title: "asc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      artist: true,
      url: true,
      moods: true,
      tier: true,
      durationSec: true,
      licensor: true,
    },
    take: 200,
  });
  return NextResponse.json(
    { tracks },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
      },
    }
  );
}
