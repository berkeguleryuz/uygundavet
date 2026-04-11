import { useTranslations } from "next-intl";
import { PillNav } from "@/app/components/PillNav";
import { Footer } from "@/app/components/Footer";
import { Logo } from "@/app/components/Logo";

export default function DataDeletionPage() {
  const t = useTranslations("DataDeletionPage");

  const sections = [
    { title: t("s1Title"), text: t("s1Text") },
    { title: t("s2Title"), text: t("s2Text") },
    { title: t("s3Title"), text: t("s3Text") },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-[#252224]">
      <PillNav />

      <div className="flex-1 pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Logo className="w-8 h-8" />
            <span className="text-white/30 text-sm font-sans">{t("lastUpdated")}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-merienda text-white mb-4">
            {t("title")}
          </h1>
          <p className="text-white/50 font-sans text-lg leading-relaxed mb-12 border-b border-white/10 pb-12">
            {t("intro")}
          </p>

          <div className="space-y-10">
            {sections.map((section, i) => (
              <div key={i}>
                <h2 className="text-lg font-chakra uppercase tracking-wider text-[#d5d1ad] mb-3">
                  {section.title}
                </h2>
                <p className="text-white/60 font-sans leading-relaxed">
                  {section.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
