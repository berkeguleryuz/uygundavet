import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/src/lib/prisma";
import { rateLimit } from "@/src/lib/rate-limit";
import { getClientIp } from "@/src/lib/client-ip";
import { containsBannedWord } from "@/src/lib/profanity";

const memorySchema = z.object({
  authorName: z.string().trim().min(1).max(120),
  message: z.string().trim().min(1).max(2000),
  hp: z.string().max(0).optional(),
});

type Params = Promise<{ slug: string }>;

export async function GET(_: Request, ctx: { params: Params }) {
  const { slug } = await ctx.params;
  // Tek sorgu — design + onaylı memories nested include ile çekiliyor.
  // Eski versiyon iki sequential round-trip yapıyordu. (async-parallel)
  const design = await prisma.invitationDesign.findFirst({
    where: { OR: [{ slug }, { vanityPath: slug }], status: "published" },
    select: {
      id: true,
      memories: {
        where: { approved: true },
        orderBy: { createdAt: "desc" },
        take: 100,
        select: {
          id: true,
          authorName: true,
          message: true,
          createdAt: true,
        },
      },
    },
  });
  if (!design) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(
    { memories: design.memories },
    {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
      },
    }
  );
}

export async function POST(req: Request, ctx: { params: Params }) {
  const { slug } = await ctx.params;
  const ip = getClientIp(req);

  const limited = await rateLimit({
    key: `mem:${ip}:${slug}`,
    limit: 5,
    windowSeconds: 600,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Çok fazla mesaj. Biraz sonra tekrar dene." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = memorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  if (parsed.data.hp && parsed.data.hp.length > 0) {
    return NextResponse.json({ ok: true, id: "noop" }, { status: 201 });
  }
  if (
    containsBannedWord(parsed.data.message) ||
    containsBannedWord(parsed.data.authorName)
  ) {
    return NextResponse.json(
      { error: "Mesaj uygunsuz içerik barındırıyor." },
      { status: 422 }
    );
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
