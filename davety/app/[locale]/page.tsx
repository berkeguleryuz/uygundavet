import { getTranslations, setRequestLocale } from "next-intl/server";
import { LandingClient } from "@/src/components/LandingClient";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Landing");

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center gap-12 px-6 py-16">
      <header className="text-center max-w-2xl">
        <h1 className="font-display text-5xl md:text-7xl leading-tight text-foreground">
          {t("title")}
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground">
          {t("subtitle")}
        </p>
      </header>

      <LandingClient />
    </main>
  );
}
