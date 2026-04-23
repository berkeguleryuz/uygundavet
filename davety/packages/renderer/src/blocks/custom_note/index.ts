import type { CustomNoteData } from "@davety/schema";
import type { BlockRegistryEntry } from "../types";
import { CustomNoteView } from "./View";

export const customNoteRegistryEntry: BlockRegistryEntry<CustomNoteData> = {
  type: "custom_note",
  View: CustomNoteView,
  defaultData: {
    title: "Etkinlik Notu",
    body: "Bu alanda etkinlik ile ilgili ek bilgiler, özel istekler, kurallar vb. bilgiler yer alır.",
  },
  defaultStyle: { align: "center" },
  labelKey: "Blocks.hero.title",
};

export { CustomNoteView };
