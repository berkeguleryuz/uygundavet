import Link from "next/link";
import { INVITE_EXPERIENCES } from "@/app/components/three-invites/experienceRegistry";
import { CLAUDE_SCENES } from "@/app/components/three-claude/sceneRegistry";

const STANDALONE_SCENES: ReadonlyArray<{
  route: string;
  title: string;
  description: string;
  palette: { bg: string; ink: string; accent: string; paper: string };
}> = [
  {
    route: "3d",
    title: "Düğün Zarfı 3D",
    description:
      "CSS 3D zarf — kapağı menteşeden açılıyor, davetiye içinden süzülerek çıkıyor.",
    palette: { bg: "#f5f6f3", ink: "#252224", accent: "#555670", paper: "#ffffff" },
  },
  {
    route: "zarf",
    title: "Zarf Reveal Sahnesi",
    description:
      "Klasik zarf açılış animasyonu — sade ve temiz bir reveal deneyimi.",
    palette: { bg: "#f1ece1", ink: "#1f1a14", accent: "#8a5a2c", paper: "#fffaf0" },
  },
  {
    route: "envelopes",
    title: "Zarf Tasarımı Seçici",
    description:
      "10 farklı zarf stili — pill üzerinden seç, beğendiğin zarfı belirle.",
    palette: { bg: "#ece7da", ink: "#1f1a14", accent: "#a25d2c", paper: "#fff7e8" },
  },
  {
    route: "box",
    title: "Hediye Kutusu",
    description:
      "Süslü hediye kutusu açılıyor — içinden davetiye yükseliyor.",
    palette: { bg: "#f0e7e7", ink: "#241719", accent: "#a8434c", paper: "#fff5f0" },
  },
];

export function SectionThreeInviteGallery() {
  return (
    <main className="min-h-dvh bg-[#f5f1e7] px-4 py-4 text-[#252224] md:px-6">
      <section className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-7xl flex-col gap-12 pt-20 pb-16">
        <header className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#8a755e]">
            Davety / Davetiye Galerisi
          </p>
          <h1 className="mt-2 font-display text-4xl leading-tight md:text-5xl">
            Davetiye çeşitleri
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#665b51] md:text-base">
            Her kart ayrı bir sahneye gider. Sahneyi açıp animasyonu izleyebilir,
            ardından galeriye dönerek diğer davetiye türlerini karşılaştırabilirsin.
          </p>
        </header>

        <div className="flex flex-col gap-4">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8a755e]">
            Hazır Sahneler
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {INVITE_EXPERIENCES.map((experience, index) => {
              const darkCard = experience.sceneKind === "curtain";
              return (
                <Link
                  key={experience.route}
                  href={`/${experience.route}`}
                  className="group flex min-h-52 flex-col justify-between overflow-hidden rounded-md border border-black/10 p-5 shadow-[0_18px_55px_-42px_rgba(37,34,36,0.7)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_70px_-42px_rgba(37,34,36,0.78)]"
                  style={{
                    backgroundColor: experience.palette.background,
                    color: darkCard ? "#fff7df" : experience.palette.dark,
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className="font-mono text-[10px] uppercase tracking-[0.22em]"
                        style={{ color: experience.palette.accent }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: experience.palette.accent }}
                      />
                    </div>

                    <h2 className="mt-5 font-display text-2xl leading-tight">
                      {experience.title}
                    </h2>
                    <p
                      className="mt-3 text-xs leading-5"
                      style={{ color: darkCard ? "#d7ccb8" : "#665b51" }}
                    >
                      {experience.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-70">
                      /{experience.route}
                    </span>
                    <span
                      className="rounded-full px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] transition group-hover:translate-x-1"
                      style={{
                        backgroundColor: experience.palette.dark,
                        color: darkCard ? "#171313" : experience.palette.paper,
                      }}
                    >
                      Gör
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8a755e]">
            Tek Tip Sahneler
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {STANDALONE_SCENES.map((scene, index) => (
              <Link
                key={scene.route}
                href={`/${scene.route}`}
                className="group flex min-h-52 flex-col justify-between overflow-hidden rounded-md border border-black/10 p-5 shadow-[0_18px_55px_-42px_rgba(37,34,36,0.7)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_70px_-42px_rgba(37,34,36,0.78)]"
                style={{
                  backgroundColor: scene.palette.bg,
                  color: scene.palette.ink,
                }}
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className="font-mono text-[10px] uppercase tracking-[0.22em]"
                      style={{ color: scene.palette.accent }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: scene.palette.accent }}
                    />
                  </div>
                  <h2 className="mt-5 font-display text-2xl leading-tight">
                    {scene.title}
                  </h2>
                  <p
                    className="mt-3 text-xs leading-5"
                    style={{ color: "#665b51" }}
                  >
                    {scene.description}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-70">
                    /{scene.route}
                  </span>
                  <span
                    className="rounded-full px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] transition group-hover:translate-x-1"
                    style={{
                      backgroundColor: scene.palette.ink,
                      color: scene.palette.paper,
                    }}
                  >
                    Gör
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8a755e]">
            Fizik Tabanlı Sahneler · Claude Lab
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {CLAUDE_SCENES.map((scene) => {
              const ready = scene.status === "ready";
              const href = `/davetiye-galerisi/claude/${scene.slug}`;
              const card = (
                <div
                  className="group flex h-full min-h-[16rem] flex-col justify-between rounded-md border p-5 transition duration-200 hover:-translate-y-1"
                  style={{
                    background: scene.palette.bg,
                    color: scene.palette.ink,
                    borderColor: ready
                      ? `${scene.palette.accent}55`
                      : "rgba(0,0,0,0.08)",
                    opacity: ready ? 1 : 0.55,
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span
                        className="font-mono text-[10px] uppercase tracking-[0.22em]"
                        style={{ color: scene.palette.accent }}
                      >
                        {String(scene.index).padStart(2, "0")}
                      </span>
                      <span
                        className="rounded-full px-2 py-0.5 text-[9px] uppercase tracking-[0.2em]"
                        style={{
                          background: ready
                            ? scene.palette.accent
                            : "rgba(0,0,0,0.1)",
                          color: ready ? "#fff" : "rgba(0,0,0,0.55)",
                        }}
                      >
                        {ready ? "hazır" : "yapım aşamasında"}
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-xl leading-tight">
                      {scene.title}
                    </h3>
                    <p className="mt-3 text-[12px] leading-5 opacity-80">
                      <span className="font-semibold">Fizik:</span> {scene.physics}
                    </p>
                    <p className="mt-2 text-[12px] leading-5 opacity-80">
                      <span className="font-semibold">Çıkış:</span> {scene.exit}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <span
                      className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-60"
                      style={{ color: scene.palette.ink }}
                    >
                      /davetiye-galerisi/claude/{scene.slug}
                    </span>
                    {ready && (
                      <span
                        className="rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] transition group-hover:translate-x-1"
                        style={{
                          background: scene.palette.ink,
                          color: scene.palette.bg,
                        }}
                      >
                        İncele
                      </span>
                    )}
                  </div>
                </div>
              );
              return ready ? (
                <Link key={scene.slug} href={href} className="block">
                  {card}
                </Link>
              ) : (
                <div key={scene.slug}>{card}</div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
