"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { QRCodeCanvas } from "qrcode.react";
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  ExternalLink,
  Flame,
  Heart,
  Mail,
  MessageCircle,
  Minus,
  Pencil,
  Send,
  Share2,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import {
  applyOffer,
  resolveActiveOffer,
  type ActiveOffer,
} from "@/app/components/pricingOffers";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
import { toast } from "sonner";
import { Link, useRouter } from "@/i18n/navigation";

type TierId = "free" | "basic" | "pro" | "premium";

type FeatureValue = true | false | string;

type TierIconComponent = (props: { className?: string }) => React.ReactElement;

interface TierMeta {
  id: TierId;
  name: string;
  basePrice: number;
  tagline: string;
  bestFor: string;
  highlight?: boolean;
  muted?: boolean;
  icon: TierIconComponent;
}

/* ─── Animated tier icons ──────────────────────────────────────────────
   Self-contained inline SVGs whose keyframes live in <TierIconStyles/>.
   All class names are prefixed `ssp-` (SaveScreen Picker) to avoid
   bleeding into the global stylesheet. */

function TierIconStyles() {
  return (
    <style>{`
      @keyframes ssp-spk-pulse { 0%,100% { transform: scale(0.92); } 50% { transform: scale(1.08); } }
      @keyframes ssp-spk-blink { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }
      @keyframes ssp-star-bob   { 0%,100% { transform: rotate(-3deg) scale(0.96); } 50% { transform: rotate(3deg) scale(1.05); } }
      @keyframes ssp-zap-flash  { 0%,42%,100% { opacity: 1; } 48% { opacity: 0.45; } 56% { opacity: 1; } 62% { opacity: 0.55; } 70% { opacity: 1; } }
      @keyframes ssp-zap-spark  { 0%,100% { opacity: 0; transform: scale(0.4); } 35%,55% { opacity: 1; transform: scale(1); } }
      @keyframes ssp-crown-bob  { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-1px); } }
      @keyframes ssp-gem-twinkle{ 0%,100% { opacity: 0.15; transform: scale(0.5); } 50% { opacity: 1; transform: scale(1.1); } }

      .ssp-spk-main { transform-box: fill-box; transform-origin: center; animation: ssp-spk-pulse 2.4s ease-in-out infinite; }
      .ssp-spk-tl   { animation: ssp-spk-blink 1.8s ease-in-out 0.2s infinite; }
      .ssp-spk-br   { animation: ssp-spk-blink 1.8s ease-in-out 0.9s infinite; }

      .ssp-star-body { transform-box: fill-box; transform-origin: center; animation: ssp-star-bob 3.6s ease-in-out infinite; }

      .ssp-zap-bolt { transform-box: fill-box; transform-origin: center; animation: ssp-zap-flash 2.6s ease-in-out infinite; }
      .ssp-zap-sp1, .ssp-zap-sp2, .ssp-zap-sp3 { transform-box: fill-box; transform-origin: center; }
      .ssp-zap-sp1  { animation: ssp-zap-spark 1.8s ease-in-out 0s infinite; }
      .ssp-zap-sp2  { animation: ssp-zap-spark 1.8s ease-in-out 0.6s infinite; }
      .ssp-zap-sp3  { animation: ssp-zap-spark 1.8s ease-in-out 1.2s infinite; }

      .ssp-crown-body { transform-box: fill-box; transform-origin: center; animation: ssp-crown-bob 2.4s ease-in-out infinite; }
      .ssp-gem-1, .ssp-gem-2, .ssp-gem-3 { transform-box: fill-box; transform-origin: center; }
      .ssp-gem-1    { animation: ssp-gem-twinkle 2.4s ease-in-out 0s infinite; }
      .ssp-gem-2    { animation: ssp-gem-twinkle 2.4s ease-in-out 0.8s infinite; }
      .ssp-gem-3    { animation: ssp-gem-twinkle 2.4s ease-in-out 1.6s infinite; }

      @media (prefers-reduced-motion: reduce) {
        .ssp-spk-main, .ssp-spk-tl, .ssp-spk-br,
        .ssp-star-body,
        .ssp-zap-bolt, .ssp-zap-sp1, .ssp-zap-sp2, .ssp-zap-sp3,
        .ssp-crown-body, .ssp-gem-1, .ssp-gem-2, .ssp-gem-3 {
          animation: none;
        }
      }
    `}</style>
  );
}

function AnimatedSparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path
        className="ssp-spk-main"
        d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
      />
      <g className="ssp-spk-tl">
        <path d="M20 3v4" />
        <path d="M22 5h-4" />
      </g>
      <g className="ssp-spk-br">
        <path d="M4 17v2" />
        <path d="M5 18H3" />
      </g>
    </svg>
  );
}

function AnimatedStarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path
        className="ssp-star-body"
        d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755A2.122 2.122 0 0 0 9.213 6.974z"
      />
    </svg>
  );
}

function AnimatedZapIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path
        className="ssp-zap-bolt"
        d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
      />
      <circle className="ssp-zap-sp1" cx="20.5" cy="4" r="0.8" fill="currentColor" stroke="none" />
      <circle className="ssp-zap-sp2" cx="3" cy="20" r="0.7" fill="currentColor" stroke="none" />
      <circle className="ssp-zap-sp3" cx="21" cy="21" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function AnimatedCrownIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <g className="ssp-crown-body">
        <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.518L7.09 9.165a1 1 0 0 0 1.517-.294z" />
        <path d="M5 21h14" />
      </g>
      <circle className="ssp-gem-1" cx="12" cy="3.6" r="0.9" fill="currentColor" stroke="none" />
      <circle className="ssp-gem-2" cx="3" cy="6" r="0.7" fill="currentColor" stroke="none" />
      <circle className="ssp-gem-3" cx="21" cy="6" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

const TIERS: TierMeta[] = [
  {
    id: "free",
    name: "Başlangıç",
    basePrice: 0,
    tagline: "Önce dene, sonra karar ver.",
    bestFor: "Hızlıca paylaşmak isteyenler için",
    icon: AnimatedSparkleIcon,
    muted: true,
  },
  {
    id: "basic",
    name: "Klasik",
    basePrice: 2000,
    tagline: "Kendi fotoğrafların, kendi renklerin.",
    bestFor: "Kişisel dokunuş arayanlar için",
    icon: AnimatedStarIcon,
  },
  {
    id: "pro",
    name: "Profesyonel",
    basePrice: 3500,
    tagline: "Tüm özellikler açık, sınırsız özgürlük.",
    bestFor: "Misafirleriyle etkileşim kuranlar için",
    highlight: true,
    icon: AnimatedZapIcon,
  },
  {
    id: "premium",
    name: "Premium",
    basePrice: 12500,
    tagline: "Markalaşmış davetiye deneyimi.",
    bestFor: "Profesyonel görünüm isteyenler için",
    icon: AnimatedCrownIcon,
  },
];

interface TierFeatureRow {
  label: string;
  values: Record<TierId, FeatureValue>;
}

interface TierFeatureGroup {
  section: string;
  items: TierFeatureRow[];
}

const TIER_FEATURE_GROUPS: TierFeatureGroup[] = [
  {
    section: "Tasarım",
    items: [
      {
        label: "Hazır şablonlar",
        values: {
          free: "5 şablon",
          basic: "Tümü",
          pro: "Tümü",
          premium: "Tümü + VIP",
        },
      },
      {
        label: "Kendi fotoğraf & video",
        values: { free: false, basic: true, pro: true, premium: true },
      },
      {
        label: "Renk, font & tema",
        values: {
          free: "Kısıtlı",
          basic: true,
          pro: true,
          premium: true,
        },
      },
      {
        label: "Özel bloklar (program, aile ağacı)",
        values: { free: false, basic: true, pro: true, premium: true },
      },
      {
        label: "Arkaplan müziği",
        values: {
          free: false,
          basic: "1 hazır şarkı",
          pro: true,
          premium: true,
        },
      },
    ],
  },
  {
    section: "Misafir Etkileşimi",
    items: [
      {
        label: "Whatsapp & SMS paylaşımı",
        values: { free: true, basic: true, pro: true, premium: true },
      },
      {
        label: "RSVP formu (katılım yanıtı)",
        values: { free: false, basic: false, pro: true, premium: true },
      },
      {
        label: "Anı defteri",
        values: { free: false, basic: false, pro: true, premium: true },
      },
      {
        label: "Foto galeri",
        values: {
          free: false,
          basic: "Sadece görüntüleme",
          pro: true,
          premium: true,
        },
      },
      {
        label: "Misafir takip paneli",
        values: { free: false, basic: false, pro: true, premium: true },
      },
    ],
  },
  {
    section: "Yayın & Marka",
    items: [
      {
        label: "davetyolla.com altında link",
        values: { free: true, basic: true, pro: true, premium: true },
      },
      {
        label: "Özel kısa link (davetyolla.com/isim)",
        values: { free: false, basic: true, pro: true, premium: true },
      },
      {
        label: "Reklam & watermark yok",
        values: { free: false, basic: true, pro: true, premium: true },
      },
      {
        label: "Çok sayfalı özel web sitesi",
        values: { free: false, basic: false, pro: false, premium: true },
      },
      {
        label: "Kendi alan adı (özel domain)",
        values: { free: false, basic: false, pro: false, premium: true },
      },
    ],
  },
  {
    section: "Destek",
    items: [
      {
        label: "E-posta desteği",
        values: { free: true, basic: true, pro: true, premium: true },
      },
      {
        label: "Whatsapp öncelikli destek",
        values: { free: false, basic: true, pro: true, premium: true },
      },
      {
        label: "1-1 tasarım danışmanlığı",
        values: { free: false, basic: false, pro: false, premium: true },
      },
    ],
  },
];

