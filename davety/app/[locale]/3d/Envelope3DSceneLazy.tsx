"use client";

import dynamic from "next/dynamic";

/**
 * Client-side lazy wrapper for Envelope3DScene. CSS-3D scene'in (~20KB)
 * client-only logic'i hidrasyon başına çalışmasın diye dinamik import
 * + ssr:false. Diğer 3D scene'lerle tutarlı pattern.
 */
const Envelope3DScene = dynamic(
  () =>
    import("./Envelope3DScene").then((m) => ({ default: m.Envelope3DScene })),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-square w-full max-w-3xl mx-auto rounded-2xl bg-black/5 animate-pulse" />
    ),
  },
);

export function Envelope3DSceneLazy() {
  return <Envelope3DScene />;
}
