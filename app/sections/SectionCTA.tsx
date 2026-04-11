"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Logo } from "@/app/components/Logo";
import { MorphButton } from "@/app/components/MorphButton";

export function SectionCTA() {
  const t = useTranslations("CTA");
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section className="relative w-full py-32 md:py-44 px-6 border-t border-border/30 overflow-hidden flex items-center justify-center min-h-[500px]">

      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        onContextMenu={(e) => e.preventDefault()}
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/hero2.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-background/60 z-1" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">

        <motion.div {...fadeUp(0.1)} className="mb-6">
          <Logo className="w-10 h-10" />
        </motion.div>

        <motion.h2
          {...fadeUp(0.2)}
          className="text-4xl md:text-6xl text-foreground font-chakra mb-4 tracking-tight uppercase"
        >
          {t("headingPrefix")} <span className="font-merienda italic lowercase text-white">{t("headingHighlight")}</span> {t("headingSuffix")}
        </motion.h2>

        <motion.p
          {...fadeUp(0.3)}
          className="text-muted-foreground text-lg mb-10 max-w-lg font-sans"
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          {...fadeUp(0.4)}
          className="flex items-center gap-4 flex-col sm:flex-row w-full sm:w-auto"
        >
          <MorphButton variant="filled" className="w-full sm:w-auto">
            {t("subscribeNow")}
          </MorphButton>
          <MorphButton variant="outline" className="w-full sm:w-auto">
            {t("startWriting")}
          </MorphButton>
        </motion.div>

      </div>
    </section>
  );
}
