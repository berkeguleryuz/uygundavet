"use client";

import { GaleriContent } from "@/app/components/dashboard/galeri-content";
import { FeatureLockedPage } from "@/app/components/dashboard/FeatureLockedPage";
import { useOrderStore } from "@/store/order-store";
import { canAccess } from "@/lib/package-gating";
import type { SelectedPackage } from "@/models/Order";

export default function GaleriPage() {
  const { order } = useOrderStore();
  const pkg = (order?.selectedPackage || "starter") as SelectedPackage;

  if (!canAccess("gallery", pkg)) {
    return <FeatureLockedPage />;
  }

  return <GaleriContent />;
}
