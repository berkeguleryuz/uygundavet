import type { PlanTier } from "@davety/schema";

/**
 * Plan-based expiry policy. Free invitations live 30 days after publish,
 * paid tiers get longer windows. Returning null means "never expires".
 *
 * Used by:
 *   - publish route, sets `expiresAt` on first publish
 *   - archive cron, flips status to "archived" once expiresAt passes
 */
const EXPIRY_DAYS_BY_TIER: Record<PlanTier, number | null> = {
  free: 30,
  basic: 180,
  pro: 365,
  premium: null,
};

export function expiryDaysFor(tier: PlanTier | undefined | null): number | null {
  return EXPIRY_DAYS_BY_TIER[tier ?? "free"];
}

export function computeExpiresAt(
  tier: PlanTier | undefined | null,
  publishedAt: Date = new Date()
): Date | null {
  const days = expiryDaysFor(tier);
  if (days === null) return null;
  const out = new Date(publishedAt);
  out.setUTCDate(out.getUTCDate() + days);
  return out;
}
