import type { ContactData } from "@davety/schema";
import type { BlockRegistryEntry } from "../types";
import { ContactView } from "./View";

export const contactRegistryEntry: BlockRegistryEntry<ContactData> = {
  type: "contact",
  View: ContactView,
  defaultData: {
    venueName: "İletişim",
    venueAddress: "Sorularınız için bize ulaşabilirsiniz.",
    phone: "+90 555 000 00 00",
  },
  defaultStyle: { align: "center" },
  labelKey: "Blocks.hero.title",
};

export { ContactView };
