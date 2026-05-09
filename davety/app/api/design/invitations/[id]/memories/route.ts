import { NextResponse } from "next/server";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";

type Params = Promise<{ id: string }>;

export async function GET(_: Request, ctx: { params: Params }) {
  const { id } = await ctx.params;
  // Session, ownership check, ve memories listesini paralel başlat;
  // ownership auth sonrası kontrol edilir, memory query designId
  // sadece params'tan ihtiyaç duyduğu için bağımsız.
  const [session, design, memories] = await Promise.all([
    getSession(),
    prisma.invitationDesign.findUnique({
      where: { id },
      select: { userId: true },
    }),
    prisma.memoryEntry.findMany({
      where: { designId: id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        authorName: true,
        message: true,
        createdAt: true,
        approved: true,
      },
    }),
  ]);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!design || design.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ memories });
}
