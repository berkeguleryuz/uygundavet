import { nanoid } from "nanoid";
import { prisma } from "@/src/lib/prisma";
import {
  planLimitsFor,
  tierOrFree,
  CUSTOM_BLOCK_TYPES,
} from "@/src/lib/plan-limits";
import { computeExpiresAt } from "@/src/lib/archive";
import { validateVanityPath } from "@/src/lib/slug";
import type { Block, PlanTier } from "@davety/schema";

/**
 * Publish flow paylaşımlı kütüphanesi. Hem `/api/design/invitations/[id]/publish`
 * endpoint'i hem Stripe webhook tarafı bu fonksiyondan geçer — böylece tier
 * trim mantığı + branding inject + expiresAt hesabı tek noktada.
 *
 * Pricing & ownership kontrolleri çağıran tarafa bırakıldı (endpoint:
 * session ownership; webhook: payment paid signal). Burada sadece "veriler
 * doğrulanmış halde geliyor" varsayımı altında DB yazımı yapılır.
 */
const BRANDING_BLOCK_ID_PREFIX = "davetyolla-brand-";

export function applyTierToPublishedDoc(doc: object, tier: PlanTier): object {
  const limits = planLimitsFor(tier);
  const docTyped = doc as {
    blocks?: Block[];
    meta?: Record<string, unknown>;
    theme?: Record<string, unknown>;
  };
  let blocks = (docTyped.blocks ?? []).slice();

  // 1. Galeri trim (tier max kadar item)
  blocks = blocks.map((b) => {
    if (b.type !== "gallery") return b;
    const items = ((b.data as { items?: unknown[] }).items ?? []).slice(
      0,
      limits.galleryMaxItems,
    );
    return { ...b, data: { ...b.data, items } };
  });

  // 2. Tier-locked bloklar
  if (!limits.memoryBookEnabled)
    blocks = blocks.filter((b) => b.type !== "memory_book");
  if (!limits.rsvpFormEnabled)
    blocks = blocks.filter((b) => b.type !== "rsvp_form");
  if (!limits.customBlocksEnabled)
    blocks = blocks.filter((b) => !CUSTOM_BLOCK_TYPES.has(b.type));

  // 3. Eski branding bloğu temizlenir, free için yeniden eklenir
  blocks = blocks.filter((b) => !b.id.startsWith(BRANDING_BLOCK_ID_PREFIX));
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
    blocks = [...blocks.slice(0, insertAt), branding, ...blocks.slice(insertAt)];
  }

  // 4. bgMusicUrl tier'a göre temizle
  let theme = docTyped.theme;
  if (limits.backgroundMusicMode === "off" && theme && "bgMusicUrl" in theme) {
    theme = { ...theme, bgMusicUrl: undefined };
  }

  return {
    ...docTyped,
    blocks,
    ...(theme ? { theme } : {}),
  };
}

export type PublishResult =
  | {
      ok: true;
      slug: string;
      vanityPath: string | null;
      url: string;
      expiresAt: Date | null;
      previousTier: PlanTier;
    }
  | { ok: false; status: number; error: string; reason?: string };

/**
 * Publish davetiyeyi: tier kurallarını uygular + DB yazar. Caller
 * authorization & payment doğrulamasını yapmış olmalı.
 *
 * `actorId` set edildiğinde EditEvent tablosuna `design.publish` kaydı
 * yazılır — design history'sinde "Yayınlandı (tier: pro, source: stripe)"
 * şeklinde görünür. `source` audit için: free → "publish-endpoint",
 * stripe webhook → "stripe-webhook", verify-session fallback → "stripe-verify".
 */
