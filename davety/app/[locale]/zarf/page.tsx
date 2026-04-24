import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@davety/schema";
import { SectionEnvelopeReveal } from "@/app/sections/SectionEnvelopeReveal";

export default async function EnvelopeRevealPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <SectionEnvelopeReveal locale={locale} />;
}
