"use client";

import { Image as ImageIcon, Trash2 } from "lucide-react";
import { useEditorStore } from "@/src/store/editor-store";
import { useAssetUpload } from "@/src/hooks/useAssetUpload";
import { ENVELOPE_PRESETS } from "@/src/components/envelopes/envelopePresets";
import { deriveLiningBg } from "@/src/components/envelopes/resolveEnvelope";

/** Serializable subset of an envelope preset — only colors + lining pattern
 *  end up persisted in theme.envelope. JSX-only decorations (twine, window
 *  cutout, wax seal components) cannot be saved as theme data, so they are
 *  intentionally skipped when applying a preset. liningBg is derived from
 *  the envelope color so the thumbnails (and the saved theme) match the
 *  warm tone-matched lining the renderer actually shows. */
function serializePreset(p: (typeof ENVELOPE_PRESETS)[number]) {
  const props = p.props;
  const envelopeColor = props.envelopeColor as string | undefined;
  return {
    color: envelopeColor,
    // Default flap = envelope. A unified single-color silhouette reads
    // more elegantly than a two-tone envelope; the user can pick a
    // separate flap color anytime from the side panel if they want
    // contrast.
    flapColor: envelopeColor,
    liningBg: deriveLiningBg(envelopeColor),
    liningPattern: props.liningPattern as string | undefined,
  };
}

const PATTERNS: { id: string; label: string }[] = [
  { id: "none", label: "Düz" },
  { id: "daisy", label: "Papatya" },
  { id: "rose", label: "Gül" },
  { id: "floral", label: "Çiçek" },
  { id: "leaves", label: "Yaprak" },
  { id: "waves", label: "Dalga" },
  { id: "damask", label: "Damask" },
  { id: "gold", label: "Altın" },
  { id: "chevron", label: "Şevron" },
];

