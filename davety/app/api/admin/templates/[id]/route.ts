import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminSession } from "@/src/lib/admin";
import { prisma } from "@/src/lib/prisma";

const patchSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  description: z.string().max(500).nullable().optional(),
  category: z.string().max(60).nullable().optional(),
  published: z.boolean().optional(),
  doc: z.unknown().optional(),
  previewUrl: z.string().url().nullable().optional(),
});

type Params = Promise<{ id: string }>;

export async function GET(_: Request, ctx: { params: Params }) {
  const { id } = await ctx.params;
  const session = await isAdminSession();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const template = await prisma.designTemplate.findUnique({ where: { id } });
  if (!template) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(template);
}

export async function PATCH(req: Request, ctx: { params: Params }) {
  const { id } = await ctx.params;
  const session = await isAdminSession();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const updated = await prisma.designTemplate.update({
    where: { id },
    data: {
      ...(parsed.data.title !== undefined ? { title: parsed.data.title } : {}),
      ...(parsed.data.description !== undefined
        ? { description: parsed.data.description }
        : {}),
      ...(parsed.data.category !== undefined
        ? { category: parsed.data.category }
        : {}),
      ...(parsed.data.published !== undefined
        ? { published: parsed.data.published }
        : {}),
      ...(parsed.data.previewUrl !== undefined
        ? { previewUrl: parsed.data.previewUrl }
        : {}),
      ...(parsed.data.doc !== undefined ? { doc: parsed.data.doc as object } : {}),
    },
  });

  await prisma.adminAuditLog
    .create({
      data: {
        actorId: session.user.id,
        action: "template.update",
        targetType: "template",
        targetId: id,
        meta: parsed.data as object,
      },
    })
    .catch(() => {});

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, ctx: { params: Params }) {
  const { id } = await ctx.params;
  const session = await isAdminSession();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.designTemplate.delete({ where: { id } });
  await prisma.adminAuditLog
    .create({
      data: {
        actorId: session.user.id,
        action: "template.delete",
        targetType: "template",
        targetId: id,
      },
    })
    .catch(() => {});

  return NextResponse.json({ ok: true });
}
