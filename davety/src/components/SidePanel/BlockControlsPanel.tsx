"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Eye,
  EyeOff,
  Image as ImageIcon,
  Calendar,
  MapPin,
  Sliders,
  Info,
  ArrowUp,
  ArrowDown,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { DECORATION_ICONS, DECORATION_CATEGORIES } from "@davety/renderer";
import { useEditorStore } from "@/src/store/editor-store";
import { useUIStore } from "@/src/store/ui-store";
import { useAssetUpload } from "@/src/hooks/useAssetUpload";
import { useConfirm } from "@/src/components/ConfirmDialog";
import { SpacingControl } from "./controls/SpacingControl";
import { FocalPointPicker } from "./controls/FocalPointPicker";
import { DECORATION_TEMPLATE_CATEGORIES } from "@/src/components/decorations/templateManifest";

export function BlockControlsPanel() {
  const t = useTranslations("Editor.block");
  const tBlocks = useTranslations("Blocks");

  const doc = useEditorStore((s) => s.doc);
  const docId = useEditorStore((s) => s.docId);
  const toggleVisibility = useEditorStore((s) => s.toggleVisibility);
  const updateBlockData = useEditorStore((s) => s.updateBlockData);
  const updateBlockStyle = useEditorStore((s) => s.updateBlockStyle);
  const moveBlock = useEditorStore((s) => s.moveBlock);
  const deleteBlock = useEditorStore((s) => s.deleteBlock);
  const blockId = useUIStore((s) => s.selectedBlockId);
  const selectField = useUIStore((s) => s.selectField);
  const selectBlock = useUIStore((s) => s.selectBlock);
  const confirm = useConfirm();

  const { pick, busy: uploading } = useAssetUpload(docId);

  if (!doc || !blockId) return null;
  const block = doc.blocks.find((b) => b.id === blockId);
  if (!block) return null;

  const blockIndex = doc.blocks.findIndex((b) => b.id === blockId);
  const blockLabel = blockTypeLabel(block.type, tBlocks);

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
      <header className="flex items-center justify-between gap-2">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
          {blockLabel}
        </span>
        {/* Blok aksiyonları: clip-path'lı kart şekillerinde canvas
            üstündeki floating bar bazen erişilemez kalabilir, bu
            yüzden aynı kontroller (yukarı/aşağı taşı, gizle/göster,
            sil) burada da bulunur. Sağ panel her durumda görünür. */}
        <div className="flex items-center gap-1">
          <PanelIconBtn
            title="Yukarı taşı"
            disabled={blockIndex <= 0}
            onClick={() => moveBlock(blockId, blockIndex - 1)}
          >
            <ArrowUp className="size-3.5" />
          </PanelIconBtn>
          <PanelIconBtn
            title="Aşağı taşı"
            disabled={blockIndex >= doc.blocks.length - 1}
            onClick={() => moveBlock(blockId, blockIndex + 1)}
          >
            <ArrowDown className="size-3.5" />
          </PanelIconBtn>
          <PanelIconBtn
            title={block.visible ? "Gizle" : "Göster"}
            onClick={() => toggleVisibility(blockId)}
          >
            {block.visible ? (
              <EyeOff className="size-3.5" />
            ) : (
              <Eye className="size-3.5" />
            )}
          </PanelIconBtn>
          <PanelIconBtn
            title={
              block.locked
                ? "Bu blok silinemez (işlevsel). Gizleyebilirsin."
                : "Sil"
            }
            danger
            disabled={!!block.locked}
            onClick={async () => {
              if (block.locked) return;
              const ok = await confirm({
                title: "Bloğu sil",
                description:
                  "Bu bloğu silmek istediğine emin misin? Bu işlem geri alınabilir (Ctrl+Z).",
                confirmLabel: "Sil",
                cancelLabel: "Vazgeç",
                variant: "danger",
              });
              if (ok) {
                deleteBlock(blockId);
                selectBlock(null);
              }
            }}
          >
            <Trash2 className="size-3.5" />
          </PanelIconBtn>
        </div>
      </header>

      {block.type === "hero" ? (
        <HeroVariantPicker
          value={(block.data as { variant?: string }).variant ?? "classic"}
          onChange={(variant) => updateBlockData(blockId, { variant })}
        />
      ) : null}

      {/* Hero foto odak noktası: kullanıcı yüklediği fotoğrafın
          neresini frame içinde tutacağını seçer. media (yeni upload'lar)
          ve photoUrl (sample template'lerden gelen) iki kaynak da
          destekleniyor. Sadece hero bloğunda + bir görsel varsa görünür. */}
      {block.type === "hero" ? (() => {
        const data = block.data as {
          media?: { url?: string; focalX?: number; focalY?: number };
          photoUrl?: string;
          photoFocalX?: number;
          photoFocalY?: number;
          photoHeight?: number;
          variant?: string;
        };
        const hasMedia = !!(data.media?.url || data.photoUrl);
        if (!hasMedia) return null;
        // Yükseklik slider'ı sadece photo-top varyantında anlamlı,
        // photo-full zaten tam ekran, arch'ın görsel alanı yok.
        const showHeightSlider = data.variant === "photo-top";
        return (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium">
                Görsel Odak Noktası
              </div>
              {data.media?.url ? (
                <FocalPointPicker
                  imageUrl={data.media.url}
                  focalX={data.media.focalX ?? 50}
                  focalY={data.media.focalY ?? 50}
                  onChange={(x, y) =>
                    updateBlockData(blockId, {
                      media: { ...data.media, focalX: x, focalY: y },
                    })
                  }
                />
              ) : (
                <FocalPointPicker
                  imageUrl={data.photoUrl!}
                  focalX={data.photoFocalX ?? 50}
                  focalY={data.photoFocalY ?? 50}
                  onChange={(x, y) =>
                    updateBlockData(blockId, {
                      photoFocalX: x,
                      photoFocalY: y,
                    })
                  }
                />
              )}
            </div>

            {showHeightSlider ? (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium">
                    Görsel Yüksekliği
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateBlockData(blockId, { photoHeight: undefined })
                    }
                    className="text-[10px] text-muted-foreground hover:underline cursor-pointer"
                  >
                    sıfırla
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={120}
                    max={420}
                    step={4}
                    value={data.photoHeight ?? 224}
                    onChange={(e) =>
                      updateBlockData(blockId, {
                        photoHeight: Number(e.target.value),
                      })
                    }
                    className="flex-1 cursor-pointer"
                  />
                  <span className="text-[11px] tabular-nums text-muted-foreground w-12 text-right">
                    {data.photoHeight ?? 224}px
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        );
      })() : null}

      {block.type === "decoration" ? (
        <DecorationBlockEditor
          data={
            block.data as {
              iconKey?: string;
              svgRaw?: string;
              sizePx?: number;
              color?: string;
              align?: "left" | "center" | "right";
            }
          }
          onChange={(patch) => {
            // DecorationView öncelik sırası: svgRaw > iconKey. Mini ikon
            // seçilince svgRaw'ı sıfırla, template seçilince iconKey'i
            // sıfırla, böylece picker'lar arası geçiş bekleneni yapar.
            if (patch.iconKey !== undefined) {
              updateBlockData(blockId, { ...patch, svgRaw: undefined });
            } else if (patch.svgRaw !== undefined) {
              updateBlockData(blockId, { ...patch, iconKey: undefined });
            } else {
              updateBlockData(blockId, patch);
            }
          }}
        />
      ) : null}

      <div className="grid grid-cols-3 gap-2 text-[11px]">
        <Chip
          icon={<MapPin className="size-4" />}
          label={t("chooseLocation")}
          disabled={!["venue", "contact"].includes(block.type)}
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
          // "*" sentinel field id, TextStylePanel'i blok-seviye stil
          // moduna alır. Font/size/color/align değişikliği tüm fields'a
          // uygulanır (her field'ı ayrı ayrı tıklamaya gerek yok).
          // Özellikle families bloğunda "Gelinin Ailesi" + "Damadın
          // Ailesi"ni tek tıkla beraber düzenlemek için.
          onClick={() => selectField(blockId, "*")}
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

      <SpacingControl
        paddingTop={block.style.paddingTop}
        paddingBottom={block.style.paddingBottom}
        onChange={(patch) => updateBlockStyle(blockId, patch)}
      />
    </div>
  );
}


