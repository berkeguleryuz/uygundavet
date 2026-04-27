import { z } from "zod";

export const blockTypeSchema = z.enum([
  "hero",
  "countdown",
  "families",
  "event_program",
  "story_timeline",
  "venue",
  "gallery",
  "memory_book",
  "rsvp_form",
  "donation",
  "custom_note",
  "custom_section",
  "cta",
  "contact",
  "footer",
  "decoration",
]);
export type BlockType = z.infer<typeof blockTypeSchema>;

export const blockStyleSchema = z.object({
  fontFamily: z.string().optional(),
  fontSize: z.number().positive().optional(),
  color: z.string().optional(),
  align: z.enum(["left", "center", "right", "justify"]).optional(),
  bold: z.boolean().optional(),
  italic: z.boolean().optional(),
  underline: z.boolean().optional(),
  strike: z.boolean().optional(),
  paddingTop: z.number().optional(),
  paddingBottom: z.number().optional(),
  fieldOverrides: z
    .record(
      z.string(),
      z.object({
        fontFamily: z.string().optional(),
        fontSize: z.number().optional(),
        color: z.string().optional(),
        bold: z.boolean().optional(),
        italic: z.boolean().optional(),
        underline: z.boolean().optional(),
        strike: z.boolean().optional(),
      })
    )
    .optional(),
});
export type BlockStyle = z.infer<typeof blockStyleSchema>;

export const blockSchema = z.object({
  id: z.string(),
  type: blockTypeSchema,
  visible: z.boolean().default(true),
  /** Locked blocks can be hidden/edited but not deleted. Used for functional blocks
   *  (memory_book, rsvp_form, gallery, venue) whose action buttons carry meaning. */
  locked: z.boolean().optional(),
  data: z.record(z.string(), z.unknown()),
  style: blockStyleSchema.default({}),
});
export type Block<T = Record<string, unknown>> = {
  id: string;
  type: BlockType;
  visible: boolean;
  locked?: boolean;
  data: T;
  style: BlockStyle;
};

// Per-block data shapes
export interface MediaRef {
  url: string;
  key?: string;
  width?: number;
  height?: number;
  mediaType: "image" | "video" | "audio";
  /** Responsive URL variants (thumb/md/lg/original) for images only. */
  variants?: Partial<Record<"thumb" | "md" | "lg" | "original", string>>;
}

/**
 * Top-of-card layout variants. Hero renders completely differently per
 * variant (arched frame, full-bleed photo, oversized typography, etc.)
 * while still using the same editable fields. Optional — when absent the
 * renderer falls back to the "classic" variant.
 */
export type HeroVariant =
  | "classic"
  | "arch"
  | "photo-top"
  | "photo-full"
  | "floral-crown"
  | "monogram-circle"
  | "bold-type"
  | "botanical-frame";

export interface HeroData {
  brideName: string;
  groomName: string;
  subtitle?: string;
  description?: string;
  media?: MediaRef;
  /** Which top-of-card layout to render. Defaults to "classic" if absent. */
  variant?: HeroVariant;
  /** Explicit photo URL for photo-driven variants (photo-top / photo-full). */
  photoUrl?: string;
  /** Decorative style for floral-crown / classic ornaments. */
  decorative?: "daisy" | "rose" | "gold" | "none";
  /** Accent colour override for SVG flourishes. Falls back to theme.accent. */
  accent?: string;
}

export interface CountdownData {
  targetIso: string;
  labels: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
}

export interface FamilyInfo {
  title: string;
  members: string[];
}

export interface FamiliesData {
  bride: FamilyInfo;
  groom: FamilyInfo;
}

export interface EventProgramItem {
  time: string;
  label: string;
  icon?: string;
}
export interface EventProgramData {
  items: EventProgramItem[];
  venueName?: string;
  venueAddress?: string;
  mapUrl?: string;
}

export interface StoryMilestone {
  date: string;
  title: string;
  description: string;
  media?: MediaRef;
}
export interface StoryTimelineData {
  items: StoryMilestone[];
}

export interface VenueData {
  venueName: string;
  venueAddress: string;
  mapUrl?: string;
  directionsUrl?: string;
  reminderEnabled?: boolean;
}

export interface GalleryData {
  items: MediaRef[];
}

export interface MemoryBookData {
  prompt: string;
  enabled: boolean;
}

export interface RsvpFormData {
  enabled: boolean;
  note?: string;
}

export interface DonationData {
  iban?: string;
  title?: string;
  description?: string;
}

export interface CustomNoteData {
  title?: string;
  body: string;
}

export interface CustomSectionData {
  title: string;
  body?: string;
  items?: { title: string; description?: string }[];
}

export interface CtaData {
  label: string;
  href?: string;
}

export interface ContactData {
  venueName?: string;
  venueAddress?: string;
  phone?: string;
}

export interface FooterData {
  text?: string;
}

export interface DecorationData {
  /** Catalog id from `@davety/renderer/decorations` (e.g. "heart"). */
  iconKey: string;
  /** Render size in CSS px. Defaults to 64. */
  sizePx?: number;
  /** Stroke color. Falls back to theme.accentColor when absent. */
  color?: string;
  /** Horizontal alignment within the section. */
  align?: "left" | "center" | "right";
}
