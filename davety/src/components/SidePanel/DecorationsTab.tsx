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
import {
  DECORATION_TEMPLATE_CATEGORIES,
  type DecorationTemplate,
} from "@/src/components/decorations/templateManifest";

type Mode = "icons" | "templates";

export function DecorationsTab() {
  const [mode, setMode] = useState<Mode>("templates");

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-medium">Süslemeler</h3>
        <p className="mt-1 text-[11px] text-muted-foreground leading-snug">
          Davetiyene eklemek istediğin süslemeyi seç. Tıkladığında davetiyenin
          sonuna yeni bir süsleme bloğu olarak eklenir.
        </p>
      </div>

      <div className="grid grid-cols-2 rounded-full border border-border overflow-hidden text-xs">
        <ModeBtn
          active={mode === "templates"}
          onClick={() => setMode("templates")}
          label="Hazır Şablonlar"
        />
        <ModeBtn
          active={mode === "icons"}
          onClick={() => setMode("icons")}
          label="Mini İkonlar"
        />
      </div>

      {mode === "icons" ? <IconLibrary /> : <TemplateLibrary />}
    </div>
  );
}

function ModeBtn({
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
      className={`py-1.5 cursor-pointer transition-colors ${
        active
          ? "bg-foreground text-background"
          : "bg-background text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

/* ──────────────────────── Icons (mini) ──────────────────────── */

function IconLibrary() {
  const insertBlock = useEditorStore((s) => s.insertBlock);
  const accent = useEditorStore((s) => s.doc?.theme.accentColor) ?? "#252224";

  const [filter, setFilter] = useState<"all" | DecorationCategory>("all");
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
    const block: Block<DecorationData> = {
      id: crypto.randomUUID(),
      type: "decoration",
      visible: true,
      data: { iconKey: icon.id, sizePx: 64, align: "center" },
      style: { align: "center" },
    };
    insertBlock(block);
    toast.success(`${icon.label} davetiyene eklendi`);
  }

  return (
    <>
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
        <Chip
          active={filter === "all"}
          onClick={() => setFilter("all")}
          label="Hepsi"
        />
        {DECORATION_CATEGORIES.map((c) => (
          <Chip
            key={c.key}
            active={filter === c.key}
            onClick={() => setFilter(c.key)}
            label={c.label}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <Empty />
      ) : (
        <div className="grid grid-cols-3 gap-1.5">
          {filtered.map((icon) => (
            <button
              key={icon.id}
              onClick={() => addToInvitation(icon)}
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
              <PlusBadge />
            </button>
          ))}
        </div>
      )}
    </>
  );
}

/* ──────────────────────── Templates (rich) ──────────────────── */

function TemplateLibrary() {
  const insertBlock = useEditorStore((s) => s.insertBlock);
  const accent = useEditorStore((s) => s.doc?.theme.accentColor) ?? "#252224";

  const [activeKey, setActiveKey] = useState(
    DECORATION_TEMPLATE_CATEGORIES[0]?.key ?? "wedding-essentials",
  );
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Show single active category
      const cat = DECORATION_TEMPLATE_CATEGORIES.find((c) => c.key === activeKey);
      return cat ? [cat] : [];
    }
    // Across categories — match id or category label
    return DECORATION_TEMPLATE_CATEGORIES.map((c) => ({
      ...c,
      items: c.items.filter(
        (i) => i.id.includes(q) || c.label.toLowerCase().includes(q),
      ),
    })).filter((c) => c.items.length > 0);
  }, [query, activeKey]);

  async function addTemplate(item: DecorationTemplate, categoryLabel: string) {
    setBusyId(item.id);
    try {
      const res = await fetch(item.url);
      if (!res.ok) throw new Error("fetch failed");
      const svgRaw = await res.text();
      const block: Block<DecorationData> = {
        id: crypto.randomUUID(),
        type: "decoration",
        visible: true,
        data: { svgRaw, sizePx: 320, align: "center" },
        style: { align: "center" },
      };
      insertBlock(block);
      toast.success(`${categoryLabel} davetiyene eklendi`);
    } catch {
      toast.error("Şablon yüklenemedi");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <div className="relative">
        <Search className="size-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Şablonlarda ara…"
          className="w-full rounded-md border border-border bg-background pl-7 pr-2.5 py-1.5 text-xs focus:outline-none focus:border-foreground/40"
        />
      </div>

      {!query ? (
        <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto pr-1">
          {DECORATION_TEMPLATE_CATEGORIES.map((c) => (
            <Chip
              key={c.key}
              active={activeKey === c.key}
              onClick={() => setActiveKey(c.key)}
              label={`${c.label} (${c.items.length})`}
            />
          ))}
        </div>
      ) : (
        <p className="text-[10px] text-muted-foreground">
          {filteredCategories.reduce((n, c) => n + c.items.length, 0)} sonuç
          bulundu
        </p>
      )}

      {filteredCategories.length === 0 ? (
        <Empty />
      ) : (
        filteredCategories.map((cat) => (
          <section key={cat.key} className="flex flex-col gap-1.5">
            {query ? (
              <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {cat.label}
              </h4>
            ) : null}
            <div className="grid grid-cols-2 gap-2">
              {cat.items.map((item) => {
                const busy = busyId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => addTemplate(item, cat.label)}
                    disabled={busy}
                    title={`${cat.label} ekle`}
                    className="group relative aspect-square rounded-md border border-border bg-background hover:border-primary hover:bg-primary/5 cursor-pointer transition-colors p-3 disabled:opacity-50"
                    style={{ color: accent }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={item.id}
                      className="w-full h-full object-contain"
                      style={{ color: accent }}
                    />
                    <PlusBadge />
                  </button>
                );
              })}
            </div>
          </section>
        ))
      )}

      <p className="text-[10px] text-muted-foreground leading-snug">
        Eklenen şablonun rengi tema accent rengini takip eder. Bloğa tıklayıp
        sağ panelden boyut ve renk değiştirebilirsin.
      </p>
    </>
  );
}

/* ─────────────────────────── shared ─────────────────────────── */

function Chip({
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

function PlusBadge() {
  return (
    <span
      className="absolute top-1 right-1 size-4 rounded-full bg-primary text-primary-foreground inline-flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      aria-hidden="true"
    >
      <Plus className="size-2.5" />
    </span>
  );
}

function Empty() {
  return (
    <div className="rounded-md border border-dashed border-border p-6 text-center text-[11px] text-muted-foreground">
      Bu kriterle eşleşen sonuç yok.
    </div>
  );
}
