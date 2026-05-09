"use client";

import dynamic from "next/dynamic";
import type { InvitationDoc } from "@davety/schema";

/**
 * Client-side lazy wrapper for BoxRevealScene. The scene pulls all of
 * three.js (~580KB minified) into the bundle; this wrapper defers the
 * import until the component actually mounts in the browser, with
 * ssr: false so the heavy module never lands in any SSR HTML payload.
 *
 * Server components (SectionGiftBox) can import this wrapper normally
 * since it's tagged "use client" — Next handles the boundary.
 */
const BoxRevealScene = dynamic(
  () =>
    import("./BoxRevealScene").then((m) => ({ default: m.BoxRevealScene })),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-square w-full max-w-3xl mx-auto rounded-2xl bg-black/5 animate-pulse" />
    ),
  },
);

export function BoxRevealSceneLazy({
  invitation,
}: {
  invitation: InvitationDoc;
}) {
  return <BoxRevealScene invitation={invitation} />;
}
