import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";
import { validateVanityPath } from "@/src/lib/slug";
import { planLimitsFor, tierOrFree } from "@/src/lib/plan-limits";
import type { PlanTier } from "@davety/schema";

const slugSchema = z.object({ vanityPath: z.string() });
type Params = Promise<{ id: string }>;

export async function PATCH(req: Request, ctx: { params: Params }) {
  const { id } = await ctx.params;
  // Body parse, session ve design fetch paralel.
  const bodyPromise = req.json().catch(() => null);
  const [session, existing] = await Promise.all([
    getSession(),
    prisma.invitationDesign.findUnique({
      where: { id },
      select: { userId: true, doc: true },
    }),
  ]);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await bodyPromise;
  const parsed = slugSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const check = validateVanityPath(parsed.data.vanityPath);
  if (!check.ok) {
    return NextResponse.json(
      { error: "Invalid vanity", reason: check.reason },
      { status: 400 }
    );
  }

  // Vanity path Klasik+ tier gerekli. Free kullanıcı buton görmemeli
  // (UI gate), defensive olarak server-side de blokla.
  const tier = tierOrFree(
    ((existing.doc as { meta?: { tier?: PlanTier } })?.meta?.tier ?? null)
  );
  if (!planLimitsFor(tier).vanityPathEnabled) {
    return NextResponse.json(
      {
        error: "VanityPathLocked",
        message: "Özel kısa link Klasik+ paketinde açılır.",
      },
      { status: 402 }
    );
  }

  const conflict = await prisma.invitationDesign.findFirst({
    where: { vanityPath: parsed.data.vanityPath, NOT: { id } },
    select: { id: true },
  });
  if (conflict) {
    return NextResponse.json({ error: "Vanity taken" }, { status: 409 });
  }

  await prisma.invitationDesign.update({
    where: { id },
    data: { vanityPath: parsed.data.vanityPath },
  });

  return NextResponse.json({ ok: true });
}
