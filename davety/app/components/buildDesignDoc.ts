import { readFileSync } from "node:fs";
import { join } from "node:path";
import { nanoid } from "nanoid";
import type {
  Block,
  DecorationData,
  EventCategory,
  FamiliesData,
  HeroData,
  InvitationDoc,
  Locale,
} from "@davety/schema";
import { buildDefaultDoc } from "@davety/schema";
import type { DesignSample } from "./designSamples";
import { shapeFor } from "./designSamples";

/** Strip every `<text>...</text>` and `<tspan>...</tspan>` element from
 *  an SVG markup blob. Bazı asset dosyaları (özellikle monogram, badge,
 *  save-the-date) sabit harfler ("S · E", "EST. 2026") ya da etiketler
 *  taşıyor; bunları süsleme bloğu olarak gömerken metin kullanıcının
 *  gerçek isimleriyle alakasız kalıyor. Süsler tamamen dekoratif olsun
 *  diye text node'ları çıkarıyoruz. */
export function stripSvgText(raw: string): string {
  return raw
    .replace(/<text[\s\S]*?<\/text>/gi, "")
    .replace(/<tspan[\s\S]*?<\/tspan>/gi, "");
}

/** Read a `/public/assets/templates/<key>.svg` file synchronously and
 *  return its raw markup (or `undefined` if the file is missing or we're
 *  in a context that can't reach the filesystem). Used to inline the
 *  sample's chosen decoration template as a real `decoration` block in
 *  the seeded doc so editor + galeri görünümü aynı süsü taşır. Metin
 *  içeren dosyalarda harfler temizlenir — süslemeler kullanıcının
 *  isimleriyle alakasız harfler taşımasın. */
function loadTemplateSvg(assetKey: string): string | undefined {
  try {
    const path = join(
      process.cwd(),
      "public",
      "assets",
      "templates",
      `${assetKey}.svg`,
    );
    return stripSvgText(readFileSync(path, "utf8"));
  } catch {
    return undefined;
  }
}

/** Category → which side's family-block title to use. The seed doc
 *  creates a Families block with "Gelinin Ailesi" / "Damadın Ailesi"
 *  hard-coded; for non-wedding events we rewrite those titles so the
 *  editor doesn't ship a birthday invitation with bride/groom labels. */
function familyTitlesFor(category: EventCategory): {
  bride: string;
  groom: string;
} {
  switch (category) {
    case "circumcision":
      return { bride: "Çocuğun Ailesi", groom: "Akrabalar" };
    case "birthday":
      return { bride: "Aile", groom: "Yakınlar" };
    case "business":
      return { bride: "Ev Sahibi", groom: "Sponsorlar" };
    case "engagement":
    case "wedding":
    default:
      return { bride: "Gelinin Ailesi", groom: "Damadın Ailesi" };
  }
}

/** Maps the gallery card's `decorative` flavour onto a real icon id from
 *  the renderer's decoration catalog. The gallery preview draws a
 *  daisy-arc / rose-vine / gold-divider above the names — and once the
 *  user opens the invitation we want the same flavour to be present
 *  (inline in the subtitle + as a standalone decoration block) so the
 *  preview's promise is kept. */
function decorativeIconKey(
  d: DesignSample["decorative"],
): string | undefined {
  switch (d) {
    case "daisy":
      return "daisy";
    case "rose":
      return "rose";
    case "gold":
      return "ornate-divider";
    case "none":
    default:
      return undefined;
  }
}

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
    groomName:
      design.category === "birthday" || design.category === "business"
        ? ""
        : design.sampleGroom,
  });

  const iconKey = decorativeIconKey(design.decorative);
  const familyTitles = familyTitlesFor(design.category);
  // Birthday and business launches only have one celebrant — the gallery
  // sample uses the second slot for descriptive text ("3 Yaş", "Doğum
  // Günü") which then becomes a non-deletable second name in the
  // editor. Strip it on doc-build so the hero collapses to a single name
  // and the side panel's hidden "second name" input stays empty.
  const effectiveGroomName =
    design.category === "birthday" || design.category === "business"
      ? ""
      : design.sampleGroom;

  // Hero — swap in the design's layout variant, subtitle, photo, flourish.
  // When the design carries a decorative flavour, we wrap the subtitle
  // with the matching {{iconKey}} markers so the renderer's inline
  // decoration parser draws the actual icon flanking the subtitle —
  // mirroring the dotted/floral arc the homepage card shows.
  const blocks: Block[] = base.blocks.map((b) => {
    if (b.type === "hero") {
      const wrappedSubtitle = iconKey
        ? `{{${iconKey}}} ${design.subtitle} {{${iconKey}}}`
        : design.subtitle;
      const hero: HeroData = {
        brideName: design.sampleBride,
        groomName: effectiveGroomName,
        subtitle: wrappedSubtitle,
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
    if (b.type === "families") {
      // Rewrite "Gelinin Ailesi" / "Damadın Ailesi" to match the event
      // category — keeps members[] but swaps the section titles so a
      // birthday/business invite doesn't ship with bride/groom labels.
      const fam = b.data as FamiliesData;
      return {
        ...b,
        data: {
          ...fam,
          bride: { ...fam.bride, title: familyTitles.bride },
          groom: { ...fam.groom, title: familyTitles.groom },
        } as unknown as Record<string, unknown>,
      };
    }
    return b;
  });

  // Standalone decoration block right after the hero. Eğer örnekte
  // `decorationTemplate` tanımlıysa o SVG'yi disk'ten alıp `svgRaw` ile
  // gömüyoruz (galerideki maskelenmiş süsün birebir aynısı, accent
  // rengiyle boyanmış); yoksa eski `iconKey` (daisy/rose/ornate-divider)
  // davranışına düşüyoruz. Böylece galeri ile editör hep aynı süsü
  // gösterir ve hiçbir tasarım çıplak gelmez.
  const templateSvg = design.decorationTemplate
    ? loadTemplateSvg(design.decorationTemplate)
    : undefined;
  const heroIdx = blocks.findIndex((b) => b.type === "hero");
  if (heroIdx >= 0) {
    let decorationData: DecorationData | null = null;
    if (templateSvg) {
      decorationData = {
        svgRaw: templateSvg,
        sizePx: 180,
        color: design.accent,
        align: "center",
      };
    } else if (iconKey) {
      decorationData = {
        iconKey,
        sizePx: 40,
        color: design.accent,
        align: "center",
      };
    }
    if (decorationData) {
      const decoration: Block<DecorationData> = {
        id: nanoid(8),
        type: "decoration",
        visible: true,
        style: { align: "center" },
        data: decorationData,
      };
      blocks.splice(heroIdx + 1, 0, decoration as unknown as Block);
    }
  }

  // Theme — apply sample's palette + envelope settings + card shape.
  return {
    ...base,
    meta: {
      ...base.meta,
      // Drives terminology in the editor side panel (Gelin/Damat vs.
      // Çocuk vs. Doğum Günü Sahibi vs. Şirket).
      eventCategory: design.category,
    },
    theme: {
      ...base.theme,
      bgColor: design.bg,
      accentColor: design.accent,
      cardShape: shapeFor(design),
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
