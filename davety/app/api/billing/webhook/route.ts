import { NextResponse, after } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/src/lib/prisma";
import { stripe } from "@/src/lib/stripe";
import { publishDesign } from "@/src/lib/publish";
import type { PlanTier } from "@davety/schema";

/**
 * Stripe webhook handler. `checkout.session.completed` üzerine
 * BillingTransaction'ı paid'e çekiyor ve publishDesign'ı tetikliyor.
 *
 * Idempotent:
 *   - sessionId üzerinde unique constraint var.
 *   - status === "paid" geldiyse erken return.
 *   - publishDesign idempotent (aynı tier ile tekrar çağırmak güvenli).
 *
 * Webhook signature DOĞRULAMASI ŞARTTIR — yoksa rastgele biri sahte
 * payment "completed" gönderip ücretsiz tier yükseltir.
 */

// Edge runtime'da raw body okuma sınırlı — Node runtime kullanıyoruz.
export const runtime = "nodejs";
// Yanıtı cachelenmesin diye (Stripe webhook her seferinde fresh).
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !webhookSecret) {
    console.error("[stripe webhook] Missing signature or secret");
    return NextResponse.json(
      { error: "Missing signature" },
      { status: 400 },
    );
  }

  // Raw body (Buffer / string) gerekli — JSON parse'ı YAPMA, yoksa
  // signature doğrulanmaz.
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("[stripe webhook] Signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 },
    );
  }

  // Stripe hızlı 200 bekler — publish işlemini after() ile response
  // sonrasına ertele. (server-after-nonblocking) verify-session
  // browser-side fallback zaten var, gecikme kullanıcı deneyimini
  // bozmaz.
  if (event.type === "checkout.session.completed") {
    const sessionObj = event.data.object as Stripe.Checkout.Session;
    after(() => handleCheckoutCompleted(sessionObj));
  } else if (event.type === "checkout.session.async_payment_succeeded") {
    const sessionObj = event.data.object as Stripe.Checkout.Session;
    after(() => handleCheckoutCompleted(sessionObj));
  } else if (event.type === "checkout.session.expired") {
    const sessionObj = event.data.object as Stripe.Checkout.Session;
    after(() =>
      prisma.billingTransaction.updateMany({
        where: { stripeSessionId: sessionObj.id, status: "pending" },
        data: { status: "failed" },
      }),
    );
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(s: Stripe.Checkout.Session) {
  if (s.payment_status !== "paid") {
    console.warn(
      `[stripe webhook] session ${s.id} payment_status=${s.payment_status}, skipping`,
    );
    return;
  }

  const meta = s.metadata ?? {};
  const transactionId = meta.transactionId;
  const designId = meta.designId;
  const tier = meta.tier as PlanTier | undefined;
  const userId = meta.userId;
  const vanityPath = meta.vanityPath || null;

  if (!transactionId || !designId || !tier || !userId) {
    console.error("[stripe webhook] Missing metadata on session", s.id, meta);
    return;
  }

  // Idempotency: zaten paid'e çekilmişse atla.
  const txn = await prisma.billingTransaction.findUnique({
    where: { id: transactionId },
    select: { status: true, designId: true, userId: true, tier: true },
  });
  if (!txn) {
    console.error(
      `[stripe webhook] transaction ${transactionId} not found for session ${s.id}`,
    );
    return;
  }
  if (txn.status === "paid") {
    console.log(`[stripe webhook] transaction ${transactionId} already paid`);
    return;
  }
  // Cross-check: meta'daki design/user/tier ile DB eşleşmeli (defense
  // in depth — webhook payload manipüle edilemez ama yine de).
  if (
    txn.designId !== designId ||
    txn.userId !== userId ||
    txn.tier !== tier
  ) {
    console.error(
      `[stripe webhook] transaction ${transactionId} mismatch with session ${s.id}`,
    );
    return;
  }

  // 1) BillingTransaction → paid
  await prisma.billingTransaction.update({
    where: { id: transactionId },
    data: {
      status: "paid",
      paidAt: new Date(),
      stripePaymentIntentId:
        typeof s.payment_intent === "string"
          ? s.payment_intent
          : s.payment_intent?.id ?? null,
    },
  });

  // 2) Davetiyeyi yeni tier ile yayınla (publishDesign idempotent).
  //    actorId webhook'ta session yok → design owner'ını actor olarak
  //    yazıyoruz; design history'de "owner upgrade etti" olarak görünür.
  const result = await publishDesign({
    designId,
    tier,
    vanityPath: vanityPath || null,
    actorId: userId,
    source: "stripe-webhook",
    stripeSessionId: s.id,
    stripeTransactionId: transactionId,
  });
  if (!result.ok) {
    console.error(
      `[stripe webhook] publishDesign failed for ${designId}:`,
      result,
    );
  } else {
    console.log(
      `[stripe webhook] design ${designId} published as ${tier} via session ${s.id}`,
    );
  }
}
