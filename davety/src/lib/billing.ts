import { applyOffer, resolveActiveOffer } from "@/app/components/pricingOffers";
import { prisma } from "@/src/lib/prisma";

/**
 * Server-side fiyatlandırma. Stripe Checkout Session yaratırken
 * tutarı KESİNLİKLE client'tan almıyoruz — burada resolve ediyoruz
 * ki kullanıcı fiyatı manipüle edip ucuza tier alamasın.
 *
 * basePrice TRY cinsinden tam sayı, kuruş için *100 yapılır.
 *
 * Kaynak: SaveScreen.tsx içindeki TIERS dizisi ile ZORUNLU eşit kalmalı.
 * Burayı değiştirirken oradakini de güncelle. (Tek yere taşıma için
 * shared module ileride gerekirse açılabilir, şimdilik tier sayısı az
 * olduğu için duplikasyon kabul edilebilir.)
 */
export const TIER_BASE_PRICE_TRY: Record<
  "free" | "basic" | "pro" | "premium",
  number
> = {
  free: 0,
  basic: 2000,
  pro: 3500,
  premium: 12500,
};

export const TIER_LABELS_TR: Record<
  "free" | "basic" | "pro" | "premium",
  string
> = {
  free: "Başlangıç",
  basic: "Klasik",
  pro: "Profesyonel",
  premium: "Premium",
};

export type PaidTier = "basic" | "pro" | "premium";

export interface ResolvedPrice {
  basePrice: number;
  /** Final amount after applying the active offer (TRY tam sayı). */
  finalPrice: number;
  /** Stripe için kuruş cinsinden (TRY * 100). */
  finalAmountKurus: number;
  appliedPercent: number;
  promotionCode: string | null;
}

/**
 * Aktif offer + base price ile bir tier'ın anlık fiyatını hesaplar.
 * `now` parametresi test edilebilir kalsın diye dışarıdan alınıyor.
 */
export function resolvePriceForTier(
  tier: PaidTier,
  now: Date = new Date(),
): ResolvedPrice {
  const basePrice = TIER_BASE_PRICE_TRY[tier];
  const offer = resolveActiveOffer(now);
  const percent = offer.percent;
  const finalPrice = percent > 0 ? applyOffer(basePrice, percent) : basePrice;
  return {
    basePrice,
    finalPrice,
    finalAmountKurus: finalPrice * 100,
    appliedPercent: percent,
    promotionCode: offer.promotionCode,
  };
}

export function isPaidTier(t: string): t is PaidTier {
  return t === "basic" || t === "pro" || t === "premium";
}

export interface UpgradeQuote {
  /** Hedef tier'ın anlık temel fiyatı (TRY tam sayı). */
  basePrice: number;
  /** Aktif offer uygulandıktan sonra hedef tier fiyatı (TRY tam sayı). */
  finalPrice: number;
  /** Aktif offer yüzdesi (0-100). */
  appliedPercent: number;
  /** Stripe için kuruş cinsinden hedef tier fiyatı. */
  finalAmountKurus: number;
  /** Bu davetiye için kullanıcının ŞİMDİYE KADAR ödediği toplam (kuruş).
   *  Eski Klasik aboneliği + ara upgrade'ler vb. hepsi dahil. */
  totalPaidKurus: number;
  /** Şimdi ödenecek tutar (kuruş): max(0, finalAmountKurus - totalPaidKurus).
   *  Promosyonla yeni fiyat eski toplamdan düşükse 0 — bedava upgrade. */
  upgradeAmountKurus: number;
  /** Aktif Stripe promotion code (varsa). */
  promotionCode: string | null;
}

/**
 * Yükseltme fiyatını davetiye bazlı geçmiş ödemeleri dikkate alarak
 * hesapla. Kullanıcı 2000 TL Klasik almışsa ve şu an Pro 1800 TL'ye
 * indirimde ise upgradeAmount = 0 (bedava). 12500 TL Premium'a geçmek
 * isterse 12500 - 2000 = 10500 TL öder, vb.
 *
 * Formül kümülatif: kullanıcı her zaman hedef tier'ın anlık fiyatını
 * TOPLAM ödemiş olur. İndirim daha sonra düşerse fark talep edilmez —
 * sadece o anki fiyat referans.
 */
export async function resolveUpgradeQuote(
  designId: string,
  tier: PaidTier,
  now: Date = new Date(),
): Promise<UpgradeQuote> {
  const price = resolvePriceForTier(tier, now);

  // Bu davetiye için kullanıcının paid TX'leri toplamı.
  const agg = await prisma.billingTransaction.aggregate({
    where: { designId, status: "paid" },
    _sum: { amount: true },
  });
  const totalPaidKurus = agg._sum.amount ?? 0;

  const upgradeAmountKurus = Math.max(
    0,
    price.finalAmountKurus - totalPaidKurus,
  );

  return {
    basePrice: price.basePrice,
    finalPrice: price.finalPrice,
    appliedPercent: price.appliedPercent,
    finalAmountKurus: price.finalAmountKurus,
    totalPaidKurus,
    upgradeAmountKurus,
    promotionCode: price.promotionCode,
  };
}