export async function publishDesign(args: {
  designId: string;
  tier: PlanTier;
  vanityPath?: string | null;
  actorId?: string;
  source?: "publish-endpoint" | "stripe-webhook" | "stripe-verify";
  stripeSessionId?: string;
  stripeTransactionId?: string;
}): Promise<PublishResult> {
  const {
    designId,
    tier,
    vanityPath,
    actorId,
    source,
    stripeSessionId,
    stripeTransactionId,
  } = args;
  // Existing design fetch + vanity conflict check paralel — vanityPath
  // verilmediyse conflict query atlanır. Single round-trip.
  const [existing, vanityConflict] = await Promise.all([
    prisma.invitationDesign.findUnique({
      where: { id: designId },
      select: { id: true, doc: true, userId: true },
    }),
    vanityPath
      ? prisma.invitationDesign.findFirst({
          where: { vanityPath, NOT: { id: designId } },
          select: { id: true },
        })
      : Promise.resolve(null),
  ]);
  if (!existing) {
    return { ok: false, status: 404, error: "Not found" };
  }
  const previousTier = tierOrFree(
    ((existing.doc as { meta?: { tier?: string } }).meta?.tier as
      | PlanTier
      | undefined) ?? null,
  );

  const limits = planLimitsFor(tier);
  const existingMeta =
    (existing.doc as { meta?: { tier?: string } }).meta ?? {};

  if (vanityPath && !limits.vanityPathEnabled) {
    return {
      ok: false,
      status: 402,
      error: "VanityPathLocked",
      reason: "Özel kısa link Klasik+ paketinde açılır.",
    };
  }
  if (vanityPath) {
    const check = validateVanityPath(vanityPath);
    if (!check.ok) {
      return { ok: false, status: 400, error: "Invalid vanity", reason: check.reason };
    }
    if (vanityConflict) {
      return { ok: false, status: 409, error: "Vanity taken" };
    }
  }

  const publishedDocRaw = applyTierToPublishedDoc(existing.doc as object, tier);
  const publishedDoc = {
    ...publishedDocRaw,
    meta: {
      ...existingMeta,
      ...(publishedDocRaw as { meta?: object }).meta,
      status: "published",
      updatedAt: new Date().toISOString(),
      tier,
    },
  };

  // doc.meta'ya da status="published" stamp et — editor topbar'daki
  // isPublished selector'ı (DesignerShell) buradan okuyor, GÜNCELLE
  // butonunu göstermek + "Yayında" badge için. Eskiden sadece
  // publishedDoc.meta.status set ediliyordu, doc tarafı "draft" kalıp
  // editor "henüz yayınlanmamış" sanıyordu.
  const docWithTier = {
    ...(existing.doc as object),
    meta: { ...existingMeta, tier, status: "published" },
  };

  const publishedAt = new Date();
  const expiresAt = computeExpiresAt(tier, publishedAt);

  let updated: {
    slug: string;
    vanityPath: string | null;
    publishedAt: Date | null;
    expiresAt: Date | null;
  };
  try {
    updated = await prisma.invitationDesign.update({
      where: { id: designId },
      data: {
        status: "published",
        publishedDoc,
        publishedAt,
        expiresAt,
        archivedAt: null,
        ...(vanityPath ? { vanityPath } : {}),
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
      const fallback = await prisma.invitationDesign.update({
        where: { id: designId },
        data: {
          status: "published",
          publishedDoc,
          publishedAt,
          ...(vanityPath ? { vanityPath } : {}),
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
    ? `/davetiyem/${updated.vanityPath}`
    : `/davetiyem/${updated.slug}`;

  // EditEvent log — design history'de görünsün. actorId varsa kaydet
  // (webhook'ta design owner'ı, endpoint'te session.user.id). Tier
  // değişti mi (upgrade) onu da payload'a koy.
  if (actorId) {
    try {
      await prisma.editEvent.create({
        data: {
          designId,
          actorId,
          op: previousTier !== tier ? "tier.upgrade" : "design.publish",
          payload: {
            tier,
            previousTier,
            source: source ?? "publish-endpoint",
            ...(stripeSessionId ? { stripeSessionId } : {}),
            ...(stripeTransactionId
              ? { stripeTransactionId }
              : {}),
          },
        },
      });
    } catch (err) {
      // Event log fail olursa publish'i kırma — best effort.
      console.warn("[publishDesign] editEvent log failed:", err);
    }
  }

  return {
    ok: true,
    slug: updated.slug,
    vanityPath: updated.vanityPath,
    url: shareUrl,
    expiresAt: updated.expiresAt,
    previousTier,
  };
}

export function tierRank(t: PlanTier): number {
  switch (tierOrFree(t)) {
    case "free":
      return 0;
    case "basic":
      return 1;
    case "pro":
      return 2;
    case "premium":
      return 3;
  }
}
