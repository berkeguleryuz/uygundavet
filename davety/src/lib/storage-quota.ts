/**
 * Per-user storage quota enforcement.
 *
 * Aggregates `Asset.sizeBytes WHERE userId = X` and compares against
 * the user's plan limit. Called from the upload route before any R2
 * writes happen so we never store bytes we will then have to bill or
 * delete.
 *
 * Plan limits are derived from the user's most recently created
 * design's `doc.meta.tier`. When a user has no design yet we treat
 * them as "free", which is the safer default.
 */
import { prisma } from "./prisma";
import type { PlanTier } from "@davety/schema";

const QUOTA_BYTES_BY_TIER: Record<PlanTier, number> = {
  free: 50 * 1024 * 1024,
  basic: 500 * 1024 * 1024,
  pro: 5 * 1024 * 1024 * 1024,
  premium: 25 * 1024 * 1024 * 1024,
};

export function quotaBytesFor(tier: PlanTier | undefined | null): number {
  return QUOTA_BYTES_BY_TIER[tier ?? "free"];
}

export async function userStorageUsed(userId: string): Promise<number> {
  const agg = await prisma.asset.aggregate({
    where: { userId },
    _sum: { sizeBytes: true },
  });
  return agg._sum.sizeBytes ?? 0;
}

export async function userTier(userId: string): Promise<PlanTier> {
  const recent = await prisma.invitationDesign.findFirst({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: { doc: true },
  });
  if (!recent) return "free";
  const doc = recent.doc as unknown as { meta?: { tier?: PlanTier } } | null;
  const tier = doc?.meta?.tier;
  if (tier === "free" || tier === "basic" || tier === "pro" || tier === "premium") {
    return tier;
  }
  return "free";
}

/**
 * Throws when the upload would push the user over their plan quota.
 * Caller maps the error to a 402 Payment Required response so the
 * client can prompt for an upgrade.
 */
export async function assertWithinStorageQuota(
  userId: string,
  incomingBytes: number
): Promise<void> {
  const [used, tier] = await Promise.all([
    userStorageUsed(userId),
    userTier(userId),
  ]);
  const limit = quotaBytesFor(tier);
  if (used + incomingBytes > limit) {
    const usedMb = (used / (1024 * 1024)).toFixed(1);
    const limitMb = (limit / (1024 * 1024)).toFixed(0);
    throw new Error(
      `Storage quota exceeded for plan "${tier}" (${usedMb} MB used, ${limitMb} MB limit). Upgrade your plan to upload more.`
    );
  }
}
