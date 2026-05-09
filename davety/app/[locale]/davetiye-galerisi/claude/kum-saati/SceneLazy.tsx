"use client";

import dynamic from "next/dynamic";
import type { Palette } from "@/app/components/three-claude/sharedScene";

const KumSaatiScene = dynamic(
  () => import("./Scene").then((m) => ({ default: m.KumSaatiScene })),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-video w-full max-w-5xl mx-auto rounded-2xl bg-black/5 animate-pulse" />
    ),
  },
);

export function KumSaatiSceneLazy({ palette }: { palette: Palette }) {
  return <KumSaatiScene palette={palette} />;
}
