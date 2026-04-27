"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import {
  DECORATION_CATEGORIES,
  DECORATION_ICONS,
  type DecorationCategory,
  type DecorationIcon,
} from "@davety/renderer";
import type { Block, DecorationData } from "@davety/schema";
import { useEditorStore } from "@/src/store/editor-store";

type Filter = "all" | DecorationCategory;

export function DecorationsTab() {
  const insertBlock = useEditorStore((s) => s.insertBlock);
  const accent = useEditorStore((s) => s.doc?.theme.accentColor);

  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DECORATION_ICONS.filter((i) => {
      if (filter !== "all" && i.category !== filter) return false;
      if (!q) return true;
      return (
        i.label.toLowerCase().includes(q) ||
        i.id.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
      );
    });
  }, [filter, query]);

  function addToInvitation(icon: DecorationIcon) {
    const id = crypto.randomUUID();
    const block: Block<DecorationData> = {
      id,
      type: "decoration",
      visible: true,
      data: {
        iconKey: icon.id,
        sizePx: 64,
        align: "center",
      },
      style: { align: "center" },
    };
    insertBlock(block);
    toast.success(`${icon.label} davetiyene eklendi`);
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-medium">Süslemeler</h3>
        <p className="mt-1 text-[11px] text-muted-foreground leading-snug">
          Davetiyene eklemek istediğin süslemeyi seç. Tıkladığında davetiyenin
          sonuna yeni bir süsleme bloğu olarak eklenir.
        </p>
      </div>

      <div className="relative">
        <Search className="size-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ara: kalp, çiçek, taç…"
          className="w-full rounded-md border border-border bg-background pl-7 pr-2.5 py-1.5 text-xs focus:outline-none focus:border-foreground/40"
        />
      </div>

      <div className="flex flex-wrap gap-1">
        <CategoryChip
          active={filter === "all"}
          onClick={() => setFilter("all")}
          label="Hepsi"
        />
        {DECORATION_CATEGORIES.map((c) => (
          <CategoryChip
            key={c.key}
            active={filter === c.key}
            onClick={() => setFilter(c.key)}
            label={c.label}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-md border border-dashed border-border p-6 text-center text-[11px] text-muted-foreground">
          Bu kriterle eşleşen süsleme yok.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1.5">
          {filtered.map((icon) => (
            <IconTile
              key={icon.id}
              icon={icon}
              accent={accent ?? "#252224"}
              onAdd={() => addToInvitation(icon)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border cursor-pointer transition-colors ${
        active
          ? "bg-foreground text-background border-foreground"
          : "bg-background text-muted-foreground border-border hover:border-foreground/40"
      }`}
    >
      {label}
    </button>
  );
}

function IconTile({
  icon,
  accent,
  onAdd,
}: {
  icon: DecorationIcon;
  accent: string;
  onAdd: () => void;
}) {
  return (
    <button
      onClick={onAdd}
      title={`${icon.label} ekle`}
      className="group relative aspect-square rounded-md border border-border bg-background hover:border-primary hover:bg-primary/5 cursor-pointer transition-colors flex flex-col items-center justify-center p-2"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={accent}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-7"
        dangerouslySetInnerHTML={{ __html: icon.svg }}
      />
      <span className="mt-1 text-[9px] text-muted-foreground leading-none truncate w-full text-center">
        {icon.label}
      </span>
      <span
        className="absolute top-1 right-1 size-4 rounded-full bg-primary text-primary-foreground inline-flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        aria-hidden="true"
      >
        <Plus className="size-2.5" />
      </span>
    </button>
  );
}
