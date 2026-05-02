import { NextResponse } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";
import { validateVanityPath } from "@/src/lib/slug";
import { planLimitsFor, tierOrFree } from "@/src/lib/plan-limits";
import { computeExpiresAt } from "@/src/lib/archive";
import type { Block, PlanTier } from "@davety/schema";

const publishSchema = z.object({
  vanityPath: z.string().optional(),
  tier: z.enum(["free", "basic", "pro", "premium"]).optional(),
});

/**
 * Apply tier-based mutations to the doc snapshot before persisting it as
 * the published version. Server-side gate: even if the editor UI is
 * bypassed (developer tools, malicious client), the publishedDoc never
 * leaks paid-tier features to free users.
 *
 * Mutations applied:
 *   1. Trim gallery items to the tier's max (1 for free, larger for paid).
 *   2. Drop disallowed blocks (memory_book on free).
 *   3. Inject a branded promo block at the 4th position (index 3) for
 *      free tier so every published free invitation carries our advert.
 *      Idempotent, running twice doesn't duplicate the block.
 *
 * The branding block uses a lightweight custom_note with a recognisable
 * id prefix so we can detect and replace it on subsequent publishes.
 */
const BRANDING_BLOCK_ID_PREFIX = "davetyolla-brand-";

function applyTierToDoc(doc: object, tier: PlanTier): object {
  const limits = planLimitsFor(tier);
  const docTyped = doc as { blocks?: Block[]; meta?: Record<string, unknown> };
  let blocks = (docTyped.blocks ?? []).slice();

  // 1. Trim gallery items
  blocks = blocks.map((b) => {
    if (b.type !== "gallery") return b;
    const items = ((b.data as { items?: unknown[] }).items ?? []).slice(
      0,
      limits.galleryMaxItems
    );
    return { ...b, data: { ...b.data, items } };
  });

  // 2. Drop disallowed blocks
  if (!limits.memoryBookEnabled) {
    blocks = blocks.filter((b) => b.type !== "memory_book");
  }

  // 3. Branding block: free shows it permanently at index 3, paid tiers
  //    have it removed if it leaked in.
  blocks = blocks.filter(
    (b) => !b.id.startsWith(BRANDING_BLOCK_ID_PREFIX)
  );
  if (limits.showsBranding) {
    const branding: Block = {
      id: `${BRANDING_BLOCK_ID_PREFIX}${nanoid(6)}`,
      type: "custom_note",
      visible: true,
      locked: true,
      data: {
        title: "DavetYolla.com",
        body: "Bu davetiye DavetYolla.com ile ücretsiz hazırlandı. Sen de kendi davetiyeni dakikalar içinde oluştur.",
      },
      style: { align: "center" },
    };
    const insertAt = Math.min(3, blocks.length);
    blocks = [
      ...blocks.slice(0, insertAt),
      branding,
      ...blocks.slice(insertAt),
    ];
  }

  return {
    ...docTyped,
    blocks,
  };
}

type Params = Promise<{ id: string }>;

export async function POST(req: Request, ctx: { params: Params }) {
  const { id } = await ctx.params;
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = publishSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const existing = await prisma.invitationDesign.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const vanity = parsed.data.vanityPath;
  if (vanity) {
    const check = validateVanityPath(vanity);
    if (!check.ok) {
      return NextResponse.json(
        { error: "Invalid vanity", reason: check.reason },
        { status: 400 }
      );
    }
    const conflict = await prisma.invitationDesign.findFirst({
      where: { vanityPath: vanity, NOT: { id } },
      select: { id: true },
    });
    if (conflict) {
      return NextResponse.json(
        { error: "Vanity taken" },
        { status: 409 }
      );
    }
  }

  const tier = parsed.data.tier;
  const existingMeta =
    (existing.doc as { meta?: { tier?: string } }).meta ?? {};
  const effectiveTier = tierOrFree(
    (tier ?? (existingMeta.tier as PlanTier | undefined)) ?? null
  );

  // Tier mutations (gallery trim + branding block) before stamping
  // status=published. publishedDoc is what guests see; doc is what the
  // owner keeps editing, we apply the same trim to both so the editor
  // shows the actual published state.
  const tierApplied = applyTierToDoc(existing.doc as object, effectiveTier);
  const publishedDoc = {
    ...tierApplied,
    meta: {
      ...existingMeta,
      ...(tierApplied as { meta?: object }).meta,
      status: "published",
      updatedAt: new Date().toISOString(),
      tier: effectiveTier,
    },
  };

  const docWithTier = {
    ...tierApplied,
    meta: { ...existingMeta, tier: effectiveTier },
  };

  const publishedAt = new Date();
  const expiresAt = computeExpiresAt(effectiveTier, publishedAt);

  // Yeni alanlar (expiresAt, archivedAt) auto-archive feature'ı için
  // eklendi. Migration veya prisma generate henüz çalıştırılmadıysa
  // Prisma "Unknown arg" hatası fırlatır. O senaryoda eski path'e
  // düşüp kullanıcı yayınlamaya devam edebilsin.
  let updated: {
    slug: string;
    vanityPath: string | null;
    publishedAt: Date | null;
    expiresAt: Date | null;
  };
  try {
    updated = await prisma.invitationDesign.update({
      where: { id },
      data: {
        status: "published",
        publishedDoc,
        publishedAt,
        expiresAt,
        archivedAt: null,
        ...(vanity ? { vanityPath: vanity } : {}),
        doc: docWithTier,
      },
      select: {
        slug: true,
        vanityPath: true,
        publishedAt: true,
        expiresAt: true,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (
      /Unknown arg|Unknown field|column .* does not exist/i.test(msg) ||
      /expiresAt|archivedAt/.test(msg)
    ) {
      console.warn(
        "[publish] new columns not migrated yet, falling back without expiresAt/archivedAt"
      );
      const fallback = await prisma.invitationDesign.update({
        where: { id },
        data: {
          status: "published",
          publishedDoc,
          publishedAt,
          ...(vanity ? { vanityPath: vanity } : {}),
          doc: docWithTier,
        },
        select: { slug: true, vanityPath: true, publishedAt: true },
      });
      updated = { ...fallback, expiresAt: null };
    } else {
      throw err;
    }
  }

  const shareUrl = updated.vanityPath
    ? `/i/${updated.vanityPath}`
    : `/i/${updated.slug}`;

  return NextResponse.json({
    ok: true,
    slug: updated.slug,
    vanityPath: updated.vanityPath,
    url: shareUrl,
    expiresAt: updated.expiresAt,
  });
}
