"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { useTranslations } from "next-intl";
import FlowingMenu from "@/app/components/FlowingMenu";
import { THEME_OPTIONS } from "@/lib/themes";

const themeItems = THEME_OPTIONS.map((t) => ({
  link: `/${t.key}`,
  text: t.key.charAt(0).toUpperCase() + t.key.slice(1),
  image: t.image,
  video: "video" in t && t.video === true,
  target: "_blank" as const,
}));

export function SectionThemes() {
  const t = useTranslations("Themes");

  return (
    <section id="temalar" className="w-full py-32 md:py-44 bg-[#252224] scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6 mb-16">
        <motion.p
          {...fadeUp(0.1)}
          className="text-xs tracking-[3px] uppercase text-muted-foreground mb-4 font-sans text-center"
        >
          {t("label")}
        </motion.p>
        <motion.h2
          {...fadeUp(0.2)}
          className="text-4xl md:text-6xl text-[#d5d1ad] font-chakra mb-4 tracking-tight uppercase text-center"
        >
          {t("heading")}
        </motion.h2>
        <motion.p
          {...fadeUp(0.3)}
          className="text-muted-foreground text-center font-sans max-w-xl mx-auto"
        >
          {t("subtitle")}
        </motion.p>
      </div>

      <motion.div
        {...fadeUp(0.4)}
        className="relative w-full h-[460px] sm:h-[560px] md:h-[680px] lg:h-[780px] 2xl:h-[880px]"
      >
        <FlowingMenu
          items={themeItems}
          speed={15}
          textColor="#f5f6f3"
          bgColor="#252224"
          marqueeBgColor="#d5d1ad"
          marqueeTextColor="#252224"
          borderColor="rgba(255,255,255,0.1)"
        />
      </motion.div>
    </section>
  );
}
