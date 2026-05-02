/**
 * Lightweight magic-byte sniffer. Verifies that the actual file content
 * matches the client-claimed Content-Type for video/audio uploads. For
 * images we already rely on sharp to reject malformed input, this module
 * is mainly to stop a malicious client from claiming `image/jpeg` while
 * smuggling a `.exe` or `.html` past the upload route.
 *
 * Returns `true` if the bytes look consistent with `claimedMime`.
 * Returns `false` if mismatch detected.
 *
 * Note: this is best-effort. We accept the claim if we cannot positively
 * identify the bytes, so as not to reject obscure-but-legal formats.
 */

const SIGS: Array<{
  mime: string;
  match: (b: Uint8Array) => boolean;
}> = [
  // video/mp4: "ftyp" at offset 4
  {
    mime: "video/mp4",
    match: (b) =>
      b.length > 11 &&
      b[4] === 0x66 &&
      b[5] === 0x74 &&
      b[6] === 0x79 &&
      b[7] === 0x70,
  },
  // video/webm: EBML header 1A 45 DF A3
  {
    mime: "video/webm",
    match: (b) =>
      b.length > 4 &&
      b[0] === 0x1a &&
      b[1] === 0x45 &&
      b[2] === 0xdf &&
      b[3] === 0xa3,
  },
  // audio/mpeg (mp3): "ID3" tag, or 0xFF 0xFB / 0xFF 0xF3 / 0xFF 0xF2 frame sync
  {
    mime: "audio/mpeg",
    match: (b) => {
      if (b.length < 3) return false;
      if (b[0] === 0x49 && b[1] === 0x44 && b[2] === 0x33) return true;
      if (b[0] === 0xff && (b[1] === 0xfb || b[1] === 0xf3 || b[1] === 0xf2))
        return true;
      return false;
    },
  },
  // audio/mp4 (m4a): same ftyp container as mp4
  {
    mime: "audio/mp4",
    match: (b) =>
      b.length > 11 &&
      b[4] === 0x66 &&
      b[5] === 0x74 &&
      b[6] === 0x79 &&
      b[7] === 0x70,
  },
  // audio/ogg: "OggS"
  {
    mime: "audio/ogg",
    match: (b) =>
      b.length > 4 &&
      b[0] === 0x4f &&
      b[1] === 0x67 &&
      b[2] === 0x67 &&
      b[3] === 0x53,
  },
  // audio/wav: "RIFF"...."WAVE"
  {
    mime: "audio/wav",
    match: (b) =>
      b.length > 12 &&
      b[0] === 0x52 &&
      b[1] === 0x49 &&
      b[2] === 0x46 &&
      b[3] === 0x46 &&
      b[8] === 0x57 &&
      b[9] === 0x41 &&
      b[10] === 0x56 &&
      b[11] === 0x45,
  },
  // image/jpeg: FF D8 FF
  {
    mime: "image/jpeg",
    match: (b) =>
      b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  // image/png: 89 50 4E 47 0D 0A 1A 0A
  {
    mime: "image/png",
    match: (b) =>
      b.length > 8 &&
      b[0] === 0x89 &&
      b[1] === 0x50 &&
      b[2] === 0x4e &&
      b[3] === 0x47 &&
      b[4] === 0x0d &&
      b[5] === 0x0a &&
      b[6] === 0x1a &&
      b[7] === 0x0a,
  },
  // image/gif: "GIF8"
  {
    mime: "image/gif",
    match: (b) =>
      b.length > 4 &&
      b[0] === 0x47 &&
      b[1] === 0x49 &&
      b[2] === 0x46 &&
      b[3] === 0x38,
  },
  // image/webp: RIFF....WEBP
  {
    mime: "image/webp",
    match: (b) =>
      b.length > 12 &&
      b[0] === 0x52 &&
      b[1] === 0x49 &&
      b[2] === 0x46 &&
      b[3] === 0x46 &&
      b[8] === 0x57 &&
      b[9] === 0x45 &&
      b[10] === 0x42 &&
      b[11] === 0x50,
  },
];

/**
 * Returns true when the bytes look consistent with the claimed MIME.
 * Returns false when we positively identify a different type.
 * Returns true when we cannot identify the bytes at all (best-effort).
 */
export function verifyMime(bytes: Uint8Array, claimedMime: string): boolean {
  const headers = bytes.subarray(0, Math.min(bytes.length, 64));
  let identified: string | null = null;
  for (const sig of SIGS) {
    if (sig.match(headers)) {
      identified = sig.mime;
      break;
    }
  }
  if (identified === null) {
    return true;
  }
  if (identified === claimedMime) return true;
  if (claimedMime === "video/mp4" && identified === "audio/mp4") return true;
  if (claimedMime === "audio/mp4" && identified === "video/mp4") return true;
  return false;
}

/**
 * Per-MIME byte ceilings. Image files are expected to be small after
 * webp re-encoding, audio is medium, video is the only thing that needs
 * the full 100 MB headroom. Tighter caps shrink the attack surface for
 * decompression-bomb-style payloads.
 */
export const SIZE_LIMITS_BY_MIME: Record<string, number> = {
  "image/jpeg": 12 * 1024 * 1024,
  "image/png": 12 * 1024 * 1024,
  "image/webp": 12 * 1024 * 1024,
  "image/gif": 8 * 1024 * 1024,
  "audio/mpeg": 25 * 1024 * 1024,
  "audio/mp4": 25 * 1024 * 1024,
  "audio/ogg": 25 * 1024 * 1024,
  "audio/wav": 60 * 1024 * 1024,
  "video/mp4": 100 * 1024 * 1024,
  "video/webm": 100 * 1024 * 1024,
};

export function maxBytesFor(mime: string): number {
  return SIZE_LIMITS_BY_MIME[mime] ?? 20 * 1024 * 1024;
}
