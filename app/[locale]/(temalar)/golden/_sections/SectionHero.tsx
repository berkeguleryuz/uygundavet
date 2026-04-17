"use client";

import { useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { ChevronDownIcon } from "../_icons/ChevronDownIcon";
import { SunIcon } from "../_icons/SunIcon";

gsap.registerPlugin(useGSAP);

const BASE = "/golden";

const TR_MONTHS = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];

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
      gsap.to("[data-sun-rotate]", { rotation: 360, duration: 60, ease: "none", repeat: -1 });
      gsap.to("[data-sun-pulse]", { scale: 1.08, duration: 4, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to("[data-halo-rotate]", { rotation: -360, duration: 90, ease: "none", repeat: -1 });
      // Shimmer sweep on the title
      gsap.fromTo(
        "[data-shimmer]",
        { backgroundPosition: "-200% 0" },
        { backgroundPosition: "200% 0", duration: 4, ease: "none", repeat: -1, delay: 2 }
      );
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className="relative min-h-svh overflow-hidden bg-gradient-to-br from-[#faf5ec] via-[#e8d4b4] to-[#c1666b]/35"
    >
      {/* Central radial sun glow */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-[radial-gradient(circle,_rgba(244,169,0,0.55)_0%,_rgba(244,169,0,0.15)_40%,_rgba(244,169,0,0)_70%)] pointer-events-none"
      />

      {/* Large rotating sun silhouette */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 pointer-events-none md:w-[780px] md:h-[780px] w-[350px] h-[350px]"
      >
        <div
          data-sun-rotate
          className="absolute inset-0 flex items-center justify-center text-[#f4a900]/22 will-change-transform"
        >
          <SunIcon size={620} />
        </div>
      </div>

      {/* Film grain-like dots */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 60 }).map((_, i) => (
          <span
            key={i}
            className="absolute w-[2px] h-[2px] rounded-full bg-[#c1666b]"
            style={{
              top: `${(i * 17) % 100}%`,
              left: `${(i * 53) % 100}%`,
              opacity: 0.08 + ((i * 7) % 3) / 20,
            }}
          />
        ))}
      </div>

      {/* Center content */}
      <div className="relative z-10 min-h-svh flex flex-col items-center justify-center px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="inline-flex items-center gap-3 mb-8"
        >
          <div className="h-px w-12 bg-[#4a403a]/40" />
          <SunIcon size={18} data-sun-pulse className="text-[#f4a900]" />
          <span className="font-sans text-[11px] tracking-[0.45em] uppercase text-[#4a403a] font-bold">
            {t("heroTagline")}
          </span>
          <SunIcon size={18} data-sun-pulse className="text-[#f4a900]" />
          <div className="h-px w-12 bg-[#4a403a]/40" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          data-shimmer
          className="font-merienda text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight max-w-4xl bg-[linear-gradient(90deg,_#4a403a_0%,_#c1666b_25%,_#f4a900_50%,_#c1666b_75%,_#4a403a_100%)] bg-[length:200%_auto] bg-clip-text text-transparent"
        >
          {brideFirst}
          <span className="inline-block mx-4 md:mx-6 text-[#c1666b]">&amp;</span>
          {groomFirst}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.7, delay: 1.0 }}
          className="my-8 md:my-10 w-36 h-[2px] bg-gradient-to-r from-transparent via-[#f4a900] to-transparent origin-center"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.2 }}
          className="font-sans text-sm md:text-base tracking-[0.3em] uppercase text-[#4a403a]/85 mb-2 font-semibold"
        >
          {formattedDate}
        </motion.p>

        {wedding.venueName && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.35 }}
            className="font-merienda text-lg md:text-xl text-[#c1666b]"
          >
            {wedding.venueName}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.55 }}
          className="mt-10"
        >
          <Link
            href={`${BASE}/lcv`}
            className="group inline-flex items-center gap-3 bg-[#4a403a] text-[#faf5ec] rounded-full px-10 py-4 font-sans text-xs md:text-sm font-bold tracking-[0.28em] uppercase hover:bg-[#c1666b] transition-colors duration-300 shadow-[0_18px_40px_-18px_rgba(74,64,58,0.6)]"
          >
            <SunIcon size={16} className="text-[#f4a900] group-hover:rotate-180 transition-transform duration-700" />
            {t("heroCtaButton")}
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10"
      >
        <span className="font-sans text-[10px] tracking-[0.35em] uppercase text-[#4a403a]/70 font-bold">
          {t("heroScrollHint")}
        </span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-[#4a403a]/60"
        >
          <ChevronDownIcon size={16} />
        </motion.span>
      </motion.div>
    </section>
  );
}
