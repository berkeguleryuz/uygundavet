"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { QRCodeSVG } from "qrcode.react";
import { Copy, ArrowLeft } from "lucide-react";
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
  const [status, setStatus] = useState(initialStatus);
  const [publishing, setPublishing] = useState(false);

  const davetiyeBase =
    process.env.NEXT_PUBLIC_DAVETIYE_URL ?? "https://uygundavet.com";
  const publicPath = vanity || slug;
  const shareUrl = `${davetiyeBase}/i/${publicPath}`;

  async function handlePublish() {
    setPublishing(true);
    const res = await fetch(`/api/design/invitations/${designId}/publish`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ vanityPath: vanity || undefined }),
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

  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
    toast.success(t("copy"));
  }

  return (
    <main className="min-h-dvh max-w-xl mx-auto px-6 py-10">
      <button
        onClick={() => router.push(`/design/invitations/${designId}/editor`)}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
      >
        <ArrowLeft className="size-4" /> Düzenlemeye dön
      </button>

      <section className="bg-card border border-border rounded-xl p-6 mb-6">
        <h1 className="font-display text-2xl text-center">
          {status === "published" ? t("title") : "Davetiyeni Yayınla"}
        </h1>
        <p className="text-sm text-muted-foreground text-center mt-1">
          {t("subtitle")}
        </p>

        <div className="mt-6 flex flex-col items-center gap-3">
          <QRCodeSVG value={shareUrl} size={160} />
          <div className="text-xs font-chakra text-muted-foreground">{t("shareLink")}</div>
          <div className="flex items-center gap-2">
            <code className="text-xs bg-muted rounded px-2 py-1">{shareUrl}</code>
            <button
              onClick={() => copy(shareUrl)}
              className="rounded-full border border-border p-1.5 hover:bg-muted cursor-pointer"
            >
              <Copy className="size-3.5" />
            </button>
          </div>
        </div>

        {status !== "published" ? (
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="mt-6 w-full rounded-full bg-primary text-primary-foreground py-3 font-chakra uppercase tracking-[0.2em] text-xs disabled:opacity-50 cursor-pointer"
          >
            {publishing ? "..." : "Yayınla"}
          </button>
        ) : (
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 w-full inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground py-3 font-chakra uppercase tracking-[0.2em] text-xs cursor-pointer"
          >
            Görüntüle
          </a>
        )}
      </section>

      <section className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-medium mb-1">{t("customLink")}</h2>
        <p className="text-sm text-muted-foreground mb-4">{t("customLinkDesc")}</p>

        <div className="text-xs text-muted-foreground mb-1">{t("currentLink")}</div>
        <div className="text-sm font-chakra mb-4">{davetiyeBase}/i/{slug}</div>

        <div className="flex items-center gap-2 text-sm">
          <span>{davetiyeBase}/i/</span>
          <input
            value={vanity}
            onChange={(e) => setVanity(e.target.value.toLowerCase())}
            placeholder="mehmet-ve-zeynep"
            className="flex-1 rounded-md border border-input bg-background px-3 py-2"
          />
        </div>

        <button
          onClick={async () => {
            const res = await fetch(`/api/design/invitations/${designId}/slug`, {
              method: "PATCH",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ vanityPath: vanity }),
            });
            if (!res.ok) {
              const body = await res.json().catch(() => ({}));
              toast.error(body.error ?? "Özel link ayarlanamadı");
              return;
            }
            toast.success("Özel link güncellendi");
          }}
          className="mt-3 text-xs px-4 py-2 rounded-full border border-border cursor-pointer hover:bg-muted"
        >
          Özel linki kaydet
        </button>
      </section>
    </main>
  );
}
