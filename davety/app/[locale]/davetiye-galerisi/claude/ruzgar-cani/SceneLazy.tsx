"use client";

import dynamic from "next/dynamic";
import type { Palette } from "@/app/components/three-claude/sharedScene";

/**
 * Client-side lazy wrapper. Scene imports * as THREE; bu wrapper
 * three.js bundle'ını gallery rotuna girince dinamik chunk olarak
 * yükler, ana sayfa ve diğer rotalar bu chunk'ı taşımıyor.
 */
const Scene = dynamic(
  () => import("./Scene").then((m) => ({ default: m.Scene })),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-video w-full max-w-5xl mx-auto rounded-2xl bg-black/5 animate-pulse" />
    ),
  },
);

export function SceneLazy({ palette }: { palette: Palette }) {
  return <Scene palette={palette} />;
}
