import { z } from "zod";
import { blockSchema, type Block } from "./blocks";
import { themeSchema, type Theme } from "./theme";

export const localeSchema = z.enum(["tr", "en", "de"]);
export type Locale = z.infer<typeof localeSchema>;

export const docStatusSchema = z.enum(["draft", "published"]);
export type DocStatus = z.infer<typeof docStatusSchema>;

/** What the invitation is for. Drives terminology on the side panel
 *  (Gelin/Damat vs. Çocuk vs. Doğum Günü Sahibi vs. Şirket) and the
 *  default Families block titles. Optional for backward compatibility
 *  with docs created before this field existed. */
export const eventCategorySchema = z.enum([
  "wedding",
  "engagement",
  "circumcision",
  "birthday",
  "business",
]);
export type EventCategory = z.infer<typeof eventCategorySchema>;

/**
 * Plan tier for the invitation. Drives editor-time gating (1 photo cap on
 * gallery, no memory_book on free, etc.) and publish-time decisions
 * (auto-trim to 1 image for free, append davetyolla.com watermark).
 * Defaults to "free" when missing for backward compatibility with docs
 * created before this field existed.
 */
export const planTierSchema = z.enum(["free", "basic", "pro", "premium"]);
export type PlanTier = z.infer<typeof planTierSchema>;

export const docMetaSchema = z.object({
  createdAt: z.string(),
  updatedAt: z.string(),
  weddingDate: z.string(),
  weddingTime: z.string(),
  status: docStatusSchema,
  locale: localeSchema,
  eventCategory: eventCategorySchema.optional(),
  tier: planTierSchema.optional(),
});
export type DocMeta = z.infer<typeof docMetaSchema>;

export const invitationDocSchema = z.object({
  meta: docMetaSchema,
  theme: themeSchema,
  blocks: z.array(blockSchema),
});
export type InvitationDoc = {
  meta: DocMeta;
  theme: Theme;
  blocks: Block[];
};
