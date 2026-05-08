"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Minus,
  Plus,
  Sparkles,
  Strikethrough,
  Underline,
} from "lucide-react";
import {
  DECORATION_ICONS,
  fontCategories,
  filterByCategory,
  type FontCategory,
} from "@davety/renderer";
import { useEditorStore } from "@/src/store/editor-store";
import { useUIStore } from "@/src/store/ui-store";
import { useAssetUpload } from "@/src/hooks/useAssetUpload";
import { cn } from "@/src/lib/utils";
import { getEventLabels } from "@/src/lib/event-labels";
import { planLimitsFor, nextTierLabel } from "@/src/lib/plan-limits";
import {
  InlineDecorationField,
  type InlineDecorationFieldHandle,
} from "./InlineDecorationField";
import { SpacingControl } from "./controls/SpacingControl";

export function TextStylePanel() {
  const t = useTranslations("Editor.textPanel");

  const doc = useEditorStore((s) => s.doc);
  const docId = useEditorStore((s) => s.docId);
  const updateFieldStyle = useEditorStore((s) => s.updateFieldStyle);
  const updateBlockData = useEditorStore((s) => s.updateBlockData);
  const updateBlockStyle = useEditorStore((s) => s.updateBlockStyle);
  const applyPatch = useEditorStore((s) => s.applyPatch);
  const blockId = useUIStore((s) => s.selectedBlockId);
  const fieldId = useUIStore((s) => s.selectedFieldId);

  const [category, setCategory] = useState<FontCategory>("all");
  const [query, setQuery] = useState("");
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  /** Inline süsleme ikonlarını DOM'da gösteren contentEditable alanın
   *  imperative tutamağı, "Süsleme Ekle" butonu cursor pozisyonuna
   *  ikon eklemek için bu API'yi kullanıyor. */
  const inlineFieldRef = useRef<InlineDecorationFieldHandle | null>(null);
  // Computed font-size of the actually-rendered field, measured from the
  // canvas DOM so the panel reflects what the user sees, not the override
  // default (which would otherwise read 24 even when Tailwind has scaled
  // the field to e.g. text-3xl=30px). Without this the +/- buttons can
  // shrink text the user expected to grow.
  const [measuredFontSize, setMeasuredFontSize] = useState<number | null>(null);

  // For fanout fields (e.g. countdown date), read display values from the
  // first underlying cell so the inputs show the actual rendered style.
  const FANOUT_READ: Record<string, string> = {
    targetIso: "days",
  };
  // "*" sentinel = block-level styling mode. Panel hiçbir spesifik
  // field'ı target almaz, doğrudan block.style root'una yazar. Tüm
  // alt-field'lar (override'sız olanlar) bu değeri inherit eder.
  const isBlockMode = fieldId === "*";
  const readFieldId = isBlockMode
    ? ""
    : FANOUT_READ[fieldId ?? ""] ?? fieldId ?? "";
  // Re-measure whenever the user picks a different field/block. Skip the
  // measurement when the user has an explicit override, the override is
  // the source of truth in that case.
  useEffect(() => {
    if (!blockId || !readFieldId) return;
    const block = doc?.blocks.find((b) => b.id === blockId);
    const overrideSize = block?.style.fieldOverrides?.[readFieldId]?.fontSize;
    const blockSize = block?.style.fontSize;
    let cancelled = false;
    let raf = 0;
    queueMicrotask(() => {
      if (cancelled) return;
      if (overrideSize ?? blockSize) {
        setMeasuredFontSize(null);
        return;
      }
      raf = requestAnimationFrame(() => {
        if (cancelled) return;
        const el = document.querySelector<HTMLElement>(
          `[data-block-id="${blockId}"] [data-field-id="${readFieldId}"]`,
        );
        if (!el) {
          setMeasuredFontSize(null);
          return;
        }
        const px = parseFloat(getComputedStyle(el).fontSize);
        if (Number.isFinite(px) && px > 0) {
          setMeasuredFontSize(Math.round(px));
        }
      });
    });
    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
    };
  }, [blockId, readFieldId, doc]);

  if (!doc || !blockId || !fieldId) return null;
  // "*" block-mode'unda fieldId="*" geldiği için aşağıdaki guard'lar
  // doğrudan field-level data'ya bakan kısımları skip eder.
  const block = doc.blocks.find((b) => b.id === blockId);
  if (!block) return null;

  const currentField =
    block.style.fieldOverrides?.[readFieldId] ?? {};
  const fontFamily = currentField.fontFamily ?? block.style.fontFamily ?? "";
  // Resolution order: explicit field override → block-wide style →
  // canvas-measured value → 24px floor. The measured fallback fixes the
  // "+ shrinks text" bug for fields whose size came from a Tailwind class.
  const fontSize =
    currentField.fontSize ?? block.style.fontSize ?? measuredFontSize ?? 24;
  const color = currentField.color ?? block.style.color ?? "#252224";
  const align = block.style.align ?? "center";

  // Some "logical" field IDs map to multiple visual cells. Style edits on
  // the date field need to fan out to all four countdown numbers
  // (days/hours/minutes/seconds), since those are what the user sees and
  // wants to restyle when they pick "Tarihi Değiştir".
  const FANOUT: Record<string, string[]> = {
    targetIso: ["days", "hours", "minutes", "seconds"],
  };
  const update = (patch: Record<string, unknown>) => {
    if (isBlockMode) {
      // Block-level mode, doğrudan block.style'a yaz, tüm field'lar
      // inherit eder.
      updateBlockStyle(blockId, patch);
      return;
    }
    const targets = FANOUT[fieldId] ?? [fieldId];
    for (const id of targets) {
      updateFieldStyle(blockId, id, patch);
    }
  };

  // Raw text-content editing for the selected field. Reads the current value
  // out of block.data and writes it back via updateBlockData so the canvas
  // reflects edits immediately.
  const isCoupleNames = fieldId === "coupleNames";
  const fieldValue = isCoupleNames
    ? undefined
    : extractFieldValue(block.data, fieldId);
  const isDateField = fieldId === "targetIso";
  // Families block fields are nested (data.bride.title / data.bride.members
  // etc.) so the generic content editor can't reach them. We branch into a
  // dedicated editor below.
  const familiesSide: "bride" | "groom" | null =
    block.type === "families" && fieldId.startsWith("bride")
      ? "bride"
      : block.type === "families" && fieldId.startsWith("groom")
        ? "groom"
        : null;
  const familiesPart: "title" | "members" | null = familiesSide
    ? fieldId.endsWith("Members")
      ? "members"
      : "title"
    : null;
  const isFamiliesField = familiesSide !== null;
  // Etkinlik programının "items" alanı saat+etiket dizisidir, düz metin
  // editörüyle düzenlenemez, kendi list editörü vardır.
  const isEventItemsField =
    block.type === "event_program" && fieldId === "items";
  // Galeri "items" alanı MediaRef dizisidir, kendi yükle/sil/sırala
  // editörü vardır.
  const isGalleryItemsField =
    block.type === "gallery" && fieldId === "items";
  // event_program / venue / contact bloklarındaki konum bilgileri
  // schema'da OPTIONAL, kullanıcı henüz girmediğinde data alanı
  // undefined olur ve generic extractFieldValue editör göstermez. Bu
  // bayrak sayesinde alan boş bile olsa input açılıp kullanıcı doldurabilir.
  const isOptionalLocationField =
    ((block.type === "venue" || block.type === "contact") &&
      (fieldId === "venueName" ||
        fieldId === "venueAddress" ||
        fieldId === "mapUrl")) ||
    (block.type === "contact" && fieldId === "phone") ||
    (block.type === "donation" && fieldId === "iban");
  const isStoryItemsField =
    block.type === "story_timeline" && fieldId === "items";
  const showContentEditor =
    !isBlockMode &&
    (isCoupleNames ||
      isDateField ||
      isFamiliesField ||
      isEventItemsField ||
      isGalleryItemsField ||
      isStoryItemsField ||
      isOptionalLocationField ||
      fieldValue !== undefined);
  const fieldLabel = isBlockMode
    ? "Tüm Bloğun Metin Ayarları"
    : fieldLabelFor(fieldId, doc?.meta.eventCategory);
  const isLongText =
    fieldId === "description" || fieldId === "prompt" || fieldId === "body";

  const fonts = filterByCategory(category).filter((f) =>
    query ? f.family.toLowerCase().includes(query.toLowerCase()) : true
  );

  return (
    <div className="p-5 flex flex-col gap-5">
      {/* Field content editor, edit the actual text of the selected field */}
      {showContentEditor ? (
        isEventItemsField ? (
          <EventProgramItemsEditor
            items={
              ((block.data as { items?: import("@davety/schema").EventProgramItem[] }).items) ??
              []
            }
            onChange={(items) => updateBlockData(blockId, { items })}
          />
        ) : isGalleryItemsField ? (
          <GalleryItemsEditor
            docId={docId}
            tier={doc.meta.tier}
            items={
              ((block.data as { items?: import("@davety/schema").MediaRef[] }).items) ??
              []
            }
            onChange={(items) => updateBlockData(blockId, { items })}
          />
        ) : isStoryItemsField ? (
          <StoryTimelineItemsEditor
            items={
              ((block.data as { items?: import("@davety/schema").StoryMilestone[] }).items) ??
              []
            }
            onChange={(items) => updateBlockData(blockId, { items })}
          />
        ) : isOptionalLocationField ? (
          <div>
            <label className="text-[11px] text-muted-foreground block mb-1">
              {fieldLabel}
            </label>
            <input
              value={(block.data[fieldId] as string) ?? ""}
              placeholder={
                fieldId === "venueName"
                  ? "Mekan adı"
                  : fieldId === "venueAddress"
                  ? "Mekan adresi"
                  : fieldId === "phone"
                  ? "+90 555 000 00 00"
                  : fieldId === "iban"
                  ? "TR00 0000 0000 0000 0000 0000 00"
                  : "https://..."
              }
              onChange={(e) =>
                updateBlockData(blockId, { [fieldId]: e.target.value })
              }
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {fieldId === "venueAddress" ? (
              <p className="mt-1.5 text-[10px] text-muted-foreground">
                Boş bırakırsan adres satırı görünmez.
              </p>
            ) : fieldId === "iban" ? (
              <p className="mt-1.5 text-[10px] text-muted-foreground">
                Misafirlerin görüp para gönderebilmesi için IBAN&apos;ını yaz.
              </p>
            ) : null}
          </div>
        ) : isFamiliesField && familiesSide && familiesPart ? (
          <FamiliesFieldEditor
            block={block}
            side={familiesSide}
            part={familiesPart}
            onChange={(patch) => updateBlockData(blockId, patch)}
          />
        ) : isDateField ? (
          <div>
            <label className="text-[11px] text-muted-foreground block mb-1">
              Hedef Tarih ve Saat
            </label>
            <input
              type="datetime-local"
              value={isoToDatetimeLocal(
                (block.data["targetIso"] as string) ?? ""
              )}
              onChange={(e) => {
                const iso = datetimeLocalToIso(e.target.value);
                if (!iso) return;
                updateBlockData(blockId, { targetIso: iso });
                // Mirror into doc.meta so the header countdown, public page,
                // and any envelope-card preview that read meta directly stay
                // in sync with the canvas countdown the user just edited.
                const [date, time] = splitIso(e.target.value);
                applyPatch((d) => {
                  d.meta.weddingDate = date;
                  d.meta.weddingTime = time;
                });
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <p className="mt-1.5 text-[10px] text-muted-foreground">
              Geri sayım bu zamana göre çalışır.
            </p>
          </div>
        ) : isCoupleNames ? (
          (() => {
            const labels = getEventLabels(doc?.meta.eventCategory);
            const showSecond = labels.secondName !== null;
            const groomValue = (block.data["groomName"] as string) ?? "";
            return (
              <div className="flex flex-col gap-2">
                <div className={showSecond ? "grid grid-cols-2 gap-2" : ""}>
                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1">
                      {labels.firstName}
                    </label>
                    <input
                      value={(block.data["brideName"] as string) ?? ""}
                      onChange={(e) =>
                        updateBlockData(blockId, { brideName: e.target.value })
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  {showSecond ? (
                    <div>
                      <label className="text-[11px] text-muted-foreground block mb-1">
                        {labels.secondName}
                      </label>
                      <input
                        value={groomValue}
                        onChange={(e) =>
                          updateBlockData(blockId, { groomName: e.target.value })
                        }
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                    </div>
                  ) : null}
                </div>
                {/* İkinci isim alanını temizle. Couple event'lerde
                    bile (düğün/nişan) tek isimle çalışmak isteyenler
                    için, non-couple event'lerde (doğum günü vs.) eski
                    seed'den kalan "Damat" değerini silmek için.
                    Boşsa link görünmez. Renderer groomName boşsa
                    AndSpacer + ikinci satırı zaten gizliyor. */}
                {groomValue.trim() ? (
                  <button
                    type="button"
                    onClick={() =>
                      updateBlockData(blockId, { groomName: "" })
                    }
                    className="self-start text-[10px] underline text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    İkinci ismi kaldır
                  </button>
                ) : null}
              </div>
            );
          })()
        ) : (
          <div>
            <label className="text-[11px] text-muted-foreground block mb-1">
              {fieldLabel}
            </label>
            <InlineDecorationField
              ref={inlineFieldRef}
              value={(fieldValue as string) ?? ""}
              onChange={(next) =>
                updateBlockData(blockId, { [fieldId]: next })
              }
              multiline={isLongText}
            />
            <InlineDecorationButton
              open={iconPickerOpen}
              onToggle={() => setIconPickerOpen((v) => !v)}
              onPick={(key) => {
                // Inline alan ikonu cursor pozisyonuna ekler ve kendi
                // onChange'ini tetikler, DecorationPreview'a artık
                // ihtiyaç yok, çünkü ikonun kendisi text alanında zaten
                // gözüküyor.
                inlineFieldRef.current?.insertIcon(key);
              }}
            />
          </div>
        )
      ) : null}

      {/* Size + Align + Color + Style row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] text-muted-foreground">{t("size")}</label>
          <div className="mt-1 flex items-center justify-between rounded-md border border-input bg-background">
            <button
              onClick={() => update({ fontSize: Math.max(8, fontSize - 2) })}
              className="p-2 hover:bg-muted cursor-pointer"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="font-chakra text-sm tabular-nums">{fontSize}</span>
            <button
              onClick={() => update({ fontSize: Math.min(200, fontSize + 2) })}
              className="p-2 hover:bg-muted cursor-pointer"
            >
              <Plus className="size-3.5" />
            </button>
          </div>
        </div>

        <div>
          <label className="text-[11px] text-muted-foreground">{t("align")}</label>
          <div className="mt-1 grid grid-cols-4 gap-1 rounded-md border border-input bg-background p-1">
            {(
              [
                ["left", AlignLeft],
                ["center", AlignCenter],
                ["right", AlignRight],
                ["justify", AlignJustify],
              ] as const
            ).map(([val, Icon]) => (
              <button
                key={val}
                onClick={() =>
                  useEditorStore
                    .getState()
                    .updateBlockStyle(blockId, { align: val })
                }
                className={cn(
                  "h-7 flex items-center justify-center rounded cursor-pointer",
                  align === val ? "bg-muted" : "hover:bg-muted/60"
                )}
              >
                <Icon className="size-3.5" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[11px] text-muted-foreground">{t("color")}</label>
          <input
            type="color"
            value={color}
            onChange={(e) => update({ color: e.target.value })}
            className="mt-1 w-full h-9 rounded-md border border-input bg-background cursor-pointer"
          />
        </div>

        <div>
          <label className="text-[11px] text-muted-foreground">{t("style")}</label>
          <div className="mt-1 grid grid-cols-4 gap-1 rounded-md border border-input bg-background p-1">
            {(
              [
                ["bold", Bold],
                ["underline", Underline],
                ["strike", Strikethrough],
                ["italic", Italic],
              ] as const
            ).map(([key, Icon]) => (
              <button
                key={key}
                onClick={() => update({ [key]: !currentField[key] })}
                className={cn(
                  "h-7 flex items-center justify-center rounded cursor-pointer",
                  currentField[key] ? "bg-muted" : "hover:bg-muted/60"
                )}
              >
                <Icon className="size-3.5" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Font picker */}
      <div>
        <label className="text-[11px] text-muted-foreground block mb-1">
          {t("fontStyle")}
        </label>

        <div className="flex gap-1 overflow-x-auto pb-2">
          {fontCategories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "text-[11px] px-3 py-1 rounded-full whitespace-nowrap cursor-pointer",
                category === c
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {t(`categories.${c}` as const)}
            </button>
          ))}
        </div>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("fontSearch")}
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />

        <ul className="mt-2 max-h-64 overflow-y-auto border border-border rounded-md divide-y divide-border">
          {fonts.map((f) => (
            <li key={f.family}>
              <button
                onClick={() => update({ fontFamily: f.family })}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm cursor-pointer",
                  fontFamily === f.family
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted"
                )}
                style={{ fontFamily: `"${f.family}"` }}
              >
                {f.family}
              </button>
            </li>
          ))}
          {fonts.length === 0 ? (
            <li className="px-3 py-4 text-center text-muted-foreground text-xs">
              Sonuç yok
            </li>
          ) : null}
        </ul>
      </div>

      {/* Block-level spacing, surfaced here too so the user can adjust
          the section's top/bottom padding without leaving the text panel
          (the hero & other "tall" blocks open this panel directly when
          their main field is clicked, never the BlockControlsPanel). */}
      <SpacingControl
        paddingTop={block.style.paddingTop}
        paddingBottom={block.style.paddingBottom}
        onChange={(patch) => updateBlockStyle(blockId, patch)}
      />
    </div>
  );
}

