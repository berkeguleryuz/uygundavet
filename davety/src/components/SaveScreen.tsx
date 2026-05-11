"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

// qrcode.react ~40KB; route SaveScreen olduğu için zaten izole, ama
// burada da dinamik import ile QR canvas yüklemesi geciktirilir —
// kullanıcı yayınlamadan önce QR'ı görmüyor zaten.
const QRCodeCanvas = dynamic(
  () => import("qrcode.react").then((m) => ({ default: m.QRCodeCanvas })),
  {
    ssr: false,
    loading: () => (
      <div className="bg-muted animate-pulse rounded-md w-full aspect-square" />
    ),
  },
);
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  ExternalLink,
  Flame,
  Heart,
  Lock,
  Minus,
  Pencil,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import {
  applyOffer,
  resolveActiveOffer,
  type ActiveOffer,
} from "@/app/components/pricingOffers";

import { toast } from "sonner";
import { Link, useRouter } from "@/i18n/navigation";
import { planLimitsFor, nextTierLabel } from "@/src/lib/plan-limits";
import {
  TierIconStyles,
  SparkleIcon,
  StarIcon,
  ZapIcon,
  CrownIcon,
} from "@/src/components/tier-icons";
import {
  ShareIconStyles,
  WhatsAppIcon,
  EmailIcon,
  TelegramIcon,
  XBrandIcon,
  SmsIcon,
  NativeShareIcon,
} from "@/src/components/share-icons";

type TierId = "free" | "basic" | "pro" | "premium";

// Paket sıralama hiyerarşisi: yayın sonrası "Paketi Yükselt"
// flow'unda mevcut paketin altındaki seçenekler kilitli olmalı —
// downgrade business kuralı yok, paket bir kez alındıktan sonra
// alt seviyeye düşülemez.
const TIER_RANK: Record<TierId, number> = {
  free: 0,
  basic: 1,
  pro: 2,
  premium: 3,
};

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

/* Tier ikonları + animasyon sınıfları paylaşımlı module'a taşındı. */

const TIERS: TierMeta[] = [
  {
    id: "free",
    name: "Başlangıç",
    basePrice: 0,
    tagline: "Önce dene, sonra karar ver.",
    bestFor: "Hızlıca paylaşmak isteyenler için",
    icon: SparkleIcon,
    muted: true,
  },
  {
    id: "basic",
    name: "Klasik",
    basePrice: 2000,
    tagline: "Kendi fotoğrafların, kendi renklerin.",
    bestFor: "Kişisel dokunuş arayanlar için",
    icon: StarIcon,
  },
  {
    id: "pro",
    name: "Profesyonel",
    basePrice: 3500,
    tagline: "Tüm özellikler açık, sınırsız özgürlük.",
    bestFor: "Misafirleriyle etkileşim kuranlar için",
    highlight: true,
    icon: ZapIcon,
  },
  {
    id: "premium",
    name: "Premium",
    basePrice: 12500,
    tagline: "Markalaşmış davetiye deneyimi.",
    bestFor: "Profesyonel görünüm isteyenler için",
    icon: CrownIcon,
  },
];

interface TierFeatureRow {
  label: string;
  /** Opsiyonel alt-satır açıklama (parantez içi vs.). Label kısa
   *  kalsın diye uzun açıklamalar küçük + mute renkte alt satıra
   *  düşer. value bir string ise (ör: "1 hazır şarkı") onu da bu
   *  alt satıra basıyoruz; ikisi birlikte gösterilebilir. */
  note?: string;
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
          free: "Tümü",
          basic: "Tümü",
          pro: "Tümü",
          premium: "Tümü",
        },
      },
      {
        label: "Kendi fotoğraf & video",
        values: { free: "1 görsel", basic: true, pro: true, premium: true },
      },
      {
        label: "Renk, font & tema",
        values: {
          free: true,
          basic: true,
          pro: true,
          premium: true,
        },
      },
      {
        label: "Özel bloklar",
        note: "program, aile ağacı",
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
        label: "RSVP formu",
        note: "katılım yanıtı",
        values: { free: false, basic: true, pro: true, premium: true },
      },
      {
        label: "Anı defteri",
        values: { free: false, basic: true, pro: true, premium: true },
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
        values: {
          free: false,
          basic: "Sadece sayı",
          pro: true,
          premium: true,
        },
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
        label: "Özel kısa link",
        note: "davetyolla.com/davetiyem/isim",
        values: { free: false, basic: false, pro: true, premium: true },
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
        label: "Kendi alan adı",
        note: "özel domain",
        values: { free: false, basic: false, pro: false, premium: true },
      },
      {
        label: "PDF olarak indir",
        values: { free: false, basic: true, pro: true, premium: true },
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
  /** Çift adı, paylaşım mesajını kişiselleştirmek için. */
  coupleName?: string | null;
  weddingDate?: string | null;
  eventCategory?: string | null;
}

