import type { FamiliesData } from "@davety/schema";
import type { BlockRegistryEntry } from "../types";
import { FamiliesView } from "./View";

export const familiesRegistryEntry: BlockRegistryEntry<FamiliesData> = {
  type: "families",
  View: FamiliesView,
  defaultData: {
    bride: {
      title: "Gelinin Ailesi",
      members: ["Anne Adı Soyadı", "Baba Adı Soyadı"],
    },
    groom: {
      title: "Damadın Ailesi",
      members: ["Anne Adı Soyadı", "Baba Adı Soyadı"],
    },
  },
  defaultStyle: { align: "center" },
  labelKey: "Blocks.families.title",
};

export { FamiliesView };
