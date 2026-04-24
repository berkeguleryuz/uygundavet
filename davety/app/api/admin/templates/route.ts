import { NextResponse } from "next/server";
import { z } from "zod";
import { buildDefaultDoc } from "@davety/schema";
import { isAdminSession } from "@/src/lib/admin";
import { prisma } from "@/src/lib/prisma";

const createSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/i),
  title: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  category: z.string().max(60).optional(),
  doc: z.unknown().optional(),
});

export async function GET() {
  const session = await isAdminSession();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const templates = await prisma.designTemplate.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ templates });
}

export async function POST(req: Request) {
  const session = await isAdminSession();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const conflict = await prisma.designTemplate.findUnique({
    where: { slug: parsed.data.slug },
    select: { id: true },
  });
  if (conflict) {
    return NextResponse.json({ error: "Slug taken" }, { status: 409 });
  }

  const doc =
    parsed.data.doc ??
    buildDefaultDoc({
      weddingDate: new Date(Date.now() + 90 * 86_400_000)
        .toISOString()
        .split("T")[0],
      weddingTime: "19:00",
    });

  const template = await prisma.designTemplate.create({
    data: {
      slug: parsed.data.slug.toLowerCase(),
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      category: parsed.data.category ?? null,
      doc: doc as object,
      createdBy: session.user.id,
    },
    select: { id: true, slug: true },
  });

  await prisma.adminAuditLog
    .create({
      data: {
        actorId: session.user.id,
        action: "template.create",
        targetType: "template",
        targetId: template.id,
      },
    })
    .catch(() => {});

  return NextResponse.json(template, { status: 201 });
}
