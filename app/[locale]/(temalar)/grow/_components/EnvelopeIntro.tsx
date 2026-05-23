"use client";

import { EnvelopeIntroCore, type EnvelopeIntroTheme } from "@/components/envelope-intro";
import { useWedding } from "../_lib/context";

const GROW_THEME: EnvelopeIntroTheme = {
  storageKey: "grow-envelope-opened",
  foucClass: "grow-envelope-seen",
  imageSrc: "/temalar/envelopes/grow.webp",
  aspect: "627 / 890",
  flapTipPercent: 50,
  overlayBg: "radial-gradient(ellipse at center, #2a2f24 0%, #14160f 75%)",
  sealBg: "radial-gradient(circle at 38% 32%, #f5efd6, #d5d1ad 65%, #9a9577)",
  monogramColor: "rgba(40,48,32,0.85)",
  sealGlow: "rgba(213,209,173,0.55)",
  coupleNameColor: "#e8e3c2",
  taglineColor: "rgba(213,209,173,0.7)",
  hintColor: "rgba(245,239,214,0.45)",
  interiorBg: "radial-gradient(ellipse at 50% 30%, #1d211a, #0d100c)",
  envelopeGlow: "radial-gradient(circle at 50% 45%, rgba(232,227,194,0.85), transparent 65%)",
  screenFlash: "radial-gradient(circle at 50% 45%, rgba(232,227,194,0.95), rgba(180,200,160,0.45) 45%, rgba(140,160,120,0.12) 72%)",
};

// TEST modu: true iken zarf HER yenilemede tekrar gelir. CANLIYA ALMADAN ÖNCE false.
const ALWAYS_SHOW = true;

export function EnvelopeIntro() {
  const wedding = useWedding();
  return (
    <EnvelopeIntroCore
      theme={GROW_THEME}
      brideName={wedding.brideName}
      groomName={wedding.groomName}
      alwaysShow={ALWAYS_SHOW}
    />
  );
}
