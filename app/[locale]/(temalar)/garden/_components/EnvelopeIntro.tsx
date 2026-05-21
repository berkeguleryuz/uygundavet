"use client";

import { EnvelopeIntroCore, type EnvelopeIntroTheme } from "@/components/envelope-intro";
import { useWedding } from "../_lib/context";

const GARDEN_THEME: EnvelopeIntroTheme = {
  storageKey: "garden-envelope-opened",
  foucClass: "garden-envelope-seen",
  imageSrc: "/temalar/envelopes/garden.webp",
  aspect: "644 / 897",
  flapTipPercent: 53,
  overlayBg: "radial-gradient(ellipse at center, #1f2a22 0%, #0e140f 75%)",
  sealBg: "radial-gradient(circle at 38% 32%, #fdd884, #f9a620 60%, #b97a14)",
  monogramColor: "rgba(40,30,12,0.9)",
  sealGlow: "rgba(249,166,32,0.55)",
  coupleNameColor: "#f5f3ed",
  taglineColor: "rgba(253,185,74,0.8)",
  hintColor: "rgba(245,243,237,0.45)",
  interiorBg: "radial-gradient(ellipse at 50% 30%, #182218, #0a100b)",
  envelopeGlow: "radial-gradient(circle at 50% 45%, rgba(249,180,80,0.8), transparent 65%)",
  screenFlash: "radial-gradient(circle at 50% 45%, rgba(253,230,170,0.95), rgba(220,180,90,0.5) 45%, rgba(150,120,60,0.15) 72%)",
};

// TEST modu: true iken zarf HER yenilemede tekrar gelir. CANLIYA ALMADAN ÖNCE false.
const ALWAYS_SHOW = true;

export function EnvelopeIntro() {
  const wedding = useWedding();
  return (
    <EnvelopeIntroCore
      theme={GARDEN_THEME}
      brideName={wedding.brideName}
      groomName={wedding.groomName}
      alwaysShow={ALWAYS_SHOW}
    />
  );
}
