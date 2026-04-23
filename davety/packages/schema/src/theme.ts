import { z } from "zod";

export const envelopeThemeSchema = z.object({
  color: z.string().default("#f5eedb"),
  liningPattern: z.string().default("daisy"),
  flapColor: z.string().default("#eee0be"),
});
export type EnvelopeTheme = z.infer<typeof envelopeThemeSchema>;

export const themeSchema = z.object({
  bgColor: z.string().default("#f5f6f3"),
  accentColor: z.string().default("#252224"),
  pattern: z.string().optional(),
  bgMusicUrl: z.string().optional(),
  envelope: envelopeThemeSchema.default({
    color: "#f5eedb",
    liningPattern: "daisy",
    flapColor: "#eee0be",
  }),
});
export type Theme = z.infer<typeof themeSchema>;

export const defaultTheme: Theme = {
  bgColor: "#f5f6f3",
  accentColor: "#252224",
  envelope: {
    color: "#f5eedb",
    liningPattern: "daisy",
    flapColor: "#eee0be",
  },
};
