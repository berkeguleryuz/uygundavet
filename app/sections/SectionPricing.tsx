"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { useTranslations } from "next-intl";
import { PricingCard } from "@/app/components/PricingCard";
import { useWizardStore } from "@/store/wizard-store";
import type { PackageKey } from "@/lib/packages";

export function SectionPricing() {
  const t = useTranslations("Pricing");
  const wizard = useWizardStore();

  const handleSelect = (key: PackageKey) => {
    wizard.setPackage(key);
    document.getElementById("wizard")?.scrollIntoView({ behavior: "smooth" });
  };

  const packages = [
    {
      key: "starter" as PackageKey,
      name: t("starter.name"),
      price: t("starter.price"),
      desc: t("starter.desc"),
      cta: t("starter.cta"),
      features: t("starter.features").split(","),
      highlighted: false,
    },
    {
      key: "pro" as PackageKey,
      name: t("pro.name"),
      price: t("pro.price"),
      desc: t("pro.desc"),
      cta: t("pro.cta"),
      features: t("pro.features").split(","),
      badge: t("pro.badge"),
      highlighted: true,
    },
    {
      key: "business" as PackageKey,
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
          {packages.map(({ key, ...rest }, i) => (
            <motion.div
              key={key}
              {...fadeUp(0.3 + i * 0.15)}
              className={rest.highlighted ? "scale-[1.03] md:scale-105" : ""}
            >
              <PricingCard {...rest} onSelect={() => handleSelect(key)} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
