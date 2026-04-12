import { customAlphabet } from "nanoid";

const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
const generate = customAlphabet(alphabet, 8);

export function generateInviteCode(): string {
  return generate();
}
