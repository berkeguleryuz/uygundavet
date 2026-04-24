import { customAlphabet } from "nanoid";

const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";
const nano = customAlphabet(alphabet, 5);

export function generateShortSlug(): string {
  return nano();
}

const VANITY_RE = /^[a-z0-9][a-z0-9-]{1,39}[a-z0-9]$/i;
const RESERVED = new Set([
  "admin",
  "api",
  "design",
  "dashboard",
  "login",
  "signup",
  "logout",
  "auth",
  "i",
  "public",
  "static",
]);

export function validateVanityPath(vanity: string): {
  ok: boolean;
  reason?: string;
} {
  if (vanity.length < 3) return { ok: false, reason: "too_short" };
  if (vanity.length > 40) return { ok: false, reason: "too_long" };
  if (!VANITY_RE.test(vanity)) return { ok: false, reason: "invalid_chars" };
  if (RESERVED.has(vanity.toLowerCase())) return { ok: false, reason: "reserved" };
  return { ok: true };
}
