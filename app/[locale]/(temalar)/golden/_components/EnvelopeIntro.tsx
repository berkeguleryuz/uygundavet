"use client";

import { EnvelopeIntroCore, type EnvelopeIntroTheme } from "@/components/envelope-intro";
import { useWedding } from "../_lib/context";

const GOLDEN_THEME: EnvelopeIntroTheme = {
  storageKey: "golden-envelope-opened",
  foucClass: "golden-envelope-seen",
  imageSrc: "/temalar/envelopes/golden.webp",
  aspect: "617 / 874",
  flapTipPercent: 58,
  overlayBg: "radial-gradient(ellipse at center, #2d2620 0%, #14110d 75%)",
  sealBg: "radial-gradient(circle at 38% 32%, #ffdf8a, #f4a900 60%, #8a5e08)",
  monogramColor: "rgba(45,38,32,0.95)",
  sealGlow: "rgba(244,169,0,0.55)",
  coupleNameColor: "#faf5ec",
  taglineColor: "rgba(255,250,240,0.95)",
  hintColor: "rgba(250,245,236,0.5)",
  interiorBg: "radial-gradient(ellipse at 50% 30%, #1e1812, #0c0906)",
  envelopeGlow: "radial-gradient(circle at 50% 45%, rgba(255,210,140,0.9), transparent 65%)",
  screenFlash: "radial-gradient(circle at 50% 45%, rgba(255,225,160,0.97), rgba(240,180,80,0.55) 45%, rgba(160,110,30,0.15) 72%)",
};

// TEST modu: true iken zarf HER yenilemede tekrar gelir. CANLIYA ALMADAN ÖNCE false.
const ALWAYS_SHOW = true;

export function EnvelopeIntro() {
  const wedding = useWedding();
  return (
    <EnvelopeIntroCore
      theme={GOLDEN_THEME}
      brideName={wedding.brideName}
      groomName={wedding.groomName}
      alwaysShow={ALWAYS_SHOW}
    />
  );
}