function formatTry(amount: number): string {
  return `${amount.toLocaleString("tr-TR")}₺`;
}

interface SaveScreenProps {
  designId: string;
  slug: string;
  vanityPath: string | null;
  status: "draft" | "published";
  tier: TierId | null;
}

export function SaveScreen({
  designId,
  slug,
  vanityPath: initialVanity,
  status: initialStatus,
  tier: initialTier,
}: SaveScreenProps) {
  const t = useTranslations("Publish");
  const router = useRouter();

  const [vanity, setVanity] = useState(initialVanity ?? "");
  const [savedVanity, setSavedVanity] = useState(initialVanity ?? "");
  const [status, setStatus] = useState(initialStatus);
  const [publishing, setPublishing] = useState(false);
  const [savingVanity, setSavingVanity] = useState(false);
  const [step, setStep] = useState<"intro" | "tier">("intro");
  const [selectedTier, setSelectedTier] = useState<TierId | null>(initialTier);
  const [activeTier, setActiveTier] = useState<TierId | null>(initialTier);

  const davetiyeBase =
    process.env.NEXT_PUBLIC_DAVETIYE_URL ?? "https://davetyolla.com";
  const publicPath = savedVanity || slug;
  const shareUrl = `${davetiyeBase}/i/${publicPath}`;

  const isPublished = status === "published";

  const shareMessage = useMemo(
    () =>
      `Düğünümüze davetlisin! Davetiyemizi buradan inceleyebilirsin: ${shareUrl}`,
    [shareUrl],
  );

  async function handlePublish(tierId: TierId) {
    setPublishing(true);
    const res = await fetch(`/api/design/invitations/${designId}/publish`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        vanityPath: savedVanity || undefined,
        tier: tierId,
      }),
    });
    setPublishing(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error ?? "Yayınlanamadı");
      return;
    }
    setStatus("published");
    setActiveTier(tierId);
    toast.success(t("title"));
  }

  async function copy(text: string, label = t("copy")) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(label);
    } catch {
      toast.error("Kopyalanamadı");
    }
  }

  async function saveVanity() {
    setSavingVanity(true);
    const res = await fetch(`/api/design/invitations/${designId}/slug`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ vanityPath: vanity }),
    });
    setSavingVanity(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error ?? "Özel link ayarlanamadı");
      return;
    }
    setSavedVanity(vanity);
    toast.success("Özel link güncellendi");
  }

  function downloadQR() {
    const canvas = document.querySelector<HTMLCanvasElement>(
      "#share-qr canvas",
    );
    if (!canvas) {
      toast.error("QR oluşturulamadı");
      return;
    }
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `davetiye-${publicPath}-qr.png`;
    a.click();
  }

  async function nativeShare() {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({
          title: "Düğün Davetiyesi",
          text: shareMessage,
          url: shareUrl,
        });
      } catch {
        // user cancelled
      }
    } else {
      copy(shareUrl, "Bağlantı kopyalandı");
    }
  }

  const activeTierMeta = activeTier
    ? TIERS.find((tier) => tier.id === activeTier) ?? null
    : null;

  return (
    <main className="min-h-dvh bg-[#f5f6f3]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <button
          onClick={() => router.push(`/design/invitations/${designId}/editor`)}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <ArrowLeft className="size-4" /> Düzenlemeye dön
        </button>

        {!isPublished && step === "tier" ? (
          <TierPicker
            selectedTier={selectedTier}
            onSelect={setSelectedTier}
            onCancel={() => setStep("intro")}
            onConfirm={() => selectedTier && handlePublish(selectedTier)}
            publishing={publishing}
          />
        ) : (
          <Hero
            isPublished={isPublished}
            publishing={publishing}
            tier={activeTierMeta}
            onPublish={() => setStep("tier")}
          />
        )}

        {isPublished ? (
          <>
            <div className="grid lg:grid-cols-5 gap-4 mb-6">
              <ShareCard
                shareUrl={shareUrl}
                onCopy={() => copy(shareUrl, "Bağlantı kopyalandı")}
                onDownloadQR={downloadQR}
              />
              <QuickShareCard
                shareUrl={shareUrl}
                shareMessage={shareMessage}
                onNativeShare={nativeShare}
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-4 mb-6">
              <VanityCard
                davetiyeBase={davetiyeBase}
                slug={slug}
                vanity={vanity}
                onChange={setVanity}
                savedVanity={savedVanity}
                onSave={saveVanity}
                saving={savingVanity}
              />
              <NextStepsCard designId={designId} shareUrl={shareUrl} />
            </div>
          </>
        ) : step === "intro" ? (
          <DraftHint />
        ) : null}
      </div>

      {/* Hidden canvas QR used for PNG download — we render a parallel
          canvas so the visible QR can stay SVG-crisp for display. */}
      <div id="share-qr" className="hidden">
        <QRCodeCanvas value={shareUrl} size={512} includeMargin />
      </div>
    </main>
  );
}

