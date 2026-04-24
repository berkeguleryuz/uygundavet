import { buildDefaultDoc, type Locale } from "@davety/schema";
import { EnvelopeRevealScene } from "@/app/components/envelope-reveal/EnvelopeRevealScene";

interface SectionEnvelopeRevealProps {
  locale: Locale;
}

export function SectionEnvelopeReveal({ locale }: SectionEnvelopeRevealProps) {
  const invitation = buildDefaultDoc({
    locale,
    weddingDate: "2026-06-15",
    weddingTime: "19:00",
    brideName: "Hilal",
    groomName: "Ibrahim",
    templateSlug: "envelope-3d-reveal",
  });

  return (
    <main className="min-h-dvh overflow-hidden bg-[#f5f1e7] px-4 py-4 text-[#252224] md:px-6">
      <section className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-7xl flex-col justify-center gap-2">
        <header className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#8a755e]">
            Davety / Envelope 3D
          </p>
          <h1 className="mt-1 font-display text-3xl leading-tight text-[#252224] md:text-4xl">
            Zarfın içinden çıkan davetiye
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-xs leading-5 text-[#665b51] md:text-sm">
            Önce zarfın ön yüzü görünür. Tıklayınca zarf arka yüzüne döner,
            kapak gerçek menteşe çizgisinden açılır ve davetiye ancak zarf
            ağzını temizledikten sonra yukarı çıkıp okunur hale gelir.
          </p>
        </header>

        <EnvelopeRevealScene invitation={invitation} />
      </section>
    </main>
  );
}
