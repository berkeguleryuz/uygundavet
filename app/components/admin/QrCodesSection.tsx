"use client";

import { useState } from "react";
import { QrCode, Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { UploadQrSticker } from "@/app/components/dashboard/UploadQrSticker";
import { TableCardQr } from "@/app/components/dashboard/TableCardQr";
import { QrSticker } from "@/app/components/dashboard/QrSticker";

interface QrCodesSectionProps {
  customDomain?: string;
  inviteCode?: string;
  brideFirst?: string;
  groomFirst?: string;
  weddingDate?: string;
}

interface QrTarget {
  upload: string;
  rsvp: string;
  whatsapp: string;
}

function buildTargets(customDomain: string, inviteCode: string): QrTarget | null {
  const domain = customDomain.trim();
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://uygundavet.com";

  if (!inviteCode && !domain) return null;

  if (domain) {
    return {
      upload: `https://${domain}`,
      rsvp: `https://${domain}/lcv`,
      whatsapp: `https://${domain}/lcv?source=whatsapp`,
    };
  }

  return {
    upload: `${site}/paylas/${inviteCode}`,
    rsvp: `${site}/rsvp/${inviteCode}`,
    whatsapp: `${site}/rsvp/${inviteCode}?source=whatsapp`,
  };
}

function formatWeddingDate(date?: string): string {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    });
  } catch {
    return "";
  }
}

export function QrCodesSection({
  customDomain = "",
  inviteCode = "",
  brideFirst = "",
  groomFirst = "",
  weddingDate = "",
}: QrCodesSectionProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const targets = buildTargets(customDomain, inviteCode);
  const coupleName = [brideFirst, groomFirst].filter(Boolean).join(" & ");
  const weddingDateStr = formatWeddingDate(weddingDate);

  const handleCopy = async (url: string, key: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedKey(key);
      toast.success("Kopyalandı");
      setTimeout(() => setCopiedKey(null), 1500);
    } catch {
      toast.error("Kopyalanamadı");
    }
  };

  if (!targets) {
    return (
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <QrCode className="w-4 h-4 text-white/50" />
          <h3 className="text-sm font-chakra uppercase tracking-[0.12em] text-white/70">
            QR Kodları
          </h3>
        </div>
        <p className="text-sm text-white/40 font-sans">
          Davet kodu veya özel domain olmadığı için QR kodları oluşturulamadı.
        </p>
      </div>
    );
  }

  const tiles: Array<{ key: string; label: string; url: string; node: React.ReactNode }> = [
    {
      key: "upload-sticker",
      label: "Sticker",
      url: targets.upload,
      node: (
        <UploadQrSticker url={targets.upload} coupleName={coupleName || "—"} />
      ),
    },
    {
      key: "table-card",
      label: "Masa Kartı",
      url: targets.upload,
      node: (
        <TableCardQr
          url={targets.upload}
          brideFirst={brideFirst || "—"}
          groomFirst={groomFirst || "—"}
          weddingDateStr={weddingDateStr || "—"}
        />
      ),
    },
    {
      key: "rsvp-sticker",
      label: "RSVP / Beni Tara",
      url: targets.rsvp,
      node: <QrSticker url={targets.rsvp} coupleName={coupleName || "—"} />,
    },
  ];

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <QrCode className="w-4 h-4 text-white/50" />
          <h3 className="text-sm font-chakra uppercase tracking-[0.12em] text-white/70">
            QR Kodları
          </h3>
        </div>
        <span className="text-[10px] text-white/30 font-sans">
          {customDomain ? `Özel domain: ${customDomain}` : "uygundavet.com üzerinden"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
        {tiles.map((tile) => (
          <div
            key={tile.key}
            className="bg-white/[0.02] border border-white/10 rounded-xl p-4 flex flex-col items-center gap-3"
          >
            <p className="text-[10px] uppercase tracking-[0.12em] text-white/40 font-sans">
              {tile.label}
            </p>

            <div className="flex-1 min-h-0 w-full flex justify-center [&>div]:h-full">
              {tile.node}
            </div>

            <div className="w-full space-y-1.5 mt-auto">
              <p
                className="text-[10px] text-white/50 font-mono break-all text-center leading-snug"
                title={tile.url}
              >
                {tile.url.replace(/^https?:\/\//, "")}
              </p>
              <div className="flex items-center gap-1.5 w-full">
                <button
                  onClick={() => handleCopy(tile.url, tile.key)}
                  className="flex-1 h-7 rounded-md bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors flex items-center justify-center gap-1 text-[10px] font-sans cursor-pointer"
                >
                  {copiedKey === tile.key ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  Kopyala
                </button>
                <a
                  href={tile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-7 px-2 rounded-md bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors flex items-center justify-center"
                  title="Test et"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
