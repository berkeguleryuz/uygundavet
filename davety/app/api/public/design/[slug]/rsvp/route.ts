import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/src/lib/prisma";

const rsvpSchema = z.object({
  name: z.string().min(1).max(120),
  phone: z.string().max(40).optional(),
  email: z.string().email().optional(),
  attending: z.enum(["yes", "no"]),
  guestCount: z.number().int().min(1).max(20).default(1),
  note: z.string().max(1000).optional(),
  source: z.string().max(40).optional(),
});

type Params = Promise<{ slug: string }>;

export async function POST(req: Request, ctx: { params: Params }) {
  const { slug } = await ctx.params;

  const body = await req.json().catch(() => null);
  const parsed = rsvpSchema.safeParse(body);
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

  const guest = await prisma.guest.create({
    data: {
      designId: design.id,
      name: parsed.data.name,
      phone: parsed.data.phone ?? null,
      email: parsed.data.email ?? null,
      attending: parsed.data.attending,
      guestCount: parsed.data.guestCount,
      note: parsed.data.note ?? null,
      source: parsed.data.source ?? null,
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, id: guest.id }, { status: 201 });
}
