import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

/**
 * Cron-friendly endpoint that flips published invitations whose
 * `expiresAt` has passed to status="archived" and stamps `archivedAt`.
 *
 * Auth: requires the `CRON_SECRET` env var to match a `?secret=` query
 * param so randoms cannot trigger archival. Vercel Cron forwards an
 * `Authorization: Bearer <secret>` header which we also accept.
 *
 * Idempotent: an invitation already archived (archivedAt != null) is
 * skipped on subsequent runs.
 */
function authorize(req: Request): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  const url = new URL(req.url);
  if (url.searchParams.get("secret") === expected) return true;
  const auth = req.headers.get("authorization") ?? "";
  if (auth === `Bearer ${expected}`) return true;
  return false;
}

export async function GET(req: Request) {
  if (!authorize(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const now = new Date();
  const updated = await prisma.invitationDesign.updateMany({
    where: {
      status: "published",
      expiresAt: { lte: now },
      archivedAt: null,
    },
    data: {
      status: "archived",
      archivedAt: now,
    },
  });
  return NextResponse.json({ ok: true, archived: updated.count });
}
