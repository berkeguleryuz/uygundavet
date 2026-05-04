// Brand palette — bridges the wedding-paper warmth of /reklam with the
// charcoal-and-cream system documented in CLAUDE.md.
export const C = {
  // Backgrounds
  bgLight: "#f5f6f3", // CLAUDE.md Bg 1
  bgDark: "#252224", // CLAUDE.md Bg 2
  paper: "#faf7f0",
  ivory: "#f5f0e6",
  cream: "#ece4d3",

  // Ink
  ink: "#1a1612",
  charcoal: "#2a2520",
  mute: "#8a7f6e",
  line: "#d8cfbc",

  // Accents (wedding)
  gold: "#b89968",
  goldDeep: "#8a6f43",
  goldHi: "#d5d1ad", // CLAUDE.md koyu arka plan başlık rengi
  rose: "#c89a93",
  sage: "#8a9a7a",
  navy: "#1f2340",

  // Pure
  black: "#000000",
  white: "#ffffff",
} as const;

export type ColorToken = keyof typeof C;
