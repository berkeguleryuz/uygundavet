"use client";

import { useRef, useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { QRCodeSVG } from "qrcode.react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { downloadNodeAsPng } from "./downloadFromDom";

interface TableCardQrProps {
  url: string;
  brideFirst: string;
  groomFirst: string;
  weddingDateStr: string;
}

export function TableCardQr({
  url,
  brideFirst,
  groomFirst,
  weddingDateStr,
}: TableCardQrProps) {
  const t = useTranslations("Dashboard");
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    const el = cardRef.current;
    if (!el) return;
    setDownloading(true);
    try {
      const filename = `masa-karti-${brideFirst}-${groomFirst}`
        .toLowerCase()
        .replace(/\s+/g, "-");
      await downloadNodeAsPng(el, filename, { pixelRatio: 6 });
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
  }, [brideFirst, groomFirst]);

  return (
    <div className="flex flex-col gap-3 w-full max-w-[200px]">
      <div
        ref={cardRef}
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
              {t("tableCardTagline1").toLocaleUpperCase("tr-TR")}
              <br />
              {t("tableCardTagline2").toLocaleUpperCase("tr-TR")}
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
            <p
              className="text-[6px] text-[#8b7355]/70"
              style={{ fontFamily: "var(--font-merienda), serif" }}
            >
              uygundavet.com
            </p>
          </div>
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
        {t("downloadTableCard")}
      </Button>
    </div>
  );
}
