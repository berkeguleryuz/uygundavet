"use client";

import { EnvelopeIntroCore, type EnvelopeIntroTheme } from "@/components/envelope-intro";
import { useWedding } from "../_lib/context";

const SUNSET_THEME: EnvelopeIntroTheme = {
  storageKey: "sunset-envelope-opened",
  foucClass: "sunset-envelope-seen",
  imageSrc: "/temalar/envelopes/sunset.webp",
  aspect: "654 / 938",
  flapTipPercent: 53,
  overlayBg:
    "radial-gradient(ellipse at center, #3a2418 0%, #1a0f0a 75%)",
  sealBg:
    "radial-gradient(circle at 38% 32%, #f4d8a8, #d4735e 70%, #a8533f)",
  monogramColor: "rgba(61,36,24,0.85)",
  sealGlow: "rgba(240,194,127,0.5)",
  coupleNameColor: "#f0c27f",
  taglineColor: "rgba(232,168,124,0.7)",
  hintColor: "rgba(250,240,230,0.45)",
  interiorBg:
    "radial-gradient(ellipse at 50% 30%, #2a160e, #140a06)",
  envelopeGlow:
    "radial-gradient(circle at 50% 45%, rgba(255,210,140,0.9), transparent 65%)",
  screenFlash:
    "radial-gradient(circle at 50% 45%, rgba(255,224,170,0.97), rgba(255,196,130,0.55) 45%, rgba(255,170,110,0.15) 72%)",
};

// TEST modu: true iken zarf HER yenilemede tekrar gelir. CANLIYA ALMADAN ÖNCE false.
const ALWAYS_SHOW = true;

export function EnvelopeIntro() {
  const wedding = useWedding();
  return (
    <EnvelopeIntroCore
      theme={SUNSET_THEME}
      brideName={wedding.brideName}
      groomName={wedding.groomName}
      alwaysShow={ALWAYS_SHOW}
    />
  );
}
