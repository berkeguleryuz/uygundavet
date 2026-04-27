"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { QRCodeCanvas } from "qrcode.react";
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  ExternalLink,
  Heart,
  Mail,
  MessageCircle,
  Pencil,
  Send,
  Share2,
  Sparkles,
  Users,
} from "lucide-react";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
import { toast } from "sonner";
import { Link, useRouter } from "@/i18n/navigation";

interface SaveScreenProps {
  designId: string;
  slug: string;
  vanityPath: string | null;
  status: "draft" | "published";
}

export function SaveScreen({
  designId,
  slug,
  vanityPath: initialVanity,
  status: initialStatus,
}: SaveScreenProps) {
  const t = useTranslations("Publish");
  const router = useRouter();

  const [vanity, setVanity] = useState(initialVanity ?? "");
  const [savedVanity, setSavedVanity] = useState(initialVanity ?? "");
  const [status, setStatus] = useState(initialStatus);
  const [publishing, setPublishing] = useState(false);
  const [savingVanity, setSavingVanity] = useState(false);

  const davetiyeBase =
    process.env.NEXT_PUBLIC_DAVETIYE_URL ?? "https://uygundavet.com";
  const publicPath = savedVanity || slug;
  const shareUrl = `${davetiyeBase}/i/${publicPath}`;

  const isPublished = status === "published";

  const shareMessage = useMemo(
    () =>
      `Düğünümüze davetlisin! Davetiyemizi buradan inceleyebilirsin: ${shareUrl}`,
    [shareUrl],
  );

  async function handlePublish() {
    setPublishing(true);
    const res = await fetch(`/api/design/invitations/${designId}/publish`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ vanityPath: savedVanity || undefined }),
    });
    setPublishing(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error ?? "Yayınlanamadı");
      return;
    }
    setStatus("published");
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

  return (
    <main className="min-h-dvh bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <button
          onClick={() => router.push(`/design/invitations/${designId}/editor`)}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <ArrowLeft className="size-4" /> Düzenlemeye dön
        </button>

        <Hero
          isPublished={isPublished}
          publishing={publishing}
          onPublish={handlePublish}
        />

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
        ) : (
          <DraftHint />
        )}
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
  onPublish,
}: {
  isPublished: boolean;
  publishing: boolean;
  onPublish: () => void;
}) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-10 mb-6 text-center">
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
      <div className="relative">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full text-[10px] uppercase tracking-[0.25em] px-3 py-1 font-medium ${
            isPublished
              ? "bg-emerald-500/15 text-emerald-700"
              : "bg-amber-500/15 text-amber-700"
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
        <h1 className="font-display text-3xl sm:text-4xl mt-4">
          {isPublished
            ? "Tebrikler, davetiyen yayında!"
            : "Davetiyeni yayınla"}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-xl mx-auto">
          {isPublished
            ? "Aşağıdaki paylaşım araçlarıyla misafirlerine davetiyeni iletebilir, RSVP'leri panelden takip edebilirsin."
            : "Yayınladığında benzersiz bir paylaşım bağlantısı, QR kod ve hızlı paylaşım araçların hazır olacak."}
        </p>
        {!isPublished ? (
          <button
            onClick={onPublish}
            disabled={publishing}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 font-chakra uppercase tracking-[0.2em] text-xs disabled:opacity-50 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <Sparkles className="size-3.5" />
            {publishing ? "Yayınlanıyor..." : "Şimdi Yayınla"}
          </button>
        ) : null}
      </div>
    </section>
  );
}

function DraftHint() {
  return (
    <section className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
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
      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-4">
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
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
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
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
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
        className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground text-xs px-5 py-2.5 font-chakra uppercase tracking-[0.15em] disabled:opacity-50 hover:opacity-90 cursor-pointer transition-opacity"
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
      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
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
