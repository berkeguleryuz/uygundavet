import type { StoryTimelineData } from "@davety/schema";
import type { BlockRegistryEntry } from "../types";
import { StoryTimelineView } from "./View";

export const storyTimelineRegistryEntry: BlockRegistryEntry<StoryTimelineData> = {
  type: "story_timeline",
  View: StoryTimelineView,
  defaultData: { items: [] },
  defaultStyle: { align: "center" },
  labelKey: "Blocks.hero.title",
};

export { StoryTimelineView };
