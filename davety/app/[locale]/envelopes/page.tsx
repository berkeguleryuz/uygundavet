import { setRequestLocale } from "next-intl/server";
import { EnvelopePlayground } from "./EnvelopePlayground";

export default async function EnvelopesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-dvh bg-[#f5f6f3] px-2 py-10">
      <header className="max-w-5xl mx-auto text-center mb-8">
        <h1
          className="text-3xl md:text-4xl mb-2"
          style={{ fontFamily: "Merienda, serif" }}
        >
          Zarf Tasarımı Seç
        </h1>
        <p className="text-sm text-muted-foreground">
          10 farklı stil — pill üzerinden seç, zarfa tıklayarak aç/kapat.
          Beğendiğini söyle, onu kullanalım.
        </p>
      </header>

      <EnvelopePlayground />
    </main>
  );
}
