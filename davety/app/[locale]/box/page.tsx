import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@davety/schema";
import { SectionGiftBox } from "@/app/sections/SectionGiftBox";

export default async function BoxPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <SectionGiftBox locale={locale} />;
}
