import type { GalleryData } from "@davety/schema";
import type { BlockRegistryEntry } from "../types";
import { GalleryView } from "./View";

export const galleryRegistryEntry: BlockRegistryEntry<GalleryData> = {
  type: "gallery",
  View: GalleryView,
  defaultData: { items: [] },
  defaultStyle: { align: "center" },
  labelKey: "Blocks.hero.title",
};

export { GalleryView };
