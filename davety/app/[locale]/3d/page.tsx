import { setRequestLocale } from "next-intl/server";
import { Envelope3DScene } from "./Envelope3DScene";

export default async function Envelope3DPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-dvh bg-[#f5f6f3] px-6 py-10 overflow-hidden">
      <header className="max-w-5xl mx-auto text-center mb-6">
        <div
          className="text-[11px] uppercase tracking-[0.3em] opacity-50 mb-2"
          style={{ fontFamily: "Space Grotesk, sans-serif", color: "#555670" }}
        >
          Envelopes / 3D
        </div>
        <h1
          className="text-4xl md:text-5xl mb-2"
          style={{ fontFamily: "Merienda, serif", color: "#555670" }}
        >
          Zarfın 3 Boyutlu Hâli
        </h1>
        <p
          className="text-sm max-w-xl mx-auto opacity-70"
          style={{ fontFamily: "Space Grotesk, sans-serif", color: "#555670" }}
        >
          Zarfa tıkla — kapak menteşeden açılsın, davetiye zarfın içinden
          süzülerek sana doğru uçsun. Mouse&apos;unu gezdirerek sahneyi
          eğebilirsin.
        </p>
      </header>

      <Envelope3DScene />
    </main>
  );
}
