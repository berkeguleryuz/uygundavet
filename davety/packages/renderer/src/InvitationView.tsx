import type { InvitationDoc, HeroData, Block } from "@davety/schema";
import type { CSSProperties } from "react";
import { getBlockView } from "./blocks";
import { FontBoot } from "./fonts/loader";
import { RendererProvider } from "./context";

/**
 * Returns the outer-card silhouette implied by the doc.
 * If the first hero block uses the "arch" variant, the entire
 * invitation container takes an arch silhouette — straight bottom and
 * sides, rounded dome at the top — so the chosen shape applies to the
 * full document, not just the hero block.
 */
export function getCardShapeStyle(doc: InvitationDoc): CSSProperties {
  const hero = doc.blocks.find((b) => b.type === "hero") as
    | Block<HeroData>
    | undefined;
  if (hero?.data.variant === "arch") {
    // Subtle dome on top — fixed 60px vertical radius regardless of card
    // height so a tall invitation doesn't turn into a teardrop. Sides and
    // bottom stay straight.
    return {
      borderTopLeftRadius: "50% 60px",
      borderTopRightRadius: "50% 60px",
    };
  }
  return {};
}

export function isArchShape(doc: InvitationDoc): boolean {
  const hero = doc.blocks.find((b) => b.type === "hero") as
    | Block<HeroData>
    | undefined;
  return hero?.data.variant === "arch";
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
