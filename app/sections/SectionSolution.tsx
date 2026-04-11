"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { useTranslations } from "next-intl";
import { Palette, SlidersHorizontal, Send } from "lucide-react";

export function SectionSolution() {
  const t = useTranslations("HowItWorks");

  const steps = [
    { num: "01", title: t("step1Title"), desc: t("step1Desc"), icon: Palette },
    { num: "02", title: t("step2Title"), desc: t("step2Desc"), icon: SlidersHorizontal },
    { num: "03", title: t("step3Title"), desc: t("step3Desc"), icon: Send },
  ];

  return (
    <section id="nasil-calisir" className="w-full py-32 md:py-44 px-6 border-t border-border/30 bg-[#252224]">
      <div className="max-w-6xl mx-auto">
        <motion.p
          {...fadeUp(0.1)}
          className="text-xs tracking-[3px] uppercase text-muted-foreground mb-4 font-sans"
        >
          {t("label")}
        </motion.p>

        <motion.h2
          {...fadeUp(0.2)}
          className="text-4xl md:text-6xl text-foreground font-chakra mb-16 tracking-tight"
        >
          {t("headingPrefix")} <span className="font-merienda italic text-white lowercase">{t("headingHighlight")}</span> {t("headingSuffix")}
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              {...fadeUp(0.3 + i * 0.1)}
              className="relative flex flex-col p-8 liquid-glass rounded-3xl border border-white/10"
            >
              <span className="text-6xl font-chakra font-bold text-white/5 absolute top-4 right-6">
                {step.num}
              </span>
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                <step.icon className="w-7 h-7 text-foreground/80" />
              </div>
              <h3 className="font-semibold text-lg font-chakra text-foreground mb-3 uppercase tracking-wider">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm font-sans">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
