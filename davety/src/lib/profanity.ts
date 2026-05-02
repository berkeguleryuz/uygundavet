/**
 * Lightweight profanity / spam screen for public-facing free-text inputs
 * (memory book messages, RSVP notes). Conservative by design, we only
 * filter terms that are unambiguously offensive or spam, never legitimate
 * Turkish words, even if they look similar.
 *
 * Bypasses are trivial (leetspeak, spacing). The goal here is the 90%
 * lazy-bot case, not a real moderation product. Host-side approval
 * remains the primary moderation mechanism for memories.
 */

const NORMALIZE_RE = /[^a-zçğıöşü0-9]+/gi;

const BANNED_TR = [
  "amk",
  "amq",
  "aq",
  "orospu",
  "siktir",
  "yarrak",
  "gotveren",
  "sikim",
  "sikiş",
  "ananı",
  "amına",
];
const BANNED_EN = [
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "motherfucker",
  "cunt",
  "porn",
  "nigger",
];
const BANNED_SPAM = [
  "viagra",
  "casino",
  "bahis",
  "kumarhane",
  "bedavabonus",
  "iddaa",
  "betsson",
];

const BANNED = new Set(
  [...BANNED_TR, ...BANNED_EN, ...BANNED_SPAM].map((w) => w.toLowerCase())
);

/**
 * Returns true when the input contains a token that matches any banned
 * word, after lowercasing and stripping punctuation. Diacritic-aware
 * for Turkish characters.
 */
export function containsBannedWord(input: string): boolean {
  if (!input) return false;
  const normalized = input.toLowerCase().normalize("NFC");
  const tokens = normalized.split(NORMALIZE_RE).filter(Boolean);
  for (const token of tokens) {
    if (BANNED.has(token)) return true;
    for (const banned of BANNED) {
      if (token.includes(banned)) return true;
    }
  }
  return false;
}
