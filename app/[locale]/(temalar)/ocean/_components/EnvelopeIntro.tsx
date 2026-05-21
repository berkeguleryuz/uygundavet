"use client";

import { EnvelopeIntroCore, type EnvelopeIntroTheme } from "@/components/envelope-intro";
import { useWedding } from "../_lib/context";

const OCEAN_THEME: EnvelopeIntroTheme = {
  storageKey: "ocean-envelope-opened",
  foucClass: "ocean-envelope-seen",
  imageSrc: "/temalar/envelopes/ocean.webp",
  aspect: "609 / 803",
  flapTipPercent: 60,
  overlayBg: "radial-gradient(ellipse at center, #14242e 0%, #06101a 75%)",
  sealBg: "radial-gradient(circle at 38% 32%, #e0f4f3, #a8dadc 60%, #4a8c8e)",
  monogramColor: "rgba(13,22,32,0.9)",
  sealGlow: "rgba(168,218,220,0.6)",
  coupleNameColor: "#f1faee",
  taglineColor: "rgba(13,30,45,0.85)",
  hintColor: "rgba(241,250,238,0.5)",
  interiorBg: "radial-gradient(ellipse at 50% 30%, #0f1c25, #050b12)",
  envelopeGlow: "radial-gradient(circle at 50% 45%, rgba(220,240,238,0.85), transparent 65%)",
  screenFlash: "radial-gradient(circle at 50% 45%, rgba(230,248,247,0.96), rgba(168,218,220,0.5) 45%, rgba(60,120,130,0.15) 72%)",
};

// TEST modu: true iken zarf HER yenilemede tekrar gelir. CANLIYA ALMADAN ÖNCE false.
const ALWAYS_SHOW = true;

export function EnvelopeIntro() {
  const wedding = useWedding();
  return (
    <EnvelopeIntroCore
      theme={OCEAN_THEME}
      brideName={wedding.brideName}
      groomName={wedding.groomName}
      alwaysShow={ALWAYS_SHOW}
    />
  );
}
