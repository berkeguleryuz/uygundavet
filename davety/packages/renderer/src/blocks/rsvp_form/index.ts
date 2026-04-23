import type { RsvpFormData } from "@davety/schema";
import type { BlockRegistryEntry } from "../types";
import { RsvpFormView } from "./View";

export const rsvpFormRegistryEntry: BlockRegistryEntry<RsvpFormData> = {
  type: "rsvp_form",
  View: RsvpFormView,
  defaultData: {
    enabled: true,
    note: "Lütfen katılım durumunu bildir. Seni bekliyoruz.",
  },
  defaultStyle: { align: "center" },
  labelKey: "Blocks.hero.title",
};

export { RsvpFormView };
