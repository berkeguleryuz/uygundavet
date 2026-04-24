"use client";

import { useEffect, useState } from "react";
import { Check, X, Star, Flame } from "lucide-react";
import { resolveActiveOffer, applyOffer, type ActiveOffer } from "./pricingOffers";

type Tier = {
  id: "free" | "basic" | "pro" | "premium";
  name: string;
  basePrice: number; // TRY — locked
  tagline: string;
  highlight?: boolean;
  cta: string;
  ctaHref: string;
  /** Stripe price ID (TRY). Real values go in env; placeholder for now. */
  stripePriceId?: string;
};

const TIERS: Tier[] = [
  {
    id: "free",
    name: "Başlangıç",
    basePrice: 0,
    tagline: "Hemen başla, ücretsiz dene.",
    cta: "Ücretsiz Başla",
    ctaHref: "/",
  },
  {
    id: "basic",
    name: "Klasik",
    basePrice: 2000,
    tagline: "Kendi fotoğrafların, kendi renklerin.",
    cta: "Klasik Paketi Al",
    ctaHref: "/?plan=basic",
    stripePriceId: "price_basic_try_2000",
  },
  {
    id: "pro",
    name: "Profesyonel",
    basePrice: 3500,
    highlight: true,
    tagline: "Tüm özellikler açık, sınırsız özgürlük.",
    cta: "Profesyonel Paketi Al",
    ctaHref: "/?plan=pro",
    stripePriceId: "price_pro_try_3500",
  },
  {
    id: "premium",
    name: "Premium",
    basePrice: 12500,
    tagline: "Özel domain & kişisel web siteniz.",
    cta: "Premium Paketi Al",
    ctaHref: "/?plan=premium",
    stripePriceId: "price_premium_try_12500",
  },
];

type FeatureValue = true | false | string;

interface FeatureRow {
  section: string;
  label: string;
  description?: string;
  values: Record<Tier["id"], FeatureValue>;
}

const FEATURES: FeatureRow[] = [
  // Tasarım
  {
    section: "Tasarım",
    label: "Davetiye şablonları",
    description: "Hazır tasarım sayısı",
    values: {
      free: "Seçili 5 şablon",
      basic: "Tüm şablonlar",
      pro: "Tüm şablonlar",
      premium: "Tüm şablonlar + VIP",
    },
  },
  {
    section: "Tasarım",
    label: "Kendi görsellerini yükle",
    description: "Fotoğraf & video ekleme",
    values: { free: false, basic: true, pro: true, premium: true },
  },
  {
    section: "Tasarım",
    label: "Renk & yazı özelleştirme",
    description: "Tema, font ve renk düzenleme",
    values: { free: "Kısıtlı", basic: true, pro: true, premium: true },
  },
  {
    section: "Tasarım",
    label: "Özel bloklar ekle",
    description: "Etkinlik programı, aile ağacı, özel notlar",
    values: { free: false, basic: true, pro: true, premium: true },
  },
  {
    section: "Tasarım",
    label: "Arkaplan müziği",
    values: { free: false, basic: "1 hazır şarkı", pro: true, premium: true },
  },

  // Etkileşim
  {
    section: "Misafir Etkileşimi",
    label: "Dijital paylaşım linki",
    description: "Whatsapp, SMS ile paylaş",
    values: { free: true, basic: true, pro: true, premium: true },
  },
  {
    section: "Misafir Etkileşimi",
    label: "Katılım formu (RSVP)",
    description: "Misafirlerden katılım bilgisi",
    values: { free: false, basic: false, pro: true, premium: true },
  },
  {
    section: "Misafir Etkileşimi",
    label: "Anı defteri",
    description: "Misafirler mesaj bırakır",
    values: { free: false, basic: false, pro: true, premium: true },
  },
  {
    section: "Misafir Etkileşimi",
    label: "Foto galeri",
    description: "Misafirler fotoğraf paylaşır",
    values: { free: false, basic: "Yalnız görüntüleme", pro: true, premium: true },
  },
  {
    section: "Misafir Etkileşimi",
    label: "Misafir listesi & takip",
    description: "RSVP yanıtlarını dashboardda gör",
    values: { free: false, basic: false, pro: true, premium: true },
  },

  // Yayın
  {
    section: "Yayın & Marka",
    label: "davetli.com altında link",
    description: "davetli.com/i/your-wedding",
    values: { free: true, basic: true, pro: true, premium: true },
  },
  {
    section: "Yayın & Marka",
    label: "Özel kısa link",
    description: "davetli.com/your-name",
    values: { free: false, basic: true, pro: true, premium: true },
  },
  {
    section: "Yayın & Marka",
    label: "Reklam & watermark yok",
    description: "Davetiyede site reklamı görünmez",
    values: { free: false, basic: true, pro: true, premium: true },
  },
  {
    section: "Yayın & Marka",
    label: "Özel web sitesi",
    description: "Çok sayfalı, kişiselleştirilmiş",
    values: { free: false, basic: false, pro: false, premium: true },
  },
  {
    section: "Yayın & Marka",
    label: "Kendi alan adınla yayınla",
    description: "ornek.com gibi özel domain",
    values: { free: false, basic: false, pro: false, premium: true },
  },

  // Destek
  {
    section: "Destek",
    label: "E-posta desteği",
    values: { free: true, basic: true, pro: true, premium: true },
  },
  {
    section: "Destek",
    label: "Whatsapp öncelikli destek",
    values: { free: false, basic: true, pro: true, premium: true },
  },
  {
    section: "Destek",
    label: "Özel tasarım danışmanlığı",
    description: "1-1 video görüşme",
    values: { free: false, basic: false, pro: false, premium: true },
  },
];

