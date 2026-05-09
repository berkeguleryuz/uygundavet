import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";

const patchSchema = z.object({ approved: z.boolean() });
type Params = Promise<{ id: string; entryId: string }>;

export async function PATCH(req: Request, ctx: { params: Params }) {
  const { id, entryId } = await ctx.params;
  // Body parse, session ve design fetch hepsi bağımsız.
  const bodyPromise = req.json().catch(() => null);
  const [session, design] = await Promise.all([
    getSession(),
    prisma.invitationDesign.findUnique({
      where: { id },
      select: { userId: true },
    }),
  ]);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!design || design.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await bodyPromise;
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  await prisma.memoryEntry.update({
    where: { id: entryId, designId: id },
    data: { approved: parsed.data.approved },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, ctx: { params: Params }) {
  const { id, entryId } = await ctx.params;
  // Session ve design fetch paralel.
  const [session, design] = await Promise.all([
    getSession(),
    prisma.invitationDesign.findUnique({
      where: { id },
      select: { userId: true },
    }),
  ]);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!design || design.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.memoryEntry.delete({ where: { id: entryId, designId: id } });
  return NextResponse.json({ ok: true });
}
