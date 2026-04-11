import { PillNav } from "@/app/components/PillNav";
import { SectionMindloopHero } from "@/app/sections/SectionMindloopHero";
import { SectionPlatforms } from "@/app/sections/SectionPlatforms";
import { SectionMission } from "@/app/sections/SectionMission";
import { SectionSolution } from "@/app/sections/SectionSolution";
import { SectionPricing } from "@/app/sections/SectionPricing";
import { SectionCTA } from "@/app/sections/SectionCTA";
import { SectionWizard } from "@/app/sections/SectionWizard";
import { Footer } from "@/app/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col bg-[#252224]">
      <PillNav />
      <SectionMindloopHero />
      <SectionPlatforms />
      <SectionMission />
      <SectionSolution />
      <SectionPricing />
      <SectionCTA />
      <SectionWizard />
      <Footer />
    </main>
  );
}
