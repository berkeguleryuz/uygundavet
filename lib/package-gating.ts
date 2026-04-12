import type { SelectedPackage } from "@/models/Order";

const FEATURE_ACCESS: Record<string, SelectedPackage[]> = {
  gallery: ["pro", "business"],
  memoryBook: ["pro", "business"],
  guests: ["starter", "pro", "business"],
  lcv: ["starter", "pro", "business"],
  settings: ["starter", "pro", "business"],
  invitation: ["starter", "pro", "business"],
};

export const PACKAGE_DISPLAY_NAMES: Record<SelectedPackage, string> = {
  starter: "Başlangıç",
  pro: "Pro",
  business: "Elit",
};

export function canAccess(
  feature: string,
  userPackage: SelectedPackage
): boolean {
  const allowed = FEATURE_ACCESS[feature];
  if (!allowed) return false;
  return allowed.includes(userPackage);
}
