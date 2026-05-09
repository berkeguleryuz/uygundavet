const BLOCKED_ELEMENTS = [
  "script",
  "foreignObject",
  "iframe",
  "object",
  "embed",
  "audio",
  "video",
  "canvas",
  "animate",
  "set",
];

const DANGEROUS_ATTR_RE =
  /\s(?:on[a-z]+|href|xlink:href|src|style)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;

export function sanitizeSvgMarkup(raw: string): string {
  let clean = raw.replace(/<\?xml[^?]*\?>\s*/gi, "");
  clean = clean.replace(/<!doctype[^>]*>\s*/gi, "");
  clean = clean.replace(/<!--[\s\S]*?-->/g, "");

  for (const tag of BLOCKED_ELEMENTS) {
    clean = clean.replace(
      new RegExp(`<${tag}\\b[\\s\\S]*?<\\/${tag}>`, "gi"),
      "",
    );
    clean = clean.replace(new RegExp(`<${tag}\\b[^>]*\\/?>`, "gi"), "");
  }

  clean = clean.replace(DANGEROUS_ATTR_RE, "");
  clean = clean.replace(/\sxmlns:xlink\s*=\s*(?:"[^"]*"|'[^']*')/gi, "");
  clean = clean.replace(/\s+/g, " ").trim();

  return clean;
}

export function sanitizeInvitationDoc<T>(doc: T): T {
  return sanitizeValue(doc) as T;
}

function sanitizeValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (!value || typeof value !== "object") return value;

  const next: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value)) {
    if (key === "svgRaw" && typeof child === "string") {
      next[key] = sanitizeSvgMarkup(child);
    } else {
      next[key] = sanitizeValue(child);
    }
  }
  return next;
}
