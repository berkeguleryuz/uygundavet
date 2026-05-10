import { NextResponse } from "next/server";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";

/**
 * DEBUG ONLY — bir davetiyenin DB'deki ham doc + publishedDoc karşılaştırması.
 * Sadece owner görür. Üretimde bu route'u kaldır veya admin'e kapat.
 */
type Params = Promise<{ slug: string }>;

export async function GET(_: Request, ctx: { params: Params }) {
  const { slug } = await ctx.params;
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const design = await prisma.invitationDesign.findFirst({
    where: { OR: [{ slug }, { vanityPath: slug }] },
    select: {
      id: true,
      slug: true,
      vanityPath: true,
      userId: true,
      status: true,
      publishedAt: true,
      updatedAt: true,
      lastAutosavedAt: true,
      doc: true,
      publishedDoc: true,
    },
  });
  if (!design || design.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const docTyped = design.doc as {
    blocks?: Array<{ type: string; data?: { variant?: string; description?: string } }>;
    meta?: { tier?: string; status?: string };
  };
  const pubTyped = design.publishedDoc as {
    blocks?: Array<{ type: string; data?: { variant?: string; description?: string } }>;
    meta?: { tier?: string; status?: string };
  } | null;

  return NextResponse.json({
    id: design.id,
    slug: design.slug,
    vanityPath: design.vanityPath,
    status: design.status,
    publishedAt: design.publishedAt,
    updatedAt: design.updatedAt,
    lastAutosavedAt: design.lastAutosavedAt,
    doc: {
      heroVariant: docTyped.blocks?.[0]?.data?.variant ?? null,
      heroDescription: docTyped.blocks?.[0]?.data?.description ?? null,
      blockCount: docTyped.blocks?.length ?? 0,
      blockTypes: docTyped.blocks?.map((b) => b.type) ?? [],
      tier: docTyped.meta?.tier ?? null,
      status: docTyped.meta?.status ?? null,
    },
    publishedDoc: pubTyped
      ? {
          heroVariant: pubTyped.blocks?.[0]?.data?.variant ?? null,
          heroDescription: pubTyped.blocks?.[0]?.data?.description ?? null,
          blockCount: pubTyped.blocks?.length ?? 0,
          blockTypes: pubTyped.blocks?.map((b) => b.type) ?? [],
          tier: pubTyped.meta?.tier ?? null,
          status: pubTyped.meta?.status ?? null,
        }
      : null,
    diagnosis: {
      hasPublishedDoc: !!design.publishedDoc,
      docVsPublishedHeroVariant:
        docTyped.blocks?.[0]?.data?.variant ===
        pubTyped?.blocks?.[0]?.data?.variant,
      docVsPublishedDescription:
        docTyped.blocks?.[0]?.data?.description ===
        pubTyped?.blocks?.[0]?.data?.description,
      docNewerThanPublishedAt:
        design.publishedAt && design.updatedAt > design.publishedAt,
    },
  });
}
