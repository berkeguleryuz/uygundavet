import type { CtaData } from "@davety/schema";
import type { BlockRegistryEntry } from "../types";
import { CtaView } from "./View";

export const ctaRegistryEntry: BlockRegistryEntry<CtaData> = {
  type: "cta",
  View: CtaView,
  defaultData: { label: "Davete Katıl" },
  defaultStyle: { align: "center" },
  labelKey: "Blocks.hero.title",
};

export { CtaView };
