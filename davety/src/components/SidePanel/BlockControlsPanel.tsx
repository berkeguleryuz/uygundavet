"use client";

import { useTranslations } from "next-intl";
import {
  Eye,
  EyeOff,
  Image as ImageIcon,
  Calendar,
  MapPin,
  Sliders,
  Info,
} from "lucide-react";
import { DECORATION_ICONS } from "@davety/renderer";
import { useEditorStore } from "@/src/store/editor-store";
import { useUIStore } from "@/src/store/ui-store";
import { useAssetUpload } from "@/src/hooks/useAssetUpload";

export function BlockControlsPanel() {
  const t = useTranslations("Editor.block");

  const doc = useEditorStore((s) => s.doc);
  const docId = useEditorStore((s) => s.docId);
  const toggleVisibility = useEditorStore((s) => s.toggleVisibility);
  const updateBlockData = useEditorStore((s) => s.updateBlockData);
  const blockId = useUIStore((s) => s.selectedBlockId);
  const selectField = useUIStore((s) => s.selectField);

  const { pick, busy: uploading } = useAssetUpload(docId);

  if (!doc || !blockId) return null;
  const block = doc.blocks.find((b) => b.id === blockId);
  if (!block) return null;

  const supportsMedia = ["hero", "gallery", "story_timeline"].includes(block.type);

  async function handleUpload() {
    const media = await pick("image/*,video/*");
    if (!media || !blockId) return;
    if (block!.type === "hero") {
      updateBlockData(blockId, { media });
    } else if (block!.type === "gallery") {
      const existing = (block!.data as { items?: unknown[] }).items ?? [];
      updateBlockData(blockId, { items: [...existing, media] });
    }
  }

  return (
    <div className="p-5 flex flex-col gap-4">
      <header className="flex items-center gap-2">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
          {block.type}
        </span>
      </header>

      {block.type === "hero" ? (
        <HeroVariantPicker
          value={(block.data as { variant?: string }).variant ?? "classic"}
          onChange={(variant) => updateBlockData(blockId, { variant })}
        />
      ) : null}

      {block.type === "decoration" ? (
        <DecorationBlockEditor
          data={
            block.data as {
              iconKey?: string;
              sizePx?: number;
              color?: string;
              align?: "left" | "center" | "right";
            }
          }
          onChange={(patch) => updateBlockData(blockId, patch)}
        />
      ) : null}

      <div className="grid grid-cols-3 gap-2 text-[11px]">
        <Chip
          icon={<MapPin className="size-4" />}
          label={t("chooseLocation")}
          disabled={!["venue", "event_program", "contact"].includes(block.type)}
          onClick={() => selectField(blockId, "venueAddress")}
        />
        <Chip
          icon={<Calendar className="size-4" />}
          label={t("changeDate")}
          disabled={!["countdown"].includes(block.type)}
          onClick={() => {
            // Countdown stores ISO timestamp under data.targetIso.
            // TextStylePanel renders a datetime-local input for this field.
            selectField(blockId, "targetIso");
          }}
        />
        <Chip
          icon={<Info className="size-4" />}
          label={t("enterInfo")}
          onClick={() => selectField(blockId, primaryFieldFor(block.type))}
        />
        <Chip
          icon={<Sliders className="size-4" />}
          label={t("changeSettings")}
          // Open the text/style panel for the block's primary field so the
          // user can adjust fonts, sizes, colors, alignment from there.
          onClick={() => selectField(blockId, primaryFieldFor(block.type))}
        />
        {supportsMedia ? (
          <Chip
            icon={<ImageIcon className="size-4" />}
            label={uploading ? "..." : t("uploadMedia")}
            onClick={handleUpload}
            disabled={uploading}
          />
        ) : (
          <Chip
            icon={<ImageIcon className="size-4" />}
            label={t("uploadMedia")}
            disabled
            onClick={() => {}}
          />
        )}
        <Chip
          icon={block.visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          label={block.visible ? t("hide") : t("show")}
          onClick={() => toggleVisibility(blockId)}
          highlight
        />
      </div>
    </div>
  );
}

/**
 * Returns the field id that best represents the block's "primary" editable
 * text content — used by the Bilgileri Gir / Ayarları Değiştir chips so
 * those buttons always open a useful editing surface, not an empty panel.
 */
function primaryFieldFor(blockType: string): string {
  switch (blockType) {
    case "hero":
      return "description";
    case "memory_book":
      return "prompt";
    case "venue":
    case "event_program":
    case "contact":
      return "venueName";
    case "countdown":
      return "targetIso";
    case "footer":
      return "text";
    case "custom_note":
    case "custom_section":
      return "title";
    case "donation":
      return "title";
    case "rsvp_form":
      return "note";
    default:
      return "body";
  }
}

const HERO_VARIANTS: { key: string; label: string }[] = [
  { key: "classic", label: "Klasik" },
  { key: "arch", label: "Arch" },
  { key: "photo-top", label: "Foto-Üst" },
  { key: "photo-full", label: "Tam Foto" },
  { key: "floral-crown", label: "Çiçek Taç" },
  { key: "monogram-circle", label: "Monogram" },
  { key: "bold-type", label: "Büyük Yazı" },
  { key: "botanical-frame", label: "Botanik" },
];

function HeroVariantPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="text-[11px] text-muted-foreground mb-1.5">Kart Düzeni</div>
      <div className="grid grid-cols-4 gap-1">
        {HERO_VARIANTS.map((v) => (
          <button
            key={v.key}
            onClick={() => onChange(v.key)}
            className={`px-1 py-1.5 rounded-md border text-[10px] cursor-pointer transition-colors ${
              value === v.key
                ? "bg-foreground text-background border-foreground"
                : "bg-white border-border text-muted-foreground hover:border-foreground/40"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function DecorationBlockEditor({
  data,
  onChange,
}: {
  data: {
    iconKey?: string;
    sizePx?: number;
    color?: string;
    align?: "left" | "center" | "right";
  };
  onChange: (patch: Partial<{
    iconKey: string;
    sizePx: number;
    color: string;
    align: "left" | "center" | "right";
  }>) => void;
}) {
  const size = data.sizePx ?? 64;
  const align = data.align ?? "center";
  return (
    <div className="flex flex-col gap-3 border border-border rounded-md p-3 bg-muted/30">
      <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium">
        Süsleme
      </div>
      <DecorationIconPicker
        value={data.iconKey ?? "heart"}
        color={data.color}
        onChange={(iconKey) => onChange({ iconKey })}
      />
      <label className="flex items-center gap-2 text-[11px]">
        <span className="w-12 text-muted-foreground">Boyut</span>
        <input
          type="range"
          min={24}
          max={160}
          step={4}
          value={size}
          onChange={(e) => onChange({ sizePx: Number(e.target.value) })}
          className="flex-1 cursor-pointer"
        />
        <span className="w-9 text-right tabular-nums">{size}px</span>
      </label>
      <label className="flex items-center gap-2 text-[11px]">
        <span className="w-12 text-muted-foreground">Renk</span>
        <input
          type="color"
          value={data.color ?? "#252224"}
          onChange={(e) => onChange({ color: e.target.value })}
          className="h-7 w-10 rounded border border-border cursor-pointer"
        />
        <button
          type="button"
          onClick={() => onChange({ color: undefined })}
          className="text-[10px] underline text-muted-foreground hover:text-foreground cursor-pointer"
        >
          temaya bırak
        </button>
      </label>
      <div className="flex items-center gap-2 text-[11px]">
        <span className="w-12 text-muted-foreground">Hizala</span>
        <div className="flex flex-1 rounded-md border border-border overflow-hidden">
          {(["left", "center", "right"] as const).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => onChange({ align: a })}
              className={`flex-1 py-1.5 text-[10px] uppercase tracking-wider cursor-pointer transition-colors ${
                align === a
                  ? "bg-foreground text-background"
                  : "bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              {a === "left" ? "Sol" : a === "right" ? "Sağ" : "Orta"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function DecorationIconPicker({
  value,
  color,
  onChange,
}: {
  value: string;
  color?: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-6 gap-1 max-h-40 overflow-y-auto pr-1">
      {DECORATION_ICONS.map((i) => (
        <button
          key={i.id}
          type="button"
          onClick={() => onChange(i.id)}
          title={i.label}
          className={`aspect-square rounded border flex items-center justify-center cursor-pointer transition-colors ${
            value === i.id
              ? "border-primary bg-primary/10"
              : "border-border bg-background hover:border-foreground/40"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke={color ?? "currentColor"}
            strokeWidth={1.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
            dangerouslySetInnerHTML={{ __html: i.svg }}
          />
        </button>
      ))}
    </div>
  );
}

function Chip({
  icon,
  label,
  onClick,
  highlight,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  highlight?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center gap-1 rounded-md border p-3 text-center leading-tight ${
        disabled
          ? "border-border opacity-40 cursor-not-allowed"
          : highlight
          ? "border-accent bg-accent/10 text-accent-foreground cursor-pointer hover:bg-accent/20"
          : "border-border cursor-pointer hover:bg-muted"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
