"use client";

import { EnvelopeIntroCore, type EnvelopeIntroTheme } from "@/components/envelope-intro";
import { useWedding } from "../_lib/context";

const ROSE_THEME: EnvelopeIntroTheme = {
  storageKey: "rose-envelope-opened",
  foucClass: "rose-envelope-seen",
  imageSrc: "/temalar/envelopes/rose.webp",
  aspect: "617 / 863",
  flapTipPercent: 51,
  overlayBg: "radial-gradient(ellipse at center, #2a1418 0%, #1a0f0a 75%)",
  sealBg: "radial-gradient(circle at 38% 32%, #f4d4d6, #c75050 65%, #8a2a2a)",
  monogramColor: "rgba(240,228,220,0.95)",
  sealGlow: "rgba(199,80,80,0.55)",
  coupleNameColor: "#f0e4dc",
  taglineColor: "rgba(212,137,138,0.8)",
  hintColor: "rgba(240,228,220,0.45)",
  interiorBg: "radial-gradient(ellipse at 50% 30%, #25141a, #110a0c)",
  envelopeGlow: "radial-gradient(circle at 50% 45%, rgba(240,228,220,0.85), transparent 65%)",
  screenFlash: "radial-gradient(circle at 50% 45%, rgba(250,235,235,0.96), rgba(225,180,180,0.5) 45%, rgba(180,90,90,0.15) 72%)",
};

// TEST modu: true iken zarf HER yenilemede tekrar gelir. CANLIYA ALMADAN ÖNCE false.
const ALWAYS_SHOW = true;

export function EnvelopeIntro() {
  const wedding = useWedding();
  return (
    <EnvelopeIntroCore
      theme={ROSE_THEME}
      brideName={wedding.brideName}
      groomName={wedding.groomName}
      alwaysShow={ALWAYS_SHOW}
    />
  );
}
