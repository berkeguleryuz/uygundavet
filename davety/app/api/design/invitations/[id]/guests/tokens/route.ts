import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";
import { generateGuestToken } from "@/src/lib/guest-token";

const createSchema = z.object({
  guests: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(120),
        phone: z.string().trim().max(40).optional(),
        email: z.string().trim().email().max(200).optional(),
        plusOneMax: z.number().int().min(1).max(10).default(1),
        groupLabel: z.string().trim().max(60).optional(),
        eventDays: z.array(z.string().trim().max(40)).max(10).default([]),
      })
    )
    .min(1)
    .max(500),
});

type Params = Promise<{ id: string }>;

/**
 * Bulk-create personalised guest entries with unique tokens. The host
 * uploads a list (manual entry, CSV import) and we hand back the tokens
 * so they can build the per-guest WhatsApp / SMS share links.
 */
export async function POST(req: Request, ctx: { params: Params }) {
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

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const created = await prisma.$transaction(
    parsed.data.guests.map((g) =>
      prisma.guest.create({
        data: {
          designId: id,
          name: g.name,
          phone: g.phone ?? null,
          email: g.email ?? null,
          attending: "pending",
          guestCount: 1,
          plusOneMax: g.plusOneMax,
          groupLabel: g.groupLabel ?? null,
          eventDays: g.eventDays,
          token: generateGuestToken(),
          source: "host",
        },
        select: {
          id: true,
          name: true,
          token: true,
          plusOneMax: true,
          groupLabel: true,
          eventDays: true,
        },
      })
    )
  );

  return NextResponse.json({ guests: created }, { status: 201 });
}
