import { NextResponse } from "next/server";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";

type Params = Promise<{ id: string }>;

export async function GET(_: Request, ctx: { params: Params }) {
  const { id } = await ctx.params;
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
  const [guests, stats] = await Promise.all([
    prisma.guest.findMany({
      where: { designId: id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.guest.groupBy({
      by: ["attending"],
      where: { designId: id },
      _sum: { guestCount: true },
      _count: true,
    }),
  ]);
  return NextResponse.json({ guests, stats });
}