function extractFieldValue(
  data: Record<string, unknown>,
  fieldId: string
): string | undefined {
  // Hero "coupleNames" is a composite of brideName + groomName, surface
  // the bride's name and let groomName edit through its own field.
  if (fieldId === "coupleNames") {
    const v = data["brideName"];
    return typeof v === "string" ? v : undefined;
  }
  const v = data[fieldId];
  return typeof v === "string" ? v : undefined;
}

const FIELD_LABELS: Record<string, string> = {
  coupleNames: "Gelin Adı",
  brideName: "Gelin Adı",
  groomName: "Damat Adı",
  subtitle: "Alt Başlık",
  description: "Açıklama",
  title: "Başlık",
  venueName: "Mekan Adı",
  venueAddress: "Mekan Adresi",
  mapUrl: "Harita Bağlantısı",
  phone: "Telefon",
  email: "E-posta",
  iban: "IBAN",
  items: "Satırlar",
  prompt: "Soru / Yönlendirme",
  note: "Not",
  body: "İçerik",
  text: "Metin",
  label: "Etiket",
  brideTitle: "Gelin Tarafı Başlığı",
  brideMembers: "Gelin Tarafı Üyeleri",
  groomTitle: "Damat Tarafı Başlığı",
  groomMembers: "Damat Tarafı Üyeleri",
};

