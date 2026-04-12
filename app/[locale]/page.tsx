import dynamic from "next/dynamic";
import { PillNav } from "@/app/components/PillNav";
import { SectionMindloopHero } from "@/app/sections/SectionMindloopHero";
import { SectionPlatforms } from "@/app/sections/SectionPlatforms";
import { HomepageJsonLd } from "@/app/components/HomepageJsonLd";

const SectionMission = dynamic(() =>
  import("@/app/sections/SectionMission").then((m) => m.SectionMission)
);
const SectionSolution = dynamic(() =>
  import("@/app/sections/SectionSolution").then((m) => m.SectionSolution)
);
const SectionThemes = dynamic(() =>
  import("@/app/sections/SectionThemes").then((m) => m.SectionThemes)
);
const SectionPricing = dynamic(() =>
  import("@/app/sections/SectionPricing").then((m) => m.SectionPricing)
);
const SectionCTA = dynamic(() =>
  import("@/app/sections/SectionCTA").then((m) => m.SectionCTA)
);
const SectionWizard = dynamic(() =>
  import("@/app/sections/SectionWizard").then((m) => m.SectionWizard)
);
const SectionFAQ = dynamic(() =>
  import("@/app/sections/SectionFAQ").then((m) => m.SectionFAQ)
);
const SectionFinalCTA = dynamic(() =>
  import("@/app/sections/SectionFinalCTA").then((m) => m.SectionFinalCTA)
);
const Footer = dynamic(() =>
  import("@/app/components/Footer").then((m) => m.Footer)
);

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
