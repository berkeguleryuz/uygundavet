import { loadFont as loadOrbitron } from "@remotion/google-fonts/Orbitron";
import { loadFont as loadMerienda } from "@remotion/google-fonts/Merienda";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadCormorant } from "@remotion/google-fonts/CormorantGaramond";

// CLAUDE.md mandates Orbitron / Merienda / Space Grotesk as the project's
// type system. We add Fraunces + Cormorant for the wedding-paper register
// already established in the existing /reklam scenes, and JetBrains Mono
// for technical chrome (timestamps, tickers).
const orbitron = loadOrbitron();
const merienda = loadMerienda();
const spaceGrotesk = loadSpaceGrotesk();
const fraunces = loadFraunces();
const jetbrains = loadJetBrains();
const cormorant = loadCormorant();

export const F = {
  display: orbitron.fontFamily, // Orbitron — headlines, tickers, CTAs
  script: merienda.fontFamily, // Merienda — secondary headlines, names
  body: spaceGrotesk.fontFamily, // Space Grotesk — descriptions
  serif: fraunces.fontFamily, // Fraunces — invitation editorial
  serifSoft: cormorant.fontFamily, // Cormorant — script-leaning serif
  mono: jetbrains.fontFamily, // JetBrains Mono — technical chrome
} as const;

export type FontToken = keyof typeof F;
