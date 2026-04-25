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
          disabled={!["countdown", "story_timeline"].includes(block.type)}
          onClick={() => selectField(blockId, "date")}
        />
        <Chip
          icon={<Info className="size-4" />}
          label={t("enterInfo")}
          onClick={() =>
            selectField(
              blockId,
              block.type === "hero"
                ? "description"
                : block.type === "memory_book"
                ? "prompt"
                : "body"
            )
          }
        />
        <Chip
          icon={<Sliders className="size-4" />}
          label={t("changeSettings")}
          onClick={() => {}}
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
