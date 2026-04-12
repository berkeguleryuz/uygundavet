"use client";

import { AniDefteriContent } from "@/app/components/dashboard/ani-defteri-content";
import { FeatureLockedPage } from "@/app/components/dashboard/FeatureLockedPage";
import { useOrderStore } from "@/store/order-store";
import { canAccess } from "@/lib/package-gating";
import type { SelectedPackage } from "@/models/Order";

export default function AniDefteriPage() {
  const { order } = useOrderStore();
  const pkg = (order?.selectedPackage || "starter") as SelectedPackage;

  if (!canAccess("memoryBook", pkg)) {
    return <FeatureLockedPage />;
  }

  return <AniDefteriContent />;
}
