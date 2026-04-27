import { z } from "zod";

export const envelopeThemeSchema = z.object({
  color: z.string().default("#f5eedb"),
  liningPattern: z.string().default("daisy"),
  flapColor: z.string().default("#eee0be"),
  /** Inner lining background (visible when the flap opens). */
  liningBg: z.string().default("#1f1c17"),
  /** Stamp visibility & color in the upper-right of the envelope front. */
  stampEnabled: z.boolean().default(true),
  stampColor: z.string().default("#b85450"),
  /** Optional stamp text (e.g. couple's initials). Empty → no text. */
  stampLabel: z.string().optional(),
  /** Optional stamp image URL. When set the image replaces the label. */
  stampImage: z.string().optional(),
  /** Selected envelope preset id (e.g. "kraft-ip", "monogram"). The
   *  preset contributes JSX-only decorations (twine, wax seal, window)
   *  that can't live in the JSON theme; renderer resolves the preset
   *  at draw time and the user's serializable overrides (colors,
   *  lining, stamp) win over the preset values. */
  presetId: z.string().optional(),
});
export type EnvelopeTheme = z.infer<typeof envelopeThemeSchema>;

export const themeSchema = z.object({
  bgColor: z.string().default("#f5f6f3"),
  accentColor: z.string().default("#252224"),
  /** Page background — the area around the envelope/card on the public
   *  invitation page. Distinct from `bgColor` (which is the card's own
   *  background) so the recipient sees a clear contrast between the
   *  page chrome and the invitation itself. */
  pageBgColor: z.string().default("#252224"),
  pattern: z.string().optional(),
  bgMusicUrl: z.string().optional(),
  envelope: envelopeThemeSchema.default({
    color: "#f5eedb",
    liningPattern: "daisy",
    flapColor: "#eee0be",
    liningBg: "#1f1c17",
    stampEnabled: true,
    stampColor: "#b85450",
  }),
});
export type Theme = z.infer<typeof themeSchema>;

export const defaultTheme: Theme = {
  bgColor: "#f5f6f3",
  accentColor: "#252224",
  pageBgColor: "#252224",
  envelope: {
    color: "#f5eedb",
    liningPattern: "daisy",
    flapColor: "#eee0be",
    liningBg: "#1f1c17",
    stampEnabled: true,
    stampColor: "#b85450",
    stampLabel: "H&İ",
  },
};
