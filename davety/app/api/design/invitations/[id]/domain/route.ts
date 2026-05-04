import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";
import { planLimitsFor, tierOrFree } from "@/src/lib/plan-limits";
import type { PlanTier } from "@davety/schema";

const setSchema = z.object({
  customDomain: z
    .string()
    .trim()
    .toLowerCase()
    .min(4)
    .max(253)
    .regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/)
    .nullable(),
});

const RESERVED_HOSTS = new Set([
  "davetyolla.com",
  "www.davetyolla.com",
  "uygundavet.com",
  "vercel.app",
  "localhost",
]);

type Params = Promise<{ id: string }>;

/**
 * Owner-only endpoint to set or clear the customDomain on an
 * invitation. Reserved hosts (our own app domains, vercel.app, etc.)
 * are rejected so a host cannot squat on davetyolla.com.
 *
 * The actual DNS configuration (CNAME / Vercel domain alias) is done
 * outside the app. This endpoint only stores the mapping so the proxy
 * can resolve incoming traffic to the right invitation.
 */
export async function PATCH(req: Request, ctx: { params: Params }) {
  const { id } = await ctx.params;
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.invitationDesign.findUnique({
    where: { id },
    select: { userId: true, doc: true },
  });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Custom domain SADECE Premium tier'da açık. Diğer tier'larda
  // domain set / clear isteği reddedilir, kullanıcı paketini
  // yükseltmeden bağlayamasın.
  const tier = tierOrFree(
    ((existing.doc as { meta?: { tier?: PlanTier } })?.meta?.tier ?? null)
  );
  if (!planLimitsFor(tier).customDomainEnabled) {
    return NextResponse.json(
      {
        error: "CustomDomainLocked",
        message: "Özel alan adı sadece Premium pakette açılır.",
      },
      { status: 402 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = setSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid domain", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const customDomain = parsed.data.customDomain;
  if (customDomain && RESERVED_HOSTS.has(customDomain)) {
    return NextResponse.json(
      { error: "Bu domain rezerve edilmiş." },
      { status: 409 }
    );
  }

  if (customDomain) {
    const conflict = await prisma.invitationDesign.findFirst({
      where: { customDomain, NOT: { id } },
      select: { id: true },
    });
    if (conflict) {
      return NextResponse.json(
        { error: "Bu domain zaten başka bir davetiyeye bağlı." },
        { status: 409 }
      );
    }
  }

  await prisma.invitationDesign.update({
    where: { id },
    data: { customDomain },
  });

  return NextResponse.json({ ok: true, customDomain });
}
