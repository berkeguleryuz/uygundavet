/**
 * Per-tier limits for editor-time gating and publish-time decisions.
 *
 * The tier itself lives in `doc.meta.tier`. When the field is missing
 * (older invitations created before the field existed) we default to
 * "free", that's the safer fallback because it under-shows features
 * rather than letting paid features leak to free users.
 *
 * Treat this file as the single source of truth: editor UI, publish
 * trim logic, and watermark rendering all read from here so tier
 * decisions stay consistent across the codebase.
 */
import type { PlanTier } from "@davety/schema";

export interface PlanLimits {
  /** Max photos/videos in the gallery block. */
  galleryMaxItems: number;
  /** Whether memory_book block is allowed. */
  memoryBookEnabled: boolean;
  /** Whether the host can VIEW guest RSVP responses on the dashboard.
   *  Submitting RSVP from the public page is always allowed (so the host
   *  collects data even on free), this only gates the dashboard view. */
  rsvpReadEnabled: boolean;
  /** Whether the published invitation shows a davetyolla.com watermark
   *  / promo footer. Free tier shows the ad; paid tiers don't. */
  showsBranding: boolean;
}

const LIMITS: Record<PlanTier, PlanLimits> = {
  free: {
    galleryMaxItems: 1,
    memoryBookEnabled: false,
    rsvpReadEnabled: false,
    showsBranding: true,
  },
  basic: {
    galleryMaxItems: 20,
    memoryBookEnabled: true,
    rsvpReadEnabled: true,
    showsBranding: false,
  },
  pro: {
    galleryMaxItems: 100,
    memoryBookEnabled: true,
    rsvpReadEnabled: true,
    showsBranding: false,
  },
  premium: {
    galleryMaxItems: 500,
    memoryBookEnabled: true,
    rsvpReadEnabled: true,
    showsBranding: false,
  },
};

export function tierOrFree(tier: PlanTier | undefined | null): PlanTier {
  return tier ?? "free";
}

export function planLimitsFor(tier: PlanTier | undefined | null): PlanLimits {
  return LIMITS[tierOrFree(tier)];
}

/** Friendly label for upgrade prompts ("Klasik+", "Pro+"). */
export function nextTierLabel(tier: PlanTier | undefined | null): string {
  switch (tierOrFree(tier)) {
    case "free":
      return "Klasik+";
    case "basic":
      return "Pro+";
    case "pro":
      return "Premium";
    case "premium":
      return "Premium";
  }
}
