import { z } from "zod";
import { blockSchema, type Block } from "./blocks";
import { themeSchema, type Theme } from "./theme";

export const localeSchema = z.enum(["tr", "en", "de"]);
export type Locale = z.infer<typeof localeSchema>;

export const docStatusSchema = z.enum(["draft", "published"]);
export type DocStatus = z.infer<typeof docStatusSchema>;

export const docMetaSchema = z.object({
  createdAt: z.string(),
  updatedAt: z.string(),
  weddingDate: z.string(),
  weddingTime: z.string(),
  status: docStatusSchema,
  locale: localeSchema,
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