export function EnvelopeTab() {
  const doc = useEditorStore((s) => s.doc);
  const docId = useEditorStore((s) => s.docId);
  const updateTheme = useEditorStore((s) => s.updateTheme);
  const { pick, busy: uploading } = useAssetUpload(docId);

  if (!doc) return null;
  const env = doc.theme.envelope;
  const liningBg = env.liningBg ?? "#1f1c17";
  const stampEnabled = env.stampEnabled ?? true;
  const stampColor = env.stampColor ?? "#b85450";
  const stampLabel = env.stampLabel ?? "";
  const stampImage = env.stampImage ?? "";

  const merge = (patch: Record<string, unknown>) =>
    updateTheme({ envelope: { ...env, ...patch } });

  async function handleStampUpload() {
    const media = await pick("image/*");
    if (media?.url) merge({ stampImage: media.url });
  }

  function applyPreset(preset: (typeof ENVELOPE_PRESETS)[number]) {
    const next = serializePreset(preset);
    const cleaned: Record<string, unknown> = { presetId: preset.id };
    for (const [k, v] of Object.entries(next)) {
      if (v !== undefined) cleaned[k] = v;
    }
    merge(cleaned);
  }

  return (
    <div className="border-t border-border pt-4 mt-2 flex flex-col gap-4">
      <div className="text-xs font-medium">Zarf Tasarımı</div>

      <div>
        <div className="text-[11px] text-muted-foreground mb-2">
          Hazır Zarf Tasarımları
        </div>
        <div className="grid grid-cols-2 gap-2 max-h-[260px] overflow-y-auto pr-1">
          {ENVELOPE_PRESETS.map((p) => {
            const props = serializePreset(p);
            const active = env.presetId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => applyPreset(p)}
                className={`flex flex-col gap-1.5 rounded-lg border p-2 cursor-pointer text-left transition-colors hover:border-primary ${
                  active ? "border-primary ring-2 ring-primary/20" : "border-border"
                }`}
              >
                <div className="flex gap-1 w-full h-6">
                  <div
                    className="flex-1 rounded"
                    style={{ background: props.color ?? "#f5eedb" }}
                  />
                  <div
                    className="w-5 rounded"
                    style={{ background: props.flapColor ?? props.color ?? "#eee0be" }}
                  />
                  <div
                    className="w-5 rounded"
                    style={{ background: props.liningBg ?? "#1f1c17" }}
                  />
                </div>
                <div className="text-[10px] font-medium leading-tight">
                  {p.name}
                </div>
              </button>
            );
          })}
        </div>
        <p className="mt-1.5 text-[10px] text-muted-foreground/80">
          Tüm görsel öğeler (kurdela, mum mührü, pencere, kraft dokusu vb.)
          uygulanır. Aşağıdan renkleri ve pulu özelleştirebilirsin.
        </p>
      </div>

      <ColorRow
        label="Zarf Rengi"
        hint="Zarfın dış gövde rengi (kapağın arkasındaki kısım)."
        value={env.color}
        onChange={(v) => merge({ color: v })}
      />

      <ColorRow
        label="Kapak Rengi"
        hint="Kapağın dış (kağıt) rengi — açıldığında kenarlarda görünür."
        value={env.flapColor}
        onChange={(v) => merge({ flapColor: v })}
      />

      <ColorRow
        label="İç Astar Rengi"
        hint="Kapak açılınca görünen iç dolgu rengi (desenin arka planı)."
        value={liningBg}
        onChange={(v) => merge({ liningBg: v })}
      />

      <div>
        <label className="text-[11px] text-muted-foreground">İç Astar Deseni</label>
        <div className="mt-1 grid grid-cols-3 gap-1">
          {PATTERNS.map((p) => (
            <button
              key={p.id}
              onClick={() => merge({ liningPattern: p.id })}
              className={`text-[11px] py-2 rounded-md border cursor-pointer ${
                env.liningPattern === p.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:bg-muted"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-3 flex flex-col gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={stampEnabled}
            onChange={(e) => merge({ stampEnabled: e.target.checked })}
            className="size-4 rounded cursor-pointer"
          />
          <span className="text-xs font-medium">Pul Göster</span>
        </label>

        {stampEnabled ? (
          <>
            <ColorRow
              label="Pul Rengi"
              value={stampColor}
              onChange={(v) => merge({ stampColor: v })}
            />

            <div>
              <label className="text-[11px] text-muted-foreground block">
                Pul Yazısı
              </label>
              <p className="text-[10px] text-muted-foreground/80 mt-0.5">
                Kısa harfler/baş harfler önerilir (ör. H&amp;İ).
              </p>
              <input
                type="text"
                value={stampLabel}
                onChange={(e) => merge({ stampLabel: e.target.value })}
                placeholder="H&İ"
                disabled={!!stampImage}
                className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm disabled:opacity-50"
              />
              {stampImage ? (
                <p className="mt-1 text-[10px] text-muted-foreground">
                  Görsel seçili — yazı görünmüyor.
                </p>
              ) : null}
            </div>

            <div>
              <label className="text-[11px] text-muted-foreground block">
                Pul Görseli
              </label>
              <p className="text-[10px] text-muted-foreground/80 mt-0.5">
                Yüklersen pul yazısının yerine bu görsel basılır.
              </p>
              {stampImage ? (
                <div className="mt-2 flex items-center gap-2 p-2 border border-border rounded-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={stampImage}
                    alt="Pul"
                    className="w-12 h-14 object-cover rounded"
                  />
                  <div className="flex-1 text-[11px] text-muted-foreground truncate">
                    Görsel yüklü
                  </div>
                  <button
                    onClick={() => merge({ stampImage: undefined })}
                    title="Kaldır"
                    className="p-1.5 rounded hover:bg-destructive hover:text-destructive-foreground cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleStampUpload}
                  disabled={uploading}
                  className="mt-1 w-full inline-flex items-center justify-center gap-1.5 rounded-md border border-border py-2 text-xs cursor-pointer hover:bg-muted disabled:opacity-50"
                >
                  <ImageIcon className="size-3.5" />
                  {uploading ? "Yükleniyor…" : "Görsel Yükle"}
                </button>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function ColorRow({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-[11px] text-muted-foreground block">{label}</label>
      {hint ? (
        <p className="text-[10px] text-muted-foreground/80 mt-0.5">{hint}</p>
      ) : null}
      <div className="mt-1 flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-9 h-9 rounded-md border border-input bg-background cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-md border border-input bg-background px-2 py-1.5 text-[11px] font-mono"
        />
      </div>
    </div>
  );
}
