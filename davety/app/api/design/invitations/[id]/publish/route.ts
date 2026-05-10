import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";
import { publishDesign, tierRank } from "@/src/lib/publish";
import { tierOrFree } from "@/src/lib/plan-limits";
import type { PlanTier } from "@davety/schema";

const publishSchema = z.object({
  vanityPath: z.string().optional(),
  tier: z.enum(["free", "basic", "pro", "premium"]).optional(),
});

/**
 * Publish endpoint sadece ÜCRETSIZ tier için doğrudan yayın yapar.
 * Ücretli tier'a (basic/pro/premium) yükseltme `/api/billing/checkout`
 * üzerinden Stripe Checkout'a yönlendirilir; webhook ödeme sonrası
 * `publishDesign`'i kendisi çağırır. Bu sayede client-side fiyat
 * manipülasyonuyla bedava paid tier alınmaz.
 *
 * Mevcut tier'a eşit veya altına geçiş (örn. tekrar publish) ücretsiz —
 * ödeme zaten alınmış. Üst tier istek gelirse 402 + redirect URL döner.
 */
type Params = Promise<{ id: string }>;

export async function POST(req: Request, ctx: { params: Params }) {
  const { id } = await ctx.params;
  const bodyPromise = req.json().catch(() => ({}));
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

  const body = await bodyPromise;
  const parsed = publishSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const requestedTier = parsed.data.tier;
  const existingMeta =
    (existing.doc as { meta?: { tier?: string } }).meta ?? {};
  const currentTier = tierOrFree(
    (existingMeta.tier as PlanTier | undefined) ?? null,
  );
  const targetTier = tierOrFree(requestedTier ?? currentTier);

  // Ücretli upgrade isteği — Stripe akışına yönlendir.
  if (tierRank(targetTier) > tierRank(currentTier)) {
    return NextResponse.json(
      {
        error: "PaymentRequired",
        message:
          "Üst pakete geçmek için ödeme gerekli. /api/billing/checkout üzerinden Stripe Checkout başlatılmalı.",
        currentTier,
        targetTier,
      },
      { status: 402 },
    );
  }

  const result = await publishDesign({
    designId: id,
    tier: targetTier,
    vanityPath: parsed.data.vanityPath ?? null,
    actorId: session.user.id,
    source: "publish-endpoint",
  });
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, ...(result.reason ? { reason: result.reason } : {}) },
      { status: result.status },
    );
  }
  return NextResponse.json({
    ok: true,
    slug: result.slug,
    vanityPath: result.vanityPath,
    url: result.url,
    expiresAt: result.expiresAt,
  });
}
