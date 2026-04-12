import { auth } from "./auth";
import { headers } from "next/headers";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim()).filter(Boolean);

export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  if (!ADMIN_EMAILS.includes(session.user.email)) {
    throw new Error("Forbidden");
  }

  return session;
}
