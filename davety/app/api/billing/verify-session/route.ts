import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";
import { stripe } from "@/src/lib/stripe";
import { publishDesign } from "@/src/lib/publish";
import type { PlanTier } from "@davety/schema";

const querySchema = z.object({
  sessionId: z.string().min(1),
});

/**
 * Stripe success_url'inde browser bu endpoint'i çağırır:
 *   - BillingTransaction status=paid mi → ok=true (webhook iş yapmış)
 *   - Eğer hâlâ pending ise: Stripe'tan session'ı çek, payment_status=paid
 *     ise burada paid'e çek + publishDesign tetikle (webhook gecikmesi /
 *     local dev'te webhook ulaşmamış olabilir).
 *
 * Auth: kullanıcı kendi transaction'ı dışında query atamasın.
 */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = querySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const txn = await prisma.billingTransaction.findUnique({
    where: { stripeSessionId: parsed.data.sessionId },
    select: {
      id: true,
      userId: true,
      designId: true,
      tier: true,
      status: true,
    },
  });
  if (!txn || txn.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (txn.status === "paid") {
    return NextResponse.json({ ok: true, status: "paid", tier: txn.tier });
  }

  // Webhook gelmemiş olabilir — Stripe'a sor.
  const checkoutSession = await stripe.checkout.sessions.retrieve(
    parsed.data.sessionId,
  );
  if (checkoutSession.payment_status !== "paid") {
    return NextResponse.json({
      ok: false,
      status: checkoutSession.payment_status,
    });
  }

  await prisma.billingTransaction.update({
    where: { id: txn.id },
    data: {
      status: "paid",
      paidAt: new Date(),
      stripePaymentIntentId:
        typeof checkoutSession.payment_intent === "string"
          ? checkoutSession.payment_intent
          : checkoutSession.payment_intent?.id ?? null,
    },
  });
  const vanityPath =
    (checkoutSession.metadata?.vanityPath as string | undefined) || null;
  const publishResult = await publishDesign({
    designId: txn.designId,
    tier: txn.tier as PlanTier,
    vanityPath,
    actorId: session.user.id,
    source: "stripe-verify",
    stripeSessionId: parsed.data.sessionId,
    stripeTransactionId: txn.id,
  });
  if (!publishResult.ok) {
    return NextResponse.json(
      { ok: false, error: publishResult.error },
      { status: 500 },
    );
  }
  return NextResponse.json({
    ok: true,
    status: "paid",
    tier: txn.tier,
    url: publishResult.url,
  });
}
