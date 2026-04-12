"use client";

import { useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { QRCodeSVG } from "qrcode.react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QrStickerProps {
  url: string;
  coupleName: string;
}

async function loadFont(name: string, url: string) {
  const font = new FontFace(name, `url(${url})`);
  await font.load();
  document.fonts.add(font);
}

export function QrSticker({ url, coupleName }: QrStickerProps) {
  const t = useTranslations("Dashboard");
  const stickerRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    const el = stickerRef.current;
    if (!el) return;

    // Load Merienda font for canvas
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
    if (!ctx) return;

    ctx.scale(scale, scale);

    // Background
    ctx.fillStyle = "#1c1a1b";
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 20);
    ctx.fill();

    // Outer border
    ctx.strokeStyle = "#d5d1ad";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(8, 8, w - 16, h - 16, 14);
    ctx.stroke();

    // Inner decorative border
    ctx.strokeStyle = "#d5d1ad30";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(16, 16, w - 32, h - 32, 10);
    ctx.stroke();

    // Top decorative line + heart
    ctx.fillStyle = "#d5d1ad";
    ctx.font = "14px serif";
    ctx.textAlign = "center";
    ctx.fillText("♥", w / 2, 42);

    ctx.strokeStyle = "#d5d1ad40";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 38);
    ctx.lineTo(w / 2 - 14, 38);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w / 2 + 14, 38);
    ctx.lineTo(w - 60, 38);
    ctx.stroke();

    // "Beni Tara" text with loaded font
    ctx.fillStyle = "#d5d1ad";
    ctx.font = "bold 26px 'Merienda-Canvas', cursive";
    ctx.textAlign = "center";
    ctx.fillText(t("scanMe"), w / 2, 72);

    // QR Code
    const svgEl = el.querySelector("svg");
    if (svgEl) {
      const svgData = new XMLSerializer().serializeToString(svgEl);
      const img = new Image();
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const urlObj = URL.createObjectURL(blob);

      await new Promise<void>((resolve) => {
        img.onload = () => {
          const qrSize = 180;
          const qrX = (w - qrSize) / 2;
          const qrY = 90;

          // White background for QR
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.roundRect(qrX - 12, qrY - 12, qrSize + 24, qrSize + 24, 14);
          ctx.fill();

          ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
          URL.revokeObjectURL(urlObj);
          resolve();
        };
        img.src = urlObj;
      });
    }

    // Bottom decorative line
    ctx.strokeStyle = "#d5d1ad30";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, 310);
    ctx.lineTo(w - 50, 310);
    ctx.stroke();

    // Couple name
    ctx.fillStyle = "#d5d1ad";
    ctx.font = "18px 'Merienda-Canvas', cursive";
    ctx.textAlign = "center";
    ctx.fillText(coupleName, w / 2, 340);

    // Brand
    ctx.fillStyle = "#ffffff25";
    ctx.font = "10px sans-serif";
    ctx.fillText("uygundavet.com", w / 2, 375);

    // Download
    const link = document.createElement("a");
    link.download = `qr-sticker-${coupleName.replace(/\s+/g, "-").toLowerCase()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [coupleName, t]);

  return (
    <div className="space-y-3">
      {/* Sticker Preview */}
      <div
        ref={stickerRef}
        className="bg-[#1c1a1b] rounded-2xl border-2 border-[#d5d1ad] p-6 flex flex-col items-center gap-3 mx-auto max-w-[200px] relative"
      >
        {/* Top decoration */}
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

        {/* Bottom decoration */}
        <div className="h-px w-full bg-[#d5d1ad]/20" />
        <p className="text-[#d5d1ad] text-xs font-merienda text-center">{coupleName}</p>
      </div>

      {/* Download Button */}
      <Button
        onClick={handleDownload}
        variant="outline"
        className="w-full gap-2 rounded-xl"
      >
        <Download className="size-4" />
        {t("downloadSticker")}
      </Button>
    </div>
  );
}
