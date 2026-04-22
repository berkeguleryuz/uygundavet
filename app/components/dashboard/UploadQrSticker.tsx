"use client";

import { useRef, useCallback, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { QRCodeSVG } from "qrcode.react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { downloadNodeAsPng } from "./downloadFromDom";

interface UploadQrStickerProps {
  url: string;
  coupleName: string;
}

export function UploadQrSticker({ url, coupleName }: UploadQrStickerProps) {
  const t = useTranslations("Dashboard");
  const stickerRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    const el = stickerRef.current;
    if (!el) return;
    setDownloading(true);
    try {
      const filename = `qr-sticker-masa-${coupleName.replace(/\s+/g, "-").toLowerCase() || "uygundavet"}`;
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
    <div className="flex flex-col gap-3 w-full max-w-[200px] h-full">
      <div
        ref={stickerRef}
        className="bg-[#1c1a1b] rounded-xl border border-[#d5d1ad] p-4 flex flex-col items-center justify-center relative"
      >
        <div className="flex flex-col items-center gap-1 w-full">
          <p className="font-merienda text-[#d5d1ad] text-[11px] font-bold text-center leading-tight">
            {t("leaveMemoryOrUpload")}
          </p>
          <p className="text-[#d5d1ad]/70 text-[9px] font-merienda text-center leading-tight">
            {coupleName}
          </p>
          <div className="h-px w-full bg-[#d5d1ad]/20" />
        </div>

        <div className="bg-white rounded-lg p-2.5 mt-2">
          <QRCodeSVG
            value={url}
            size={140}
            bgColor="#ffffff"
            fgColor="#1c1a1b"
            level="M"
          />
        </div>

        <div className="relative w-full flex items-center justify-center">
          <Image
            src="/brand-text.png"
            alt="Uygun Davet"
            width={140}
            height={32}
            className="object-contain max-h-9 w-auto -mb-4"
          />
        </div>
      </div>

      <Button
        onClick={handleDownload}
        disabled={downloading}
        variant="outline"
        size="sm"
        className="w-full gap-2 rounded-lg h-8 text-xs mt-auto"
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
