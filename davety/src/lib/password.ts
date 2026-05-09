import {
  randomBytes,
  scrypt as scryptCb,
  timingSafeEqual,
  type ScryptOptions,
} from "node:crypto";

/**
 * Lightweight password hashing helper for the invitation password
 * protection feature. Uses Node's built-in scrypt so we avoid adding
 * bcrypt or argon2 as a dependency.
 *
 * Format: `scrypt$N=16384,r=8,p=1$<saltHex>$<derivedKeyHex>`
 * The N/r/p parameters are encoded so we can rotate cost factors later
 * without invalidating existing hashes.
 *
 * Cost factor (N=16384) is intentionally moderate. Invitation passwords
 * are not bank-grade secrets, the threat model is "stop a stranger who
 * randomly stumbles on the URL" not "resist a state-funded GPU farm".
 * Higher N would slow down every page render of password-gated pages.
 */
const N = 16384;
const r = 8;
const p = 1;
const KEY_LEN = 32;

function scrypt(
  password: string,
  salt: Buffer,
  keylen: number,
  options: ScryptOptions,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCb(password, salt, keylen, options, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
}

export async function hashInvitationPassword(plain: string): Promise<string> {
  if (!plain || plain.length < 4) {
    throw new Error("Password must be at least 4 characters");
  }
  const salt = randomBytes(16);
  const derived = (await scrypt(plain.normalize("NFC"), salt, KEY_LEN, {
    N,
    r,
    p,
  })) as Buffer;
  return `scrypt$N=${N},r=${r},p=${p}$${salt.toString("hex")}$${derived.toString(
    "hex"
  )}`;
}

export async function verifyInvitationPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  if (!hash || !plain) return false;
  const parts = hash.split("$");
  if (parts.length !== 4 || parts[0] !== "scrypt") return false;
  const params = Object.fromEntries(
    parts[1].split(",").map((kv) => {
      const [k, v] = kv.split("=");
      return [k, parseInt(v, 10)];
    })
  ) as { N?: number; r?: number; p?: number };
  const salt = Buffer.from(parts[2], "hex");
  const expected = Buffer.from(parts[3], "hex");
  const derived = (await scrypt(plain.normalize("NFC"), salt, expected.length, {
    N: params.N ?? N,
    r: params.r ?? r,
    p: params.p ?? p,
  })) as Buffer;
  if (derived.length !== expected.length) return false;
  try {
    return timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}
