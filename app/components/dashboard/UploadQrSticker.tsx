"use client";

import { useRef, useCallback, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { QRCodeSVG } from "qrcode.react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface UploadQrStickerProps {
  url: string;
  coupleName: string;
}

async function loadFont(name: string, url: string) {
  try {
    const font = new FontFace(name, `url(${url})`);
    await font.load();
    document.fonts.add(font);
  } catch {
    /* font yükleme başarısızsa canvas fallback font kullanır */
  }
}

function loadImage(src: string, timeoutMs = 5000): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const timer = setTimeout(() => reject(new Error("image load timeout")), timeoutMs);
    img.onload = () => {
      clearTimeout(timer);
      resolve(img);
    };
    img.onerror = () => {
      clearTimeout(timer);
      reject(new Error("image load failed"));
    };
    img.src = src;
  });
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
      await loadFont(
        "Merienda-Canvas",
        "https://fonts.gstatic.com/s/merienda/v19/gNMHW3x8Qoy5_mf8uVMCOou6_dvg.woff2"
      );

      const canvas = document.createElement("canvas");
      const scale = 3;
      const w = 300;
      const h = 400;
      canvas.width = w * scale;
      canvas.height = h * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("canvas context unavailable");
      ctx.scale(scale, scale);

      ctx.fillStyle = "#1c1a1b";
      ctx.beginPath();
      ctx.roundRect(0, 0, w, h, 20);
      ctx.fill();

      ctx.strokeStyle = "#d5d1ad";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(8, 8, w - 16, h - 16, 14);
      ctx.stroke();

      ctx.strokeStyle = "#d5d1ad30";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(16, 16, w - 32, h - 32, 10);
      ctx.stroke();

      try {
        const logo = await loadImage("/brand-text.png");
        const targetH = 42;
        const ratio = logo.width / logo.height;
        const targetW = Math.min(w - 80, targetH * ratio);
        const finalH = targetW / ratio;
        const lx = (w - targetW) / 2;
        const ly = 32;
        ctx.drawImage(logo, lx, ly, targetW, finalH);
      } catch {
        ctx.fillStyle = "#d5d1ad";
        ctx.font = "bold 20px 'Merienda-Canvas', serif";
        ctx.textAlign = "center";
        ctx.fillText("Uygun Davet", w / 2, 56);
      }

      const svgEl = el.querySelector("svg");
      if (svgEl) {
        const svgData = new XMLSerializer().serializeToString(svgEl);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const urlObj = URL.createObjectURL(svgBlob);

        try {
          const qrImg = await loadImage(urlObj);
          const qrSize = 180;
          const qrX = (w - qrSize) / 2;
          const qrY = 95;

          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.roundRect(qrX - 12, qrY - 12, qrSize + 24, qrSize + 24, 14);
          ctx.fill();

          ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
        } finally {
          URL.revokeObjectURL(urlObj);
        }
      }

      ctx.strokeStyle = "#d5d1ad30";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(40, 310);
      ctx.lineTo(w - 40, 310);
      ctx.stroke();

      ctx.fillStyle = "#d5d1ad";
      ctx.font = "bold 14px 'Merienda-Canvas', serif";
      ctx.textAlign = "center";
      ctx.fillText(t("leaveMemoryOrUpload"), w / 2, 335);

      ctx.fillStyle = "#d5d1adaa";
      ctx.font = "12px 'Merienda-Canvas', serif";
      ctx.fillText(coupleName, w / 2, 360);

      ctx.fillStyle = "#ffffff25";
      ctx.font = "9px sans-serif";
      ctx.fillText("uygundavet.com", w / 2, 378);

      const filename = `qr-sticker-masa-${coupleName.replace(/\s+/g, "-").toLowerCase() || "uygundavet"}.png`;

      await new Promise<void>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("canvas.toBlob returned null"));
            return;
          }
          const objUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = objUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(objUrl), 1000);
          resolve();
        }, "image/png");
      });
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
  }, [coupleName, t]);

  return (
    <div className="space-y-3 w-full max-w-[190px]">
      <div
        ref={stickerRef}
        className="bg-[#1c1a1b] rounded-xl border border-[#d5d1ad] p-4 flex flex-col items-center gap-2 relative"
      >
        <div className="relative w-full h-7 flex items-center justify-center">
          <Image
            src="/brand-text.png"
            alt="Uygun Davet"
            width={110}
            height={24}
            className="object-contain max-h-7 w-auto"
          />
        </div>

        <div className="bg-white rounded-lg p-2">
          <QRCodeSVG
            value={url}
            size={100}
            bgColor="#ffffff"
            fgColor="#1c1a1b"
            level="M"
          />
        </div>

        <div className="h-px w-full bg-[#d5d1ad]/20" />
        <p className="font-merienda text-[#d5d1ad] text-[11px] font-bold text-center leading-tight">
          {t("leaveMemoryOrUpload")}
        </p>
        <p className="text-[#d5d1ad]/70 text-[9px] font-merienda text-center leading-tight">
          {coupleName}
        </p>
      </div>

      <Button
        onClick={handleDownload}
        disabled={downloading}
        variant="outline"
        size="sm"
        className="w-full gap-2 rounded-lg h-8 text-xs"
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
