"use client";

import dynamic from "next/dynamic";
import type { InvitationDoc } from "@davety/schema";
import type { InviteExperienceConfig } from "./experienceRegistry";

/**
 * Client-side lazy wrapper for ThreeInviteExperienceScene. The scene
 * imports * as THREE which alone is ~580KB; this wrapper isolates it
 * behind a client boundary + dynamic import so /curtain, /zarf,
 * /music-box and gallery routes only pay the cost when the user
 * actually navigates there.
 */
const ThreeInviteExperienceScene = dynamic(
  () =>
    import("./ThreeInviteExperienceScene").then((m) => ({
      default: m.ThreeInviteExperienceScene,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-square w-full max-w-3xl mx-auto rounded-2xl bg-black/5 animate-pulse" />
    ),
  },
);

export function ThreeInviteExperienceSceneLazy({
  invitation,
  experience,
}: {
  invitation: InvitationDoc;
  experience: InviteExperienceConfig;
}) {
  return (
    <ThreeInviteExperienceScene
      invitation={invitation}
      experience={experience}
    />
  );
}
