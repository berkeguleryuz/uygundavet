"use client";

import { useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { CompassIcon } from "../_icons/CompassIcon";

gsap.registerPlugin(useGSAP);

const BASE = "/ocean";

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
      gsap.to("[data-wave-1]", { x: -60, duration: 14, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to("[data-wave-2]", { x: 80, duration: 18, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to("[data-wave-3]", { x: -40, duration: 22, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to("[data-compass]", { rotation: 360, duration: 80, ease: "none", repeat: -1 });
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className="relative min-h-svh overflow-hidden bg-gradient-to-b from-[#0d1620] via-[#1a2332] to-[#1a2f42]"
    >
      {/* Starfield-like dots (dusk to water) */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="absolute w-[2px] h-[2px] rounded-full bg-[#a8dadc]"
            style={{
              top: `${(i * 37) % 45}%`,
              left: `${(i * 53) % 100}%`,
              opacity: 0.15 + ((i * 7) % 5) / 20,
            }}
          />
        ))}
      </div>

      {/* Horizon line */}
      <div aria-hidden className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#a8dadc]/30 to-transparent" />

      {/* Large rotating compass halo */}
      <div
        aria-hidden
        data-compass
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#2d8b8b]/12 pointer-events-none"
      >
        <CompassIcon size={720} />
      </div>

      {/* Parallax wave layers (below horizon) */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none overflow-hidden">
        <svg
          data-wave-3
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          className="absolute inset-x-[-10%] bottom-[55%] w-[120%] h-24 text-[#2d8b8b]/30"
        >
          <path d="M0 100 Q 180 60 360 100 T 720 100 T 1080 100 T 1440 100 L 1440 200 L 0 200 Z" fill="currentColor" />
        </svg>
        <svg
          data-wave-2
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          className="absolute inset-x-[-10%] bottom-[30%] w-[120%] h-28 text-[#2d8b8b]/45"
        >
          <path d="M0 100 Q 180 40 360 100 T 720 100 T 1080 100 T 1440 100 L 1440 200 L 0 200 Z" fill="currentColor" />
        </svg>
        <svg
          data-wave-1
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          className="absolute inset-x-[-10%] bottom-0 w-[120%] h-32 text-[#0d1620]"
        >
          <path d="M0 100 Q 180 30 360 100 T 720 100 T 1080 100 T 1440 100 L 1440 200 L 0 200 Z" fill="currentColor" />
        </svg>
      </div>

      {/* Center content */}
      <div className="relative z-10 min-h-svh flex flex-col items-center justify-center px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="inline-flex items-center gap-3 mb-8"
        >
          <div className="h-px w-12 bg-[#a8dadc]/60" />
          <span className="font-sans text-[11px] tracking-[0.45em] uppercase text-[#a8dadc] font-semibold">
            {t("heroTagline")}
          </span>
          <div className="h-px w-12 bg-[#a8dadc]/60" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="font-merienda text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#f1faee] leading-[0.95] tracking-tight max-w-4xl"
        >
          {brideFirst}
          <motion.span
            initial={{ opacity: 0, scale: 0.6, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.9 }}
            className="inline-block mx-4 md:mx-6 text-[#a8dadc]"
          >
            &amp;
          </motion.span>
          {groomFirst}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.7, delay: 1.1 }}
          className="my-8 md:my-10 w-32 h-px bg-gradient-to-r from-transparent via-[#a8dadc] to-transparent origin-center"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.3 }}
          className="font-sans text-sm md:text-base tracking-[0.3em] uppercase text-[#a8dadc] mb-2"
        >
          {formattedDate}
        </motion.p>

        {wedding.venueName && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.45 }}
            className="font-merienda text-lg md:text-xl text-[#f1faee]/75"
          >
            {wedding.venueName}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.6 }}
          className="mt-10"
        >
          <Link
            href={`${BASE}/lcv`}
            className="group inline-flex items-center gap-3 bg-[#a8dadc] text-[#0d1620] rounded-full px-10 py-4 font-sans text-xs md:text-sm font-bold tracking-[0.28em] uppercase hover:bg-[#f1faee] transition-colors duration-300"
          >
            <CompassIcon size={16} className="group-hover:rotate-90 transition-transform duration-700" />
            {t("heroCtaButton")}
          </Link>
        </motion.div>
      </div>

    </section>
  );
}
