import type { VenueData } from "@davety/schema";
import type { BlockRegistryEntry } from "../types";
import { VenueView } from "./View";

export const venueRegistryEntry: BlockRegistryEntry<VenueData> = {
  type: "venue",
  View: VenueView,
  defaultData: {
    venueName: "",
    venueAddress: "",
    reminderEnabled: true,
  },
  defaultStyle: { align: "center" },
  labelKey: "Blocks.eventProgram.title",
};

export { VenueView };
