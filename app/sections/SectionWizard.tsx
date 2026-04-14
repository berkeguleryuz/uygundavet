import { WizardForm } from "../components/WizardForm";

export function SectionWizard() {
  return (
    <section id="wizard" className="relative w-full min-h-screen bg-[#252224] flex items-center justify-center py-20 px-4 border-t border-white/10">
      <div className="z-10 w-full relative">
        <WizardForm />
      </div>
    </section>
  );
}
