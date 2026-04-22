"use client";

import { useRef, useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { QRCodeSVG } from "qrcode.react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { downloadNodeAsPng } from "./downloadFromDom";

interface QrStickerProps {
  url: string;
  coupleName: string;
}

export function QrSticker({ url, coupleName }: QrStickerProps) {
  const t = useTranslations("Dashboard");
  const stickerRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    const el = stickerRef.current;
    if (!el) return;
    setDownloading(true);
    try {
      const filename = `qr-sticker-${coupleName.replace(/\s+/g, "-").toLowerCase() || "uygundavet"}`;
      await downloadNodeAsPng(el, filename, { pixelRatio: 6 });
    } catch (err) {
      console.error("QR sticker download failed:", err);
      toast.error(
        err instanceof Error && err.message
          ? `İndirilemedi: ${err.message}`
          : "Sticker indirilemedi"
      );
    } finally {
      setDownloading(false);
    }
  }, [coupleName]);

  return (
    <div className="flex flex-col gap-3 w-full max-w-[200px] mx-auto">
      <div
        ref={stickerRef}
        className="bg-[#1c1a1b] rounded-2xl border-2 border-[#d5d1ad] p-6 flex flex-col items-center gap-3 relative"
      >
        <div className="flex items-center gap-2 w-full">
          <div className="flex-1 h-px bg-[#d5d1ad]/20" />
          <span className="text-[#d5d1ad] text-xs">♥</span>
          <div className="flex-1 h-px bg-[#d5d1ad]/20" />
        </div>

        <p className="font-merienda text-[#d5d1ad] text-lg font-bold tracking-wide">
          {t("scanMe")}
        </p>

        <div className="bg-white rounded-xl p-3">
          <QRCodeSVG
            value={url}
            size={120}
            bgColor="#ffffff"
            fgColor="#1c1a1b"
            level="M"
          />
        </div>

        <div className="h-px w-full bg-[#d5d1ad]/20" />
        <p className="text-[#d5d1ad] text-xs font-merienda text-center">{coupleName}</p>
      </div>

      <Button
        onClick={handleDownload}
        disabled={downloading}
        variant="outline"
        size="sm"
        className="w-full gap-1.5 rounded-lg h-8 text-xs mt-auto"
      >
        {downloading ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Download className="size-3.5" />
        )}
        {t("downloadSticker")}
      </Button>
    </div>
  );
}
