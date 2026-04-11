"use client";

import { IntersectionGrid } from "../components/IntersectionGrid";
import { Zap, ShieldCheck, Cpu } from "lucide-react";
import { useTranslations } from "next-intl";

export function SectionFeatures() {
  const t = useTranslations("Features");

  const features = [
    {
      title: t("fastDeliveryTitle"),
      description: t("fastDeliveryDesc"),
      icon: Zap,
    },
    {
      title: t("securityTitle"),
      description: t("securityDesc"),
      icon: ShieldCheck,
    },
    {
      title: t("themeTitle"),
      description: t("themeDesc"),
      icon: Cpu,
    },
  ];

  return (
    <section className="relative w-full py-32 bg-[#252224] text-white overflow-hidden border-t border-white/10">
      <IntersectionGrid className="text-white opacity-40 mx-auto max-w-7xl" />

      <div className="absolute top-0 inset-x-0 h-32 bg-linear-to-b from-[#252224] to-transparent z-0" />
      <div className="absolute bottom-0 inset-x-0 h-32 bg-linear-to-t from-[#252224] to-transparent z-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-chakra uppercase text-[#d5d1ad] mb-6 tracking-wide">
            {t("heading")}
          </h2>
          <p className="font-sans text-white/70 max-w-2xl mx-auto text-lg">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white/5 border border-white/10 p-8 rounded-tr-3xl rounded-bl-3xl hover:bg-white/10 transition-colors backdrop-blur-sm group"
            >
              <div className="w-14 h-14 bg-black/50 border border-white/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feat.icon className="w-6 h-6 text-[#d5d1ad]" />
              </div>
              <h3 className="font-merienda text-2xl font-semibold mb-4 tracking-tight">
                {feat.title}
              </h3>
              <p className="font-sans text-white/60 leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
