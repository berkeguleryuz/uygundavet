import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { RsvpForm } from "./RsvpForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Rsvp" });
  return {
    title: t("title"),
    robots: { index: false, follow: false },
  };
}

export default async function RsvpPage({
  params,
}: {
  params: Promise<{ inviteCode: string; locale: string }>;
}) {
  const { inviteCode } = await params;
  return <RsvpForm inviteCode={inviteCode} />;
}
