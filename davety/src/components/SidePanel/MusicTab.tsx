"use client";

import { useEffect, useMemo, useState } from "react";
import { useEditorStore } from "@/src/store/editor-store";
import { useAssetUpload } from "@/src/hooks/useAssetUpload";

interface CatalogTrack {
  id: string;
  slug: string;
  title: string;
  artist: string;
  url: string;
  moods: string[];
  tier: string;
  durationSec: number | null;
  licensor: string | null;
}

const MOOD_FILTERS: { id: string; label: string }[] = [
  { id: "all", label: "Tümü" },
  { id: "romantic", label: "Romantik" },
  { id: "joyful", label: "Neşeli" },
  { id: "elegant", label: "Zarif" },
  { id: "traditional", label: "Geleneksel" },
  { id: "celebration", label: "Kutlama" },
  { id: "dramatic", label: "Etkileyici" },
];

export function MusicTab() {
  // Sadece bgMusicUrl gerekli; full doc subscribe etmek her keystroke'ta
  // re-render. (rerender-defer-reads)
  const currentUrl = useEditorStore(
    (s) => s.doc?.theme.bgMusicUrl ?? "",
  );
  const docExists = useEditorStore((s) => !!s.doc);
  const docId = useEditorStore((s) => s.docId);
  const updateTheme = useEditorStore((s) => s.updateTheme);
  const { pick, busy } = useAssetUpload(docId);

  const [tracks, setTracks] = useState<CatalogTrack[] | null>(null);
  const [mood, setMood] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // AbortController ile unmount halinde request iptal —
    // eski cancelled boolean network'ü kesmiyordu, sadece setState'i.
    const controller = new AbortController();
    fetch("/api/music", { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        if (!controller.signal.aborted) setTracks(data.tracks ?? []);
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        setError("Müzik kütüphanesi şu an erişilemiyor.");
      });
    return () => controller.abort();
  }, []);

  const filtered = useMemo(() => {
    if (!tracks) return [];
    if (mood === "all") return tracks;
    return tracks.filter((t) => t.moods.includes(mood));
  }, [tracks, mood]);

  if (!docExists) return null;

  return (
    <div className="border-t border-border pt-4 mt-2 flex flex-col gap-4">
      <div className="text-xs font-medium">Arkaplan Müziği</div>

      <div className="flex flex-col gap-2">
        <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Kütüphane
        </div>
        <div className="flex flex-wrap gap-1">
          {MOOD_FILTERS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMood(m.id)}
              className={`text-[11px] px-2 py-1 rounded-full border ${
                mood === m.id
                  ? "bg-foreground text-background border-foreground"
                  : "border-border hover:bg-muted"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        {error ? (
          <div className="text-[11px] text-destructive">{error}</div>
        ) : null}
        <div className="flex flex-col gap-1 max-h-64 overflow-auto rounded-md border border-border">
          {tracks === null ? (
            <div className="text-[11px] text-muted-foreground p-3">
              Yükleniyor...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-[11px] text-muted-foreground p-3">
              Bu ruh haline uygun parça bulunamadı.
            </div>
          ) : (
            filtered.map((t) => {
              const active = currentUrl === t.url;
              return (
                <button
                  key={t.id}
                  onClick={() => updateTheme({ bgMusicUrl: t.url })}
                  className={`text-left flex items-center justify-between gap-2 px-3 py-2 text-xs cursor-pointer ${
                    active ? "bg-muted" : "hover:bg-muted/50"
                  }`}
                >
                  <span className="flex flex-col">
                    <span className="font-medium">{t.title}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {t.artist}
                      {t.tier !== "free" ? ` · ${t.tier}` : ""}
                    </span>
                  </span>
                  {active ? (
                    <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-600">
                      Seçili
                    </span>
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Kendi Müziğin
        </div>
        <input
          type="url"
          value={currentUrl}
          onChange={(e) => updateTheme({ bgMusicUrl: e.target.value })}
          placeholder="Müzik URL'i (mp3/ogg)"
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <button
          onClick={async () => {
            const media = await pick("audio/*");
            if (media?.url) updateTheme({ bgMusicUrl: media.url });
          }}
          disabled={busy}
          className="text-xs rounded-md border border-border py-2 cursor-pointer hover:bg-muted disabled:opacity-50"
        >
          {busy ? "Yükleniyor..." : "Müzik Yükle"}
        </button>
        {currentUrl ? (
          <audio controls className="w-full" preload="none">
            <source src={currentUrl} />
          </audio>
        ) : null}
      </div>
    </div>
  );
}
