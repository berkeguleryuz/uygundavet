"use client";

import { useState } from "react";
import { WeddingEnvelope } from "@/src/components/envelopes/WeddingEnvelope";
import { ENVELOPE_PRESETS } from "@/src/components/envelopes/envelopePresets";

export function EnvelopePlayground() {
  const [selected, setSelected] = useState(ENVELOPE_PRESETS[0].id);
  const [guestName, setGuestName] = useState("Ahmet Yılmaz");
  const current = ENVELOPE_PRESETS.find((p) => p.id === selected)!;

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

      {/* Guest name input */}
      <div className="flex items-center justify-center gap-2 text-xs flex-wrap">
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
          className="px-3 py-1.5 rounded border border-border bg-white text-sm"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        />
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
            {...current.props}
          />
        </div>
      </div>
    </div>
  );
}
