import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/src/lib/prisma";
import { rateLimit } from "@/src/lib/rate-limit";
import { getClientIp } from "@/src/lib/client-ip";

const rsvpSchema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().max(40).optional(),
  email: z.string().trim().email().max(200).optional(),
  attending: z.enum(["yes", "no", "maybe"]),
  guestCount: z.number().int().min(1).max(20).default(1),
  note: z.string().trim().max(1000).optional(),
  source: z.string().trim().max(40).optional(),
  guestToken: z.string().trim().max(64).optional(),
  // Honeypot field, real users leave it empty. Bots that auto-fill every
  // input populate it and get bounced.
  hp: z.string().max(0).optional(),
});

type Params = Promise<{ slug: string }>;

export async function POST(req: Request, ctx: { params: Params }) {
  const { slug } = await ctx.params;
  const ip = getClientIp(req);

  const limited = await rateLimit({
    key: `rsvp:${ip}:${slug}`,
    limit: 6,
    windowSeconds: 600,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Çok fazla deneme. Lütfen biraz sonra tekrar dene." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = rsvpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  if (parsed.data.hp && parsed.data.hp.length > 0) {
    return NextResponse.json({ ok: true, id: "noop" }, { status: 201 });
  }

  const design = await prisma.invitationDesign.findFirst({
    where: { OR: [{ slug }, { vanityPath: slug }], status: "published" },
    select: { id: true, publishedDoc: true },
  });
  if (!design) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const meta = (design.publishedDoc as { meta?: { rsvpDeadline?: string } })
    ?.meta;
  if (meta?.rsvpDeadline) {
    const deadline = new Date(meta.rsvpDeadline);
    if (Number.isFinite(deadline.getTime()) && Date.now() > deadline.getTime()) {
      return NextResponse.json(
        { error: "RsvpDeadlinePassed", message: "Cevap tarihi geçti." },
        { status: 410 }
      );
    }
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
      source:
        parsed.data.source ??
        (parsed.data.guestToken ? "token" : null),
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, id: guest.id }, { status: 201 });
}
