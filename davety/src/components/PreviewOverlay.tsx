"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { InvitationView, getCardShapeStyle, getBlockView } from "@davety/renderer";
import type { Block, HeroData, InvitationDoc } from "@davety/schema";
import { useEditorStore } from "@/src/store/editor-store";
import { useUIStore } from "@/src/store/ui-store";
import { WeddingEnvelope } from "@/src/components/envelopes/WeddingEnvelope";
import { resolveEnvelopeProps } from "@/src/components/envelopes/resolveEnvelope";
import { BoxRevealScene } from "@/app/components/box/BoxRevealScene";

type WrapperKind = "envelope" | "box" | "direct";

/**
 * Returns a neutral page background that contrasts the invitation's
 * own bg color so the card never blends into the surrounding page.
 * Light invitation themes get a darker stone tone; dark invitations
 * get a lighter slate tone — both are roughly 50% off the invitation
 * bg's perceived luminance.
 */
function tintedBackground(bg: string): string {
  const hex = bg.replace("#", "");
  const r = parseInt(hex.slice(0, 2) || "f5", 16);
  const g = parseInt(hex.slice(2, 4) || "f6", 16);
  const b = parseInt(hex.slice(4, 6) || "f3", 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  // For light invitations → wash with darker warm gray; for dark
  // invitations → wash with lighter cool gray. The 50/50 blend keeps
  // the page feeling related to the design without matching it.
  return luminance > 0.5
    ? "#d8d4cc" // muted warm stone — sits behind cream/light cards
    : "#3a3a40"; // muted cool slate — sits behind dark cards
}

const HeroViewComponent = getBlockView("hero") as React.ComponentType<{
  block: Block<HeroData>;
  theme: InvitationDoc["theme"];
  editable?: boolean;
}>;

export function PreviewOverlay() {
  const previewMode = useUIStore((s) => s.previewMode);
  const togglePreview = useUIStore((s) => s.togglePreview);
  const doc = useEditorStore((s) => s.doc);

  const [wrapper, setWrapper] = useState<WrapperKind>("envelope");
  const [revealed, setRevealed] = useState(false);

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
              onClick={() => {
                togglePreview();
                setRevealed(false);
              }}
              className="flex items-center gap-1.5 text-sm hover:text-foreground cursor-pointer"
            >
              <ArrowLeft className="size-4" /> Düzenlemeye Dön
            </button>

            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Sarmal:
              </span>
              <div className="flex items-center rounded-full border border-border overflow-hidden text-xs">
                <WrapperBtn
                  active={wrapper === "envelope"}
                  onClick={() => {
                    setWrapper("envelope");
                    setRevealed(false);
                  }}
                  label="Zarf"
                />
                <WrapperBtn
                  active={wrapper === "box"}
                  onClick={() => {
                    setWrapper("box");
                    setRevealed(false);
                  }}
                  label="Kutu"
                />
                <WrapperBtn
                  active={wrapper === "direct"}
                  onClick={() => {
                    setWrapper("direct");
                    setRevealed(true);
                  }}
                  label="Doğrudan"
                />
              </div>
            </div>

            <div className="text-xs font-chakra uppercase tracking-[0.2em] text-muted-foreground">
              Önizleme
            </div>
          </div>

          {/* Body — page background is intentionally NOT doc.theme.bgColor.
              We tint a darker neutral on top of the invitation bg so the
              card silhouette is always clearly separated from the page,
              never blended in (e.g., a cream invitation no longer
              disappears against a cream page). */}
          <div
            className="px-4 py-8 min-h-[calc(100dvh-3.25rem)]"
            style={{ background: tintedBackground(doc.theme.bgColor) }}
          >
            {wrapper === "direct" ? (
              <DirectInvite doc={doc} />
            ) : revealed ? (
              <DirectInvite doc={doc} />
            ) : wrapper === "envelope" ? (
              <EnvelopeWrapper doc={doc} onReveal={() => setRevealed(true)} />
            ) : (
              <BoxWrapper doc={doc} onReveal={() => setRevealed(true)} />
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function WrapperBtn({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 cursor-pointer transition-colors ${
        active
          ? "bg-foreground text-background"
          : "bg-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

function DirectInvite({ doc }: { doc: InvitationDoc }) {
  return (
    <div className="max-w-md mx-auto">
      <div
        className="shadow-xl overflow-hidden border border-border rounded-xl"
        style={{
          background: doc.theme.bgColor,
          color: doc.theme.accentColor,
          ...getCardShapeStyle(doc),
        }}
      >
        <InvitationView doc={doc} />
      </div>
    </div>
  );
}

function EnvelopeWrapper({
  doc,
  onReveal,
}: {
  doc: InvitationDoc;
  onReveal: () => void;
}) {
  const hero = doc.blocks.find((b) => b.type === "hero") as
    | Block<HeroData>
    | undefined;

  const resolved = resolveEnvelopeProps(doc.theme.envelope);

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <WeddingEnvelope
        guestName="Misafir"
        envelopeWidth={360}
        cardWidth={340}
        cardHeight={640}
        layout="replace"
        {...resolved}
        cardRender={({ width, height }) =>
          hero ? (
            <div
              className="relative overflow-hidden rounded-md shadow-xl"
              style={{
                width,
                height,
                background: doc.theme.bgColor,
                color: doc.theme.accentColor,
                ...getCardShapeStyle(doc),
              }}
            >
              <HeroViewComponent block={hero} theme={doc.theme} editable={false} />
            </div>
          ) : null
        }
      />
      <button
        onClick={onReveal}
        className="text-[11px] uppercase tracking-[0.25em] rounded-full border border-foreground/20 px-5 py-2 bg-white/70 backdrop-blur hover:bg-white cursor-pointer"
        style={{ fontFamily: "Space Grotesk, sans-serif" }}
      >
        Tüm Davetiyeyi Gör
      </button>
    </div>
  );
}

function BoxWrapper({
  doc,
  onReveal,
}: {
  doc: InvitationDoc;
  onReveal: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full max-w-2xl">
        <BoxRevealScene invitation={doc} />
      </div>
      <button
        onClick={onReveal}
        className="text-[11px] uppercase tracking-[0.25em] rounded-full border border-foreground/20 px-5 py-2 bg-white/70 backdrop-blur hover:bg-white cursor-pointer"
        style={{ fontFamily: "Space Grotesk, sans-serif" }}
      >
        Davetiyenin Tamamına Geç
      </button>
    </div>
  );
}
