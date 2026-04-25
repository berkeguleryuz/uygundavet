import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@davety/schema";
import { SectionThreeInviteGallery } from "@/app/sections/SectionThreeInviteGallery";

export default async function ThreeInviteGalleryPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <SectionThreeInviteGallery />;
}
