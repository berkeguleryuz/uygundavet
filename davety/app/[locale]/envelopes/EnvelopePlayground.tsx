"use client";

import { useState } from "react";
import {
  WeddingEnvelope,
  type StampConfig,
} from "@/src/components/envelopes/WeddingEnvelope";
import { ENVELOPE_PRESETS } from "@/src/components/envelopes/envelopePresets";

export function EnvelopePlayground() {
  const [selected, setSelected] = useState(ENVELOPE_PRESETS[0].id);
  const [guestName, setGuestName] = useState("Ahmet Yılmaz");

  // Stamp customisation state
  const [stampOn, setStampOn] = useState(false);
  const [stampColor, setStampColor] = useState("#b85450");
  const [stampLabel, setStampLabel] = useState("H&İ");
  const [stampBorderStyle, setStampBorderStyle] = useState<
    "dashed" | "solid" | "perforated"
  >("dashed");
  const [stampImage, setStampImage] = useState("");

  const current = ENVELOPE_PRESETS.find((p) => p.id === selected)!;

  const stamp: StampConfig | null = stampOn
    ? {
        color: stampColor,
        label: stampLabel,
        image: stampImage.trim() || undefined,
        borderStyle: stampBorderStyle,
      }
    : null;

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 px-4">
      {/* Pill tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {ENVELOPE_PRESETS.map((p, i) => {
          const active = p.id === selected;
          return (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              className={`px-3 py-2 rounded-full text-[11px] uppercase tracking-[0.12em] border transition-all cursor-pointer ${
                active
                  ? "bg-foreground text-background border-foreground shadow-md"
                  : "bg-white text-foreground border-border hover:border-foreground/50"
              }`}
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              <span className="opacity-50 mr-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              {p.name}
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 max-w-xl mx-auto w-full bg-white rounded-lg border border-border p-4">
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <label
            className="opacity-60 uppercase tracking-wider"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Misafir Adı:
          </label>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="flex-1 px-3 py-1.5 rounded border border-border bg-white text-sm"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          />
        </div>

        <div className="border-t border-border pt-3">
          <label
            className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-70 cursor-pointer"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            <input
              type="checkbox"
              checked={stampOn}
              onChange={(e) => setStampOn(e.target.checked)}
              className="size-4 cursor-pointer"
            />
            Pul Göster
          </label>

          {stampOn ? (
            <div
              className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              <label className="flex items-center gap-2">
                <span className="opacity-60 min-w-20">Arka Plan</span>
                <input
                  type="color"
                  value={stampColor}
                  onChange={(e) => setStampColor(e.target.value)}
                  className="w-10 h-8 rounded cursor-pointer border border-border"
                />
                <input
                  type="text"
                  value={stampColor}
                  onChange={(e) => setStampColor(e.target.value)}
                  className="flex-1 px-2 py-1 text-[11px] font-mono border border-border rounded"
                />
              </label>
              <label className="flex items-center gap-2">
                <span className="opacity-60 min-w-20">Yazı</span>
                <input
                  type="text"
                  value={stampLabel}
                  onChange={(e) => setStampLabel(e.target.value)}
                  placeholder="H&İ"
                  className="flex-1 px-2 py-1 text-sm border border-border rounded"
                />
              </label>
              <label className="flex items-center gap-2 md:col-span-2">
                <span className="opacity-60 min-w-20">Görsel URL</span>
                <input
                  type="text"
                  value={stampImage}
                  onChange={(e) => setStampImage(e.target.value)}
                  placeholder="(opsiyonel — yazının yerine gelir)"
                  className="flex-1 px-2 py-1 text-sm border border-border rounded"
                />
              </label>
              <label className="flex items-center gap-2">
                <span className="opacity-60 min-w-20">Kenar</span>
                <select
                  value={stampBorderStyle}
                  onChange={(e) =>
                    setStampBorderStyle(
                      e.target.value as "dashed" | "solid" | "perforated"
                    )
                  }
                  className="flex-1 px-2 py-1 text-sm border border-border rounded bg-white cursor-pointer"
                >
                  <option value="dashed">Kesik</option>
                  <option value="solid">Düz</option>
                  <option value="perforated">Delikli (pul)</option>
                </select>
              </label>
            </div>
          ) : null}
        </div>
      </div>

      {/* Stage */}
      <div className="flex flex-col items-center gap-4 pt-4 pb-20">
        <div
          className="text-xs uppercase tracking-[0.25em] text-muted-foreground text-center"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          Zarfa tıkla → açılış animasyonu
        </div>
        <div
          key={current.id}
          className="flex items-center justify-center w-full"
        >
          <WeddingEnvelope
            guestName={guestName}
            envelopeWidth={380}
            cardWidth={340}
            cardHeight={640}
            layout="side-by-side"
            stamp={stamp}
            {...current.props}
          />
        </div>
      </div>
    </div>
  );
}
