import { NextResponse } from "next/server";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";

type Params = Promise<{ id: string }>;

export async function GET(_: Request, ctx: { params: Params }) {
  const { id } = await ctx.params;
  // Session, ownership ve guests/stats paralel başlatılır; auth ve
  // ownership check await sonrası yapılır.
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
  const [guests, stats] = await Promise.all([
    prisma.guest.findMany({
      where: { designId: id },
      orderBy: { createdAt: "desc" },
      // Dashboard sadece bu alanları gösteriyor; ileride yeni column
      // eklenirse otomatik wire'a düşmesin. (server-serialization)
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        attending: true,
        guestCount: true,
        note: true,
        source: true,
        token: true,
        createdAt: true,
      },
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
