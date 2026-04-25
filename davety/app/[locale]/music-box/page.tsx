import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@davety/schema";
import { SectionThreeInviteExperience } from "@/app/sections/SectionThreeInviteExperience";

export default async function MusicBoxInvitePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <SectionThreeInviteExperience locale={locale} route="music-box" />;
}
