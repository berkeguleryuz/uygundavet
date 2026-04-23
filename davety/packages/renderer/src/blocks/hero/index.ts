import type { HeroData } from "@davety/schema";
import type { BlockRegistryEntry } from "../types";
import { HeroView } from "./View";

export const heroRegistryEntry: BlockRegistryEntry<HeroData> = {
  type: "hero",
  View: HeroView,
  defaultData: {
    brideName: "Gelin",
    groomName: "Damat",
    subtitle: "Birlikte Daha Güçlü",
    description:
      "Kalplerimizin sonsuza kadar bir olduğu bu özel günde, sevincimizi sizinle paylaşmak istiyoruz.",
  },
  defaultStyle: { fontFamily: "Merienda", align: "center" },
  labelKey: "Blocks.hero.title",
};

export { HeroView };
