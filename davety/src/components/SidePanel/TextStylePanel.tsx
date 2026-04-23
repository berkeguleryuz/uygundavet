"use client";

import { useState } from "react";
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
  Strikethrough,
  Underline,
} from "lucide-react";
import {
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
  const blockId = useUIStore((s) => s.selectedBlockId);
  const fieldId = useUIStore((s) => s.selectedFieldId);

  const [category, setCategory] = useState<FontCategory>("all");
  const [query, setQuery] = useState("");

  if (!doc || !blockId || !fieldId) return null;
  const block = doc.blocks.find((b) => b.id === blockId);
  if (!block) return null;

  const currentField = block.style.fieldOverrides?.[fieldId] ?? {};
  const fontFamily = currentField.fontFamily ?? block.style.fontFamily ?? "";
  const fontSize = currentField.fontSize ?? block.style.fontSize ?? 24;
  const color = currentField.color ?? block.style.color ?? "#252224";
  const align = block.style.align ?? "center";

  const update = (patch: Record<string, unknown>) => {
    updateFieldStyle(blockId, fieldId, patch);
  };

  const fonts = filterByCategory(category).filter((f) =>
    query ? f.family.toLowerCase().includes(query.toLowerCase()) : true
  );

  return (
    <div className="p-5 flex flex-col gap-5">
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
