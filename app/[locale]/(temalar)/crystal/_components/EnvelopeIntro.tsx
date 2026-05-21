"use client";

import { EnvelopeIntroCore, type EnvelopeIntroTheme } from "@/components/envelope-intro";
import { useWedding } from "../_lib/context";

const CRYSTAL_THEME: EnvelopeIntroTheme = {
  storageKey: "crystal-envelope-opened",
  foucClass: "crystal-envelope-seen",
  imageSrc: "/temalar/envelopes/crystal.webp",
  aspect: "609 / 861",
  flapTipPercent: 54,
  overlayBg: "radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a17 75%)",
  sealBg: "radial-gradient(circle at 38% 32%, #f8f8ff, #c8ccd6 60%, #8a8fa0)",
  monogramColor: "rgba(40,46,72,0.9)",
  sealGlow: "rgba(200,210,230,0.6)",
  coupleNameColor: "#f6f3ee",
  taglineColor: "rgba(180,154,124,0.85)",
  hintColor: "rgba(246,243,238,0.5)",
  interiorBg: "radial-gradient(ellipse at 50% 30%, #16162a, #08081a)",
  envelopeGlow: "radial-gradient(circle at 50% 45%, rgba(220,230,250,0.85), transparent 65%)",
  screenFlash: "radial-gradient(circle at 50% 45%, rgba(240,245,255,0.97), rgba(210,220,240,0.5) 45%, rgba(160,180,210,0.12) 72%)",
};

// TEST modu: true iken zarf HER yenilemede tekrar gelir. CANLIYA ALMADAN ÖNCE false.
const ALWAYS_SHOW = true;

export function EnvelopeIntro() {
  const wedding = useWedding();
  return (
    <EnvelopeIntroCore
      theme={CRYSTAL_THEME}
      brideName={wedding.brideName}
      groomName={wedding.groomName}
      alwaysShow={ALWAYS_SHOW}
    />
  );
}
