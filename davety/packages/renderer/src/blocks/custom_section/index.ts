import type { CustomSectionData } from "@davety/schema";
import type { BlockRegistryEntry } from "../types";
import { CustomSectionView } from "./View";

export const customSectionRegistryEntry: BlockRegistryEntry<CustomSectionData> = {
  type: "custom_section",
  View: CustomSectionView,
  defaultData: { title: "Özel Bölüm", body: "", items: [] },
  defaultStyle: { align: "center" },
  labelKey: "Blocks.hero.title",
};

export { CustomSectionView };
