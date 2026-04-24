import type { EventProgramData } from "@davety/schema";
import type { BlockRegistryEntry } from "../types";
import { EventProgramView } from "./View";

export const eventProgramRegistryEntry: BlockRegistryEntry<EventProgramData> = {
  type: "event_program",
  View: EventProgramView,
  defaultData: {
    items: [
      { time: "18:00", label: "Karşılama" },
      { time: "19:00", label: "Nikah" },
      { time: "20:00", label: "Yemek" },
      { time: "22:00", label: "Dans" },
    ],
  },
  defaultStyle: { align: "center" },
  labelKey: "Blocks.eventProgram.title",
};

export { EventProgramView };
