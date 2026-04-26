"use client";

import { Wand2 } from "lucide-react";
import { useEditorStore } from "@/src/store/editor-store";

interface Preset {
  name: string;
  bgColor: string;
  accentColor: string;
  envelope: { color: string; flapColor: string; liningPattern: string };
}

const PRESETS: Preset[] = [
  {
    name: "Klasik Krem",
    bgColor: "#f5f1e8",
    accentColor: "#6b5a42",
    envelope: { color: "#f5eedb", flapColor: "#eee0be", liningPattern: "daisy" },
  },
  {
    name: "Gül Bahçesi",
    bgColor: "#fdf2f4",
    accentColor: "#8b3a4b",
    envelope: { color: "#f5d5d9", flapColor: "#e8b8bf", liningPattern: "rose" },
  },
  {
    name: "Lavanta",
    bgColor: "#f5f2fb",
    accentColor: "#5b4b8a",
    envelope: { color: "#e4ddf2", flapColor: "#cec2e2", liningPattern: "floral" },
  },
  {
    name: "Orman",
    bgColor: "#f0f4ee",
    accentColor: "#3e5c3a",
    envelope: { color: "#dde7d8", flapColor: "#c0d0b8", liningPattern: "leaves" },
  },
  {
    name: "Altın Gece",
    bgColor: "#1f1c17",
    accentColor: "#d4b886",
    envelope: { color: "#2b2620", flapColor: "#1a1613", liningPattern: "gold" },
  },
  {
    name: "Gökyüzü",
    bgColor: "#eef4f8",
    accentColor: "#2c5a78",
    envelope: { color: "#d9e8f2", flapColor: "#bcd4e4", liningPattern: "waves" },
  },
  {
    name: "Şeftali",
    bgColor: "#fdf5ef",
    accentColor: "#a0593b",
    envelope: { color: "#f5dcc8", flapColor: "#e8c3a8", liningPattern: "peach" },
  },
  {
    name: "Minimal Mono",
    bgColor: "#ffffff",
    accentColor: "#1a1a1a",
    envelope: { color: "#f2f2f2", flapColor: "#e0e0e0", liningPattern: "plain" },
  },
  {
    name: "Bordo Lüks",
    bgColor: "#f8f0ee",
    accentColor: "#5e1a1a",
    envelope: { color: "#e8d1cd", flapColor: "#d2ada6", liningPattern: "damask" },
  },
  {
    name: "Deniz Kabuğu",
    bgColor: "#f8f6f1",
    accentColor: "#7a6a52",
    envelope: { color: "#ecdfcb", flapColor: "#d8c5a5", liningPattern: "shell" },
  },
];

const PATTERNS = [
  { id: "none", label: "Düz" },
  { id: "daisy", label: "Papatya" },
  { id: "rose", label: "Gül" },
  { id: "floral", label: "Çiçek" },
  { id: "leaves", label: "Yaprak" },
  { id: "waves", label: "Dalga" },
  { id: "damask", label: "Damask" },
];

