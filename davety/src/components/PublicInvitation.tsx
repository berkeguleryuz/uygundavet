"use client";

import { useState } from "react";
import Link from "next/link";
import { InvitationView } from "@davety/renderer";
import type { InvitationDoc, Block } from "@davety/schema";
import { WeddingEnvelope } from "@/src/components/envelopes/WeddingEnvelope";
import { ENVELOPE_PRESETS } from "@/src/components/envelopes/envelopePresets";

interface Props {
  doc: InvitationDoc;
  slug: string;
  designId: string;
  isOwner: boolean;
  isDraft: boolean;
}

function extractHero(doc: InvitationDoc): {
  brideName?: string;
  groomName?: string;
  subtitle?: string;
  description?: string;
} {
  const hero = doc.blocks.find((b: Block) => b.type === "hero");
  return (hero?.data ?? {}) as {
    brideName?: string;
    groomName?: string;
    subtitle?: string;
    description?: string;
  };
}

export function PublicInvitation({
  doc,
  slug,
  designId,
  isOwner,
  isDraft,
}: Props) {
  const [revealed, setRevealed] = useState(false);

  const hero = extractHero(doc);

  // Default envelope preset — eventually stored on the design doc so user can pick.
  const preset = ENVELOPE_PRESETS[0];

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
            cardProps={{
              brideName: hero.brideName,
              groomName: hero.groomName,
              subtitle: hero.subtitle,
              description: hero.description,
              weddingDate: doc.meta.weddingDate,
              weddingTime: doc.meta.weddingTime,
              locale: doc.meta.locale,
              accent: doc.theme.accentColor,
              bg: doc.theme.bgColor,
            }}
            {...preset.props}
          />
          <button
            onClick={() => setRevealed(true)}
            className="mt-6 text-[11px] uppercase tracking-[0.25em] rounded-full border border-foreground/20 px-5 py-2 bg-white/70 backdrop-blur hover:bg-white cursor-pointer"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Tüm Bloklari Gör
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
