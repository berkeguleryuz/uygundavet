import type { MemoryBookData } from "@davety/schema";
import type { BlockRegistryEntry } from "../types";
import { MemoryBookView } from "./View";

export const memoryBookRegistryEntry: BlockRegistryEntry<MemoryBookData> = {
  type: "memory_book",
  View: MemoryBookView,
  defaultData: {
    prompt:
      "Bizimle ilgili anılarınızı, dileklerinizi ve mesajlarınızı bu alanda paylaşabilirsiniz.",
    enabled: true,
  },
  defaultStyle: { align: "center" },
  labelKey: "Blocks.memoryBook.title",
};

export { MemoryBookView };
