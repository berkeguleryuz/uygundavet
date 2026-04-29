import type { InvitationDoc, HeroData, Block } from "@davety/schema";
import type { CSSProperties } from "react";
import { getBlockView } from "./blocks";
import { FontBoot } from "./fonts/loader";
import { RendererProvider } from "./context";

/**
 * Maps the chosen `theme.cardShape` to the CSS that decorates the outer
 * card silhouette. Sides + bottom always stay flat; only the top varies.
 *
 *   - flat       → square corners (default, modern minimal)
 *   - arch       → soft rounded dome at the top
 *   - tall-arch  → deeper, narrower dome
 *   - rounded    → both top corners rounded with fixed radius
 *   - peaked     → triangular peak (gothic feel)
 *   - chevron    → inverse V notch in the top edge (banner)
 *   - tag        → top corners cut off (luggage-tag silhouette)
 *
 * For backward compatibility we still respect `hero.data.variant === "arch"`
 * when the doc has no explicit `theme.cardShape` set.
 */
export function getCardShapeStyle(doc: InvitationDoc): CSSProperties {
  const explicit = doc.theme.cardShape;
  // Once the user picks any shape (including "flat") in the editor, that
  // wins over the legacy hero.variant fallback. Otherwise selecting "Düz"
  // wouldn't visibly clear a previously-applied dome from a sample doc.
  if (explicit) return shapeCss(explicit);

  // Backward compat — old docs encoded shape inside hero.variant.
  const hero = doc.blocks.find((b) => b.type === "hero") as
    | Block<HeroData>
    | undefined;
  if (hero?.data.variant === "arch") return shapeCss("arch");

  return {};
}

/** Inner padding compensation for shapes that bite into the top edge.
 *  Without this the first block's text + toolbar end up under the clip
 *  cut and the last "+ Blok Ekle" slot inside an overflow-hidden card
 *  gets pushed past the bottom edge. */
export function getCardShapePadding(
  doc: InvitationDoc,
): { paddingTop?: string; paddingBottom?: string } {
  const shape = doc.theme.cardShape;
  switch (shape) {
    case "peaked":
      return { paddingTop: "44px", paddingBottom: "16px" };
    case "chevron":
      return { paddingTop: "36px", paddingBottom: "16px" };
    case "tag":
      return { paddingTop: "36px" };
    case "arch":
      return { paddingTop: "28px" };
    case "tall-arch":
      return { paddingTop: "56px" };
    default:
      return {};
  }
}

/** Per-shape CSS. Exported so the gallery preview component can pick
 *  the same silhouette without re-implementing the mapping. */
export function shapeCss(shape: NonNullable<InvitationDoc["theme"]["cardShape"]>): CSSProperties {
  switch (shape) {
    case "arch":
      return {
        borderTopLeftRadius: "50% 60px",
        borderTopRightRadius: "50% 60px",
      };
    case "tall-arch":
      return {
        borderTopLeftRadius: "50% 110px",
        borderTopRightRadius: "50% 110px",
      };
    case "rounded":
      return {
        borderTopLeftRadius: "44px",
        borderTopRightRadius: "44px",
      };
    case "peaked":
      // Triangular peak — depth scales with card height.
      return {
        clipPath: "polygon(0% 7%, 50% 0%, 100% 7%, 100% 100%, 0% 100%)",
      };
    case "chevron":
      // Inverse-V notch: top corners stay flush, dip in the middle.
      return {
        clipPath: "polygon(0% 0%, 50% 6%, 100% 0%, 100% 100%, 0% 100%)",
      };
    case "tag":
      // Luggage tag — top corners cut at 28px.
      return {
        clipPath:
          "polygon(28px 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 0 100%, 0 28px)",
      };
    case "flat":
    default:
      return {};
  }
}

export function isArchShape(doc: InvitationDoc): boolean {
  return doc.theme.cardShape === "arch" || doc.theme.cardShape === "tall-arch";
}

export interface InvitationViewProps {
  doc: InvitationDoc;
  /** When true each text slot becomes clickable via onFieldSelect. */
  editable?: boolean;
  onFieldSelect?: (blockId: string, fieldId: string) => void;
  className?: string;
  /** Absolute URL to the davety app (for memory/RSVP POST endpoints from consumer apps). */
  publicBase?: string;
  /** Public slug — required for memory/RSVP submit endpoints. */
  slug?: string;
}

export function InvitationView({
  doc,
  editable = false,
  onFieldSelect,
  className,
  publicBase,
  slug,
}: InvitationViewProps) {
  return (
    <RendererProvider value={{ publicBase, slug }}>
    <div
      className={`invitation-canvas overflow-hidden ${className ?? ""}`}
      style={{
        background: doc.theme.bgColor,
        color: doc.theme.accentColor,
        ...getCardShapeStyle(doc),
        ...getCardShapePadding(doc),
      }}
    >
      <FontBoot doc={doc} />

      {doc.blocks
        .filter((b) => b.visible || editable)
        .map((block) => {
          const View = getBlockView(block.type);
          return (
            <div
              key={block.id}
              data-block-id={block.id}
              data-block-type={block.type}
              style={{ opacity: block.visible ? 1 : 0.35 }}
            >
              <View
                block={block}
                theme={doc.theme}
                editable={editable}
                onFieldSelect={
                  onFieldSelect
                    ? (fieldId) => onFieldSelect(block.id, fieldId)
                    : undefined
                }
              />
            </div>
          );
        })}
    </div>
    </RendererProvider>
  );
}

export function renderInvitation(doc: InvitationDoc) {
  return <InvitationView doc={doc} />;
}
