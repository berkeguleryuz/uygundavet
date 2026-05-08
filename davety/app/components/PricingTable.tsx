"use client";

import { useEffect, useState } from "react";
import { Check, X, Star, Flame } from "lucide-react";
import { resolveActiveOffer, applyOffer, type ActiveOffer } from "./pricingOffers";
import {
  TierIconStyles,
  SparkleIcon,
  StarIcon as DrawStarIcon,
  ZapIcon,
  CrownIcon,
} from "@/src/components/tier-icons";

type Tier = {
  id: "free" | "basic" | "pro" | "premium";
  name: string;
  basePrice: number; // TRY, locked
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
    description: "Tüm hazır tasarımlar her pakette açık",
    values: {
      free: true,
      basic: true,
      pro: true,
      premium: true,
    },
  },
  {
    section: "Tasarım",
    label: "Kendi görsellerini yükle",
    description: "Fotoğraf & video ekleme",
    values: { free: "1 görsel", basic: true, pro: true, premium: true },
  },
  {
    section: "Tasarım",
    label: "Renk & yazı özelleştirme",
    description: "Tema, font ve renk düzenleme",
    values: { free: true, basic: true, pro: true, premium: true },
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
    description: "Misafirler katılım gönderebilir",
    values: { free: false, basic: true, pro: true, premium: true },
  },
  {
    section: "Misafir Etkileşimi",
    label: "Anı defteri",
    description: "Misafirler mesaj bırakır",
    values: { free: false, basic: true, pro: true, premium: true },
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
    values: {
      free: false,
      basic: "Sadece sayı",
      pro: true,
      premium: true,
    },
  },

  // Yayın
  {
    section: "Yayın & Marka",
    label: "davetyolla.com altında link",
    description: "davetyolla.com/davetiyem/your-wedding",
    values: { free: true, basic: true, pro: true, premium: true },
  },
  {
    section: "Yayın & Marka",
    label: "Özel kısa link",
    description: "davetyolla.com/davetiyem/cift-adi",
    values: { free: false, basic: false, pro: true, premium: true },
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
  {
    section: "Yayın & Marka",
    label: "PDF olarak indir",
    description: "Baskı kalitesinde davetiye çıktısı",
    values: { free: false, basic: true, pro: true, premium: true },
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
    // Re-resolve every minute, catches midnight rollover and the window
    // into/out of the monthly flash sale without a page refresh.
    const int = window.setInterval(tick, 60_000);
    return () => window.clearInterval(int);
  }, []);

  return (
    <div
      className="w-full"
      style={{ fontFamily: "Space Grotesk, sans-serif" }}
    >
      {/* Animasyon sınıfları + keyframes, sayfada bir kez tanımlanır. */}
      <TierIconStyles />

      {/* Active-offer note (countdown moved into each tier card so the
          urgency sits next to the price it applies to, not at the top). */}
      <OfferNote offer={offer} />

      {/* Pricing cards row, sticky at top for long feature tables.
          Mobilde 4 kart yan yana sığsın diye grid mobilde
          repeat(4,1fr), desktop'ta label-kolonu + 4 tier. Kartların
          kendileri (TierHeader) responsive olarak iç boşluk/font
          küçültür, böylece dar ekranda da overflow olmaz. */}
      <div className="sticky top-20 z-20 bg-background/95 backdrop-blur-md -mx-4 md:-mx-8 px-2 md:px-8 py-2 md:py-3 border-b border-border">
        <div className="grid grid-cols-4 md:grid-cols-[minmax(140px,1.2fr)_repeat(4,1fr)] gap-1.5 md:gap-3 items-stretch">
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

  // Mobilde kompakt ikon + isim + fiyat + buton; desktop'ta zengin
  // (badge slot, countdown, tagline, reklam uyarı kutusu, full CTA).
  const mobileCta =
    tier.id === "free" ? "Başla" : tier.id === "premium" ? "Al" : "Seç";

  return (
    <div
      className={`relative rounded-xl md:rounded-2xl border p-1.5 md:p-4 flex flex-col items-center text-center transition-all h-full ${
        tier.highlight
          ? "bg-foreground text-background border-foreground shadow-lg"
          : "bg-white border-border"
      }`}
    >
      {/* Top badge: mobilde absolute mini, desktop'ta sabit slot */}
      {tier.highlight ? (
        <>
          <div className="md:hidden absolute -top-1.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-0.5 px-1.5 py-0 rounded-full text-[7px] font-bold uppercase tracking-wider bg-foreground text-background border border-background/30 whitespace-nowrap">
            <Star className="size-2 fill-current" /> Popüler
          </div>
          <div className="hidden md:flex h-5 mb-1 items-center justify-center">
            <div className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest">
              <Star className="size-3 fill-current" /> En Popüler
            </div>
          </div>
        </>
      ) : (
        <div className="hidden md:block h-5 mb-1" aria-hidden />
      )}

      {/* Tier ikonu, mobilde minik */}
      <div className={`relative ${tier.highlight ? "mt-1.5 md:mt-0" : ""} mb-1 md:mb-2`}>
        <div
          className={`size-7 md:size-12 inline-flex items-center justify-center rounded-md md:rounded-xl border ${
            tier.highlight
              ? "border-background/30 text-background"
              : "border-border text-foreground"
          }`}
        >
          {tier.id === "free" ? (
            <SparkleIcon className="size-4 md:size-7" />
          ) : tier.id === "basic" ? (
            <DrawStarIcon className="size-4 md:size-7" />
          ) : tier.id === "pro" ? (
            <ZapIcon className="size-4 md:size-7" />
          ) : (
            <CrownIcon className="size-4 md:size-7" />
          )}
        </div>
        {/* "Seç" pill yalnızca desktop'ta, mobilde alt CTA buton zaten var */}
        <a
          href={tier.ctaHref}
          aria-label={`${tier.name} paketini seç`}
          className={`hidden md:inline-flex absolute -bottom-2 -right-3 items-center justify-center rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.15em] shadow-sm transition-colors cursor-pointer ${
            tier.highlight
              ? "bg-background text-foreground hover:bg-background/90"
              : "bg-foreground text-background hover:bg-foreground/90"
          }`}
        >
          Seç
        </a>
      </div>

      {percent > 0 && !isFree ? (
        <div className="absolute -top-1 -right-1 md:-top-2 md:right-3 md:left-auto inline-flex items-center gap-0.5 md:gap-1 px-1 md:px-2 py-0 md:py-0.5 rounded-full text-[8px] md:text-[10px] font-semibold bg-rose-500 text-white shadow">
          <Flame className="size-2 md:size-3" /> %{percent}
        </div>
      ) : null}

      {/* Countdown: mobilde gizli (yer kaplamasın, OfferNote zaten üst
          kampanya etiketini gösteriyor), desktop'ta sabit slot */}
      <div className="hidden md:flex h-6 mb-1 items-center justify-center">
        {percent > 0 && !isFree && offer ? (
          <Countdown
            targetIso={offer.endsAtIso}
            variant={tier.highlight ? "light" : "dark"}
            compact
          />
        ) : null}
      </div>

      <div
        className={`text-[10px] md:text-base font-semibold leading-tight ${
          tier.highlight ? "" : "text-foreground"
        }`}
      >
        {tier.name}
      </div>

      {/* Fiyat: mobilde tek satır mini, desktop'ta full + min-h */}
      <div className="mt-0.5 md:mt-1 leading-none md:min-h-[3rem] flex items-center justify-center">
        {isFree ? (
          <span className="text-xs md:text-2xl font-bold tabular-nums">
            Ücretsiz
          </span>
        ) : percent > 0 ? (
          <div className="flex flex-col items-center gap-0">
            <span
              className={`hidden md:inline text-[11px] md:text-xs tabular-nums line-through ${
                tier.highlight ? "opacity-60" : "text-muted-foreground"
              }`}
            >
              {tier.basePrice.toLocaleString("tr-TR")}₺
            </span>
            <span className="text-xs md:text-2xl font-bold tabular-nums">
              {discounted.toLocaleString("tr-TR")}₺
            </span>
          </div>
        ) : (
          <span className="text-xs md:text-2xl font-bold tabular-nums">
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

      {/* Reklam uyarısı + CTA. Mobilde tek satır mini etiket, desktop'ta
          tam metin amber kutu. CTA mobilde "Seç/Başla/Al" gibi 1 kelime,
          desktop'ta tam başlıklı. */}
      <div className="mt-auto pt-1 md:pt-3 w-full flex flex-col items-stretch gap-1 md:gap-2">
        {isFree ? (
          <>
            <div className="md:hidden text-[7.5px] text-amber-700 font-medium leading-tight">
              ⚠️ Reklamlı
            </div>
            <div
              className="hidden md:flex items-center gap-1.5 rounded-md bg-amber-100 border border-amber-300 text-amber-900 px-2 py-1.5 text-[10px] md:text-[11px] leading-snug font-medium text-left"
              role="note"
            >
              <span className="text-base leading-none">⚠️</span>
              <span>Davetiyende DavetYolla reklamı görünür.</span>
            </div>
          </>
        ) : null}

        <a
          href={tier.ctaHref}
          className={`w-full px-1.5 md:px-3 py-1 md:py-1.5 rounded-full text-[9px] md:text-xs font-medium leading-tight transition-colors ${
            tier.highlight
              ? "bg-background text-foreground hover:bg-background/90"
              : "bg-foreground text-background hover:bg-foreground/90"
          }`}
        >
          <span className="md:hidden">{mobileCta}</span>
          <span className="hidden md:inline">{tier.cta}</span>
        </a>
      </div>
    </div>
  );
}

/* ─── Offer note (no countdown, countdown lives in tier cards) ───────── */
function OfferNote({ offer }: { offer: ActiveOffer | null }) {
  if (!offer) {
    return <div className="h-2" aria-hidden />;
  }
  // Subtle one-line note when an offer is active. The actionable
  // urgency (countdown timer) is rendered inside each affected tier
  // card by `Countdown` so the user sees it right next to the price.
  return (
    <div className="mb-4 text-center">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-300 bg-rose-50 text-rose-700 px-3 py-1 text-[11px] font-medium">
        <Flame className="size-3" />
        {offer.label}
        {offer.sublabel ? (
          <span className="opacity-80">· {offer.sublabel}</span>
        ) : null}
      </span>
    </div>
  );
}

function Countdown({
  targetIso,
  variant = "dark",
  compact = false,
}: {
  targetIso: string;
  /** "dark" = bg-black/20 (white card); "light" = bg-white/20 (highlighted dark card). */
  variant?: "dark" | "light";
  /** Tighter padding/typography for use inside small tier cards. */
  compact?: boolean;
}) {
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
  const bg = variant === "light" ? "bg-white/15" : "bg-rose-500/10";
  const fg = variant === "light" ? "text-current" : "text-rose-700";
  return (
    <div
      className={`mt-2 inline-flex items-center gap-1.5 rounded-full ${bg} ${fg} ${
        compact ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
      } font-semibold tabular-nums`}
    >
      <span className="opacity-70 uppercase tracking-widest text-[9px]">
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