export function PricingTable() {
  // Group features by section for rendering
  const sections = Array.from(new Set(FEATURES.map((f) => f.section)));

  // Resolve offer client-side only to avoid SSR ↔ client timezone mismatches.
  const [offer, setOffer] = useState<ActiveOffer | null>(null);
  useEffect(() => {
    const tick = () => setOffer(resolveActiveOffer(new Date()));
    tick();
    // Re-resolve every minute — catches midnight rollover and the window
    // into/out of the monthly flash sale without a page refresh.
    const int = window.setInterval(tick, 60_000);
    return () => window.clearInterval(int);
  }, []);

  return (
    <div
      className="w-full"
      style={{ fontFamily: "Space Grotesk, sans-serif" }}
    >
      {/* Active-offer banner */}
      <OfferBanner offer={offer} />

      {/* Pricing cards row — sticky at top for long feature tables */}
      <div className="sticky top-20 z-20 bg-background/95 backdrop-blur-md -mx-4 md:-mx-8 px-4 md:px-8 py-3 border-b border-border">
        <div className="grid grid-cols-[minmax(140px,1.2fr)_repeat(4,1fr)] gap-3 items-stretch">
          <div className="hidden md:block" />
          {TIERS.map((tier) => (
            <TierHeader key={tier.id} tier={tier} offer={offer} />
          ))}
        </div>
      </div>

      {/* Feature table */}
      <div className="mt-6">
        {sections.map((section) => (
          <section key={section} className="mb-8">
            <h3
              className="text-sm md:text-base font-semibold tracking-tight text-foreground uppercase tracking-widest mb-3 px-1"
              style={{ fontFamily: "Space Grotesk, sans-serif", letterSpacing: "0.12em" }}
            >
              {section}
            </h3>
            <div className="rounded-2xl border border-border overflow-hidden bg-white">
              {FEATURES.filter((f) => f.section === section).map((row, idx) => (
                <div
                  key={`${section}-${idx}`}
                  className="grid grid-cols-[minmax(140px,1.2fr)_repeat(4,1fr)] items-start gap-3 px-3 md:px-4 py-3 border-b last:border-b-0 border-border hover:bg-muted/30"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground">
                      {row.label}
                    </div>
                    {row.description ? (
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {row.description}
                      </div>
                    ) : null}
                  </div>
                  {TIERS.map((tier) => (
                    <div
                      key={tier.id}
                      className="flex items-start justify-center text-center text-xs md:text-sm"
                    >
                      <FeatureCell value={row.values[tier.id]} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Footnotes */}
      <div className="text-xs text-muted-foreground space-y-1 pb-12 pt-4 border-t border-border mt-6">
        <p>
          * Fiyatlar Türk Lirası cinsindendir ve tek seferlik etkinlik bazlı
          ödemelerdir. KDV dahildir.
        </p>
        <p>
          * Premium paketi için özel domain ücretleri ayrıca fatura edilebilir.
        </p>
        <p>
          * İstediğin zaman üst pakete geçebilir, fark ücretini ödeyerek ek
          özellikleri açabilirsin.
        </p>
      </div>
    </div>
  );
}

function TierHeader({
  tier,
  offer,
}: {
  tier: Tier;
  offer: ActiveOffer | null;
}) {
  const isFree = tier.basePrice === 0;
  const percent = offer?.percent ?? 0;
  const discounted = percent > 0 ? applyOffer(tier.basePrice, percent) : tier.basePrice;

  return (
    <div
      className={`relative rounded-2xl border p-3 md:p-4 flex flex-col items-center text-center transition-all ${
        tier.highlight
          ? "bg-foreground text-background border-foreground shadow-lg"
          : "bg-white border-border"
      }`}
    >
      {tier.highlight ? (
        <div className="mb-1 inline-flex items-center gap-1 text-[10px] uppercase tracking-widest">
          <Star className="size-3 fill-current" /> En Popüler
        </div>
      ) : null}

      {percent > 0 && !isFree ? (
        <div className="absolute -top-2 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500 text-white shadow">
          <Flame className="size-3" /> %{percent}
        </div>
      ) : null}

      <div
        className={`text-sm md:text-base font-semibold ${
          tier.highlight ? "" : "text-foreground"
        }`}
      >
        {tier.name}
      </div>

      <div className="mt-1 leading-none">
        {isFree ? (
          <span className="text-xl md:text-2xl font-bold tabular-nums">
            Ücretsiz
          </span>
        ) : percent > 0 ? (
          <div className="flex flex-col items-center gap-0.5">
            <span
              className={`text-[11px] md:text-xs tabular-nums line-through ${
                tier.highlight ? "opacity-60" : "text-muted-foreground"
              }`}
            >
              {tier.basePrice.toLocaleString("tr-TR")}₺
            </span>
            <span className="text-xl md:text-2xl font-bold tabular-nums">
              {discounted.toLocaleString("tr-TR")}₺
            </span>
          </div>
        ) : (
          <span className="text-xl md:text-2xl font-bold tabular-nums">
            {tier.basePrice.toLocaleString("tr-TR")}₺
          </span>
        )}
      </div>

      <div
        className={`text-[10px] md:text-[11px] mt-1 ${
          tier.highlight ? "opacity-80" : "text-muted-foreground"
        } hidden md:block`}
      >
        {tier.tagline}
      </div>

      <a
        href={tier.ctaHref}
        className={`mt-2 md:mt-3 w-full px-3 py-1.5 md:py-2 rounded-full text-[11px] md:text-xs font-medium transition-colors ${
          tier.highlight
            ? "bg-background text-foreground hover:bg-background/90"
            : "bg-foreground text-background hover:bg-foreground/90"
        }`}
      >
        {tier.cta}
      </a>
    </div>
  );
}

/* ─── Offer banner with 24h countdown ─────────────────────────────────── */
function OfferBanner({ offer }: { offer: ActiveOffer | null }) {
  if (!offer) {
    // Server render or pre-hydration — keep a reserved space so cards
    // below don't jump when the banner populates.
    return <div className="h-10 mb-6" aria-hidden />;
  }
  if (offer.percent <= 0) {
    return (
      <div className="mb-6 rounded-full border border-border bg-white px-4 py-2 text-center text-xs text-muted-foreground">
        {offer.label}
        {offer.sublabel ? (
          <span className="ml-2 opacity-70">— {offer.sublabel}</span>
        ) : null}
      </div>
    );
  }

  const isFlash = offer.promotionCode === "MONTHLY_FLASH_60";
  return (
    <div
      className={`mb-6 rounded-2xl px-4 md:px-5 py-3 md:py-3.5 flex items-center gap-3 flex-wrap ${
        isFlash
          ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white"
          : "bg-foreground text-background"
      }`}
    >
      <div className="inline-flex items-center gap-2 shrink-0">
        <Flame className="size-5" />
        <span className="text-xs md:text-sm uppercase tracking-[0.2em] font-semibold">
          {offer.label}
        </span>
        <span className="inline-flex items-center justify-center rounded-full bg-white/20 text-[11px] md:text-xs font-bold px-2 py-0.5">
          %{offer.percent}
        </span>
      </div>

      {offer.sublabel ? (
        <div className="text-[11px] md:text-xs opacity-90">
          {offer.sublabel}
        </div>
      ) : null}

      <div className="flex-1" />

      <Countdown targetIso={offer.endsAtIso} />
    </div>
  );
}

function Countdown({ targetIso }: { targetIso: string }) {
  const [left, setLeft] = useState<{ h: number; m: number; s: number } | null>(
    null
  );

  useEffect(() => {
    const target = new Date(targetIso).getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      const totalSec = Math.floor(diff / 1000);
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;
      setLeft({ h, m, s });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [targetIso]);

  if (!left) return null;
  return (
    <div className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold tabular-nums bg-black/20 rounded-full px-3 py-1">
      <span className="opacity-70 uppercase tracking-widest text-[10px]">
        Kalan
      </span>
      <span>
        {pad(left.h)}:{pad(left.m)}:{pad(left.s)}
      </span>
    </div>
  );
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function FeatureCell({ value }: { value: FeatureValue }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center justify-center size-7 rounded-full bg-emerald-50 text-emerald-600">
        <Check className="size-4" />
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex items-center justify-center size-7 rounded-full bg-muted text-muted-foreground">
        <X className="size-3.5" />
      </span>
    );
  }
  return <span className="text-foreground text-[11px] md:text-xs leading-snug">{value}</span>;
}
