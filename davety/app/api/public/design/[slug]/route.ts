import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

type Params = Promise<{ slug: string }>;

export async function GET(_: Request, ctx: { params: Params }) {
  const { slug } = await ctx.params;

  const design = await prisma.invitationDesign.findFirst({
    where: {
      OR: [{ slug }, { vanityPath: slug }],
      status: "published",
    },
    select: {
      slug: true,
      vanityPath: true,
      publishedDoc: true,
      publishedAt: true,
    },
  });

  if (!design || !design.publishedDoc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(
    {
      slug: design.slug,
      vanityPath: design.vanityPath,
      doc: design.publishedDoc,
      publishedAt: design.publishedAt,
    },
    {
      headers: {
        "Cache-Control":
          "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
