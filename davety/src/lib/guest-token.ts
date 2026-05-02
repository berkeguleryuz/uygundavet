import { customAlphabet } from "nanoid";

/**
 * Per-guest URL-safe token generator. 16 chars from a 32-char alphabet
 * gives ~80 bits of entropy, plenty for non-guessability while keeping
 * the token short enough for a WhatsApp message.
 *
 * Alphabet excludes look-alikes (0/O, 1/l/i) so a guest reading the
 * link out loud over the phone does not get a 404. Lowercase-only.
 */
const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
const nano = customAlphabet(alphabet, 16);

export function generateGuestToken(): string {
  return nano();
}

const TOKEN_RE = /^[a-z0-9]{16}$/;

export function isValidGuestToken(token: string): boolean {
  return TOKEN_RE.test(token);
}
