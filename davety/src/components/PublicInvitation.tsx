"use client";

import { useState } from "react";
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
  const [revealed, setRevealed] = useState(false);

  const resolvedEnvelope = resolveEnvelopeProps(doc.theme.envelope);

  return (
    <main
      className="min-h-dvh flex flex-col items-center justify-start px-4 py-10"
      style={{ background: doc.theme.bgColor }}
    >
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

      {!revealed ? (
        <div className="flex flex-col items-center gap-6 py-6 w-full">
          <WeddingEnvelope
            guestName="Misafir"
            envelopeWidth={360}
            cardWidth={340}
            cardHeight={640}
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
          <button
            onClick={() => setRevealed(true)}
            className="mt-6 text-[11px] uppercase tracking-[0.25em] rounded-full border border-foreground/20 px-5 py-2 bg-white/70 backdrop-blur hover:bg-white cursor-pointer"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Tüm Davetiyeyi Gör
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md mx-auto rounded-xl overflow-hidden shadow-2xl animate-in fade-in duration-500">
          <InvitationView doc={doc} slug={slug} />
        </div>
      )}

      {isOwner && revealed ? (
        <Link
          href={`/design/invitations/${designId}/editor`}
          className="mt-8 text-xs uppercase tracking-[0.25em] rounded-full border border-foreground/20 px-5 py-2 bg-white/80 backdrop-blur hover:bg-white cursor-pointer"
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
      }}
    >
      <InvitationView doc={doc} slug={slug} />
    </div>
  );
}