function randomTheme(): Preset {
  const hue = Math.floor(Math.random() * 360);
  const bgSat = 30 + Math.floor(Math.random() * 20);
  const bgLight = 94 + Math.floor(Math.random() * 4);
  const accSat = 40 + Math.floor(Math.random() * 30);
  const accLight = 25 + Math.floor(Math.random() * 20);
  const envSat = 35;
  const envLight = 85;
  const flapLight = 75;
  return {
    name: "Özel",
    bgColor: hslToHex(hue, bgSat, bgLight),
    accentColor: hslToHex(hue, accSat, accLight),
    envelope: {
      color: hslToHex(hue, envSat, envLight),
      flapColor: hslToHex(hue, envSat, flapLight),
      liningPattern: "daisy",
    },
  };
}

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function DesignTab() {
  const theme = useEditorStore((s) => s.doc?.theme);
  const applyPatch = useEditorStore((s) => s.applyPatch);

  if (!theme) return null;

  const applyPreset = (p: Preset) => {
    // Apply the preset AND wipe per-block / per-field color overrides so
    // a previous template's hard-coded dark accent doesn't survive on top
    // of a new bright theme (e.g. Altın Gece's gold accent was being
    // overridden by an old #6b5a42 set on the hero block's coupleNames).
    applyPatch((d) => {
      d.theme.bgColor = p.bgColor;
      d.theme.accentColor = p.accentColor;
      d.theme.envelope = {
        ...(d.theme.envelope ?? {}),
        ...p.envelope,
      };
      for (const block of d.blocks) {
        const data = block.data as Record<string, unknown>;
        if ("accent" in data) {
          (data as { accent?: string }).accent = p.accentColor;
        }
        // Strip stale color from block-level style
        if (block.style && (block.style as { color?: string }).color) {
          delete (block.style as { color?: string }).color;
        }
        // Strip color from each field override (preserve other style props)
        const overrides = block.style?.fieldOverrides;
        if (overrides) {
          for (const id of Object.keys(overrides)) {
            const o = overrides[id] as { color?: string };
            if (o && "color" in o) delete o.color;
          }
        }
      }
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Hazır Temalar</h3>
          <button
            onClick={() => applyPreset(randomTheme())}
            title="Rastgele bir tema oluştur"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer rounded-md border border-border px-2 py-1"
          >
            <Wand2 className="size-3" /> Rastgele
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((p) => {
            const active =
              theme.bgColor === p.bgColor && theme.accentColor === p.accentColor;
            return (
              <button
                key={p.name}
                onClick={() => applyPreset(p)}
                className={`flex flex-col items-start gap-1.5 rounded-lg border p-2 cursor-pointer hover:border-primary transition-colors text-left ${
                  active ? "border-primary ring-2 ring-primary/20" : "border-border"
                }`}
              >
                <div className="flex gap-1 w-full">
                  <div
                    className="flex-1 h-6 rounded"
                    style={{ background: p.bgColor }}
                  />
                  <div
                    className="w-6 h-6 rounded"
                    style={{ background: p.accentColor }}
                  />
                  <div
                    className="w-6 h-6 rounded"
                    style={{ background: p.envelope.color }}
                  />
                </div>
                <div className="text-[11px] font-medium">{p.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Renkler</h3>
        <div className="space-y-2">
          <ColorRow
            label="Arka Plan"
            value={theme.bgColor}
            onChange={(v) => updateTheme({ bgColor: v })}
          />
          <ColorRow
            label="Vurgu / Metin"
            value={theme.accentColor}
            onChange={(v) => updateTheme({ accentColor: v })}
          />
          <ColorRow
            label="Zarf"
            value={theme.envelope.color}
            onChange={(v) =>
              updateTheme({ envelope: { ...theme.envelope, color: v } })
            }
          />
          <ColorRow
            label="Zarf Kapağı"
            value={theme.envelope.flapColor}
            onChange={(v) =>
              updateTheme({ envelope: { ...theme.envelope, flapColor: v } })
            }
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Desen</h3>
        <div className="grid grid-cols-3 gap-1.5">
          {PATTERNS.map((p) => {
            const active =
              (theme.pattern ?? "none") === p.id ||
              (p.id === "none" && !theme.pattern);
            return (
              <button
                key={p.id}
                onClick={() =>
                  updateTheme({ pattern: p.id === "none" ? undefined : p.id })
                }
                className={`text-[11px] px-2 py-1.5 rounded border cursor-pointer hover:bg-muted ${
                  active ? "border-primary bg-muted" : "border-border"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-xs">
      <span className="flex-1 text-muted-foreground">{label}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded cursor-pointer border border-border"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-20 rounded border border-border px-2 py-1 text-[11px] font-mono"
      />
    </label>
  );
}
