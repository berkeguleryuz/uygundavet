import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

/**
 * Request-scoped session lookup. React.cache memoizes the result for
 * the duration of a single render pass, so layout + page + nested
 * components calling getSession() share one Better Auth round-trip
 * instead of N. Critical because layouts and pages frequently both
 * need the session for authorization gates.
 */
export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

export async function requireSession() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}
