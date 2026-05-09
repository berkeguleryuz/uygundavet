import { NextResponse } from "next/server";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";
import { computeExpiresAt } from "@/src/lib/archive";
import type { PlanTier } from "@davety/schema";

type Params = Promise<{ id: string }>;

/**
 * Owner-only endpoint to restore an archived invitation. Resets
 * archivedAt, recomputes a fresh expiresAt based on the current tier,
 * and bumps status back to "published".
 *
 * Free users can only restore once per cycle, paid tiers unlimited.
 * The cycle bookkeeping lives in doc.meta.restoreCount which we
 * increment opaquely so existing UIs continue to work.
 */
export async function POST(_: Request, ctx: { params: Params }) {
  const { id } = await ctx.params;
  // Session ve design fetch paralel; existing'den sadece userId+doc.
  const [session, existing] = await Promise.all([
    getSession(),
    prisma.invitationDesign.findUnique({
      where: { id },
      select: { userId: true, doc: true },
    }),
  ]);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const docMeta =
    (existing.doc as { meta?: { tier?: PlanTier; restoreCount?: number } })
      ?.meta ?? {};
  const tier = (docMeta.tier ?? "free") as PlanTier;
  const restoreCount = docMeta.restoreCount ?? 0;
  if (tier === "free" && restoreCount >= 1) {
    return NextResponse.json(
      {
        error: "RestoreLimitReached",
        message:
          "Free planda her davetiye sadece 1 kez yeniden yayınlanabilir. Daha uzun ömür için planını yükselt.",
      },
      { status: 402 }
    );
  }

  const publishedAt = new Date();
  const expiresAt = computeExpiresAt(tier, publishedAt);

  const nextDoc = {
    ...(existing.doc as object),
    meta: {
      ...docMeta,
      restoreCount: restoreCount + 1,
    },
  };

  await prisma.invitationDesign.update({
    where: { id },
    data: {
      status: "published",
      archivedAt: null,
      publishedAt,
      expiresAt,
      doc: nextDoc,
    },
  });

  return NextResponse.json({ ok: true, expiresAt });
}
