"use client";

import { useState } from "react";
import Link from "next/link";
import { InvitationView, getBlockView } from "@davety/renderer";
import type { InvitationDoc, Block, HeroData } from "@davety/schema";
import { WeddingEnvelope } from "@/src/components/envelopes/WeddingEnvelope";
import { resolveEnvelopeProps } from "@/src/components/envelopes/resolveEnvelope";

interface Props {
  doc: InvitationDoc;
  slug: string;
  designId: string;
  isOwner: boolean;
  isDraft: boolean;
}

function findHero(doc: InvitationDoc): Block<HeroData> | null {
  const hero = doc.blocks.find((b) => b.type === "hero");
  return (hero as Block<HeroData>) ?? null;
}

export function PublicInvitation({
  doc,
  slug,
  designId,
  isOwner,
  isDraft,
}: Props) {
  const [revealed, setRevealed] = useState(false);

  const hero = findHero(doc);

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
            cardRender={({ width, height }) =>
              hero ? (
                <RealHeroCard
                  doc={doc}
                  hero={hero}
                  width={width}
                  height={height}
                />
              ) : null
            }
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
 * What actually slides out of the envelope — the user's real hero block
 * rendered with their chosen variant (arch / photo / floral-crown / …)
 * plus the date row, wrapped in a card-sized frame so it looks like a
 * printable invitation, not a generic placeholder.
 */
// Resolve the hero block view once at module scope so React treats it as a
// stable component (calling getBlockView inside render triggers the
// "Cannot create components during render" rule).
const HeroViewComponent = getBlockView("hero") as React.ComponentType<{
  block: Block<HeroData>;
  theme: InvitationDoc["theme"];
  editable?: boolean;
}>;

function RealHeroCard({
  doc,
  hero,
  width,
  height,
}: {
  doc: InvitationDoc;
  hero: Block<HeroData>;
  width: number;
  height: number;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-md shadow-xl"
      style={{
        width,
        height,
        background: doc.theme.bgColor,
        color: doc.theme.accentColor,
      }}
    >
      <HeroViewComponent block={hero} theme={doc.theme} editable={false} />
      <div
        className="absolute inset-x-0 bottom-0 px-6 py-4 text-center text-[11px] uppercase tracking-[0.25em] border-t"
        style={{
          fontFamily: "Space Grotesk, sans-serif",
          borderColor: `${doc.theme.accentColor}22`,
          color: `${doc.theme.accentColor}cc`,
        }}
      >
        <FormattedDate iso={doc.meta.weddingDate} time={doc.meta.weddingTime} />
      </div>
    </div>
  );
}

function FormattedDate({ iso, time }: { iso?: string; time?: string }) {
  if (!iso) return null;
  const d = new Date(`${iso}T${time ?? "00:00"}:00`);
  if (isNaN(d.getTime())) return null;
  const months = [
    "OCAK",
    "ŞUBAT",
    "MART",
    "NİSAN",
    "MAYIS",
    "HAZİRAN",
    "TEMMUZ",
    "AĞUSTOS",
    "EYLÜL",
    "EKİM",
    "KASIM",
    "ARALIK",
  ];
  return (
    <span>
      {d.getDate()} · {months[d.getMonth()]} · {d.getFullYear()}
      {time ? ` · ${time}` : ""}
    </span>
  );
}
