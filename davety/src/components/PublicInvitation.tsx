"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { InvitationView, getCardShapeStyle } from "@davety/renderer";
import type { InvitationDoc } from "@davety/schema";
import { WeddingEnvelope } from "@/src/components/envelopes/WeddingEnvelope";
import { resolveEnvelopeProps } from "@/src/components/envelopes/resolveEnvelope";

interface Props {
  doc: InvitationDoc;
  slug: string;
  designId: string;
  isOwner: boolean;
  isDraft: boolean;
}

/** Pick a readable button palette against the page background — light
 *  pages get a dark glass button, dark pages get a light glass button.
 *  Threshold uses perceived luminance, not raw RGB average. */
function readableButtonStyle(pageBg: string): {
  border: string;
  bg: string;
  bgHover: string;
  text: string;
} {
  const hex = pageBg.replace("#", "");
  const r = parseInt(hex.slice(0, 2) || "25", 16);
  const g = parseInt(hex.slice(2, 4) || "22", 16);
  const b = parseInt(hex.slice(4, 6) || "24", 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  if (luminance > 0.5) {
    return {
      border: "rgba(0,0,0,0.25)",
      bg: "rgba(0,0,0,0.06)",
      bgHover: "rgba(0,0,0,0.12)",
      text: "#1a1a1a",
    };
  }
  return {
    border: "rgba(255,255,255,0.3)",
    bg: "rgba(255,255,255,0.1)",
    bgHover: "rgba(255,255,255,0.2)",
    text: "#ffffff",
  };
}

export function PublicInvitation({
  doc,
  slug,
  designId,
  isOwner,
  isDraft,
}: Props) {
  const resolvedEnvelope = resolveEnvelopeProps(doc.theme.envelope);
  const editBtn = readableButtonStyle(doc.theme.pageBgColor ?? "#252224");

  // Card slot starts at 640px (envelope's natural top-of-page geometry).
  // `cardExpandedHeight` is what WeddingEnvelope grows to the moment its
  // internal `dropping` state flips — same render, same CSS transition
  // tick as the envelope's translateY, so the two animations are
  // perfectly synced (no parent setTimeout race).
  const [cardExpandedHeight, setCardExpandedHeight] = useState(700);
  // Envelope/card start at viewport width (capped at 400px so the
  // designed mobile-portrait look is preserved on desktop). This way
  // the closed envelope fills mobile screens edge-to-edge without
  // leaving a side band, instead of staying pinned at a fixed 340/360.
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
    <main
      className="relative min-h-dvh flex flex-col items-center justify-start"
      style={{ background: doc.theme.pageBgColor ?? "#252224" }}
    >
      {/* Owner edit shortcut — top-right on desktop, bottom-of-page on
          mobile. Recipients (non-owners) never see this. */}
      {isOwner ? (
        <Link
          href={`/design/invitations/${designId}/editor`}
          className="hidden md:inline-flex absolute top-4 right-4 items-center text-xs uppercase tracking-[0.25em] rounded-full border px-5 py-2 backdrop-blur cursor-pointer transition-colors"
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            zIndex: 50,
            borderColor: editBtn.border,
            background: editBtn.bg,
            color: editBtn.text,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = editBtn.bgHover)
          }
          onMouseLeave={(e) => (e.currentTarget.style.background = editBtn.bg)}
        >
          Düzenle
        </Link>
      ) : null}

      {isDraft && isOwner ? (
        <div className="w-full max-w-2xl mb-6 rounded-lg border border-amber-400/60 bg-amber-50 text-amber-900 px-4 py-2 text-xs text-center">
          Bu davetiye henüz yayınlanmamış — önizleme modundasın. Sadece sen
          görebilirsin.{" "}
          <Link
            href={`/design/invitations/${designId}/save`}
            className="underline font-medium"
          >
            Yayınla
          </Link>
        </div>
      ) : null}

      <div className="flex flex-col items-center gap-6 w-full">
        <WeddingEnvelope
          guestName="Misafir"
          envelopeWidth={envelopeWidth}
          cardWidth={cardWidth}
          cardHeight={640}
          cardExpandedHeight={cardExpandedHeight}
          layout="replace"
          {...resolvedEnvelope}
          cardRender={({ width, height }) => (
            <FullInvitationCard
              doc={doc}
              slug={slug}
              width={width}
              height={height}
            />
          )}
        />
      </div>

      {isOwner ? (
        <Link
          href={`/design/invitations/${designId}/editor`}
          className="md:hidden mt-8 mb-6 text-xs uppercase tracking-[0.25em] rounded-full border px-5 py-2 backdrop-blur cursor-pointer transition-colors"
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            borderColor: editBtn.border,
            background: editBtn.bg,
            color: editBtn.text,
          }}
        >
          Düzenle
        </Link>
      ) : null}
    </main>
  );
}

/**
 * Card slot content: the FULL InvitationView (every block — hero,
 * countdown, families, program, venue, RSVP, …) wrapped in the
 * envelope's card frame. Width/height are fixed by the envelope's
 * card slot; the content scrolls inside so the recipient can read the
 * entire invitation without leaving the envelope frame.
 */
function FullInvitationCard({
  doc,
  slug,
  width,
  height,
}: {
  doc: InvitationDoc;
  slug: string;
  width: number;
  height: number;
}) {
  return (
    <div
      className="relative overflow-auto shadow-xl"
      style={{
        width,
        height,
        // Same trick as the envelope's card slot: a CSS min-height
        // ensures the rendered card actually grows with the viewport
        // when the JS-computed `height` (a pixel value captured at
        // mount) is shorter than the live viewport. Animated in
        // lockstep with `height` so the card grows smoothly during
        // the envelope drop instead of jumping.
        minHeight: "calc(100dvh - 48px)",
        background: doc.theme.bgColor,
        color: doc.theme.accentColor,
        transition:
          "height 1.4s cubic-bezier(0.55, 0, 0.2, 1), min-height 1.4s cubic-bezier(0.55, 0, 0.2, 1)",
        ...getCardShapeStyle(doc),
      }}
    >
      <InvitationView doc={doc} slug={slug} />
    </div>
  );
}
