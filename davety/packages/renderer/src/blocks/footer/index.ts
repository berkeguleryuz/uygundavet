import type { FooterData } from "@davety/schema";
import type { BlockRegistryEntry } from "../types";
import { FooterView } from "./View";

export const footerRegistryEntry: BlockRegistryEntry<FooterData> = {
  type: "footer",
  View: FooterView,
  defaultData: { text: "davety ile oluşturuldu" },
  defaultStyle: { align: "center" },
  labelKey: "Blocks.hero.title",
};

export { FooterView };
