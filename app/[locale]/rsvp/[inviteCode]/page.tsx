import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { Customer } from "@/models/Customer";
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
  searchParams,
}: {
  params: Promise<{ inviteCode: string; locale: string }>;
  searchParams: Promise<{ source?: string }>;
}) {
  const { inviteCode } = await params;
  const { source } = await searchParams;

  await connectDB();
  const customer = await Customer.findOne({ inviteCode })
    .select("customDomain")
    .lean();
  const customDomain = (customer?.customDomain || "")
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/, "");
  if (customDomain) {
    const suffix = source ? `?source=${encodeURIComponent(source)}` : "";
    redirect(`https://${customDomain}/lcv${suffix}`);
  }

  return <RsvpForm inviteCode={inviteCode} source={source} />;
}
