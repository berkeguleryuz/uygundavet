import { NextResponse } from "next/server";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";
import { deleteR2Prefix } from "@/src/lib/r2";

/**
 * Account self-deletion. Removes:
 *   1. All R2 objects under `users/{uid}/`
 *   2. All Prisma rows that cascade from User (designs, assets, sessions, etc.)
 *
 * Better Auth handles session invalidation through its own deleteUser flow,
 * but for now we cascade through Prisma which our schema already covers.
 * The user must be authenticated; we never let one user delete another.
 */
export async function DELETE() {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    await deleteR2Prefix(`users/${userId}/`);
  } catch (err) {
    console.error("[delete account] R2 cleanup failed:", err);
  }

  // Prisma cascade handles InvitationDesign, Session, Account, Asset, etc.
  await prisma.user.delete({ where: { id: userId } });

  return NextResponse.json({ ok: true });
}
