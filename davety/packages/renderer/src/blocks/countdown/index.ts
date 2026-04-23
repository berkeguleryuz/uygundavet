import type { CountdownData } from "@davety/schema";
import type { BlockRegistryEntry } from "../types";
import { CountdownView } from "./View";

export const countdownRegistryEntry: BlockRegistryEntry<CountdownData> = {
  type: "countdown",
  View: CountdownView,
  defaultData: {
    targetIso: new Date(Date.now() + 90 * 86_400_000).toISOString(),
    labels: { days: "Gün", hours: "Saat", minutes: "Dakika", seconds: "Saniye" },
  },
  defaultStyle: { align: "center" },
  labelKey: "Blocks.countdown.title",
};

export { CountdownView };
