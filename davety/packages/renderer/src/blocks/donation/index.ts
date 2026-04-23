import type { DonationData } from "@davety/schema";
import type { BlockRegistryEntry } from "../types";
import { DonationView } from "./View";

export const donationRegistryEntry: BlockRegistryEntry<DonationData> = {
  type: "donation",
  View: DonationView,
  defaultData: {
    title: "Bizlere Destek Olun",
    description:
      "Bu özel günde bizimle olmak ve destek vermek isterseniz, bağış yapabilirsiniz.",
    iban: "",
  },
  defaultStyle: { align: "center" },
  labelKey: "Blocks.donation.title",
};

export { DonationView };
