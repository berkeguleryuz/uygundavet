"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import {
  UserCheck, Heart,
  Coins, Gem,
  QrCode, Scan,
  Users, UserPlus,
  Share2, Send,
  Globe, Languages,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

function FeatureCard({
  title,
  desc,
  Icon,
  HoverIcon,
  delay,
}: {
  title: string;
  desc: string;
  Icon: LucideIcon;
  HoverIcon: LucideIcon;
  delay: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      {...fadeUp(delay)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group flex flex-col items-center text-center p-8 liquid-glass rounded-3xl border border-white/10 hover:border-white/20 transition-colors cursor-default"
    >
      <div className="relative w-20 h-20 flex items-center justify-center mb-5 rounded-2xl bg-white/5">
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            opacity: isHovered ? 0 : 1,
            scale: isHovered ? 0.5 : 1,
            rotateY: isHovered ? 90 : 0,
          }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          <Icon className="w-10 h-10 text-foreground/80" />
        </motion.div>

        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.5,
            rotateY: isHovered ? 0 : -90,
          }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          <HoverIcon className="w-10 h-10 text-foreground" />
        </motion.div>
      </div>

      <h3 className="font-semibold text-base font-chakra text-foreground mb-2 uppercase tracking-wider">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm font-sans">
        {desc}
      </p>
    </motion.div>
  );
}

export function SectionPlatforms() {
  const t = useTranslations("Features");

  const features = [
    { title: t("rsvpTitle"), desc: t("rsvpDesc"), Icon: UserCheck, HoverIcon: Heart },
    { title: t("goldTitle"), desc: t("goldDesc"), Icon: Coins, HoverIcon: Gem },
    { title: t("qrTitle"), desc: t("qrDesc"), Icon: QrCode, HoverIcon: Scan },
    { title: t("guestTitle"), desc: t("guestDesc"), Icon: Users, HoverIcon: UserPlus },
    { title: t("shareTitle"), desc: t("shareDesc"), Icon: Share2, HoverIcon: Send },
    { title: t("langTitle"), desc: t("langDesc"), Icon: Globe, HoverIcon: Languages },
  ];

  return (
    <section id="ozellikler" className="w-full pt-52 md:pt-64 pb-12 md:pb-16 px-6 bg-[#252224]">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <motion.p
          {...fadeUp(0.05)}
          className="text-xs tracking-[3px] uppercase text-muted-foreground mb-4 font-sans"
        >
          {t("label")}
        </motion.p>

        <motion.h2
          {...fadeUp(0.1)}
          className="text-4xl md:text-6xl lg:text-7xl font-chakra text-center mb-6 tracking-tight"
        >
          {t("headingPrefix")} <span className="font-merienda italic lowercase text-white">{t("headingHighlight")}</span> {t("headingSuffix")}
        </motion.h2>

        <motion.p
          {...fadeUp(0.15)}
          className="text-muted-foreground text-lg max-w-2xl mx-auto mb-20 text-center font-sans"
        >
          {t("subtitle")}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-16">
          {features.map((feature, i) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              desc={feature.desc}
              Icon={feature.Icon}
              HoverIcon={feature.HoverIcon}
              delay={0.2 + i * 0.07}
            />
          ))}
        </div>

        <motion.p
          {...fadeUp(0.7)}
          className="text-muted-foreground text-sm text-center font-sans"
        >
          {t("footer")}
        </motion.p>
      </div>
    </section>
  );
}
