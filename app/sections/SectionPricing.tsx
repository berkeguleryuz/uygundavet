"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { MorphButton } from "@/app/components/MorphButton";

export function SectionPricing() {
  const t = useTranslations("Pricing");

  const packages = [
    {
      name: t("starter.name"),
      price: t("starter.price"),
      desc: t("starter.desc"),
      cta: t("starter.cta"),
      features: t("starter.features").split(","),
      highlighted: false,
    },
    {
      name: t("pro.name"),
      price: t("pro.price"),
      desc: t("pro.desc"),
      cta: t("pro.cta"),
      features: t("pro.features").split(","),
      badge: t("pro.badge"),
      highlighted: true,
    },
    {
      name: t("business.name"),
      price: t("business.price"),
      desc: t("business.desc"),
      cta: t("business.cta"),
      features: t("business.features").split(","),
      highlighted: false,
    },
  ];

  return (
    <section
      id="fiyatlar"
      className="w-full py-32 md:py-44 px-6 bg-[#252224] border-t border-white/10"
    >
      <div className="max-w-6xl mx-auto">
        <motion.p
          {...fadeUp(0.1)}
          className="text-xs tracking-[3px] uppercase text-muted-foreground mb-4 font-sans text-center"
        >
          {t("label")}
        </motion.p>

        <motion.h2
          {...fadeUp(0.2)}
          className="text-4xl md:text-6xl text-[#d5d1ad] font-chakra mb-16 tracking-tight uppercase text-center"
        >
          {t("heading")}
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              {...fadeUp(0.3 + i * 0.15)}
              className={`relative rounded-3xl border px-7 py-7 flex flex-col ${
                pkg.highlighted
                  ? "border-white/25 scale-[1.03] md:scale-105 z-10 bg-white/[0.08] backdrop-blur-md"
                  : "liquid-glass border-white/10"
              }`}
            >
              {pkg.highlighted && pkg.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-[#252224] text-xs font-semibold font-sans px-4 py-1.5 rounded-full tracking-wide uppercase">
                  {pkg.badge}
                </div>
              )}

              <h3 className="font-chakra text-lg uppercase tracking-[0.15em] text-white mb-2">
                {pkg.name}
              </h3>

              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-chakra text-white font-bold">
                  {pkg.price}
                </span>
              </div>

              <p className="font-sans text-white/60 text-sm leading-relaxed mb-8">
                {pkg.desc}
              </p>

              <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                {pkg.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-white/80 font-sans text-sm"
                  >
                    <Check className="w-4 h-4 text-[#d5d1ad] mt-0.5 shrink-0" />
                    <span>{feature.trim()}</span>
                  </li>
                ))}
              </ul>

              <MorphButton
                variant={pkg.highlighted ? "filled" : "outline"}
                className="w-full"
              >
                {pkg.cta}
              </MorphButton>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
