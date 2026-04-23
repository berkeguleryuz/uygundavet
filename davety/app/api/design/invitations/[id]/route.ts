import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";

const patchSchema = z.object({
  doc: z.unknown(),
  clientUpdatedAt: z.string().optional(),
});

type Params = Promise<{ id: string }>;

export async function GET(_: Request, ctx: { params: Params }) {
  const { id } = await ctx.params;
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const design = await prisma.invitationDesign.findUnique({ where: { id } });
  if (!design || design.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(design);
}

export async function PATCH(req: Request, ctx: { params: Params }) {
  const { id } = await ctx.params;
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const existing = await prisma.invitationDesign.findUnique({
    where: { id },
    select: { userId: true, updatedAt: true },
  });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // NB: multi-tab collision detection (clientUpdatedAt mismatch → 409) is deferred.
  // Single-user flow was hitting false positives because React strict-mode double
  // hydration reset the ack cursor. Treat autosaves as last-write-wins for now.
  const updated = await prisma.invitationDesign.update({
    where: { id },
    data: {
      doc: parsed.data.doc as object,
      lastAutosavedAt: new Date(),
    },
    select: { updatedAt: true },
  });

  // Fire-and-forget edit event log
  prisma.editEvent
    .create({
      data: {
        designId: id,
        actorId: session.user.id,
        op: "doc.replace",
        payload: {},
      },
    })
    .catch(() => {});

  return NextResponse.json({
    ok: true,
    updatedAt: updated.updatedAt.toISOString(),
  });
}

export async function DELETE(_: Request, ctx: { params: Params }) {
  const { id } = await ctx.params;
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const existing = await prisma.invitationDesign.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await prisma.invitationDesign.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
