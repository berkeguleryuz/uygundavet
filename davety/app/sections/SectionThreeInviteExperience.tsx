import Link from "next/link";
import { buildDefaultDoc, type Locale } from "@davety/schema";
import { ThreeInviteExperienceScene } from "@/app/components/three-invites/ThreeInviteExperienceScene";
import {
  getInviteExperienceByRoute,
  type InviteExperienceRoute,
} from "@/app/components/three-invites/experienceRegistry";

interface SectionThreeInviteExperienceProps {
  locale: Locale;
  route: InviteExperienceRoute;
}

export function SectionThreeInviteExperience({
  locale,
  route,
}: SectionThreeInviteExperienceProps) {
  const experience = getInviteExperienceByRoute(route);
  const invitation = buildDefaultDoc({
    locale,
    weddingDate: "2026-06-15",
    weddingTime: "19:00",
    brideName: "Hilal",
    groomName: "Ibrahim",
    templateSlug: experience.templateSlug,
  });
  const darkScene = experience.sceneKind === "moonlight" || experience.sceneKind === "curtain";

  return (
    <main
      className="min-h-dvh overflow-hidden px-4 py-4 md:px-6"
      style={{
        backgroundColor: experience.palette.background,
        color: darkScene ? "#fff7df" : experience.palette.dark,
      }}
    >
      <section className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-7xl flex-col justify-center gap-2">
        <header className="mx-auto max-w-3xl text-center">
          <Link
            href="/davetiye-galerisi"
            className="mb-3 inline-flex rounded-full border border-current/20 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] opacity-75 transition hover:opacity-100"
          >
            Tüm 3D Davetiyeler
          </Link>
          <p
            className="font-mono text-[11px] uppercase tracking-[0.28em]"
            style={{ color: experience.palette.accent }}
          >
            {experience.eyebrow}
          </p>
          <h1 className="mt-1 font-display text-3xl leading-tight md:text-4xl">
            {experience.title}
          </h1>
          <p
            className="mx-auto mt-2 max-w-2xl text-xs leading-5 md:text-sm"
            style={{ color: darkScene ? "#d7ccb8" : "#665b51" }}
          >
            {experience.description}
          </p>
        </header>

        <ThreeInviteExperienceScene invitation={invitation} experience={experience} />
      </section>
    </main>
  );
}
