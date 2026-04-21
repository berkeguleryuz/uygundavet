"use client";

import { useRef, useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { QRCodeSVG } from "qrcode.react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface TableCardQrProps {
  url: string;
  brideFirst: string;
  groomFirst: string;
  weddingDateStr: string;
}

async function loadFont(name: string, url: string) {
  try {
    const font = new FontFace(name, `url(${url})`);
    await font.load();
    document.fonts.add(font);
  } catch {
    /* fallback */
  }
}

function loadSvgImage(svgString: string, timeoutMs = 5000): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new window.Image();
    const timer = setTimeout(() => {
      URL.revokeObjectURL(url);
      reject(new Error("svg image timeout"));
    }, timeoutMs);
    img.onload = () => {
      clearTimeout(timer);
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      clearTimeout(timer);
      URL.revokeObjectURL(url);
      reject(new Error("svg image load failed"));
    };
    img.src = url;
  });
}

export function TableCardQr({
  url,
  brideFirst,
  groomFirst,
  weddingDateStr,
}: TableCardQrProps) {
  const t = useTranslations("Dashboard");
  const qrRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    const el = qrRef.current;
    if (!el) return;
    setDownloading(true);
    try {
      await loadFont(
        "Merienda-Canvas",
        "https://fonts.gstatic.com/s/merienda/v19/gNMHW3x8Qoy5_mf8uVMCOou6_dvg.woff2"
      );

      const scale = 3;
      const w = 350;
      const h = 500;
      const canvas = document.createElement("canvas");
      canvas.width = w * scale;
      canvas.height = h * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("canvas context unavailable");
      ctx.scale(scale, scale);

      // Krem/ivory arka plan
      ctx.fillStyle = "#f5f0e8";
      ctx.fillRect(0, 0, w, h);

      // Dış çerçeve - koyu altın ince çizgi
      ctx.strokeStyle = "#8b7355";
      ctx.lineWidth = 1.2;
      ctx.strokeRect(16, 16, w - 32, h - 32);

      // İç ince çerçeve
      ctx.strokeStyle = "#8b7355";
      ctx.lineWidth = 0.5;
      ctx.strokeRect(22, 22, w - 44, h - 44);

      // Dört köşede küçük yaprak/çiçek ornamanı
      const drawCornerOrnament = (cx: number, cy: number, flipX: number, flipY: number) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(flipX, flipY);
        ctx.strokeStyle = "#8b7355";
        ctx.lineWidth = 0.8;
        ctx.fillStyle = "#a68b5b40";

        // Yaprak
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(10, -4, 18, -10, 22, -20);
        ctx.bezierCurveTo(14, -14, 6, -8, 0, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Küçük yaprak
        ctx.beginPath();
        ctx.moveTo(4, -2);
        ctx.bezierCurveTo(2, -8, -2, -12, -8, -14);
        ctx.bezierCurveTo(-4, -8, 0, -4, 4, -2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      };

      drawCornerOrnament(40, 40, 1, 1);
      drawCornerOrnament(w - 40, 40, -1, 1);
      drawCornerOrnament(40, h - 40, 1, -1);
      drawCornerOrnament(w - 40, h - 40, -1, -1);

      // Tarih
      ctx.fillStyle = "#6b5a42";
      ctx.font = "italic 12px 'Merienda-Canvas', serif";
      ctx.textAlign = "center";
      ctx.fillText(weddingDateStr, w / 2, 75);

      // Gelin ismi
      ctx.fillStyle = "#3d2f20";
      ctx.font = "400 44px 'Merienda-Canvas', serif";
      ctx.fillText(brideFirst, w / 2, 135);

      // & ornament
      ctx.fillStyle = "#8b7355";
      ctx.font = "italic 28px 'Merienda-Canvas', serif";
      ctx.fillText("&", w / 2, 180);

      // İnce çizgiler & yanında
      ctx.strokeStyle = "#8b7355";
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(w / 2 - 70, 172);
      ctx.lineTo(w / 2 - 22, 172);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(w / 2 + 22, 172);
      ctx.lineTo(w / 2 + 70, 172);
      ctx.stroke();

      // Damat ismi
      ctx.fillStyle = "#3d2f20";
      ctx.font = "400 44px 'Merienda-Canvas', serif";
      ctx.fillText(groomFirst, w / 2, 225);

      // Tagline
      ctx.fillStyle = "#6b5a42";
      ctx.font = "bold 9px sans-serif";
      const tag1 = t("tableCardTagline1");
      const tag2 = t("tableCardTagline2");
      ctx.fillText(tag1.toUpperCase(), w / 2, 285);
      ctx.fillText(tag2.toUpperCase(), w / 2, 300);

      // QR kodu
      const svgEl = el.querySelector("svg");
      if (svgEl) {
        const svgData = new XMLSerializer().serializeToString(svgEl);
        try {
          const qrImg = await loadSvgImage(svgData);
          const qrSize = 130;
          const qrX = (w - qrSize) / 2;
          const qrY = 325;

          // Beyaz arka plan
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16);
          // İnce çerçeve
          ctx.strokeStyle = "#8b7355";
          ctx.lineWidth = 0.6;
          ctx.strokeRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16);

          ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
        } catch {
          /* QR render başarısız olursa place-holder çizelim */
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(w / 2 - 65, 325, 130, 130);
        }
      }

      // uygundavet.com
      ctx.fillStyle = "#8b735580";
      ctx.font = "8px sans-serif";
      ctx.fillText("uygundavet.com", w / 2, 480);

      const filename = `masa-karti-${brideFirst}-${groomFirst}`.toLowerCase().replace(/\s+/g, "-") + ".png";

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
      console.error("Table card download failed:", err);
      toast.error(
        err instanceof Error && err.message
          ? `İndirilemedi: ${err.message}`
          : "Masa kartı indirilemedi"
      );
    } finally {
      setDownloading(false);
    }
  }, [brideFirst, groomFirst, weddingDateStr, t]);

  return (
    <div className="space-y-3 w-full max-w-[200px]">
      <div
        ref={qrRef}
        className="relative aspect-[7/10] rounded-md overflow-hidden shadow-sm"
        style={{
          backgroundColor: "#f5f0e8",
          border: "1px solid #8b7355",
          backgroundImage:
            "linear-gradient(#f5f0e8, #f5f0e8), repeating-linear-gradient(45deg, transparent, transparent 20px, #8b735508 20px, #8b735508 21px)",
        }}
      >
        <div
          className="absolute inset-1.5 border border-[#8b7355]/50"
          aria-hidden
        />
        <div className="relative h-full flex flex-col items-center justify-between py-4 px-3 text-center">
          <div className="space-y-1">
            <p
              className="text-[9px] italic"
              style={{ color: "#6b5a42", fontFamily: "var(--font-merienda), serif" }}
            >
              {weddingDateStr}
            </p>
          </div>

          <div className="flex flex-col items-center gap-0.5">
            <p
              className="text-[22px] leading-none"
              style={{ color: "#3d2f20", fontFamily: "var(--font-merienda), serif" }}
            >
              {brideFirst}
            </p>
            <div className="flex items-center gap-2 my-0.5">
              <span className="h-px w-6 bg-[#8b7355]/60" />
              <span
                className="italic text-sm"
                style={{ color: "#8b7355", fontFamily: "var(--font-merienda), serif" }}
              >
                &
              </span>
              <span className="h-px w-6 bg-[#8b7355]/60" />
            </div>
            <p
              className="text-[22px] leading-none"
              style={{ color: "#3d2f20", fontFamily: "var(--font-merienda), serif" }}
            >
              {groomFirst}
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 w-full">
            <p
              className="text-[6.5px] font-bold tracking-wide leading-tight px-1"
              style={{ color: "#6b5a42" }}
            >
              {t("tableCardTagline1").toUpperCase()}
              <br />
              {t("tableCardTagline2").toUpperCase()}
            </p>
            <div className="bg-white p-1 border border-[#8b7355]/40">
              <QRCodeSVG
                value={url}
                size={80}
                bgColor="#ffffff"
                fgColor="#3d2f20"
                level="M"
              />
            </div>
            <p className="text-[6px] text-[#8b7355]/70">uygundavet.com</p>
          </div>
        </div>
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
        {t("downloadTableCard")}
      </Button>
    </div>
  );
}
