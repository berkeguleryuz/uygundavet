import type { ContactData } from "@davety/schema";
import type { BlockRegistryEntry } from "../types";
import { ContactView } from "./View";

export const contactRegistryEntry: BlockRegistryEntry<ContactData> = {
  type: "contact",
  View: ContactView,
  defaultData: { venueName: "", venueAddress: "", phone: "" },
  defaultStyle: { align: "center" },
  labelKey: "Blocks.hero.title",
};

export { ContactView };
