import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "./auth";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

/**
 * Request-scoped admin check. AdminLayout + admin pages + admin API
 * routes all call this; React.cache dedupes the Better Auth session
 * lookup so it happens once per request even with multiple consumers.
 */
export const isAdminSession = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email?.toLowerCase();
  if (!session || !email) return null;
  if (!ADMIN_EMAILS.includes(email)) return null;
  return session;
});

export async function requireAdmin() {
  const session = await isAdminSession();
  if (!session) {
    throw new Response("Forbidden", { status: 403 });
  }
  return session;
}
