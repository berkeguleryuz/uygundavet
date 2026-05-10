import Stripe from "stripe";

/**
 * Tek Stripe SDK instance — Next.js dev mode hot-reload'da yeniden
 * yaratılmaması için global cache. .env'deki STRIPE_SECRET_KEY ile
 * initialise olur. Test (sk_test_) veya prod (sk_live_) anahtarı.
 */
declare global {
  var __stripe: Stripe | undefined;
}

function createClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY env değişkeni tanımlı değil. .env'i kontrol et.",
    );
  }
  return new Stripe(key, {
    // Stripe SDK v22'nin desteklediği tek sürüm. Yükseltme yapılırsa
    // burası ve webhook construct çağrısı birlikte güncellenir.
    apiVersion: "2026-04-22.dahlia",
    typescript: true,
  });
}

export const stripe: Stripe = global.__stripe ?? createClient();
if (process.env.NODE_ENV !== "production") global.__stripe = stripe;
