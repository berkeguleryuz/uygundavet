import { nanoid } from "nanoid";
import type {
  Block,
  HeroData,
  InvitationDoc,
  Locale,
} from "@davety/schema";
import { buildDefaultDoc } from "@davety/schema";
import type { DesignSample } from "./designSamples";

/**
 * Turn a DesignSample (visual template on the homepage grid) into a real
 * editable InvitationDoc that the editor can open. Anything the user will
 * see on the card — theme colours, hero variant, photo, decorative flourish —
 * is baked into the doc so editing actually shows their chosen design.
 *
 * The user still sees the full block suite (countdown, families, venue,
 * program, rsvp, memory, etc.) so it's a starting point, not a cage.
 */
export function buildDesignDoc(
  design: DesignSample,
  args: { weddingDate: string; weddingTime: string; locale?: Locale }
): InvitationDoc {
  const locale: Locale = args.locale ?? "tr";

  // Start from the rich default doc — keeps all the functional blocks
  // (venue, rsvp, gallery, memory_book, etc.) in their default state.
  const base = buildDefaultDoc({
    weddingDate: args.weddingDate,
    weddingTime: args.weddingTime,
    locale,
    brideName: design.sampleBride,
    groomName: design.sampleGroom,
  });

  // Hero — swap in the design's layout variant, subtitle, photo, flourish.
  const blocks: Block[] = base.blocks.map((b) => {
    if (b.type === "hero") {
      const hero: HeroData = {
        brideName: design.sampleBride,
        groomName: design.sampleGroom,
        subtitle: design.subtitle,
        description:
          (b.data as HeroData).description ??
          "Bu özel günde sizi aramızda görmekten mutluluk duyarız.",
        variant: design.layout,
        photoUrl: design.photoUrl,
        decorative: design.decorative,
        accent: design.accent,
      };
      return {
        ...b,
        id: b.id || nanoid(8),
        data: hero as unknown as Record<string, unknown>,
        style: {
          ...b.style,
          color: design.textColor,
          // Merienda for display names — matches the grid preview.
          fontFamily: b.style.fontFamily ?? "Merienda",
        },
      };
    }
    return b;
  });

  // Theme — apply sample's palette + envelope settings.
  return {
    ...base,
    theme: {
      ...base.theme,
      bgColor: design.bg,
      accentColor: design.accent,
      envelope: {
        ...base.theme.envelope,
        color: design.envelopeColor,
        liningPattern: design.liningPattern,
        flapColor: design.flapColor ?? design.envelopeColor,
      },
    },
    blocks,
  };
}
