"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { HeartIcon } from "../_icons/HeartIcon";
import { MapPinIcon } from "../_icons/MapPinIcon";
import { WaveIcon } from "../_icons/WaveIcon";
import { CompassIcon } from "../_icons/CompassIcon";

const BASE = "/ocean";

export function IletisimContent() {
  const wedding = useWedding();
  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  return (
    <div className="min-h-svh bg-[#f1faee] pt-28 pb-12 px-4 sm:px-6 relative overflow-hidden" data-section-light>
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="absolute inset-x-0 top-20 w-full h-10 opacity-35 pointer-events-none">
        <path d="M0 30 Q 180 0 360 30 T 720 30 T 1080 30 T 1440 30" stroke="#2d8b8b" strokeWidth="1.5" fill="none" />
      </svg>

      <div className="max-w-xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="h-px w-10 bg-[#2d8b8b]/50" />
            <WaveIcon size={16} className="text-[#2d8b8b]" />
            <div className="h-px w-10 bg-[#2d8b8b]/50" />
          </div>
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#2d8b8b] font-bold mb-3">
            {t("contactLabel")}
          </p>
          <h1 className="font-merienda text-3xl md:text-4xl text-[#1a2332]">
            {brideFirst} <span className="text-[#2d8b8b]">&amp;</span> {groomFirst}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-white rounded-[1.75rem] border border-[#2d8b8b]/20 shadow-[0_20px_45px_-20px_rgba(26,35,50,0.2)] p-8 space-y-6">
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-full bg-[#2d8b8b]/15 border border-[#2d8b8b]/30 flex items-center justify-center">
                <CompassIcon size={28} className="text-[#2d8b8b]" />
              </div>
            </div>

            <p className="font-sans text-sm text-[#3d5763] leading-relaxed text-center">
              {t("contactText")}
            </p>

            {wedding.venueName && (
              <div className="flex items-center gap-2.5 justify-center text-[#1a2332]/80">
                <MapPinIcon size={16} className="text-[#2d8b8b]" />
                <span className="font-sans text-sm">{wedding.venueName}</span>
              </div>
            )}

            {wedding.venueAddress && (
              <p className="font-sans text-sm text-[#3d5763]/80 text-center">
                {wedding.venueAddress}
              </p>
            )}

            <div className="h-px bg-gradient-to-r from-transparent via-[#2d8b8b]/25 to-transparent" />

            <Link
              href={`${BASE}/lcv`}
              className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-[#1a2332] text-[#f1faee] font-bold font-sans text-sm tracking-[0.15em] uppercase hover:bg-[#2d8b8b] transition-colors"
            >
              <HeartIcon size={16} />
              {t("contactCtaButton")}
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <p className="font-sans text-[11px] text-[#1a2332]/40">
            <Link href="https://uygundavet.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#2d8b8b] transition-colors">
              Uygun Davet
            </Link>{" "}
            {t("footerCreatedWith")}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
