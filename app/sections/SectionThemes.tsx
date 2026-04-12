"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { useTranslations } from "next-intl";
import FlowingMenu from "@/app/components/FlowingMenu";

const themeItems = [
  {
    link: "#",
    text: "Rose",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
  },
  {
    link: "#",
    text: "Sunset",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80",
  },
  {
    link: "#",
    text: "Pearl",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80",
  },
  {
    link: "#",
    text: "Crystal",
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80",
  },
];

export function SectionThemes() {
  const t = useTranslations("Themes");

  return (
    <section id="temalar" className="w-full py-32 md:py-44 bg-[#252224]">
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
        className="max-w-7xl md:mx-auto md:px-6"
        style={{ height: "700px", position: "relative" }}
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