/**
 * Returns the field id that best represents the block's "primary" editable
 * text content, used by the Bilgileri Gir / Ayarları Değiştir chips so
 * those buttons always open a useful editing surface, not an empty panel.
 */
function primaryFieldFor(blockType: string): string {
  switch (blockType) {
    case "hero":
      return "description";
    case "memory_book":
      return "prompt";
    case "event_program":
      // Etkinlik programı için "ana içerik" satır listesidir, saat ve
      // etiketleri buradan düzenlenir.
      return "items";
    case "gallery":
      // Galeri için ana içerik medya listesi, yükle/sil/sırala buradan.
      return "items";
    case "venue":
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
      // Bağış için ana editör IBAN, kullanıcı para göndermesi için
      // bunu yazmadan blok eksik kalır.
      return "iban";
    case "rsvp_form":
      return "note";
    case "story_timeline":
      // Hikayemiz items list, bu olmadan render edilecek bir şey yok.
      return "items";
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
    svgRaw?: string;
    sizePx?: number;
    color?: string;
    align?: "left" | "center" | "right";
  };
  onChange: (patch: Partial<{
    iconKey: string;
    svgRaw: string;
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

      <UnifiedDecorationPicker
        selectedIconKey={data.iconKey}
        color={data.color}
        onPickIcon={(iconKey) => onChange({ iconKey })}
        onPickTemplate={(svgRaw) => onChange({ svgRaw, sizePx: 220 })}
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

/**
 * Tüm süslemeler tek bir picker'da, eski "Mini İkonlar / Hazır Şablonlar"
 * iki sekmeli yapı kaldırıldı. SVG'ler nasılsa aynı boyda render edildiği
 * için ayırmaya gerek yok; "Hepsi" + kategori chip'leriyle filtreleniyor.
 *
 * İki kaynaktan gelen item'lar tek listeye birleştiriliyor:
 *   - inline catalog ikonları (`DECORATION_ICONS`) → onPickIcon(iconKey)
 *   - public şablonlar (`DECORATION_TEMPLATE_CATEGORIES`) → fetch → onPickTemplate(svgRaw)
 */
type UnifiedItem =
  | {
      kind: "icon";
      id: string;
      label: string;
      categoryKey: string;
      categoryLabel: string;
      svg: string;
    }
  | {
      kind: "template";
      id: string;
      categoryKey: string;
      categoryLabel: string;
      url: string;
    };

function UnifiedDecorationPicker({
  selectedIconKey,
  color,
  onPickIcon,
  onPickTemplate,
}: {
  selectedIconKey: string | undefined;
  color: string | undefined;
  onPickIcon: (iconKey: string) => void;
  onPickTemplate: (svgRaw: string) => void;
}) {
  const [activeKey, setActiveKey] = useState<string>("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  // Tek liste, her chip kategori üzerinden filtre, "all" hepsini gösterir.
  const items = useMemo<UnifiedItem[]>(() => {
    const iconCatLabel = (key: string) =>
      DECORATION_CATEGORIES.find((c) => c.key === key)?.label ?? key;
    const iconItems: UnifiedItem[] = DECORATION_ICONS.map((i) => ({
      kind: "icon",
      id: i.id,
      label: i.label,
      categoryKey: `icon:${i.category}`,
      categoryLabel: iconCatLabel(i.category),
      svg: i.svg,
    }));
    const templateItems: UnifiedItem[] = DECORATION_TEMPLATE_CATEGORIES.flatMap(
      (c) =>
        c.items.map<UnifiedItem>((it) => ({
          kind: "template",
          id: it.id,
          categoryKey: `tpl:${c.key}`,
          categoryLabel: c.label,
          url: it.url,
        }))
    );
    return [...iconItems, ...templateItems];
  }, []);

  // Chip listesi: "Hepsi" + her kaynaktan kategoriler. Sıra: önce mini icon
  // kategorileri (kısa), sonra template kategorileri.
  const chips = useMemo(() => {
    const seen = new Set<string>();
    const out: { key: string; label: string }[] = [
      { key: "all", label: "Hepsi" },
    ];
    for (const it of items) {
      if (seen.has(it.categoryKey)) continue;
      seen.add(it.categoryKey);
      out.push({ key: it.categoryKey, label: it.categoryLabel });
    }
    return out;
  }, [items]);

  const filtered =
    activeKey === "all"
      ? items
      : items.filter((it) => it.categoryKey === activeKey);

  async function handlePick(it: UnifiedItem) {
    if (it.kind === "icon") {
      onPickIcon(it.id);
      return;
    }
    setBusyId(it.id);
    try {
      const res = await fetch(it.url);
      if (!res.ok) throw new Error("fetch failed");
      const svgRaw = await res.text();
      onPickTemplate(svgRaw);
    } catch {
      toast.error("Şablon yüklenemedi");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto pr-1">
        {chips.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setActiveKey(c.key)}
            className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border cursor-pointer transition-colors ${
              activeKey === c.key
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-muted-foreground border-border hover:border-foreground/40"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div
        className="grid grid-cols-5 gap-1 max-h-44 overflow-y-auto pr-1"
        style={{ color: color ?? "currentColor" }}
      >
        {filtered.map((it) => {
          const isSelected =
            it.kind === "icon" && it.id === selectedIconKey;
          return (
            <button
              key={`${it.kind}:${it.id}`}
              type="button"
              onClick={() => handlePick(it)}
              disabled={it.kind === "template" && busyId === it.id}
              title={it.kind === "icon" ? it.label : it.id}
              className={`aspect-square rounded border flex items-center justify-center cursor-pointer transition-colors p-0.5 disabled:opacity-50 ${
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-border bg-background hover:border-foreground/40"
              }`}
            >
              {it.kind === "icon" ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={color ?? "currentColor"}
                  strokeWidth={1.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-5"
                  dangerouslySetInnerHTML={{ __html: it.svg }}
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={it.url}
                  alt={it.id}
                  className="w-full h-full object-contain"
                  style={{ color: color ?? "currentColor" }}
                />
              )}
            </button>
          );
        })}
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

/**
 * Block type → localized panel başlığı. Side panel header'ında
 * "story_timeline" yerine kullanıcının dilinde "Hikayemiz" göstermek
 * için. Eksik anahtar varsa raw type'a düşer (silent fallback).
 */
function blockTypeLabel(
  type: string,
  t: (key: string) => string
): string {
  const KEY: Record<string, string> = {
    hero: "hero.title",
    countdown: "countdown.title",
    families: "families.title",
    event_program: "eventProgram.title",
    venue: "venue.title",
    story_timeline: "storyTimeline.title",
    gallery: "gallery.title",
    memory_book: "memoryBook.title",
    rsvp_form: "rsvpForm.title",
    donation: "donation.title",
    custom_note: "customNote.title",
    custom_section: "customSection.title",
    contact: "contact.title",
    footer: "footer.title",
    decoration: "decoration.title",
    cta: "cta.title",
  };
  const k = KEY[type];
  if (!k) return type;
  try {
    return t(k);
  } catch {
    return type;
  }
}

/**
 * Header'daki aksiyon butonları için kompakt icon button. Canvas
 * IconBtn'iyle aynı görünüm + davranış, sadece panel tone'una uygun.
 * Yan paneller dar olduğu için size-7'lik kare butonlar tercih edildi.
 */
function PanelIconBtn({
  title,
  onClick,
  disabled,
  danger,
  children,
}: {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={onClick}
      className={`size-7 rounded-md inline-flex items-center justify-center border border-border transition disabled:opacity-40 disabled:cursor-not-allowed ${
        danger && !disabled
          ? "text-destructive hover:bg-destructive/10"
          : "hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}
