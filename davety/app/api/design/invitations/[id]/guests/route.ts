import { NextResponse } from "next/server";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";
import { planLimitsFor, nextTierLabel } from "@/src/lib/plan-limits";
import type { PlanTier } from "@davety/schema";

type Params = Promise<{ id: string }>;

function readTier(d: unknown): PlanTier {
  if (!d || typeof d !== "object") return "free";
  const meta = (d as { meta?: { tier?: unknown } }).meta;
  if (meta && typeof meta.tier === "string") {
    const t = meta.tier;
    if (t === "free" || t === "basic" || t === "pro" || t === "premium") {
      return t;
    }
  }
  return "free";
}

export async function GET(_: Request, ctx: { params: Params }) {
  const { id } = await ctx.params;
  // Session + ownership + tier paralel. rsvpReadEnabled false ise
  // 403 + sadece toplam sayı (rsvpCountEnabled true ise).
  const [session, design] = await Promise.all([
    getSession(),
    prisma.invitationDesign.findUnique({
      where: { id },
      select: { userId: true, doc: true, publishedDoc: true },
    }),
  ]);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!design || design.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const tier = readTier(design.publishedDoc) ?? readTier(design.doc);
  const limits = planLimitsFor(tier);

  if (!limits.rsvpReadEnabled) {
    // Detay yetkisi yok — sadece toplam sayıyı (Basic+ için) ya da hiç.
    const totalCount = limits.rsvpCountEnabled
      ? await prisma.guest.count({ where: { designId: id } })
      : 0;
    return NextResponse.json(
      {
        error: "tier-locked",
        tier,
        nextTier: nextTierLabel(tier),
        totalCount,
        guests: [],
        stats: [],
      },
      { status: 403 },
    );
  }

  const [guests, stats] = await Promise.all([
    prisma.guest.findMany({
      where: { designId: id },
      orderBy: { createdAt: "desc" },
      // Dashboard sadece bu alanları gösteriyor; ileride yeni column
      // eklenirse otomatik wire'a düşmesin. (server-serialization)
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        attending: true,
        guestCount: true,
        note: true,
        source: true,
        token: true,
        createdAt: true,
      },
    }),
    prisma.guest.groupBy({
      by: ["attending"],
      where: { designId: id },
      _sum: { guestCount: true },
      _count: true,
    }),
  ]);
  return NextResponse.json({ guests, stats });
}
