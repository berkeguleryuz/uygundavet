import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const catalogPath = path.join(root, "src/templates/premiumTemplates.ts");

if (!fs.existsSync(catalogPath)) {
  throw new Error("Missing premium template catalog: src/templates/premiumTemplates.ts");
}

const catalog = await import(pathToFileURL(catalogPath).href);
const templates = catalog.PREMIUM_TEMPLATES;

if (!Array.isArray(templates)) {
  throw new Error("PREMIUM_TEMPLATES must be an array");
}

if (templates.length !== 48) {
  throw new Error(`Expected 48 premium templates, found ${templates.length}`);
}

const slugs = new Set();
const titles = new Set();
const categories = new Set(catalog.PREMIUM_TEMPLATE_CATEGORIES?.map((c) => c.key) ?? []);
const assetRefs = new Set();

for (const template of templates) {
  if (!template.slug || typeof template.slug !== "string") {
    throw new Error("Every premium template needs a string slug");
  }
  if (slugs.has(template.slug)) {
    throw new Error(`Duplicate premium template slug: ${template.slug}`);
  }
  slugs.add(template.slug);

  if (!template.title || typeof template.title !== "string") {
    throw new Error(`Template ${template.slug} needs a title`);
  }
  if (titles.has(template.title)) {
    throw new Error(`Duplicate premium template title: ${template.title}`);
  }
  titles.add(template.title);

  if (!categories.has(template.category)) {
    throw new Error(`Template ${template.slug} has invalid category: ${template.category}`);
  }

  if (!template.previewUrl?.startsWith("/assets/templates/previews/")) {
    throw new Error(`Template ${template.slug} needs a generated previewUrl`);
  }
  const previewFile = path.join(root, "public", template.previewUrl.replace(/^\/+/, ""));
  if (!fs.existsSync(previewFile)) {
    throw new Error(`Template ${template.slug} is missing preview file: ${template.previewUrl}`);
  }

  for (const assetPath of template.assets ?? []) {
    if (!assetPath.startsWith("/assets/templates/")) {
      throw new Error(`Template ${template.slug} has invalid asset path: ${assetPath}`);
    }
    assetRefs.add(assetPath);
  }

  const doc = catalog.buildPremiumTemplateDoc(template, {
    weddingDate: "2026-09-12",
    weddingTime: "19:30",
    locale: "tr",
  });
  assertInvitationDocShape(template.slug, doc);
}

if (assetRefs.size < 100) {
  throw new Error(`Expected at least 100 referenced assets, found ${assetRefs.size}`);
}

for (const assetPath of assetRefs) {
  const absolute = path.join(root, "public", assetPath.replace(/^\/+/, ""));
  if (!fs.existsSync(absolute)) {
    throw new Error(`Missing transparent asset: ${assetPath}`);
  }
  const source = fs.readFileSync(absolute, "utf8");
  if (!source.includes("<svg") || !source.includes("fill")) {
    throw new Error(`Asset does not look like a transparent SVG: ${assetPath}`);
  }
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      templates: templates.length,
      assets: assetRefs.size,
      categories: categories.size,
    },
    null,
    2,
  ),
);

function assertInvitationDocShape(slug, doc) {
  if (!doc || typeof doc !== "object") {
    throw new Error(`Template ${slug} did not build a document object`);
  }
  if (!doc.meta?.weddingDate || !doc.meta?.weddingTime || !doc.meta?.locale) {
    throw new Error(`Template ${slug} document is missing required meta fields`);
  }
  if (!doc.theme?.bgColor || !doc.theme?.accentColor || !doc.theme?.envelope) {
    throw new Error(`Template ${slug} document is missing theme fields`);
  }
  if (!Array.isArray(doc.blocks) || doc.blocks.length < 7) {
    throw new Error(`Template ${slug} document needs a complete block list`);
  }
  const types = new Set(doc.blocks.map((block) => block.type));
  for (const required of ["hero", "countdown", "venue", "rsvp_form", "footer"]) {
    if (!types.has(required)) {
      throw new Error(`Template ${slug} document missing ${required} block`);
    }
  }
  for (const block of doc.blocks) {
    if (!block.id || !block.type || typeof block.visible !== "boolean" || !block.data) {
      throw new Error(`Template ${slug} has an invalid block shape`);
    }
  }
}
