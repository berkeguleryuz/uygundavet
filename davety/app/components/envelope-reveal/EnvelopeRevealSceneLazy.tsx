"use client";

import dynamic from "next/dynamic";
import type { InvitationDoc } from "@davety/schema";

/**
 * Client-side lazy wrapper for EnvelopeRevealScene. Three.js (~580KB)
 * sadece /zarf rotuna girince yüklensin diye client boundary + dynamic
 * import. Server component (SectionEnvelopeReveal) bu wrapper'ı normal
 * sync import edebilir.
 */
const EnvelopeRevealScene = dynamic(
  () =>
    import("./EnvelopeRevealScene").then((m) => ({
      default: m.EnvelopeRevealScene,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-square w-full max-w-3xl mx-auto rounded-2xl bg-black/5 animate-pulse" />
    ),
  },
);

export function EnvelopeRevealSceneLazy({
  invitation,
}: {
  invitation: InvitationDoc;
}) {
  return <EnvelopeRevealScene invitation={invitation} />;
}
