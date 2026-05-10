import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";
import { stripe } from "@/src/lib/stripe";
import {
  isPaidTier,
  resolveUpgradeQuote,
  TIER_LABELS_TR,
} from "@/src/lib/billing";
import { publishDesign, tierRank } from "@/src/lib/publish";
import { tierOrFree } from "@/src/lib/plan-limits";
import type { PlanTier } from "@davety/schema";

const bodySchema = z.object({
  designId: z.string().min(1),
  tier: z.enum(["basic", "pro", "premium"]),
  vanityPath: z.string().optional(),
});

/**
 * Stripe Checkout Session başlatır. Server-side fiyat resolve edilir
 * (client'ın gönderdiği amount'a İTİMAT EDİLMEZ). Aktif offer (haftanın
 * günü / aylık flaş) burada uygulanır. Tutar TRY * 100 (kuruş) olarak
 * Stripe'a gider.
 *
 * Davranış:
 *   - Auth kontrol → ownership kontrol → mevcut tier'dan yüksek mi
 *   - BillingTransaction(status="pending") oluştur
 *   - Stripe Checkout Session yarat (mode=payment, currency=try)
 *   - metadata: { transactionId, designId, tier, userId } → webhook
 *     burdan idempotency için sessionId üzerinden işler.
 *   - Return: { url } → client redirect.
 */
export async function POST(req: Request) {
  // Body parse + session bağımsız → paralel başlat.
  const bodyPromise = req.json().catch(() => null);
  const sessionPromise = getSession();

  // designId body'den geldiği için design fetch'i parse sonrasına
  // bırakıyoruz; ama session fetch ile body parse paralel.
  const body = await bodyPromise;
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    await sessionPromise; // dangling fetch'i bekle ki context hata sızdırmasın
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { designId, tier, vanityPath } = parsed.data;
  if (!isPaidTier(tier)) {
    await sessionPromise;
    return NextResponse.json({ error: "Tier not paid" }, { status: 400 });
  }

  // Session + design fetch paralel — auth ve ownership check await sonrası.
  const [session, design] = await Promise.all([
    sessionPromise,
    prisma.invitationDesign.findUnique({
      where: { id: designId },
      select: { userId: true, doc: true },
    }),
  ]);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!design || design.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const currentTier = tierOrFree(
    ((design.doc as { meta?: { tier?: string } }).meta?.tier as
      | PlanTier
      | undefined) ?? null,
  );
  if (tierRank(tier) <= tierRank(currentTier)) {
    return NextResponse.json(
      {
        error: "AlreadyAtOrAboveTier",
        message: "Bu paket mevcut paketinle aynı veya daha düşük.",
      },
      { status: 400 },
    );
  }

  // Geçmiş ödemeler dahil yükseltme tutarı. 0 ise Stripe'a uğramadan
  // direkt yayınla + 0 TL'lik audit kaydı bırak.
  const quote = await resolveUpgradeQuote(designId, tier);

  if (quote.upgradeAmountKurus === 0) {
    // Bedava upgrade — geçmiş ödemeler hedef fiyatı zaten karşılıyor.
    // BillingTransaction kaydı (audit + history için), sonra publish.
    const txn = await prisma.billingTransaction.create({
      data: {
        userId: session.user.id,
        designId,
        stripeSessionId: `free-upgrade-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,
        tier,
        amount: 0,
        currency: "try",
        status: "paid",
        promotionCode: quote.promotionCode ?? null,
        appliedPercent: quote.appliedPercent,
        paidAt: new Date(),
      },
      select: { id: true },
    });
    const result = await publishDesign({
      designId,
      tier,
      vanityPath: vanityPath ?? null,
      actorId: session.user.id,
      source: "stripe-verify",
      stripeTransactionId: txn.id,
    });
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error, ...(result.reason ? { reason: result.reason } : {}) },
        { status: result.status },
      );
    }
    return NextResponse.json({
      freeUpgrade: true,
      tier,
      url: result.url,
    });
  }

  if (quote.upgradeAmountKurus < 100) {
    // Stripe TRY minimum yaklaşık 1 TL. Bunun altı düşerse 0 olarak
    // muamele görmesi gerekirdi, ama defansif kontrol.
    return NextResponse.json(
      { error: "Price below minimum" },
      { status: 400 },
    );
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin;
  const successUrl = `${baseUrl}/design/invitations/${designId}/save?paid={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${baseUrl}/design/invitations/${designId}/save?paid_cancel=1`;

  // Pending TX kaydı (sessionId placeholder, Stripe yaratınca güncellenir).
  const txn = await prisma.billingTransaction.create({
    data: {
      userId: session.user.id,
      designId,
      stripeSessionId: `pending-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      tier,
      amount: quote.upgradeAmountKurus,
      currency: "try",
      status: "pending",
      promotionCode: quote.promotionCode ?? null,
      appliedPercent: quote.appliedPercent,
    },
    select: { id: true },
  });

  // Description: yeni satın alma mı, yükseltme mi netleşsin.
  const isUpgrade = quote.totalPaidKurus > 0;
  const productName = isUpgrade
    ? `DavetYolla — ${TIER_LABELS_TR[tier]} yükseltmesi`
    : `DavetYolla — ${TIER_LABELS_TR[tier]} paketi`;
  const productDesc = isUpgrade
    ? `Daha önce ödenen ₺${Math.round(
        quote.totalPaidKurus / 100,
      )} düşüldü. Hedef paketin anlık fiyatı ₺${quote.finalPrice}${
        quote.appliedPercent
          ? ` (%${quote.appliedPercent} indirimli)`
          : ""
      }.`
    : quote.appliedPercent
      ? `%${quote.appliedPercent} indirimli (orijinal ₺${quote.basePrice}). Tek seferlik etkinlik ödemesi.`
      : "Tek seferlik etkinlik ödemesi. KDV dahildir.";

  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: session.user.email ?? undefined,
    locale: "tr",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "try",
          unit_amount: quote.upgradeAmountKurus,
          product_data: { name: productName, description: productDesc },
        },
      },
    ],
    metadata: {
      transactionId: txn.id,
      designId,
      tier,
      userId: session.user.id,
      vanityPath: vanityPath ?? "",
      appliedPercent: String(quote.appliedPercent),
      previousPaidKurus: String(quote.totalPaidKurus),
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  await prisma.billingTransaction.update({
    where: { id: txn.id },
    data: { stripeSessionId: checkout.id },
  });

  if (!checkout.url) {
    return NextResponse.json(
      { error: "Stripe did not return a checkout URL" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    url: checkout.url,
    sessionId: checkout.id,
    transactionId: txn.id,
  });
}