function fieldLabelFor(
  fieldId: string,
  category?: import("@davety/schema").EventCategory,
): string {
  // Couple-name + family-title fields swap to category-specific copy so a
  // birthday or business invitation doesn't show "Gelin Adı" / "Damat
  // Adı" / "Gelinin Ailesi" etc.
  const labels = getEventLabels(category);
  switch (fieldId) {
    case "coupleNames":
    case "brideName":
      return labels.firstName;
    case "groomName":
      return labels.secondName ?? labels.firstName;
    case "brideTitle":
      return labels.family1;
    case "groomTitle":
      return labels.family2;
    case "brideMembers":
      return `${labels.family1} – Üyeler`;
    case "groomMembers":
      return `${labels.family2} – Üyeler`;
    default:
      return FIELD_LABELS[fieldId] ?? "Metin İçeriği";
  }
}

/** Convert "2026-06-15T19:00:00.000Z" → "2026-06-15T19:00" (datetime-local). */
function isoToDatetimeLocal(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

/** Convert "2026-06-15T19:00" → ISO string in local timezone. */
function datetimeLocalToIso(local: string): string | null {
  if (!local) return null;
  const d = new Date(local);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}

/** Split "2026-06-15T19:00" into ["2026-06-15", "19:00"] for doc.meta which
 *  stores date and time as separate fields. */
function splitIso(local: string): [string, string] {
  const [date = "", time = ""] = local.split("T");
  return [date, time.slice(0, 5)];
}

/**
 * Editor for the families block, handles the nested
 * `data.bride.{title,members}` / `data.groom.{title,members}` shape that the
 * generic content editor can't reach with a flat extractFieldValue.
 *
 * - For "title" parts: a single input bound to bride.title or groom.title.
 * - For "members" parts: a per-member list with reorder, remove and an
 *   "Üye Ekle" button so the user can build out the family list without
 *   leaving the side panel.
 */
function FamiliesFieldEditor({
  block,
  side,
  part,
  onChange,
}: {
  block: import("@davety/schema").Block<
    import("@davety/schema").FamiliesData
  >;
  side: "bride" | "groom";
  part: "title" | "members";
  onChange: (patch: Partial<import("@davety/schema").FamiliesData>) => void;
}) {
  const sideData = block.data[side];
  const sideLabel = side === "bride" ? "Gelin Tarafı" : "Damat Tarafı";

  function patchSide(
    next: Partial<import("@davety/schema").FamilyInfo>,
  ) {
    onChange({
      [side]: { ...sideData, ...next },
    } as Partial<import("@davety/schema").FamiliesData>);
  }

  if (part === "title") {
    return (
      <div>
        <label className="text-[11px] text-muted-foreground block mb-1">
          {sideLabel} Başlığı
        </label>
        <input
          value={sideData.title}
          onChange={(e) => patchSide({ title: e.target.value })}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <p className="mt-1.5 text-[10px] text-muted-foreground">
          Örn: &quot;Gelinin Ailesi&quot;, &quot;Aileler&quot;,
          &quot;Yıldız Ailesi&quot;
        </p>
      </div>
    );
  }

  // members
  const members = sideData.members;

  function update(idx: number, value: string) {
    const next = members.slice();
    next[idx] = value;
    patchSide({ members: next });
  }
  function remove(idx: number) {
    const next = members.slice();
    next.splice(idx, 1);
    patchSide({ members: next });
  }
  function move(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= members.length) return;
    const next = members.slice();
    [next[idx], next[target]] = [next[target], next[idx]];
    patchSide({ members: next });
  }
  function add() {
    patchSide({ members: [...members, ""] });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[11px] text-muted-foreground">
          {sideLabel} Üyeleri
        </label>
        <span className="text-[10px] text-muted-foreground">
          {members.length} üye
        </span>
      </div>

      {members.length === 0 ? (
        <div className="rounded-md border border-dashed border-border p-4 text-center text-[11px] text-muted-foreground">
          Henüz üye yok. &quot;Üye Ekle&quot; ile başla.
        </div>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {members.map((m, i) => (
            <li
              key={i}
              className="flex items-center gap-1 rounded-md border border-border bg-background pl-2"
            >
              <input
                value={m}
                onChange={(e) => update(i, e.target.value)}
                placeholder={`${i + 1}. üye`}
                className="flex-1 bg-transparent py-2 text-sm focus:outline-none"
              />
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="size-7 inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer rounded transition-colors"
                aria-label="Yukarı"
                title="Yukarı taşı"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === members.length - 1}
                className="size-7 inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer rounded transition-colors"
                aria-label="Aşağı"
                title="Aşağı taşı"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                className="size-7 inline-flex items-center justify-center text-destructive hover:bg-destructive/10 cursor-pointer rounded transition-colors mr-1"
                aria-label="Sil"
                title="Üyeyi sil"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={add}
        className="mt-2 w-full inline-flex items-center justify-center gap-1 rounded-full border border-dashed border-border py-2 text-[11px] text-muted-foreground hover:text-foreground hover:border-foreground/30 cursor-pointer transition-colors"
      >
        + Üye Ekle
      </button>
    </div>
  );
}

/**
 * Editor for event_program block's `items` array, saat + etiket
 * satırlarını ekleme/çıkarma/sıralama. Düğün dışı etkinliklerde (doğum
 * günü, kurumsal vs.) kullanıcının kendi içeriğini yazabilmesi için
 * default seed verisinin üstüne tamamen yazılabilir olmalı.
 */
function EventProgramItemsEditor({
  items,
  onChange,
}: {
  items: import("@davety/schema").EventProgramItem[];
  onChange: (next: import("@davety/schema").EventProgramItem[]) => void;
}) {
  function update(idx: number, patch: Partial<import("@davety/schema").EventProgramItem>) {
    const next = items.slice();
    next[idx] = { ...next[idx], ...patch };
    onChange(next);
  }
  function remove(idx: number) {
    const next = items.slice();
    next.splice(idx, 1);
    onChange(next);
  }
  function move(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    const next = items.slice();
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  }
  function add() {
    onChange([...items, { time: "", label: "" }]);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[11px] text-muted-foreground">
          Program Satırları
        </label>
        <span className="text-[10px] text-muted-foreground">
          {items.length} satır
        </span>
      </div>

      {items.length === 0 ? (
        <div className="rounded-md border border-dashed border-border p-4 text-center text-[11px] text-muted-foreground">
          Henüz satır yok. &quot;Satır Ekle&quot; ile başla.
        </div>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {items.map((it, i) => (
            <li
              key={i}
              className="flex items-center gap-1 rounded-md border border-border bg-background pl-2"
            >
              <input
                type="time"
                value={it.time}
                onChange={(e) => update(i, { time: e.target.value })}
                className="w-[88px] bg-transparent py-2 text-sm tabular-nums focus:outline-none"
              />
              <input
                value={it.label}
                onChange={(e) => update(i, { label: e.target.value })}
                placeholder={`${i + 1}. etkinlik`}
                className="flex-1 bg-transparent py-2 text-sm focus:outline-none"
              />
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="size-7 inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer rounded transition-colors"
                aria-label="Yukarı"
                title="Yukarı taşı"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
                className="size-7 inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer rounded transition-colors"
                aria-label="Aşağı"
                title="Aşağı taşı"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                className="size-7 inline-flex items-center justify-center text-destructive hover:bg-destructive/10 cursor-pointer rounded transition-colors mr-1"
                aria-label="Sil"
                title="Satırı sil"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={add}
        className="mt-2 w-full inline-flex items-center justify-center gap-1 rounded-full border border-dashed border-border py-2 text-[11px] text-muted-foreground hover:text-foreground hover:border-foreground/30 cursor-pointer transition-colors"
      >
        + Satır Ekle
      </button>
    </div>
  );
}

/**
 * Hikayemiz (story_timeline) blok editörü, `StoryMilestone[]` listesine
 * tarih + başlık + açıklama girişi. Default seed boş geldiği için
 * kullanıcı buradan satır eklemeden render edilecek bir şey olmuyordu.
 */
function StoryTimelineItemsEditor({
  items,
  onChange,
}: {
  items: import("@davety/schema").StoryMilestone[];
  onChange: (next: import("@davety/schema").StoryMilestone[]) => void;
}) {
  function update(idx: number, patch: Partial<import("@davety/schema").StoryMilestone>) {
    const next = items.slice();
    next[idx] = { ...next[idx], ...patch };
    onChange(next);
  }
  function remove(idx: number) {
    const next = items.slice();
    next.splice(idx, 1);
    onChange(next);
  }
  function move(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    const next = items.slice();
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  }
  function add() {
    onChange([
      ...items,
      { date: "", title: "", description: "" },
    ]);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[11px] text-muted-foreground">
          Hikaye Anları
        </label>
        <span className="text-[10px] text-muted-foreground">
          {items.length} an
        </span>
      </div>

      {items.length === 0 ? (
        <div className="rounded-md border border-dashed border-border p-4 text-center text-[11px] text-muted-foreground">
          Henüz an yok. &quot;An Ekle&quot; ile ilk hikayeni yaz.
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((it, i) => (
            <li
              key={i}
              className="rounded-md border border-border bg-background p-2 flex flex-col gap-1.5"
            >
              <div className="flex items-center gap-1">
                <input
                  type="date"
                  value={it.date}
                  onChange={(e) => update(i, { date: e.target.value })}
                  className="flex-1 bg-transparent py-1 px-1 text-[11px] tabular-nums focus:outline-none border border-border rounded"
                />
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="size-6 inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer rounded"
                  title="Yukarı"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === items.length - 1}
                  className="size-6 inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer rounded"
                  title="Aşağı"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="size-6 inline-flex items-center justify-center text-destructive hover:bg-destructive/10 cursor-pointer rounded"
                  title="Sil"
                >
                  ×
                </button>
              </div>
              <input
                value={it.title}
                onChange={(e) => update(i, { title: e.target.value })}
                placeholder="Başlık (örn. İlk Tanışma)"
                className="bg-transparent py-1 px-1.5 text-sm focus:outline-none border border-border rounded"
              />
              <textarea
                value={it.description}
                onChange={(e) => update(i, { description: e.target.value })}
                placeholder="Açıklama"
                rows={2}
                className="bg-transparent py-1 px-1.5 text-[12px] focus:outline-none border border-border rounded resize-none"
              />
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={add}
        className="mt-2 w-full inline-flex items-center justify-center gap-1 rounded-full border border-dashed border-border py-2 text-[11px] text-muted-foreground hover:text-foreground hover:border-foreground/30 cursor-pointer transition-colors"
      >
        + An Ekle
      </button>
    </div>
  );
}

/**
 * Editor for gallery block's `items` array, yükle/sil/sırala.
 * Galeriye birden fazla görsel/video eklenebilir; her parçanın küçük
 * önizlemesi gösterilir, kullanıcı silebilir veya sıraya alabilir.
 * Multi-select destekli: kullanıcı 5–10 dosya seçip toplu yükleyebilir.
 *
 * Tier gating: free pakette galeri 1 medya ile sınırlı. Limite ulaşınca
 * "+ Görsel/Video Ekle" butonu kilitleniyor ve "Klasik+ ile daha fazla"
 * uyarısı çıkıyor. Yayınlama anında server-side tekrar trim ediyor (UI
 * bypass'lansa bile koruma var).
 */
function GalleryItemsEditor({
  docId,
  tier,
  items,
  onChange,
}: {
  docId: string | null;
  tier: import("@davety/schema").PlanTier | undefined;
  items: import("@davety/schema").MediaRef[];
  onChange: (next: import("@davety/schema").MediaRef[]) => void;
}) {
  const { pickMany, busy } = useAssetUpload(docId);
  const limits = planLimitsFor(tier);
  const remaining = Math.max(0, limits.galleryMaxItems - items.length);
  const atLimit = remaining === 0;

  async function add() {
    if (atLimit) return;
    const next = await pickMany("image/*,video/*", remaining);
    if (next.length === 0) return;
    onChange([...items, ...next]);
  }
  function remove(idx: number) {
    const next = items.slice();
    next.splice(idx, 1);
    onChange(next);
  }
  function move(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    const next = items.slice();
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[11px] text-muted-foreground">
          Galeri Medyaları
        </label>
        <span className="text-[10px] text-muted-foreground">
          {items.length} / {limits.galleryMaxItems}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="rounded-md border border-dashed border-border p-4 text-center text-[11px] text-muted-foreground">
          Henüz medya yok. &quot;Görsel/Video Ekle&quot; ile başla.
        </div>
      ) : (
        <ul className="grid grid-cols-3 gap-1.5">
          {items.map((m, i) => (
            <li
              key={i}
              className="relative aspect-square rounded-md overflow-hidden border border-border bg-muted group"
            >
              {m.mediaType === "video" ? (
                <video
                  src={m.url}
                  className="w-full h-full object-cover"
                  muted
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={m.variants?.thumb ?? m.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="size-6 rounded bg-white/90 text-black text-xs disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Geri al"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === items.length - 1}
                  className="size-6 rounded bg-white/90 text-black text-xs disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="İleri al"
                >
                  →
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="size-6 rounded bg-destructive text-white text-xs cursor-pointer"
                  title="Sil"
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={add}
        disabled={busy || !docId || atLimit}
        className="mt-2 w-full inline-flex items-center justify-center gap-1 rounded-full border border-dashed border-border py-2 text-[11px] text-muted-foreground hover:text-foreground hover:border-foreground/30 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {busy
          ? "Yükleniyor..."
          : atLimit
          ? `Sınıra ulaşıldı (${limits.galleryMaxItems})`
          : "+ Görsel/Video Ekle"}
      </button>

      {limits.galleryMaxItems <= 1 ? (
        <div className="mt-2 rounded-md border border-amber-300/60 bg-amber-50/60 p-2.5 text-[11px] text-amber-900">
          <strong className="font-medium">Free pakette galeri 1 medya ile sınırlı.</strong>{" "}
          Daha fazla fotoğraf/video eklemek için paketini{" "}
          <span className="font-semibold">{nextTierLabel(tier)}</span>{" "}
          paketine yükselt.
        </div>
      ) : null}
    </div>
  );
}

function InlineDecorationButton({
  open,
  onToggle,
  onPick,
}: {
  open: boolean;
  onToggle: () => void;
  onPick: (iconKey: string) => void;
}) {
  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={onToggle}
        className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border cursor-pointer transition-colors ${
          open
            ? "bg-foreground text-background border-foreground"
            : "bg-background border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
        }`}
      >
        <Sparkles className="size-3" />
        Süsleme Ekle
      </button>
      {open ? (
        <div className="mt-2 rounded-md border border-border bg-background p-2">
          <p className="text-[10px] text-muted-foreground mb-1.5 leading-snug">
            İmleç pozisyonuna bir ikon eklemek için tıkla. İkon yazıyla
            birlikte boyutlanır ve metin rengini alır.
          </p>
          <div className="grid grid-cols-8 gap-1 max-h-32 overflow-y-auto pr-1">
            {DECORATION_ICONS.map((i) => (
              <button
                key={i.id}
                type="button"
                onClick={() => onPick(i.id)}
                title={i.label}
                className="aspect-square rounded border border-border bg-background hover:border-foreground/40 hover:bg-muted cursor-pointer flex items-center justify-center transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-3.5"
                  dangerouslySetInnerHTML={{ __html: i.svg }}
                />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
