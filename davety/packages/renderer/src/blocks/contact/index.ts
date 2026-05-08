import type { ContactData } from "@davety/schema";
import type { BlockRegistryEntry } from "../types";
import { ContactView } from "./View";

export const contactRegistryEntry: BlockRegistryEntry<ContactData> = {
  type: "contact",
  View: ContactView,
  defaultData: {
    venueName: "İletişim",
    venueAddress: "Sorularınız için bize ulaşabilirsiniz.",
    phone: "+90 554 678 97 80",
    email: "davet@davetyolla.com",
  },
  defaultStyle: { align: "center" },
  labelKey: "Blocks.hero.title",
};

export { ContactView };
