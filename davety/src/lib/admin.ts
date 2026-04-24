import { headers } from "next/headers";
import { auth } from "./auth";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export async function isAdminSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email?.toLowerCase();
  if (!session || !email) return null;
  if (!ADMIN_EMAILS.includes(email)) return null;
  return session;
}

export async function requireAdmin() {
  const session = await isAdminSession();
  if (!session) {
    throw new Response("Forbidden", { status: 403 });
  }
  return session;
}
