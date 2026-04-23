import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";
import { validateVanityPath } from "@/src/lib/slug";

const publishSchema = z.object({
  vanityPath: z.string().optional(),
});

type Params = Promise<{ id: string }>;

export async function POST(req: Request, ctx: { params: Params }) {
  const { id } = await ctx.params;
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = publishSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const existing = await prisma.invitationDesign.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const vanity = parsed.data.vanityPath;
  if (vanity) {
    const check = validateVanityPath(vanity);
    if (!check.ok) {
      return NextResponse.json(
        { error: "Invalid vanity", reason: check.reason },
        { status: 400 }
      );
    }
    const conflict = await prisma.invitationDesign.findFirst({
      where: { vanityPath: vanity, NOT: { id } },
      select: { id: true },
    });
    if (conflict) {
      return NextResponse.json(
        { error: "Vanity taken" },
        { status: 409 }
      );
    }
  }

  const publishedDoc = {
    ...(existing.doc as object),
    meta: {
      ...((existing.doc as { meta?: object }).meta ?? {}),
      status: "published",
      updatedAt: new Date().toISOString(),
    },
  };

  const updated = await prisma.invitationDesign.update({
    where: { id },
    data: {
      status: "published",
      publishedDoc,
      publishedAt: new Date(),
      ...(vanity ? { vanityPath: vanity } : {}),
    },
    select: { slug: true, vanityPath: true, publishedAt: true },
  });

  const shareUrl = updated.vanityPath
    ? `/i/${updated.vanityPath}`
    : `/i/${updated.slug}`;

  return NextResponse.json({
    ok: true,
    slug: updated.slug,
    vanityPath: updated.vanityPath,
    url: shareUrl,
  });
}
