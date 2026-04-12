import { PillNav } from "@/app/components/PillNav";
import { SectionMindloopHero } from "@/app/sections/SectionMindloopHero";
import { SectionPlatforms } from "@/app/sections/SectionPlatforms";
import { SectionMission } from "@/app/sections/SectionMission";
import { SectionSolution } from "@/app/sections/SectionSolution";
import { SectionThemes } from "@/app/sections/SectionThemes";
import { SectionPricing } from "@/app/sections/SectionPricing";
import { SectionCTA } from "@/app/sections/SectionCTA";
import { SectionWizard } from "@/app/sections/SectionWizard";
import { SectionFAQ } from "@/app/sections/SectionFAQ";
import { SectionFinalCTA } from "@/app/sections/SectionFinalCTA";
import { Footer } from "@/app/components/Footer";
import { HomepageJsonLd } from "@/app/components/HomepageJsonLd";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main className="relative min-h-screen flex flex-col bg-[#252224]">
      <HomepageJsonLd locale={locale} />
      <PillNav />
      <SectionMindloopHero />
      <SectionPlatforms />
      <SectionMission />
      <SectionThemes />
      <SectionSolution />
      <SectionPricing />
      <SectionCTA />
      <SectionWizard />
      <SectionFAQ />
      <SectionFinalCTA />
      <Footer />
    </main>
  );
}
