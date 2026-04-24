import type { FamiliesData } from "@davety/schema";
import type { BlockRegistryEntry } from "../types";
import { FamiliesView } from "./View";

export const familiesRegistryEntry: BlockRegistryEntry<FamiliesData> = {
  type: "families",
  View: FamiliesView,
  defaultData: {
    bride: { title: "Gelinin Ailesi", members: [] },
    groom: { title: "Damadın Ailesi", members: [] },
  },
  defaultStyle: { align: "center" },
  labelKey: "Blocks.families.title",
};

export { FamiliesView };
