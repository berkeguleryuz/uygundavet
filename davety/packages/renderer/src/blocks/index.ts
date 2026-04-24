import type { BlockType } from "@davety/schema";
import type { BlockRegistryEntry, BlockViewProps } from "./types";

import { heroRegistryEntry } from "./hero";
import { countdownRegistryEntry } from "./countdown";
import { familiesRegistryEntry } from "./families";
import { eventProgramRegistryEntry } from "./event_program";
import { venueRegistryEntry } from "./venue";
import { storyTimelineRegistryEntry } from "./story_timeline";
import { galleryRegistryEntry } from "./gallery";
import { memoryBookRegistryEntry } from "./memory_book";
import { rsvpFormRegistryEntry } from "./rsvp_form";
import { donationRegistryEntry } from "./donation";
import { ctaRegistryEntry } from "./cta";
import { customNoteRegistryEntry } from "./custom_note";
import { customSectionRegistryEntry } from "./custom_section";
import { contactRegistryEntry } from "./contact";
import { footerRegistryEntry } from "./footer";

import { FallbackView } from "./fallback/View";

const entries: BlockRegistryEntry[] = [
  heroRegistryEntry,
  countdownRegistryEntry,
  familiesRegistryEntry,
  eventProgramRegistryEntry,
  venueRegistryEntry,
  storyTimelineRegistryEntry,
  galleryRegistryEntry,
  memoryBookRegistryEntry,
  rsvpFormRegistryEntry,
  donationRegistryEntry,
  ctaRegistryEntry,
  customNoteRegistryEntry,
  customSectionRegistryEntry,
  contactRegistryEntry,
  footerRegistryEntry,
] as BlockRegistryEntry[];

export const registry = Object.fromEntries(
  entries.map((e) => [e.type, e])
) as Partial<Record<BlockType, BlockRegistryEntry>>;

export function getBlockView(type: BlockType) {
  return registry[type]?.View ?? FallbackView;
}

export function getBlockEntry(type: BlockType): BlockRegistryEntry | undefined {
  return registry[type];
}

export function listBlockEntries(): BlockRegistryEntry[] {
  return entries;
}

export type { BlockRegistryEntry, BlockViewProps };
