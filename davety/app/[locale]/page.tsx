import { setRequestLocale } from "next-intl/server";
import { SectionDesigns } from "@/app/sections/SectionDesigns";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-dvh">
      <SectionDesigns />
    </main>
  );
}
