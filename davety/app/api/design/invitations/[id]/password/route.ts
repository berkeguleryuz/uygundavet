import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";
import { hashInvitationPassword } from "@/src/lib/password";

const setSchema = z.object({
  password: z.string().min(4).max(120).nullable(),
});

type Params = Promise<{ id: string }>;

/**
 * Host endpoint to enable / change / clear the public password gate
 * for a single invitation. Send `{ password: "abc1" }` to set a
 * password, `{ password: null }` to remove the gate.
 */
export async function PATCH(req: Request, ctx: { params: Params }) {
  const { id } = await ctx.params;
  // Body parse + session + design fetch — hepsi bağımsız, paralel.
  const bodyPromise = req.json().catch(() => null);
  const [session, existing] = await Promise.all([
    getSession(),
    prisma.invitationDesign.findUnique({
      where: { id },
      select: { userId: true },
    }),
  ]);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await bodyPromise;
  const parsed = setSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const passwordHash = parsed.data.password
    ? await hashInvitationPassword(parsed.data.password)
    : null;

  await prisma.invitationDesign.update({
    where: { id },
    data: { passwordHash },
  });

  return NextResponse.json({ ok: true, locked: passwordHash !== null });
}
