import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";
import { isPaidTier, resolveUpgradeQuote } from "@/src/lib/billing";

const bodySchema = z.object({
  designId: z.string().min(1),
  tier: z.enum(["basic", "pro", "premium"]),
});

/**
 * Modal'da "şu an ne kadar ödeyeceksin" göstermek için. Hesap server'da:
 *   final = aktif offer ile hedef tier fiyatı
 *   totalPaid = bu davetiye için tüm paid Stripe TX'leri toplamı
 *   ödeme = max(0, final - totalPaid)
 *
 * Auth + ownership şart — başka kullanıcının davetiyesinin upgrade fiyatını
 * sorgulamayı engelliyoruz (info leak değil ama sonra Stripe'a sorabilir).
 */
export async function POST(req: Request) {
  // body parse + session paralel.
  const bodyPromise = req.json().catch(() => null);
  const sessionPromise = getSession();

  const body = await bodyPromise;
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success || !isPaidTier(parsed.data.tier)) {
    await sessionPromise;
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  // Session + design fetch paralel.
  const [session, design] = await Promise.all([
    sessionPromise,
    prisma.invitationDesign.findUnique({
      where: { id: parsed.data.designId },
      select: { userId: true },
    }),
  ]);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!design || design.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const quote = await resolveUpgradeQuote(parsed.data.designId, parsed.data.tier);
  return NextResponse.json({
    basePrice: quote.basePrice,
    finalPrice: quote.finalPrice,
    appliedPercent: quote.appliedPercent,
    totalPaidTry: Math.round(quote.totalPaidKurus / 100),
    upgradeAmountTry: Math.round(quote.upgradeAmountKurus / 100),
    promotionCode: quote.promotionCode,
    isFree: quote.upgradeAmountKurus === 0,
  });
}
