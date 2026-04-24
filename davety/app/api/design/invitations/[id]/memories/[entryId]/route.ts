import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";

const patchSchema = z.object({ approved: z.boolean() });
type Params = Promise<{ id: string; entryId: string }>;

export async function PATCH(req: Request, ctx: { params: Params }) {
  const { id, entryId } = await ctx.params;
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const design = await prisma.invitationDesign.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!design || design.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.memoryEntry.update({
    where: { id: entryId, designId: id },
    data: { approved: parsed.data.approved },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, ctx: { params: Params }) {
  const { id, entryId } = await ctx.params;
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const design = await prisma.invitationDesign.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!design || design.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.memoryEntry.delete({ where: { id: entryId, designId: id } });
  return NextResponse.json({ ok: true });
}
