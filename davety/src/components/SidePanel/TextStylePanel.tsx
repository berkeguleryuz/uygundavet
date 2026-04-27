"use client";

import { useRef, useState } from "react";
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
  fontCatalog,
  fontCategories,
  filterByCategory,
  type FontCategory,
} from "@davety/renderer";
import { useEditorStore } from "@/src/store/editor-store";
import { useUIStore } from "@/src/store/ui-store";
import { cn } from "@/src/lib/utils";

export function TextStylePanel() {
  const t = useTranslations("Editor.textPanel");

  const doc = useEditorStore((s) => s.doc);
  const updateFieldStyle = useEditorStore((s) => s.updateFieldStyle);
  const updateBlockData = useEditorStore((s) => s.updateBlockData);
  const applyPatch = useEditorStore((s) => s.applyPatch);
  const blockId = useUIStore((s) => s.selectedBlockId);
  const fieldId = useUIStore((s) => s.selectedFieldId);

  const [category, setCategory] = useState<FontCategory>("all");
  const [query, setQuery] = useState("");
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const fieldInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(
    null,
  );

  if (!doc || !blockId || !fieldId) return null;
  const block = doc.blocks.find((b) => b.id === blockId);
  if (!block) return null;

  // For fanout fields (e.g. countdown date), read display values from the
  // first underlying cell so the inputs show the actual rendered style.
  const FANOUT_READ: Record<string, string> = {
    targetIso: "days",
  };
  const readFieldId = FANOUT_READ[fieldId] ?? fieldId;
  const currentField =
    block.style.fieldOverrides?.[readFieldId] ?? {};
  const fontFamily = currentField.fontFamily ?? block.style.fontFamily ?? "";
  const fontSize = currentField.fontSize ?? block.style.fontSize ?? 24;
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
  const showContentEditor =
    isCoupleNames || isDateField || fieldValue !== undefined;
  const fieldLabel = fieldLabelFor(fieldId);
  const isLongText =
    fieldId === "description" || fieldId === "prompt" || fieldId === "body";

  const fonts = filterByCategory(category).filter((f) =>
    query ? f.family.toLowerCase().includes(query.toLowerCase()) : true
  );

  return (
    <div className="p-5 flex flex-col gap-5">
      {/* Field content editor — edit the actual text of the selected field */}
      {showContentEditor ? (
        isDateField ? (
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
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-muted-foreground block mb-1">
                Gelin Adı
              </label>
              <input
                value={(block.data["brideName"] as string) ?? ""}
                onChange={(e) =>
                  updateBlockData(blockId, { brideName: e.target.value })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground block mb-1">
                Damat Adı
              </label>
              <input
                value={(block.data["groomName"] as string) ?? ""}
                onChange={(e) =>
                  updateBlockData(blockId, { groomName: e.target.value })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="text-[11px] text-muted-foreground block mb-1">
              {fieldLabel}
            </label>
            {isLongText ? (
              <textarea
                ref={(el) => {
                  fieldInputRef.current = el;
                }}
                value={(fieldValue as string) ?? ""}
                onChange={(e) =>
                  updateBlockData(blockId, { [fieldId]: e.target.value })
                }
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-y"
              />
            ) : (
              <input
                ref={(el) => {
                  fieldInputRef.current = el;
                }}
                value={(fieldValue as string) ?? ""}
                onChange={(e) =>
                  updateBlockData(blockId, { [fieldId]: e.target.value })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            )}
            <InlineDecorationButton
              open={iconPickerOpen}
              onToggle={() => setIconPickerOpen((v) => !v)}
              onPick={(key) => {
                insertAtCursor(
                  fieldInputRef.current,
                  `{{${key}}}`,
                  (next) =>
                    updateBlockData(blockId, { [fieldId]: next }),
                  (fieldValue as string) ?? "",
                );
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
              —
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}

function extractFieldValue(
  data: Record<string, unknown>,
  fieldId: string
): string | undefined {
  // Hero "coupleNames" is a composite of brideName + groomName — surface
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
  prompt: "Soru / Yönlendirme",
  note: "Not",
  body: "İçerik",
  text: "Metin",
  label: "Etiket",
};

function fieldLabelFor(fieldId: string): string {
  return FIELD_LABELS[fieldId] ?? "Metin İçeriği";
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
 * Insert `marker` at the input/textarea's current cursor position. If no
 * input ref is available, falls back to appending at the end. After
 * inserting we restore focus and place the cursor right after the inserted
 * marker so the user can keep typing.
 */
function insertAtCursor(
  el: HTMLInputElement | HTMLTextAreaElement | null,
  marker: string,
  write: (next: string) => void,
  fallbackValue: string,
) {
  if (!el) {
    write(`${fallbackValue}${marker}`);
    return;
  }
  const value = el.value;
  const start = el.selectionStart ?? value.length;
  const end = el.selectionEnd ?? value.length;
  const next = value.slice(0, start) + marker + value.slice(end);
  write(next);
  // Restore selection on next tick after React has re-rendered.
  requestAnimationFrame(() => {
    if (!el || !document.body.contains(el)) return;
    el.focus();
    const cursor = start + marker.length;
    el.setSelectionRange(cursor, cursor);
  });
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
