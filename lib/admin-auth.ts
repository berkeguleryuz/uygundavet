import { auth } from "./auth";
import { db } from "./db";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim()).filter(Boolean);

export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  if (!ADMIN_EMAILS.includes(session.user.email)) {
    throw new Error("Forbidden");
  }

  const sessionUser = session.user as typeof session.user & { role?: string };
  if (sessionUser.role !== "admin") {
    const userId = sessionUser.id;
    const filter = ObjectId.isValid(userId)
      ? { $or: [{ _id: new ObjectId(userId) }, { id: userId }] }
      : { id: userId };
    await db.collection("user").updateOne(filter, { $set: { role: "admin" } });
  }

  return session;
}
