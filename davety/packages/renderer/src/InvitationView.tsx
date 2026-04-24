import type { InvitationDoc } from "@davety/schema";
import { getBlockView } from "./blocks";
import { FontBoot } from "./fonts/loader";
import { RendererProvider } from "./context";

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
      className={`invitation-canvas ${className ?? ""}`}
      style={{
        background: doc.theme.bgColor,
        color: doc.theme.accentColor,
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
