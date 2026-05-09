import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET() {
  const templates = await prisma.designTemplate.findMany({
    where: { published: true },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      category: true,
      previewUrl: true,
    },
  });
  // Public template katalogu yavaş değişir; CDN/edge'da 5dk cache,
  // stale-while-revalidate ile arka planda yenilenir. Her yeni davetiye
  // create flow'unda çağrıldığı için DB'yi gereksiz yormamak için.
  // (server-cache-lru benzeri pattern)
  return NextResponse.json(
    { templates },
    {
      headers: {
        "Cache-Control":
          "public, s-maxage=300, stale-while-revalidate=600",
      },
    },
  );
}
