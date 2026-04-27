"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { InvitationView, getCardShapeStyle } from "@davety/renderer";
import type { InvitationDoc } from "@davety/schema";
import { useEditorStore } from "@/src/store/editor-store";
import { useUIStore } from "@/src/store/ui-store";
import { WeddingEnvelope } from "@/src/components/envelopes/WeddingEnvelope";
import { resolveEnvelopeProps } from "@/src/components/envelopes/resolveEnvelope";

export function PreviewOverlay() {
  const previewMode = useUIStore((s) => s.previewMode);
  const togglePreview = useUIStore((s) => s.togglePreview);
  const doc = useEditorStore((s) => s.doc);

  return (
    <AnimatePresence>
      {previewMode && doc ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-background overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-4 py-3 bg-background/90 backdrop-blur border-b border-border">
            <button
              onClick={togglePreview}
              className="flex items-center gap-1.5 text-sm hover:text-foreground cursor-pointer"
            >
              <ArrowLeft className="size-4" /> Düzenlemeye Dön
            </button>

            <div className="text-xs font-chakra uppercase tracking-[0.2em] text-muted-foreground">
              Önizleme
            </div>
          </div>

          {/* Body — mirrors the public invitation page exactly (same
              pageBgColor, same envelope-drop flow, same card growth). */}
          <div
            className="min-h-[calc(100dvh-3.25rem)]"
            style={{ background: doc.theme.pageBgColor ?? "#252224" }}
          >
            <EnvelopeWrapper doc={doc} />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function EnvelopeWrapper({ doc }: { doc: InvitationDoc }) {
  const resolved = resolveEnvelopeProps(doc.theme.envelope);

  // Mirror the public invitation page exactly: viewport-responsive
  // envelope/card width, expanded card height after reveal, and the
  // full InvitationView inside the card slot.
  const [cardExpandedHeight, setCardExpandedHeight] = useState(700);
  const [envelopeWidth, setEnvelopeWidth] = useState(360);
  const [cardWidth, setCardWidth] = useState(340);

  useEffect(() => {
    function compute() {
      setCardExpandedHeight(Math.max(640, window.innerHeight - 48));
      const w = Math.min(400, window.innerWidth);
      setEnvelopeWidth(w);
      setCardWidth(w);
    }
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <WeddingEnvelope
        guestName="Misafir"
        envelopeWidth={envelopeWidth}
        cardWidth={cardWidth}
        cardHeight={640}
        cardExpandedHeight={cardExpandedHeight}
        layout="replace"
        {...resolved}
        cardRender={({ width, height }) => (
          <div
            className="relative overflow-auto shadow-xl"
            style={{
              width,
              height,
              minHeight: "calc(100dvh - 48px)",
              background: doc.theme.bgColor,
              color: doc.theme.accentColor,
              transition:
                "height 1.4s cubic-bezier(0.55, 0, 0.2, 1), min-height 1.4s cubic-bezier(0.55, 0, 0.2, 1)",
              ...getCardShapeStyle(doc),
            }}
          >
            <InvitationView doc={doc} />
          </div>
        )}
      />
    </div>
  );
}

