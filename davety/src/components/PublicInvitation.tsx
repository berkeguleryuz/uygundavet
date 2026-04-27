"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { InvitationView } from "@davety/renderer";
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

export function PublicInvitation({
  doc,
  slug,
  designId,
  isOwner,
  isDraft,
}: Props) {
  const resolvedEnvelope = resolveEnvelopeProps(doc.theme.envelope);

  // Card slot starts at 640px (envelope's natural top-of-page geometry).
  // `cardExpandedHeight` is what WeddingEnvelope grows to the moment its
  // internal `dropping` state flips — same render, same CSS transition
  // tick as the envelope's translateY, so the two animations are
  // perfectly synced (no parent setTimeout race).
  const [cardExpandedHeight, setCardExpandedHeight] = useState(700);

  useEffect(() => {
    function compute() {
      setCardExpandedHeight(Math.max(640, window.innerHeight - 120));
    }
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  return (
    <main
      className="relative min-h-dvh flex flex-col items-center justify-start"
      style={{ background: "#252224" }}
    >
      {/* Owner edit shortcut — top-right on desktop, bottom-of-page on
          mobile. Recipients (non-owners) never see this. */}
      {isOwner ? (
        <Link
          href={`/design/invitations/${designId}/editor`}
          className="hidden md:inline-flex absolute top-4 right-4 items-center text-xs uppercase tracking-[0.25em] rounded-full border border-white/30 px-5 py-2 bg-white/10 text-white backdrop-blur hover:bg-white/20 cursor-pointer"
          style={{ fontFamily: "Space Grotesk, sans-serif", zIndex: 50 }}
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
          envelopeWidth={360}
          cardWidth={340}
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
          className="md:hidden mt-8 mb-6 text-xs uppercase tracking-[0.25em] rounded-full border border-white/30 px-5 py-2 bg-white/10 text-white backdrop-blur hover:bg-white/20 cursor-pointer"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
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
      className="relative overflow-auto rounded-md shadow-xl"
      style={{
        width,
        height,
        background: doc.theme.bgColor,
        color: doc.theme.accentColor,
        transition: "height 1.4s cubic-bezier(0.55, 0, 0.2, 1)",
      }}
    >
      <InvitationView doc={doc} slug={slug} />
    </div>
  );
}
