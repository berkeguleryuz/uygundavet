import { setRequestLocale } from "next-intl/server";
import { SectionPricing } from "@/app/sections/SectionPricing";

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-dvh">
      <SectionPricing />
    </main>
  );
}
