import type { DecorationData } from "@davety/schema";
import type { BlockRegistryEntry } from "../types";
import { DecorationView } from "./View";

export const decorationRegistryEntry: BlockRegistryEntry<DecorationData> = {
  type: "decoration",
  View: DecorationView,
  defaultData: {
    iconKey: "heart",
    sizePx: 64,
    align: "center",
  },
  defaultStyle: { align: "center" },
  labelKey: "Blocks.decoration.title",
};

export { DecorationView };
