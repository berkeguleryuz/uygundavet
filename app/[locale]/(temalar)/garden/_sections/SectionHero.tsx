"use client";

import { useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { ChevronDownIcon } from "../_icons/ChevronDownIcon";
import { LeafIcon } from "../_icons/LeafIcon";
import { BloomIcon } from "../_icons/BloomIcon";

gsap.registerPlugin(useGSAP);

const BASE = "/garden";

const TR_MONTHS = [
  "Ocak","Şubat","Mart","Nisan","Mayıs","Haziran",
  "Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık",
];

export function SectionHero() {
  const wedding = useWedding();
  const rootRef = useRef<HTMLElement>(null);
  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  const formattedDate = useMemo(() => {
    if (!wedding.weddingDate) return "";
    const d = new Date(wedding.weddingDate);
    return `${d.getDate()} ${TR_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  }, [wedding.weddingDate]);

  useGSAP(
    () => {
      gsap.to("[data-garden-float]", {
        y: -12,
        rotation: "+=3",
        duration: 3.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.25,
      });
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className="relative min-h-svh overflow-hidden bg-gradient-to-b from-[#f5f3ed] via-[#eef1e4] to-[#e3e9d6]"
    >
      {/* Corner botanical decorations */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <LeafIcon
          size={220}
          data-garden-float
          className="absolute -left-8 -top-6 text-[#4a7c59]/25 rotate-[-30deg]"
        />
        <LeafIcon
          size={180}
          data-garden-float
          className="absolute -right-6 top-24 text-[#b7472a]/20 rotate-[45deg] -scale-x-100"
        />
        <LeafIcon
          size={200}
          data-garden-float
          className="absolute -left-10 bottom-16 text-[#8ea68a]/30 rotate-[20deg]"
        />
        <LeafIcon
          size={260}
          data-garden-float
          className="absolute -right-14 -bottom-10 text-[#4a7c59]/25 rotate-[-20deg] -scale-x-100"
        />
        <BloomIcon
          size={70}
          data-garden-float
          className="absolute left-[14%] top-[30%] text-[#f9a620]/40"
        />
        <BloomIcon
          size={54}
          data-garden-float
          className="absolute right-[12%] bottom-[26%] text-[#f9a620]/35"
        />
      </div>

      {/* Center content */}
      <div className="relative z-10 min-h-svh flex flex-col items-center justify-center px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="inline-flex items-center gap-3 mb-8"
        >
          <div className="h-px w-10 bg-[#4a7c59]/40" />
          <LeafIcon size={16} className="text-[#4a7c59]" />
          <span className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#4a7c59] font-semibold">
            {t("heroTagline")}
          </span>
          <LeafIcon size={16} className="text-[#4a7c59] -scale-x-100" />
          <div className="h-px w-10 bg-[#4a7c59]/40" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="font-merienda text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#2b3628] leading-[0.95] tracking-tight max-w-4xl"
        >
          {brideFirst}
          <span className="inline-block mx-4 md:mx-6 font-normal text-[#f9a620]">&amp;</span>
          {groomFirst}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="origin-center my-8 md:my-10 flex items-center gap-3"
        >
          <div className="h-px w-14 bg-gradient-to-r from-transparent to-[#b7472a]/60" />
          <BloomIcon size={18} className="text-[#b7472a]" />
          <div className="h-px w-14 bg-gradient-to-l from-transparent to-[#b7472a]/60" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.05 }}
          className="font-sans text-sm md:text-base tracking-[0.2em] uppercase text-[#5e6b56] mb-2"
        >
          {formattedDate}
        </motion.p>

        {wedding.venueName && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.2 }}
            className="font-merienda text-lg md:text-xl text-[#4a7c59]"
          >
            {wedding.venueName}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.4 }}
          className="mt-10"
        >
          <Link
            href={`${BASE}/lcv`}
            className="group inline-flex items-center gap-2.5 bg-[#4a7c59] text-[#f5f3ed] rounded-full px-8 md:px-10 py-4 font-sans text-xs md:text-sm font-semibold tracking-[0.2em] uppercase hover:bg-[#3a6447] transition-colors duration-300"
          >
            <BloomIcon size={16} className="group-hover:rotate-90 transition-transform duration-500" />
            {t("heroCtaButton")}
          </Link>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 1.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10"
      >
        <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#4a7c59]/70">
          {t("heroScrollHint")}
        </span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-[#4a7c59]/60"
        >
          <ChevronDownIcon size={16} />
        </motion.span>
      </motion.div>
    </section>
  );
}
