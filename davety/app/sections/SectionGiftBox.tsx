import { buildDefaultDoc, type Locale } from "@davety/schema";
import { BoxRevealScene } from "@/app/components/box/BoxRevealScene";

interface SectionGiftBoxProps {
  locale: Locale;
}

export function SectionGiftBox({ locale }: SectionGiftBoxProps) {
  const invitation = buildDefaultDoc({
    locale,
    weddingDate: "2026-06-15",
    weddingTime: "19:00",
    brideName: "Hilal",
    groomName: "Ibrahim",
    templateSlug: "gift-box-reveal",
  });

  return (
    <main className="min-h-dvh overflow-hidden bg-[#f5f1e7] px-4 py-4 text-[#252224] md:px-6">
      <section className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-7xl flex-col justify-center gap-2">
        <header className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#8a755e]">
            Davety / Gift Box 3D
          </p>
          <h1 className="mt-1 font-display text-3xl leading-tight text-[#252224] md:text-4xl">
            Hediye kutusundan çıkan davetiye
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-xs leading-5 text-[#665b51] md:text-sm">
            Önce kapak gerçek menteşe ekseninde ağırlık ve sönüm hissiyle açılır.
            Açıklık tamamlanınca hazır davetiye kutudan yükselir, kameraya doğru
            gelir ve okunur pozisyonda yerleşir.
          </p>
        </header>

        <BoxRevealScene invitation={invitation} />
      </section>
    </main>
  );
}
