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

/** Outer card silhouette, only the top edge varies. The user picks one
 *  of these from "Kart Şekli" in the design tab; the value is rendered
 *  by the InvitationView wrapper via CSS (border-radius or clip-path)
 *  and applies to gallery previews + editor canvas + public page so the
 *  invitation always wears the same outer dress. */
export const cardShapeSchema = z.enum([
  "flat",
  "arch",
  "tall-arch",
  "rounded",
  "peaked",
  "chevron",
  "tag",
]);
export type CardShape = z.infer<typeof cardShapeSchema>;

export const themeSchema = z.object({
  bgColor: z.string().default("#f5f6f3"),
  accentColor: z.string().default("#252224"),
  /** Page background, the area around the envelope/card on the public
   *  invitation page. Distinct from `bgColor` (which is the card's own
   *  background) so the recipient sees a clear contrast between the
   *  page chrome and the invitation itself. */
  pageBgColor: z.string().default("#252224"),
  /** Outer card top silhouette. Defaults to flat (square corners). */
  cardShape: cardShapeSchema.default("flat"),
  /** Tüm kartı kaplayan arka plan görseli (URL). Set edildiğinde
   *  InvitationView image'i absolute fill olarak render eder, tüm
   *  blokların arkasında görünür. bgColor altta kalır (image
   *  overlay'lendiyse). */
  bgImageUrl: z.string().optional(),
  /** Arka plan görselinin üzerine eklenen koyu overlay yoğunluğu
   *  (0-100). 0 = overlay yok, 100 = tamamen koyu. Default 40, metin
   *  okunabilirliği için. */
  bgImageOverlay: z.number().min(0).max(100).default(40),
  /** Aksiyon butonları (RSVP, Anı Defteri, vb. solid bg butonlar) için
   *  arka plan rengi override'ı. Set edilmediğinde accentColor kullanılır.
   *  bgImage ile zenginleştirilmiş kartlarda accent/bg renklerinin
   *  buton üzerinde okunmaz olduğu durumlar için. */
  actionButtonBg: z.string().optional(),
  /** Aksiyon butonlarının metin rengi. Set edilmediğinde bgColor kullanılır. */
  actionButtonText: z.string().optional(),
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
  cardShape: "flat",
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
