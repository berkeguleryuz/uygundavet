"use client";

import { motion, useAnimation } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ContactModal } from "@/app/components/ContactModal";

const PATH_FLAT = "M 0 100 V 100 Q 50 100 100 100 V 100 z";
const PATH_CURVE = "M 0 100 V 50 Q 50 0 100 50 V 100 z";
const PATH_FULL = "M 0 100 V 0 Q 50 0 100 0 V 100 z";

function CTAButton({
  children,
  variant = "filled",
  onClick,
}: {
  children: React.ReactNode;
  variant?: "filled" | "outline";
  onClick?: () => void;
}) {
  const pathControls = useAnimation();
  const textControls = useAnimation();

  const isFilled = variant === "filled";

  const handleEnter = async () => {
    textControls.start({
      color: isFilled ? "#252224" : "#f5f6f3",
      transition: { duration: 0.4, ease: "easeInOut" },
    });
    await pathControls.start({ d: PATH_CURVE, transition: { duration: 0.2, ease: "easeIn" } });
    await pathControls.start({ d: PATH_FULL, transition: { duration: 0.2, ease: "easeOut" } });
  };

  const handleLeave = async () => {
    textControls.start({
      color: isFilled ? "#f5f6f3" : "#252224",
      transition: { duration: 0.4, ease: "easeInOut" },
    });
    await pathControls.start({ d: PATH_CURVE, transition: { duration: 0.2, ease: "easeIn" } });
    await pathControls.start({ d: PATH_FLAT, transition: { duration: 0.2, ease: "easeOut" } });
  };

  return (
    <motion.button
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative cursor-pointer overflow-hidden rounded-full px-10 py-4 font-chakra font-semibold uppercase tracking-wider liquid-glass-dark ${
        isFilled
          ? "bg-[#252224] text-[#f5f6f3]"
          : "text-[#252224]"
      }`}
    >
      <div className="absolute inset-0 pointer-events-none">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <motion.path
            d={PATH_FLAT}
            fill={isFilled ? "#ffffff" : "#252224"}
            animate={pathControls}
          />
        </svg>
      </div>
      <motion.span className="relative z-10 block" animate={textControls}>
        {children}
      </motion.span>
    </motion.button>
  );
}

export function SectionFinalCTA() {
  const t = useTranslations("FinalCTA");
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <section className="w-full py-20 md:py-32 px-4 md:px-8 bg-[#252224]">
      <motion.div
        {...fadeUp(0.2)}
        className="relative rounded-3xl border border-white/10 bg-[#f5f6f3] px-6 py-16 md:px-16 md:py-20 lg:px-24 lg:py-24 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-[#d5d1ad]/10 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <motion.p
            {...fadeUp(0.25)}
            className="text-xs tracking-[3px] uppercase text-[#252224]/40 mb-5 font-sans"
          >
            {t("label")}
          </motion.p>

          <motion.h2
            {...fadeUp(0.3)}
            className="text-3xl md:text-4xl lg:text-5xl text-[#252224] font-chakra mb-4 tracking-tight uppercase"
          >
            {t("headingPrefix")}{" "}
            <span className="font-merienda italic lowercase text-[#555670]">
              {t("headingHighlight")}
            </span>{" "}
            {t("headingSuffix")}
          </motion.h2>

          <motion.p
            {...fadeUp(0.35)}
            className="text-[#252224]/50 text-sm md:text-base mb-10 max-w-lg font-sans"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            {...fadeUp(0.4)}
            className="flex items-center gap-5 flex-col sm:flex-row"
          >
            <CTAButton
              variant="filled"
              onClick={() => {
                document.getElementById("fiyatlar")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {t("ctaPrimary")}
            </CTAButton>

            <CTAButton
              variant="outline"
              onClick={() => setContactOpen(true)}
            >
              {t("ctaSecondary")}
            </CTAButton>
          </motion.div>
        </div>
      </motion.div>

      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </section>
  );
}
