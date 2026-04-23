import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";
import { validateVanityPath } from "@/src/lib/slug";

const slugSchema = z.object({ vanityPath: z.string() });
type Params = Promise<{ id: string }>;

export async function PATCH(req: Request, ctx: { params: Params }) {
  const { id } = await ctx.params;
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = slugSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const check = validateVanityPath(parsed.data.vanityPath);
  if (!check.ok) {
    return NextResponse.json(
      { error: "Invalid vanity", reason: check.reason },
      { status: 400 }
    );
  }

  const existing = await prisma.invitationDesign.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const conflict = await prisma.invitationDesign.findFirst({
    where: { vanityPath: parsed.data.vanityPath, NOT: { id } },
    select: { id: true },
  });
  if (conflict) {
    return NextResponse.json({ error: "Vanity taken" }, { status: 409 });
  }

  await prisma.invitationDesign.update({
    where: { id },
    data: { vanityPath: parsed.data.vanityPath },
  });

  return NextResponse.json({ ok: true });
}