export function SaveScreen({
  designId,
  slug,
  vanityPath: initialVanity,
  status: initialStatus,
  tier: initialTier,
  coupleName,
  weddingDate,
  eventCategory,
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
  // Pending tier the user clicked "Yayınla" with, shows the
  // confirmation/payment modal until they confirm or cancel. Free tier
  // sees a warning about gallery trim + DavetYolla.com banner; paid
  // tiers see the payment placeholder (Stripe wiring comes later).
  const [confirmingTier, setConfirmingTier] = useState<TierId | null>(null);
  // Yayınlanmış davetiyede "Yükselt" butonuna basıldığında TierPicker'ı
  // tekrar göstermek için flag. publish route mevcut tier'ı yenisiyle
  // değiştiriyor, ayrı bir endpoint'e gerek yok.
  const [wantsUpgrade, setWantsUpgrade] = useState(false);

  // Stripe Checkout dönüşü: success_url'de `?paid=cs_...` query var.
  // Webhook büyük ihtimalle çoktan iş yapmıştır ama local dev'te ya da
  // gecikme durumunda buradan POST /api/billing/verify-session çağrısı
  // yedek olarak çalışıyor. paid=ok olunca status'u published'a çekip
  // tier'ı yenile, query'yi temizle, kullanıcıyı intro'ya götür.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const paid = url.searchParams.get("paid");
    const cancel = url.searchParams.get("paid_cancel");
    if (cancel) {
      toast.info("Ödeme iptal edildi.");
      url.searchParams.delete("paid_cancel");
      window.history.replaceState({}, "", url.toString());
      return;
    }
    if (!paid || paid === "{CHECKOUT_SESSION_ID}") return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/billing/verify-session`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ sessionId: paid }),
        });
        if (cancelled) return;
        const data = (await res.json()) as {
          ok?: boolean;
          status?: string;
          tier?: TierId;
        };
        if (data.ok && data.tier) {
          setStatus("published");
          setActiveTier(data.tier);
          setWantsUpgrade(false);
          setStep("intro");
          toast.success("Ödeme alındı, davetiyen yayına çıktı!");
        } else {
          toast.warning("Ödeme henüz onaylanmadı, birkaç saniye sonra tekrar dene.");
        }
      } catch {
        if (cancelled) return;
        toast.error("Ödeme doğrulanamadı.");
      } finally {
        if (!cancelled) {
          url.searchParams.delete("paid");
          window.history.replaceState({}, "", url.toString());
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Tek noktadan "yükseltme akışını başlat" — kart üstündeki Paketi
  // Yükselt butonları (ShareCard, VanityCard, Hero, SaveScreen header)
  // bu callback'i çağırır. wantsUpgrade=true → TierPicker görünür,
  // selectedTier mevcut paketle başlar, ve sayfa picker'a kayar
  // (kullanıcı zaten aşağıdaysa görsün).
  // Birden fazla kart (ShareCard, VanityCard, Hero, header) prop olarak
  // alıyor; useCallback ile stable ref. (rerender-unstable-callbacks)
  const triggerUpgrade = useCallback(() => {
    setWantsUpgrade(true);
    setSelectedTier(activeTier);
    // 2x rAF: React DOM flush + style/layout commit. setTimeout magic
    // sayısı yerine deterministik. (js-nested-timers)
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        document
          .getElementById("tier-picker")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }),
    );
  }, [activeTier]);

  const davetiyeBase =
    process.env.NEXT_PUBLIC_DAVETIYE_URL ?? "https://davetyolla.com";
  const publicPath = savedVanity || slug;
  const shareUrl = `${davetiyeBase}/davetiyem/${publicPath}`;

  const isPublished = status === "published";

  // Paylaşım mesajı çift adı + tarih + etkinlik tipinden oluşturulur.
  // Boş alanlar varsa sade fallback'e düşer. Mesaj hem hızlı paylaşım
  // butonlarına (WhatsApp, mail, vb.) hem native share API'ye girer.
  const shareMessage = useMemo(() => {
    const eventLabel =
      eventCategory === "engagement"
        ? "nişan etkinliğimize"
        : eventCategory === "circumcision"
          ? "sünnet törenimize"
          : eventCategory === "birthday"
            ? "doğum günü kutlamamıza"
            : eventCategory === "business"
              ? "etkinliğimize"
              : "düğünümüze";
    const dateLabel = weddingDate
      ? new Date(weddingDate).toLocaleDateString("tr-TR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : null;
    const intro = coupleName
      ? `${coupleName} olarak ${eventLabel} davetlisin!`
      : `${eventLabel.charAt(0).toUpperCase()}${eventLabel.slice(1)} davetlisin!`;
    const dateLine = dateLabel ? ` ${dateLabel} tarihinde gerçekleşecek.` : "";
    return `${intro}${dateLine} Davetiyeyi inceleyip katılım durumunu paylaşmak için: ${shareUrl}`;
  }, [shareUrl, coupleName, weddingDate, eventCategory]);

  async function handlePublish(tierId: TierId) {
    setPublishing(true);
    // Ücretli tier (basic/pro/premium) ÜST tier'a geçişse Stripe Checkout
    // başlat. Free veya mevcut tier ile yeniden publish'te direkt
    // /api/design/.../publish endpoint'i. Server-side enforcement de
    // var — burada bypass etse de 402 döner.
    // Premium dahil tüm tier'ları kapsayan TIER_RANK map'ini kullan
    // (eskiden "premium" indexOf ile array'de yoktu, premium'dan ileri
    // geçiş yanlış hesaplanıyordu).
    const isUpgrade =
      tierId !== "free" &&
      TIER_RANK[activeTier ?? "free"] < TIER_RANK[tierId];
    if (isUpgrade) {
      const res = await fetch(`/api/billing/checkout`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          designId,
          tier: tierId,
          vanityPath: savedVanity || undefined,
        }),
      });
      setPublishing(false);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast.error(body.error ?? "Ödeme başlatılamadı");
        return;
      }
      const data = (await res.json()) as {
        url?: string;
        freeUpgrade?: boolean;
        tier?: TierId;
      };
      if (data.freeUpgrade && data.tier) {
        // Bedava upgrade — Stripe'a hiç gitmeden publish'lendi.
        setStatus("published");
        setActiveTier(data.tier);
        setWantsUpgrade(false);
        setStep("intro");
        toast.success("Bedava yükseltildi, davetiyen yayında!");
        return;
      }
      if (data.url) {
        // Stripe hosted Checkout — kart girilince success_url'e döner.
        window.location.href = data.url;
        return;
      }
      toast.error("Ödeme bağlantısı alınamadı");
      return;
    }

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
    setWantsUpgrade(false);
    setStep("intro");
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

  // VanityCard prop olarak alıyor; useCallback ile stable ref.
  // (rerender-unstable-callbacks)
  const saveVanity = useCallback(async () => {
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
  }, [designId, vanity]);

  const downloadQR = useCallback(() => {
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
  }, [publicPath]);

  // useCallback şart: bu fonksiyon QuickShareCard'a `onNativeShare` ile
  // geçiyor ve orada `channels` useMemo dep'i. Stable ref olmazsa channels
  // her parent render'da yeniden allocate olur — useMemo amaçsızlaşır.
  // (rerender-unstable-callbacks)
  const nativeShare = useCallback(async () => {
    if (typeof navigator === "undefined") return;
    if ("share" in navigator) {
      try {
        await navigator.share({
          title: "Düğün Davetiyesi",
          text: shareMessage,
          url: shareUrl,
        });
        return;
      } catch {
        // user cancelled or error → fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Bağlantı kopyalandı");
    } catch {
      toast.error("Kopyalanamadı");
    }
  }, [shareMessage, shareUrl]);

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

        {(!isPublished && step === "tier") || wantsUpgrade ? (
          <TierPicker
            selectedTier={selectedTier}
            onSelect={setSelectedTier}
            onCancel={() => {
              setStep("intro");
              setWantsUpgrade(false);
            }}
            onConfirm={() => selectedTier && setConfirmingTier(selectedTier)}
            publishing={publishing}
            // Yayınlanmış davetiyede "Paketi Yükselt" akışında mevcut
            // paketin altındakileri kilitle (downgrade yok). İlk
            // yayında current null, hepsi seçilebilir.
            currentTier={wantsUpgrade ? activeTier : null}
          />
        ) : (
          <Hero
            isPublished={isPublished}
            publishing={publishing}
            tier={activeTierMeta}
            onPublish={() => setStep("tier")}
            onUpgrade={triggerUpgrade}
            onRepublish={
              isPublished && activeTier
                ? () => handlePublish(activeTier)
                : undefined
            }
          />
        )}

        {isPublished ? (
          <>
            <div className="grid lg:grid-cols-5 gap-4 mb-6">
              <ShareCard
                shareUrl={shareUrl}
                slug={savedVanity || slug}
                onCopy={() => copy(shareUrl, "Bağlantı kopyalandı")}
                onDownloadQR={downloadQR}
                pdfEnabled={planLimitsFor(activeTier).pdfDownloadEnabled}
                onUpgrade={triggerUpgrade}
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
                tier={activeTier}
                onUpgrade={triggerUpgrade}
              />
              <NextStepsCard
                designId={designId}
                shareUrl={shareUrl}
                tier={activeTier}
                onUpgrade={triggerUpgrade}
              />
            </div>
          </>
        ) : step === "intro" ? (
          <DraftHint />
        ) : null}
      </div>

      {/* Hidden canvas QR used for PNG download, we render a parallel
          canvas so the visible QR can stay SVG-crisp for display. */}
      <div id="share-qr" className="hidden">
        <QRCodeCanvas value={shareUrl} size={512} includeMargin />
      </div>

      {confirmingTier ? (
        <ConfirmTierModal
          tierId={confirmingTier}
          designId={designId}
          publishing={publishing}
          onCancel={() => setConfirmingTier(null)}
          onConfirm={async () => {
            await handlePublish(confirmingTier);
            setConfirmingTier(null);
          }}
        />
      ) : null}
    </main>
  );
}

/**
 * Confirmation modal shown after a tier is picked and "Bu Paketle Yayınla"
 * is clicked. Two flavours:
 *   - free: explains that extra gallery items get trimmed to 1 and a
 *     DavetYolla.com promo block will appear in the invitation.
 *   - paid: kullanıcıyı Stripe Checkout'a yönlendireceğimizi söyler.
 *     onConfirm → handlePublish → /api/billing/checkout → window.location
 *     redirect. Test kartı için 4242 4242 4242 4242.
 */
function ConfirmTierModal({
  tierId,
  designId,
  publishing,
  onCancel,
  onConfirm,
}: {
  tierId: TierId;
  designId: string;
  publishing: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const isFree = tierId === "free";
  const tierMeta = TIERS.find((t) => t.id === tierId) ?? null;

  // Yükseltme tutarı + geçmiş ödemeler server'dan çekilir, böylece modal
  // gerçek ödenecek tutarı (önceki paket düşülmüş halde) gösterir.
  const [quote, setQuote] = useState<{
    basePrice: number;
    finalPrice: number;
    appliedPercent: number;
    totalPaidTry: number;
    upgradeAmountTry: number;
    isFree: boolean;
  } | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(!isFree);
  useEffect(() => {
    if (isFree) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/billing/quote", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ designId, tier: tierId }),
        });
        if (cancelled) return;
        if (!res.ok) {
          setLoadingQuote(false);
          return;
        }
        const data = await res.json();
        if (!cancelled) setQuote(data);
      } finally {
        if (!cancelled) setLoadingQuote(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [designId, tierId, isFree]);
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-display text-xl sm:text-2xl mb-3">
          {isFree ? "Free pakette yayınla" : `${tierMeta?.name} paketi`}
        </h3>
        {isFree ? (
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              Free pakette davetiyene <strong>tek bir görsel</strong>{" "}
              eklenebilir. Galerinde birden fazla medya varsa diğerleri
              yayınlama sırasında otomatik olarak kaldırılacak.
            </p>
            <p>
              Ayrıca davetiyene{" "}
              <strong>DavetYolla.com tanıtım bölümü</strong> eklenecek. Bunlar olmadan yayınlamak
              için bir üst pakete geçebilirsin.
            </p>
            <p>Devam etmek istediğine emin misin?</p>
          </div>
        ) : (
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            {/* Tutar server-side resolve ediliyor; geçmiş ödemeler quote
                içinde düşülmüş halde geliyor. isFree=true ise upgrade
                ücretsiz (önceki paketler hedef fiyatı zaten karşılıyor).*/}
            {loadingQuote ? (
              <div className="rounded-xl border border-border bg-muted/30 p-4 h-20 animate-pulse" />
            ) : quote?.isFree ? (
              <div className="rounded-xl border border-emerald-300/50 bg-emerald-50 p-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-700">
                  Bedava yükseltme
                </div>
                <div className="font-display text-2xl mt-1 text-emerald-800 tabular-nums">
                  ₺0
                </div>
                <p className="text-xs text-emerald-900/80 mt-2">
                  Daha önce ödediğin{" "}
                  <span className="font-semibold tabular-nums">
                    {formatTry(quote.totalPaidTry)}
                  </span>
                  , {tierMeta?.name} paketinin anlık indirimli fiyatını
                  ({formatTry(quote.finalPrice)}) zaten karşılıyor. Ödeme
                  yapmadan yayına çıkar.
                </p>
              </div>
            ) : quote ? (
              <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {quote.totalPaidTry > 0
                        ? "Yükseltme tutarı"
                        : "Ödenecek tutar"}
                    </div>
                    <div className="font-display text-2xl mt-1 tabular-nums">
                      {formatTry(quote.upgradeAmountTry)}
                    </div>
                  </div>
                  {quote.appliedPercent > 0 ? (
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        İndirim
                      </div>
                      <div className="text-amber-600 font-semibold mt-1">
                        %{quote.appliedPercent}
                      </div>
                      <div className="text-[10px] line-through text-muted-foreground/70 tabular-nums">
                        {formatTry(quote.basePrice)}
                      </div>
                    </div>
                  ) : null}
                </div>
                {quote.totalPaidTry > 0 ? (
                  <div className="text-[11px] text-muted-foreground border-t border-border/60 pt-2 flex justify-between">
                    <span>Bu davetiye için önceki ödemen</span>
                    <span className="tabular-nums">
                      − {formatTry(quote.totalPaidTry)}
                    </span>
                  </div>
                ) : null}
                <div className="text-[11px] text-muted-foreground flex justify-between">
                  <span>Hedef paketin anlık fiyatı</span>
                  <span className="tabular-nums">
                    {formatTry(quote.finalPrice)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
                Yükseltme tutarı hesaplanamadı, bağlantını kontrol et.
              </div>
            )}
            <p>
              {quote?.isFree ? (
                <>
                  Devam ettiğinde davetiyen otomatik olarak{" "}
                  <strong>{tierMeta?.name}</strong> paketinde yayına çıkar.
                </>
              ) : (
                <>
                  Devam ettiğinde güvenli{" "}
                  <strong>Stripe ödeme sayfasına</strong>{" "}
                  yönlendirileceksin. Kart bilgilerini DavetYolla görmez;
                  ödeme onaylanınca davetiyen otomatik olarak{" "}
                  <strong>{tierMeta?.name}</strong> paketinde yayına çıkar.
                </>
              )}
            </p>
            <p className="text-[11px] text-muted-foreground/80">
              KDV dahildir, tek seferlik etkinlik ödemesi.
            </p>
          </div>
        )}
        <div className="mt-6 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={publishing}
            className="text-sm px-5 py-2.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer disabled:opacity-50"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={publishing}
            className={`text-sm px-5 py-2.5 rounded-full font-medium cursor-pointer disabled:opacity-50 ${
              isFree
                ? "bg-amber-500 text-white hover:bg-amber-600"
                : "bg-foreground text-background hover:bg-foreground/90"
            }`}
          >
            {publishing
              ? isFree
                ? "Yayınlanıyor..."
                : quote?.isFree
                  ? "Yayınlanıyor..."
                  : "Yönlendiriliyor..."
              : isFree
                ? "Anladım, Yayınla"
                : quote?.isFree
                  ? "Bedava Yükselt"
                  : quote
                    ? `${formatTry(quote.upgradeAmountTry)} Öde`
                    : "Hesaplanıyor..."}
          </button>
        </div>
      </div>
    </div>
  );
}

function Hero({
  isPublished,
  publishing,
  tier,
  onPublish,
  onUpgrade,
  onRepublish,
}: {
  isPublished: boolean;
  publishing: boolean;
  tier: TierMeta | null;
  onPublish: () => void;
  onUpgrade: () => void;
  /** Yayında olan davetiyede "Değişiklikleri Yayınla" — mevcut tier
   *  ile re-publish (ücret yok). undefined ise buton gösterilmez. */
  onRepublish?: () => void;
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
          <>
            <ActiveTierBadge tier={tier} onUpgrade={onUpgrade} />
            {onRepublish ? (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={onRepublish}
                  disabled={publishing}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-foreground text-background px-5 py-2.5 font-mono uppercase tracking-[0.2em] text-[11px] hover:bg-foreground/90 transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
                  title="Editor'deki son değişiklikleri canlıya yansıt"
                >
                  <Sparkles className="size-3" />
                  {publishing
                    ? "Yayınlanıyor..."
                    : "Değişiklikleri Yayınla"}
                </button>
                <p className="text-[10px] text-muted-foreground mt-1.5">
                  Editor&apos;deki son düzenlemeleri public davetiyene yansıtır.
                </p>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
}

function ActiveTierBadge({
  tier,
  onUpgrade,
}: {
  tier: TierMeta;
  onUpgrade: () => void;
}) {
  const Icon = tier.icon;
  // Premium dışındaki tier'larda altta "Yükselt" butonu görünür.
  // onUpgrade parent'taki state'i tetikleyip TierPicker'ı açıyor,
  // anchor link gibi sessiz başarısızlık yok.
  const canUpgrade = tier.id !== "premium";
  return (
    <div className="mt-7 inline-flex flex-col items-stretch gap-3 rounded-2xl border border-border/70 bg-white/70 backdrop-blur px-4 py-3 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center gap-3">
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
      {canUpgrade ? (
        <button
          type="button"
          onClick={onUpgrade}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-[11px] uppercase tracking-[0.2em] font-mono px-4 py-2 transition-colors cursor-pointer shadow-sm"
        >
          <Sparkles className="size-3.5" /> Paketi Yükselt
        </button>
      ) : null}
    </div>
  );
}

function TierPicker({
  selectedTier,
  onSelect,
  onCancel,
  onConfirm,
  publishing,
  currentTier,
}: {
  selectedTier: TierId | null;
  onSelect: (id: TierId) => void;
  onCancel: () => void;
  onConfirm: () => void;
  publishing: boolean;
  /** Yayınlanmış davetiyenin mevcut paketi (yükseltme akışında).
   *  Null olduğunda tüm paketler seçilebilir (ilk yayın). */
  currentTier?: TierId | null;
}) {
  // Resolve offer client-side only, same pattern as PricingTable to avoid
  // SSR/timezone drift, with a 60s tick so the banner updates on rollover.
  const [offer, setOffer] = useState<ActiveOffer | null>(null);
  useEffect(() => {
    const tick = () => setOffer(resolveActiveOffer(new Date()));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const selectedMeta = selectedTier
    ? TIERS.find((t) => t.id === selectedTier) ?? null
    : null;
  const selectedPercent =
    selectedMeta && offer && selectedMeta.basePrice > 0 ? offer.percent ?? 0 : 0;
  const selectedDiscounted =
    selectedMeta && selectedPercent > 0
      ? applyOffer(selectedMeta.basePrice, selectedPercent)
      : selectedMeta?.basePrice ?? 0;

  return (
    <section
      id="tier-picker"
      className="rounded-[1.75rem] border border-border/60 bg-white p-4 sm:p-6 lg:p-9 mb-6 scroll-mt-24"
    >
      <TierIconStyles />
      <div>
        <div className="text-center mb-5">
          <span className="inline-flex items-center gap-1.5 rounded-full text-[10px] uppercase tracking-[0.28em] px-3 py-1 font-medium font-mono border bg-amber-500/10 text-amber-700 border-amber-500/30">
            Adım 2 / 2
          </span>
          <h2 className="font-display text-2xl sm:text-4xl mt-3 leading-tight">
            Paketini seç
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto">
            Davetiyenin hangi özelliklerle yayınlanacağını belirle. Sonra
            istediğin zaman üst pakete geçebilirsin.
          </p>
        </div>

        <OfferNote offer={offer} />

        {/* Sticky publish bar, kullanıcı uzun feature listelerini geçmek
             zorunda kalmadan üstten direkt yayına basabilsin diye kart
             grid'inin üstünde duruyor. Mobilde de aynı yer, sticky =
             scroll sırasında ekranın tepesinde tutuyor. */}
        <div
          className={`sticky top-2 z-20 mb-4 flex items-center justify-between gap-3 rounded-2xl border px-3 sm:px-4 py-2 sm:py-2.5 transition-colors ${
            selectedTier
              ? "bg-foreground text-background border-foreground shadow-md"
              : "bg-muted/40 text-muted-foreground border-border"
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={onCancel}
              disabled={publishing}
              className="shrink-0 size-8 inline-flex items-center justify-center rounded-full border border-current/30 hover:bg-current/10 cursor-pointer disabled:opacity-50"
              aria-label="Geri dön"
              title="Geri dön"
            >
              <ArrowLeft className="size-4" />
            </button>
            <div className="min-w-0">
              {selectedMeta ? (
                <>
                  <div className="text-[10px] uppercase tracking-[0.2em] opacity-70">
                    Seçili paket
                  </div>
                  <div className="text-xs sm:text-sm font-semibold truncate">
                    {selectedMeta.name}
                    {selectedMeta.basePrice > 0 ? (
                      <span className="ml-2 opacity-80 tabular-nums">
                        {formatTry(
                          selectedPercent > 0
                            ? selectedDiscounted
                            : selectedMeta.basePrice
                        )}
                      </span>
                    ) : (
                      <span className="ml-2 opacity-80">Ücretsiz</span>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-xs sm:text-sm">
                  Aşağıdan bir paket seç
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onConfirm}
            disabled={!selectedTier || publishing}
            className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-full bg-background text-foreground px-4 sm:px-6 py-2 sm:py-2.5 font-mono uppercase tracking-[0.2em] text-[10px] sm:text-xs disabled:opacity-40 cursor-pointer hover:bg-background/90 transition-colors"
          >
            <Sparkles className="size-3.5" />
            <span className="hidden sm:inline">
              {publishing
                ? "Yayınlanıyor..."
                : selectedTier
                  ? "Bu Paketle Yayınla"
                  : "Paket seç"}
            </span>
            <span className="sm:hidden">
              {publishing ? "..." : "Yayınla"}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
          {TIERS.map((tier) => {
            // Mevcut paket veya altı kilitli (downgrade yok). currentTier
            // null ise (ilk yayın) hiçbiri kilitli değil.
            const locked = currentTier
              ? TIER_RANK[tier.id] <= TIER_RANK[currentTier]
              : false;
            return (
              <TierCard
                key={tier.id}
                tier={tier}
                offer={offer}
                selected={selectedTier === tier.id}
                onSelect={() => onSelect(tier.id)}
                locked={locked}
                isCurrent={currentTier === tier.id}
              />
            );
          })}
        </div>

        <p className="mt-4 text-[11px] text-muted-foreground text-center">
          Fiyatlar Türk Lirası cinsinden, tek seferlik etkinlik ödemesidir, KDV
          dahildir.
        </p>
      </div>
    </section>
  );
}

function TierCard({
  tier,
  offer,
  selected,
  onSelect,
  locked = false,
  isCurrent = false,
}: {
  tier: TierMeta;
  offer: ActiveOffer | null;
  selected: boolean;
  onSelect: () => void;
  /** Yükseltme akışında mevcut paket veya altındakiler için true.
   *  Buton disabled, görsel olarak soluk + kilitli durur. */
  locked?: boolean;
  /** Bu kart kullanıcının halihazırda satın aldığı paket mi? */
  isCurrent?: boolean;
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
      disabled={locked}
      aria-disabled={locked}
      title={
        locked
          ? isCurrent
            ? "Şu an aktif paketin"
            : "Bu paket mevcut paketinin altında — düşürme yapılamaz"
          : undefined
      }
      className={`relative h-full text-left rounded-2xl border-2 p-3 sm:p-4 flex flex-col transition-all ${
        locked ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      } ${
        tier.muted ? "bg-muted/30" : "bg-white"
      } ${
        selected
          ? "border-foreground ring-4 ring-foreground/15 -translate-y-0.5 shadow-lg"
          : locked
            ? "border-border/40"
            : tier.muted
              ? "border-border/60 hover:border-foreground/40 hover:shadow-md hover:-translate-y-0.5"
              : "border-border hover:border-foreground/50 hover:shadow-md hover:-translate-y-0.5"
      }`}
    >
      {/* Mevcut paket ozalı: kullanıcı hangi paketi aldığını net görsün. */}
      {isCurrent ? (
        <div className="absolute -top-2 right-3 inline-flex items-center gap-1 rounded-full bg-emerald-500 text-white px-2 py-0.5 text-[9px] uppercase tracking-[0.18em] font-mono shadow-sm whitespace-nowrap z-10">
          <Check className="size-2.5" /> Aktif
        </div>
      ) : null}
      {/* Selected check rozeti, hover/select durumunu kart üstünde
           kesin görünür yapar. Border + ring tek başına bazı renklerde
           silikti. */}
      {selected ? (
        <div className="absolute -top-2 -right-2 size-6 rounded-full bg-foreground text-background inline-flex items-center justify-center shadow-md ring-2 ring-background z-10">
          <Check className="size-3.5" strokeWidth={3} />
        </div>
      ) : null}

      {/* Popüler rozeti, kart üst kenarında ortalanmış olarak yüzüyor.
          Eskiden top-right idi ve countdown ile çakışıyordu. */}
      {tier.highlight ? (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-foreground text-background px-2.5 py-0.5 text-[9px] uppercase tracking-[0.18em] font-mono shadow-sm whitespace-nowrap z-10">
          <Star className="size-2.5 fill-current" /> Popüler
        </div>
      ) : null}

      {percent > 0 && !isFree ? (
        <div className="absolute -top-2 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500 text-white shadow">
          <Flame className="size-3" /> %{percent}
        </div>
      ) : null}

      {/* Discount countdown, sağ üstte. Popüler rozeti üst-orta'ya
          taşındığı için artık çakışma yok. */}
      {percent > 0 && !isFree && offer ? (
        <div className="absolute top-3 right-3">
          <Countdown targetIso={offer.endsAtIso} compact />
        </div>
      ) : null}

      {/* Header, fixed-height block so every card's "between" area lines up */}
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

        {/* Reserved 2-line price slot, keeps tagline / bestFor / features
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

      {/* Feature matrix, same rows in same order in every card. */}
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
                  note={row.note}
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
  note,
  value,
}: {
  label: string;
  note?: string;
  value: FeatureValue;
}) {
  const isOff = value === false;
  // Hem `note` (sabit alt-açıklama, ör. "program, aile ağacı") hem de
  // value=string (tier-spesifik kısıtlama, ör. "1 hazır şarkı") aynı
  // küçük alt satırda gösterilir; ikisi varsa note önce, value sonra.
  const subline =
    typeof value === "string"
      ? note
        ? `${note} · ${value}`
        : value
      : note ?? null;
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
        {subline ? (
          <span className="block text-[10px] text-muted-foreground/80 leading-tight">
            {subline}
          </span>
        ) : null}
      </span>
    </li>
  );
}

function OfferNote({ offer }: { offer: ActiveOffer | null }) {
  if (!offer || offer.percent <= 0) {
    return <div className="h-2" aria-hidden />;
  }
  // Slim banner, countdown moved to the affected tier cards.
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
  compact = false,
}: {
  targetIso: string;
  /** Compact = sıkı padding/küçük font; tier kartının köşesinde durur. */
  compact?: boolean;
}) {
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
    <div
      className={`inline-flex items-center gap-1 rounded-full bg-rose-500/10 text-rose-700 font-semibold tabular-nums ${
        compact ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
      }`}
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

function DraftHint() {
  return (
    <section className="rounded-2xl border border-dashed border-border/70 bg-white/40 p-6 text-center text-sm text-muted-foreground">
      Davetiyeni yayınladıktan sonra paylaşım araçların burada görünecek.
    </section>
  );
}

function ShareCard({
  shareUrl,
  slug,
  onCopy,
  onDownloadQR,
  pdfEnabled,
  onUpgrade,
}: {
  shareUrl: string;
  slug: string;
  onCopy: () => void;
  onDownloadQR: () => void;
  pdfEnabled: boolean;
  onUpgrade: () => void;
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
      {pdfEnabled ? (
        <a
          href={`/davetiyem/${slug}/print`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-foreground text-background px-4 py-2 text-xs hover:opacity-90 cursor-pointer transition-opacity"
        >
          <Download className="size-3.5" /> Davetiyeyi PDF indir
        </a>
      ) : (
        <button
          onClick={onUpgrade}
          className="mt-2 w-full inline-flex items-center justify-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 text-amber-800 px-4 py-2 text-xs hover:bg-amber-100 cursor-pointer transition-colors"
          title="PDF indirme Klasik+ paketinde açılır"
        >
          <Sparkles className="size-3.5" /> PDF için Yükselt
        </button>
      )}
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
  // channels array literal her render'da yeniden allocate ediyordu;
  // shareMessage/shareUrl/onNativeShare değişmedikçe stable referans.
  // Brand-doğru animasyonlu SVG'ler share-icons.tsx'te.
  // (rerender-memo-with-default-value)
  const channels = useMemo(() => {
    const encMsg = encodeURIComponent(shareMessage);
    const encUrl = encodeURIComponent(shareUrl);
    return [
      {
        label: "WhatsApp",
        href: `https://wa.me/?text=${encMsg}`,
        Icon: WhatsAppIcon,
        accent: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
      },
      {
        label: "E-posta",
        href: `mailto:?subject=${encodeURIComponent("Düğün Davetiyesi")}&body=${encMsg}`,
        Icon: EmailIcon,
        accent: "bg-blue-500/10 text-blue-700 border-blue-500/20",
      },
      {
        label: "Telegram",
        href: `https://t.me/share/url?url=${encUrl}&text=${encMsg}`,
        Icon: TelegramIcon,
        accent: "bg-sky-500/10 text-sky-700 border-sky-500/20",
      },
      {
        label: "X / Twitter",
        href: `https://twitter.com/intent/tweet?text=${encMsg}`,
        Icon: XBrandIcon,
        accent: "bg-foreground/5 text-foreground border-foreground/15",
      },
      {
        label: "SMS",
        href: `sms:?body=${encMsg}`,
        Icon: SmsIcon,
        accent: "bg-amber-500/10 text-amber-700 border-amber-500/20",
      },
      {
        label: "Cihazda Paylaş",
        onClick: onNativeShare,
        Icon: NativeShareIcon,
        accent: "bg-violet-500/10 text-violet-700 border-violet-500/20",
      },
    ] as Array<{
      label: string;
      href?: string;
      onClick?: () => void;
      Icon: (props: { className?: string }) => React.ReactElement;
      accent: string;
    }>;
  }, [shareMessage, shareUrl, onNativeShare]);

  return (
    <article className="lg:col-span-3 rounded-2xl border border-border bg-card p-6">
      <ShareIconStyles />
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
              <c.Icon className="size-5" /> {c.label}
            </a>
          ) : (
            <button
              key={c.label}
              onClick={c.onClick}
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer ${c.accent}`}
            >
              <c.Icon className="size-5" /> {c.label}
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
  tier,
  onUpgrade,
}: {
  davetiyeBase: string;
  slug: string;
  vanity: string;
  onChange: (v: string) => void;
  savedVanity: string;
  onSave: () => void;
  saving: boolean;
  tier: TierId | null;
  onUpgrade: () => void;
}) {
  const cleanBase = davetiyeBase.replace(/^https?:\/\//, "");
  const dirty = vanity !== savedVanity;
  const valid = /^[a-z0-9-]{0,40}$/.test(vanity);
  const previewSlug = vanity || slug;
  // Vanity path Klasik+ paketinde açılır. Free tier'da kart kilitli
  // overlay ile gösterilir, input disabled olur, save butonu yerine
  // "Paketi Yükselt" CTA'sı çıkar.
  const locked = !planLimitsFor(tier).vanityPathEnabled;

  return (
    <article
      className={`relative rounded-2xl border border-border bg-card p-6 ${
        locked ? "overflow-hidden" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-1">
        <div className="flex items-center gap-2">
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-mono">
            Özel Link
          </div>
          {locked ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 text-amber-800 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider">
              Pro+
            </span>
          ) : null}
        </div>
      </div>
      <h3 className="font-display text-lg mt-1">
        Daha Akılda Kalıcı Bir Adres
      </h3>
      <p className="text-xs text-muted-foreground mt-1">
        Çiftin adıyla okunabilir bir link oluştur, sosyal medyada ve
        davetiyelerde profesyonel görünür.
        {locked ? (
          <>
            {" "}
            <span className="text-amber-700 font-medium">
              Sadece Profesyonel ve Premium pakette açıktır.
            </span>
          </>
        ) : null}
      </p>

      <div
        className={`mt-4 rounded-lg border border-border overflow-hidden flex items-stretch ${
          locked ? "opacity-60" : ""
        }`}
      >
        <span className="bg-muted px-3 inline-flex items-center text-xs text-muted-foreground border-r border-border whitespace-nowrap font-mono">
          {cleanBase}/davetiyem/
        </span>
        <input
          value={vanity}
          onChange={(e) =>
            onChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
          }
          disabled={locked}
          placeholder="mehmet-ve-zeynep"
          maxLength={40}
          className="flex-1 px-3 py-2.5 text-sm bg-background focus:outline-none disabled:cursor-not-allowed"
        />
      </div>
      <div className="mt-2 text-[11px] text-muted-foreground flex items-center justify-between gap-3 flex-wrap">
        <span>
          Önizleme:{" "}
          <span className="font-mono text-foreground">
            {cleanBase}/davetiyem/{previewSlug}
          </span>
        </span>
        {!locked && !valid ? (
          <span className="text-amber-600">
            Yalnızca küçük harf, rakam ve tire (-) kullanabilirsin.
          </span>
        ) : null}
      </div>

      {locked ? (
        <button
          onClick={onUpgrade}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs px-5 py-2.5 font-mono uppercase tracking-[0.15em] cursor-pointer transition-colors shadow-sm"
        >
          <Sparkles className="size-3.5" />
          Paketi Yükselt
        </button>
      ) : (
        <button
          onClick={onSave}
          disabled={!dirty || !valid || saving}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground text-xs px-5 py-2.5 font-mono uppercase tracking-[0.15em] disabled:opacity-50 hover:opacity-90 cursor-pointer transition-opacity"
        >
          {saving ? "Kaydediliyor..." : dirty ? "Özel Linki Kaydet" : "Kaydedildi"}
        </button>
      )}
    </article>
  );
}

function NextStepsCard({
  designId,
  shareUrl,
  tier,
  onUpgrade,
}: {
  designId: string;
  shareUrl: string;
  tier: TierId | null;
  onUpgrade: () => void;
}) {
  // Tier limitleri her adıma göre kontrol ediliyor: Misafirler =
  // rsvpReadEnabled (Pro+), Hatıralar = memoryBookEnabled (Klasik+),
  // Düzenleme ve "misafir gibi gör" her tier'da açık. Kilitli adımlar
  // tıklanmaz, gri görünür ve Yükselt rozeti gösterir.
  const items = useMemo(() => {
    const limits = planLimitsFor(tier);
    return [
      {
        icon: Users,
        title: "Misafirleri takip et",
        desc: "RSVP yanıtlarını ve katılımcı listeni gör.",
        href: `/dashboard/${designId}/guests`,
        locked: !limits.rsvpReadEnabled,
      },
      {
        icon: Heart,
        title: "Hatıralara göz at",
        desc: "Misafirlerin bıraktığı mesajları onayla.",
        href: `/dashboard/${designId}/memories`,
        locked: !limits.memoryBookEnabled,
      },
      {
        icon: Pencil,
        title: "Düzenlemeye devam et",
        desc: "Yayındaki davetiye üzerinde değişiklik yap.",
        href: `/design/invitations/${designId}/editor`,
        locked: false,
      },
      {
        icon: ExternalLink,
        title: "Davetiyeyi misafir gibi gör",
        desc: "Yayındaki halini yeni sekmede aç.",
        href: shareUrl,
        external: true,
        locked: false,
      },
    ] as Array<{
      icon: typeof Users;
      title: string;
      desc: string;
      href: string;
      external?: boolean;
      locked: boolean;
    }>;
  }, [designId, shareUrl, tier]);

  const upgradeLabel = nextTierLabel(tier);

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
              <span
                className={`size-9 shrink-0 rounded-full inline-flex items-center justify-center ${
                  it.locked
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {it.locked ? (
                  <Lock className="size-4" />
                ) : (
                  <it.icon className="size-4" />
                )}
              </span>
              <span className="flex-1">
                <span className="flex items-center gap-1.5">
                  <span
                    className={`block text-sm font-medium ${
                      it.locked ? "text-muted-foreground" : ""
                    }`}
                  >
                    {it.title}
                  </span>
                  {it.locked ? (
                    <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 text-amber-800 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider">
                      {upgradeLabel}
                    </span>
                  ) : null}
                </span>
                <span className="block text-[11px] text-muted-foreground">
                  {it.desc}
                </span>
              </span>
              <Check className="size-3.5 text-muted-foreground/40" />
            </>
          );
          if (it.locked) {
            return (
              <button
                key={it.title}
                onClick={onUpgrade}
                className="flex items-center gap-3 rounded-xl border border-amber-300/40 bg-amber-50/40 px-3 py-2.5 hover:border-amber-400 hover:bg-amber-50 transition-colors cursor-pointer text-left"
              >
                {inner}
              </button>
            );
          }
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