function Hero({
  isPublished,
  publishing,
  tier,
  onPublish,
}: {
  isPublished: boolean;
  publishing: boolean;
  tier: TierMeta | null;
  onPublish: () => void;
}) {
  return (
    <section className="rounded-[1.75rem] border border-border/60 bg-white p-8 sm:p-12 mb-6 text-center">
      <div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full text-[10px] uppercase tracking-[0.28em] px-3 py-1 font-medium font-mono border ${
            isPublished
              ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30"
              : "bg-amber-500/10 text-amber-700 border-amber-500/30"
          }`}
        >
          {isPublished ? (
            <>
              <Sparkles className="size-3" /> Yayında
            </>
          ) : (
            "Taslak"
          )}
        </span>
        <h1 className="font-display text-3xl sm:text-5xl mt-5 leading-tight">
          {isPublished
            ? "Tebrikler, davetiyen yayında!"
            : "Davetiyeni yayınla"}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-3 max-w-xl mx-auto leading-relaxed">
          {isPublished
            ? "Aşağıdaki paylaşım araçlarıyla misafirlerine davetiyeni iletebilir, RSVP'leri panelden takip edebilirsin."
            : "Yayınladığında benzersiz bir paylaşım bağlantısı, QR kod ve hızlı paylaşım araçların hazır olacak. Önce paketini seç, sonra yayına geç."}
        </p>

        {!isPublished ? (
          <button
            onClick={onPublish}
            disabled={publishing}
            className="mt-7 group inline-flex items-center gap-2 rounded-full bg-foreground text-background px-7 py-3.5 font-mono uppercase tracking-[0.22em] text-xs disabled:opacity-50 cursor-pointer hover:bg-foreground/90 transition-all shadow-[0_12px_30px_-12px_rgba(37,34,36,0.55)]"
          >
            <Sparkles className="size-3.5 group-hover:rotate-12 transition-transform" />
            Şimdi Yayınla
          </button>
        ) : tier ? (
          <ActiveTierBadge tier={tier} />
        ) : null}
      </div>
    </section>
  );
}

function ActiveTierBadge({ tier }: { tier: TierMeta }) {
  const Icon = tier.icon;
  return (
    <div className="mt-7 inline-flex flex-col sm:flex-row items-center gap-3 rounded-2xl border border-border/70 bg-white/70 backdrop-blur px-4 py-3 shadow-sm">
      <div className="flex items-center gap-2.5">
        <span className="size-9 rounded-full bg-foreground text-background inline-flex items-center justify-center">
          <Icon className="size-4" />
        </span>
        <div className="text-left">
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-mono">
            Aktif Paket
          </div>
          <div className="text-sm font-semibold text-foreground">
            {tier.name}{" "}
            <span className="text-muted-foreground font-normal tabular-nums">
              · {tier.basePrice === 0 ? "Ücretsiz" : formatTry(tier.basePrice)}
            </span>
          </div>
        </div>
      </div>
      <span className="hidden sm:inline-block h-8 w-px bg-border/70" />
      <p className="text-[11px] text-muted-foreground sm:max-w-[220px] text-left">
        {tier.tagline}
      </p>
    </div>
  );
}

function TierPicker({
  selectedTier,
  onSelect,
  onCancel,
  onConfirm,
  publishing,
}: {
  selectedTier: TierId | null;
  onSelect: (id: TierId) => void;
  onCancel: () => void;
  onConfirm: () => void;
  publishing: boolean;
}) {
  // Resolve offer client-side only — same pattern as PricingTable to avoid
  // SSR/timezone drift, with a 60s tick so the banner updates on rollover.
  const [offer, setOffer] = useState<ActiveOffer | null>(null);
  useEffect(() => {
    const tick = () => setOffer(resolveActiveOffer(new Date()));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="rounded-[1.75rem] border border-border/60 bg-white p-6 sm:p-9 mb-6">
      <TierIconStyles />
      <div>
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full text-[10px] uppercase tracking-[0.28em] px-3 py-1 font-medium font-mono border bg-amber-500/10 text-amber-700 border-amber-500/30">
            Adım 2 / 2
          </span>
          <h2 className="font-display text-2xl sm:text-4xl mt-4 leading-tight">
            Paketini seç
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto">
            Davetiyenin hangi özelliklerle yayınlanacağını belirle. Sonra
            istediğin zaman üst pakete geçebilirsin.
          </p>
        </div>

        <OfferBanner offer={offer} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
          {TIERS.map((tier) => (
            <TierCard
              key={tier.id}
              tier={tier}
              offer={offer}
              selected={selectedTier === tier.id}
              onSelect={() => onSelect(tier.id)}
            />
          ))}
        </div>

        <p className="mt-5 text-[11px] text-muted-foreground text-center">
          Fiyatlar Türk Lirası cinsinden, tek seferlik etkinlik ödemesidir, KDV
          dahildir. İstediğin zaman üst pakete geçebilirsin.
        </p>

        <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onCancel}
            disabled={publishing}
            className="text-sm text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-50"
          >
            ← Geri dön
          </button>
          <button
            onClick={onConfirm}
            disabled={!selectedTier || publishing}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-7 py-3.5 font-mono uppercase tracking-[0.22em] text-xs disabled:opacity-40 cursor-pointer hover:bg-foreground/90 transition-colors"
          >
            <Sparkles className="size-3.5" />
            {publishing
              ? "Yayınlanıyor..."
              : selectedTier
                ? "Bu Paketle Yayınla"
                : "Paket seç"}
          </button>
        </div>
      </div>
    </section>
  );
}

function TierCard({
  tier,
  offer,
  selected,
  onSelect,
}: {
  tier: TierMeta;
  offer: ActiveOffer | null;
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = tier.icon;
  const isFree = tier.basePrice === 0;
  const percent = offer?.percent ?? 0;
  const discounted =
    percent > 0 ? applyOffer(tier.basePrice, percent) : tier.basePrice;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative h-full text-left rounded-2xl border p-4 flex flex-col transition-colors cursor-pointer ${
        tier.muted ? "bg-muted/30" : "bg-white"
      } ${
        selected
          ? "border-foreground"
          : tier.muted
            ? "border-border/60 hover:border-foreground/30"
            : "border-border hover:border-foreground/40"
      }`}
    >
      {tier.highlight ? (
        <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-foreground text-background px-2 py-0.5 text-[9px] uppercase tracking-[0.18em] font-mono">
          <Star className="size-2.5 fill-current" /> Popüler
        </div>
      ) : null}

      {percent > 0 && !isFree ? (
        <div className="absolute -top-2 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500 text-white shadow">
          <Flame className="size-3" /> %{percent}
        </div>
      ) : null}

      {/* Header — fixed-height block so every card's "between" area lines up */}
      <div className="flex flex-col">
        <span
          className={`inline-flex size-10 items-center justify-center rounded-xl border ${
            selected
              ? "bg-foreground text-background border-foreground"
              : tier.muted
                ? "bg-white text-muted-foreground border-border"
                : "bg-muted/50 text-foreground border-border"
          }`}
        >
          <Icon className="size-4" />
        </span>

        <div
          className={`mt-3 font-display text-lg leading-tight h-7 ${
            tier.muted ? "text-foreground/70" : ""
          }`}
        >
          {tier.name}
        </div>

        {/* Reserved 2-line price slot — keeps tagline / bestFor / features
            at identical y-coords across cards regardless of discount. */}
        <div className="mt-1 h-[3.25rem] flex flex-col justify-end leading-none">
          {isFree ? (
            <>
              <span className="text-[11px] tabular-nums text-transparent">
                .
              </span>
              <span
                className={`text-2xl font-semibold tabular-nums ${
                  tier.muted ? "text-foreground/80" : ""
                }`}
              >
                Ücretsiz
              </span>
            </>
          ) : (
            <>
              <span
                className={`text-[11px] tabular-nums ${
                  percent > 0
                    ? "text-muted-foreground line-through"
                    : "text-transparent"
                }`}
              >
                {formatTry(tier.basePrice)}
              </span>
              <span className="text-2xl font-bold tabular-nums">
                {formatTry(percent > 0 ? discounted : tier.basePrice)}
              </span>
            </>
          )}
        </div>

        <p className="text-[11px] text-muted-foreground mt-2 min-h-[2rem] leading-snug">
          {tier.tagline}
        </p>

        <div className="mt-2 inline-flex items-center self-start gap-1.5 rounded-md bg-foreground/5 text-foreground/80 px-2 py-1 text-[10px] uppercase tracking-[0.15em] font-mono min-h-[1.75rem]">
          {tier.bestFor}
        </div>
      </div>

      {/* Feature matrix — same rows in same order in every card. */}
      <div className="mt-4 flex-1 flex flex-col gap-3">
        {TIER_FEATURE_GROUPS.map((group) => (
          <div key={group.section}>
            <div
              className={`text-[10px] uppercase tracking-[0.2em] font-mono mb-1.5 ${
                tier.muted ? "text-muted-foreground/70" : "text-muted-foreground"
              }`}
            >
              {group.section}
            </div>
            <ul className="space-y-1">
              {group.items.map((row) => (
                <FeatureRow
                  key={row.label}
                  label={row.label}
                  value={row.values[tier.id]}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        className={`mt-5 inline-flex w-full items-center justify-center rounded-full px-3 py-2 text-[11px] uppercase tracking-[0.2em] font-mono transition-colors ${
          selected
            ? "bg-foreground text-background"
            : tier.muted
              ? "bg-white border border-border text-foreground/70"
              : "bg-muted/60 text-foreground"
        }`}
      >
        {selected ? (
          <>
            <Check className="size-3 mr-1.5" /> Seçildi
          </>
        ) : (
          "Seç"
        )}
      </div>
    </button>
  );
}

function FeatureRow({
  label,
  value,
}: {
  label: string;
  value: FeatureValue;
}) {
  const isOff = value === false;
  return (
    <li
      className={`text-[12px] min-h-[1.75rem] flex items-start gap-1.5 ${
        isOff ? "text-muted-foreground/70" : "text-foreground/85"
      }`}
    >
      {isOff ? (
        <Minus className="size-3.5 mt-0.5 text-muted-foreground/50 shrink-0" />
      ) : (
        <Check className="size-3.5 mt-0.5 text-emerald-600 shrink-0" />
      )}
      <span className={isOff ? "line-through" : ""}>
        {label}
        {typeof value === "string" ? (
          <span className="block text-[10px] text-muted-foreground/80 leading-tight">
            {value}
          </span>
        ) : null}
      </span>
    </li>
  );
}

function OfferBanner({ offer }: { offer: ActiveOffer | null }) {
  if (!offer) {
    return <div className="h-10" aria-hidden />;
  }
  if (offer.percent <= 0) {
    return (
      <div className="rounded-full border border-border bg-white px-4 py-2 text-center text-xs text-muted-foreground">
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
      className={`rounded-2xl px-4 md:px-5 py-3 md:py-3.5 flex items-center gap-3 flex-wrap ${
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
    null,
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
  const pad = (n: number) => n.toString().padStart(2, "0");
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

function DraftHint() {
  return (
    <section className="rounded-2xl border border-dashed border-border/70 bg-white/40 p-6 text-center text-sm text-muted-foreground">
      Davetiyeni yayınladıktan sonra paylaşım araçların burada görünecek.
    </section>
  );
}

function ShareCard({
  shareUrl,
  onCopy,
  onDownloadQR,
}: {
  shareUrl: string;
  onCopy: () => void;
  onDownloadQR: () => void;
}) {
  return (
    <article className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 flex flex-col items-center text-center">
      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-4 font-mono">
        QR Kod
      </div>
      <div className="rounded-xl border border-border bg-white p-3 shadow-sm">
        <QRCodeCanvas value={shareUrl} size={180} includeMargin={false} />
      </div>
      <p className="mt-4 text-xs text-muted-foreground max-w-[220px]">
        Misafirler kameralarıyla okutarak davetiyeye anında ulaşır.
      </p>
      <div className="mt-4 w-full flex items-center gap-2">
        <code
          className="flex-1 truncate text-xs bg-muted rounded-full px-3 py-2 text-left"
          title={shareUrl}
        >
          {shareUrl.replace(/^https?:\/\//, "")}
        </code>
        <button
          onClick={onCopy}
          className="rounded-full border border-border size-9 inline-flex items-center justify-center hover:bg-muted cursor-pointer"
          title="Bağlantıyı kopyala"
        >
          <Copy className="size-3.5" />
        </button>
      </div>
      <button
        onClick={onDownloadQR}
        className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs hover:bg-muted cursor-pointer transition-colors"
      >
        <Download className="size-3.5" /> QR&apos;ı PNG indir
      </button>
    </article>
  );
}

function QuickShareCard({
  shareUrl,
  shareMessage,
  onNativeShare,
}: {
  shareUrl: string;
  shareMessage: string;
  onNativeShare: () => void;
}) {
  const encMsg = encodeURIComponent(shareMessage);
  const encUrl = encodeURIComponent(shareUrl);
  const channels: Array<{
    label: string;
    href?: string;
    onClick?: () => void;
    icon: typeof Send;
    accent: string;
  }> = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encMsg}`,
      icon: MessageCircle,
      accent: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    },
    {
      label: "E-posta",
      href: `mailto:?subject=${encodeURIComponent("Düğün Davetiyesi")}&body=${encMsg}`,
      icon: Mail,
      accent: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    },
    {
      label: "Telegram",
      href: `https://t.me/share/url?url=${encUrl}&text=${encMsg}`,
      icon: Send,
      accent: "bg-sky-500/10 text-sky-700 border-sky-500/20",
    },
    {
      label: "X / Twitter",
      href: `https://twitter.com/intent/tweet?text=${encMsg}`,
      icon: XIcon,
      accent: "bg-foreground/5 text-foreground border-foreground/15",
    },
    {
      label: "SMS",
      href: `sms:?body=${encMsg}`,
      icon: MessageCircle,
      accent: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    },
    {
      label: "Cihazda Paylaş",
      onClick: onNativeShare,
      icon: Share2,
      accent: "bg-violet-500/10 text-violet-700 border-violet-500/20",
    },
  ];

  return (
    <article className="lg:col-span-3 rounded-2xl border border-border bg-card p-6">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-mono">
            Hızlı Paylaşım
          </div>
          <h3 className="font-display text-lg mt-1">Davetiyeyi Gönder</h3>
        </div>
        <a
          href={shareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border hover:bg-muted cursor-pointer"
        >
          <ExternalLink className="size-3" /> Davetiyeyi Aç
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {channels.map((c) =>
          c.href ? (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium hover:opacity-90 transition-opacity ${c.accent}`}
            >
              <c.icon className="size-4" /> {c.label}
            </a>
          ) : (
            <button
              key={c.label}
              onClick={c.onClick}
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer ${c.accent}`}
            >
              <c.icon className="size-4" /> {c.label}
            </button>
          ),
        )}
      </div>

      <div className="mt-5 rounded-lg bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Önerilen mesaj:</span>{" "}
        {shareMessage}
      </div>
    </article>
  );
}

function VanityCard({
  davetiyeBase,
  slug,
  vanity,
  onChange,
  savedVanity,
  onSave,
  saving,
}: {
  davetiyeBase: string;
  slug: string;
  vanity: string;
  onChange: (v: string) => void;
  savedVanity: string;
  onSave: () => void;
  saving: boolean;
}) {
  const cleanBase = davetiyeBase.replace(/^https?:\/\//, "");
  const dirty = vanity !== savedVanity;
  const valid = /^[a-z0-9-]{0,40}$/.test(vanity);
  const previewSlug = vanity || slug;

  return (
    <article className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-start justify-between gap-3 mb-1">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-mono">
            Özel Link
          </div>
          <h3 className="font-display text-lg mt-1">Daha Akılda Kalıcı Bir Adres</h3>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Çiftin adıyla okunabilir bir link oluştur — sosyal medyada ve
        davetiyelerde profesyonel görünür.
      </p>

      <div className="mt-4 rounded-lg border border-border overflow-hidden flex items-stretch">
        <span className="bg-muted px-3 inline-flex items-center text-xs text-muted-foreground border-r border-border whitespace-nowrap font-mono">
          {cleanBase}/i/
        </span>
        <input
          value={vanity}
          onChange={(e) =>
            onChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
          }
          placeholder="mehmet-ve-zeynep"
          maxLength={40}
          className="flex-1 px-3 py-2.5 text-sm bg-background focus:outline-none"
        />
      </div>
      <div className="mt-2 text-[11px] text-muted-foreground flex items-center justify-between gap-3 flex-wrap">
        <span>
          Önizleme:{" "}
          <span className="font-mono text-foreground">
            {cleanBase}/i/{previewSlug}
          </span>
        </span>
        {!valid ? (
          <span className="text-amber-600">
            Yalnızca küçük harf, rakam ve tire (-) kullanabilirsin.
          </span>
        ) : null}
      </div>

      <button
        onClick={onSave}
        disabled={!dirty || !valid || saving}
        className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground text-xs px-5 py-2.5 font-mono uppercase tracking-[0.15em] disabled:opacity-50 hover:opacity-90 cursor-pointer transition-opacity"
      >
        {saving ? "Kaydediliyor..." : dirty ? "Özel Linki Kaydet" : "Kaydedildi"}
      </button>
    </article>
  );
}

function NextStepsCard({
  designId,
  shareUrl,
}: {
  designId: string;
  shareUrl: string;
}) {
  const items: Array<{
    icon: typeof Users;
    title: string;
    desc: string;
    href: string;
    external?: boolean;
  }> = [
    {
      icon: Users,
      title: "Misafirleri takip et",
      desc: "RSVP yanıtlarını ve katılımcı listeni gör.",
      href: `/dashboard/${designId}/guests`,
    },
    {
      icon: Heart,
      title: "Hatıralara göz at",
      desc: "Misafirlerin bıraktığı mesajları onayla.",
      href: `/dashboard/${designId}/memories`,
    },
    {
      icon: Pencil,
      title: "Düzenlemeye devam et",
      desc: "Yayındaki davetiye üzerinde değişiklik yap.",
      href: `/design/invitations/${designId}/editor`,
    },
    {
      icon: ExternalLink,
      title: "Davetiyeyi misafir gibi gör",
      desc: "Yayındaki halini yeni sekmede aç.",
      href: shareUrl,
      external: true,
    },
  ];

  return (
    <article className="rounded-2xl border border-border bg-card p-6">
      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-mono">
        Sırada Ne Var?
      </div>
      <h3 className="font-display text-lg mt-1 mb-4">Bir Sonraki Adımlar</h3>
      <ul className="flex flex-col gap-2">
        {items.map((it) => {
          const inner = (
            <>
              <span className="size-9 shrink-0 rounded-full bg-primary/10 text-primary inline-flex items-center justify-center">
                <it.icon className="size-4" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-medium">{it.title}</span>
                <span className="block text-[11px] text-muted-foreground">
                  {it.desc}
                </span>
              </span>
              <Check className="size-3.5 text-muted-foreground/40" />
            </>
          );
          return it.external ? (
            <a
              key={it.title}
              href={it.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-border px-3 py-2.5 hover:border-foreground/20 hover:bg-muted/30 transition-colors cursor-pointer"
            >
              {inner}
            </a>
          ) : (
            <Link
              key={it.title}
              href={it.href as never}
              className="flex items-center gap-3 rounded-xl border border-border px-3 py-2.5 hover:border-foreground/20 hover:bg-muted/30 transition-colors cursor-pointer"
            >
              {inner}
            </Link>
          );
        })}
      </ul>
    </article>
  );
}
