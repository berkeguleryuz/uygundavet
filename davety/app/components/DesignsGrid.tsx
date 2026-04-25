"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { useSession } from "@/src/lib/auth-client";
import { DesignCard } from "./DesignCard";
import {
  CATEGORIES,
  DESIGN_SAMPLES,
  type DesignCategory,
  type DesignSample,
} from "./designSamples";

type TabKey = DesignCategory | "all";

interface Props {
  defaultTab?: TabKey;
  favoritesInitial?: string[];
}

export function DesignsGrid({
  defaultTab = "all",
  favoritesInitial = [],
}: Props) {
  const router = useRouter();
  const session = useSession();
  const [tab, setTab] = useState<TabKey>(defaultTab);
  const [favorites, setFavorites] = useState<Set<string>>(
    () => new Set(favoritesInitial)
  );
  const [target, setTarget] = useState<DesignSample | null>(null);

  const items = useMemo(
    () =>
      tab === "all"
        ? DESIGN_SAMPLES
        : DESIGN_SAMPLES.filter((d) => d.category === tab),
    [tab]
  );

  function handleDesign(design: DesignSample) {
    if (!session.data?.user) {
      router.push(`/login?returnTo=${encodeURIComponent("/")}`);
      return;
    }
    setTarget(design);
  }

  return (
    <div className="w-full" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
      {/* Category tabs */}
      <div className="flex items-center gap-2 flex-wrap mb-6">
        {CATEGORIES.map((c) => {
          const active = c.key === tab;
          return (
            <button
              key={c.key}
              onClick={() => setTab(c.key)}
              className={`px-4 py-2 rounded-full text-xs md:text-sm border transition-colors cursor-pointer ${
                active
                  ? "bg-foreground text-background border-foreground"
                  : "bg-white text-muted-foreground border-border hover:text-foreground hover:border-foreground/40"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {items.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground text-sm">
          Bu kategoride henüz tasarım yok.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 md:gap-5">
          {items.map((design) => (
            <DesignCard
              key={design.id}
              design={design}
              initialFavorite={favorites.has(design.id)}
              onToggleFavorite={(id, next) => {
                setFavorites((prev) => {
                  const s = new Set(prev);
                  if (next) s.add(id);
                  else s.delete(id);
                  return s;
                });
              }}
              onDesign={handleDesign}
            />
          ))}
        </div>
      )}

      {target ? (
        <DesignDateDialog
          design={target}
          onClose={() => setTarget(null)}
          onCreated={(id) => {
            setTarget(null);
            router.push(`/design/invitations/${id}/editor` as never);
          }}
        />
      ) : null}
    </div>
  );
}

/* ─── Date/time picker dialog — creates invitation with the chosen theme ── */
function DesignDateDialog({
  design,
  onClose,
  onCreated,
}: {
  design: DesignSample;
  onClose: () => void;
  onCreated: (id: string) => void;
}) {
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return d.toISOString().slice(0, 10);
  });
  const [time, setTime] = useState("19:00");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/design/invitations", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        weddingDate: date,
        weddingTime: time,
        // Send the full design id — the server looks it up in DESIGN_SAMPLES
        // and builds a doc with the matching hero variant + theme + photo.
        designId: design.id,
      }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error ?? "Oluşturulamadı");
      setBusy(false);
      return;
    }
    const data = await res.json();
    onCreated(data.id as string);
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={busy ? undefined : onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
        style={{ fontFamily: "Space Grotesk, sans-serif" }}
      >
        <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
          {design.name} · #{design.code}
        </div>
        <h2
          className="text-xl font-medium mb-1"
          style={{ fontFamily: "Merienda, serif" }}
        >
          Etkinlik Tarihini Seç
        </h2>
        <p className="text-sm text-muted-foreground mb-5">
          Davetiyeni seçtiğin tema ile oluşturacağız. Sonra editörde
          istediğin gibi değiştirebilirsin.
        </p>

        <label className="block mb-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
            Tarih
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border text-sm"
            required
          />
        </label>
        <label className="block mb-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
            Saat
          </div>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border text-sm"
            required
          />
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="flex-1 px-4 py-2.5 rounded-full border border-border bg-white text-sm hover:border-foreground/40 cursor-pointer disabled:opacity-50"
          >
            Vazgeç
          </button>
          <button
            type="submit"
            disabled={busy}
            className="flex-1 px-4 py-2.5 rounded-full bg-foreground text-background text-sm hover:bg-foreground/90 cursor-pointer disabled:opacity-70"
          >
            {busy ? "Oluşturuluyor..." : "Editöre Git"}
          </button>
        </div>
      </form>
    </div>
  );
}
