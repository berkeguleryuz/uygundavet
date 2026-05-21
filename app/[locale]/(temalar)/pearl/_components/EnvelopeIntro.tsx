"use client";

import { EnvelopeIntroCore, type EnvelopeIntroTheme } from "@/components/envelope-intro";
import { useWedding } from "../_lib/context";

const PEARL_THEME: EnvelopeIntroTheme = {
  storageKey: "pearl-envelope-opened",
  foucClass: "pearl-envelope-seen",
  imageSrc: "/temalar/envelopes/pearl.webp",
  aspect: "567 / 790",
  flapTipPercent: 57,
  overlayBg: "radial-gradient(ellipse at center, #2a2522 0%, #1c1917 75%)",
  sealBg: "radial-gradient(circle at 38% 32%, #faf3e6, #e3d3bf 60%, #b8a088)",
  monogramColor: "rgba(60,46,38,0.85)",
  sealGlow: "rgba(247,244,239,0.55)",
  coupleNameColor: "#f7f4ef",
  taglineColor: "rgba(196,162,150,0.75)",
  hintColor: "rgba(247,244,239,0.45)",
  interiorBg: "radial-gradient(ellipse at 50% 30%, #211c19, #100d0b)",
  envelopeGlow: "radial-gradient(circle at 50% 45%, rgba(247,244,239,0.85), transparent 65%)",
  screenFlash: "radial-gradient(circle at 50% 45%, rgba(250,243,230,0.96), rgba(220,200,180,0.5) 45%, rgba(180,160,140,0.12) 72%)",
};

// TEST modu: true iken zarf HER yenilemede tekrar gelir. CANLIYA ALMADAN ÖNCE false.
const ALWAYS_SHOW = true;

export function EnvelopeIntro() {
  const wedding = useWedding();
  return (
    <EnvelopeIntroCore
      theme={PEARL_THEME}
      brideName={wedding.brideName}
      groomName={wedding.groomName}
      alwaysShow={ALWAYS_SHOW}
    />
  );
}
