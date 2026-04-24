import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/src/lib/prisma";

const memorySchema = z.object({
  authorName: z.string().min(1).max(120),
  message: z.string().min(1).max(2000),
});

type Params = Promise<{ slug: string }>;

export async function GET(_: Request, ctx: { params: Params }) {
  const { slug } = await ctx.params;
  const design = await prisma.invitationDesign.findFirst({
    where: { OR: [{ slug }, { vanityPath: slug }], status: "published" },
    select: { id: true },
  });
  if (!design) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const memories = await prisma.memoryEntry.findMany({
    where: { designId: design.id, approved: true },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: { id: true, authorName: true, message: true, createdAt: true },
  });
  return NextResponse.json(
    { memories },
    { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" } }
  );
}

export async function POST(req: Request, ctx: { params: Params }) {
  const { slug } = await ctx.params;

  const body = await req.json().catch(() => null);
  const parsed = memorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const design = await prisma.invitationDesign.findFirst({
    where: { OR: [{ slug }, { vanityPath: slug }], status: "published" },
    select: { id: true },
  });
  if (!design) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const memory = await prisma.memoryEntry.create({
    data: {
      designId: design.id,
      authorName: parsed.data.authorName,
      message: parsed.data.message,
      approved: false,
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, id: memory.id }, { status: 201 });
}
