"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { HeartIcon } from "../_icons/HeartIcon";
import { MapPinIcon } from "../_icons/MapPinIcon";
import { SunIcon } from "../_icons/SunIcon";
import { HaloIcon } from "../_icons/HaloIcon";

const BASE = "/golden";

export function IletisimContent() {
  const wedding = useWedding();
  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  return (
    <div className="min-h-svh bg-[#d4b896]/30 pt-28 pb-12 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="h-px w-10 bg-[#c1666b]/50" />
            <SunIcon size={16} className="text-[#f4a900]" />
            <div className="h-px w-10 bg-[#c1666b]/50" />
          </div>
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#c1666b] font-bold mb-3">
            {t("contactLabel")}
          </p>
          <h1 className="font-merienda text-3xl md:text-4xl text-[#4a403a]">
            {brideFirst} <span className="text-[#f4a900]">&amp;</span> {groomFirst}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-[#faf5ec] rounded-[1.75rem] border-[3px] border-[#f4a900]/40 shadow-[0_25px_50px_-20px_rgba(74,64,58,0.3)] p-8 space-y-6 relative overflow-hidden">
            <HaloIcon size={200} className="absolute -right-6 -top-6 text-[#f4a900]/12 pointer-events-none" />

            <div className="flex justify-center relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#f4a900] to-[#c1666b] shadow-lg flex items-center justify-center">
                <SunIcon size={28} className="text-[#faf5ec]" />
              </div>
            </div>

            <p className="font-sans text-sm text-[#4a403a]/75 leading-relaxed text-center relative">
              {t("contactText")}
            </p>

            {wedding.venueName && (
              <div className="flex items-center gap-2.5 justify-center text-[#4a403a]/85 relative">
                <MapPinIcon size={16} className="text-[#c1666b]" />
                <span className="font-sans text-sm">{wedding.venueName}</span>
              </div>
            )}

            {wedding.venueAddress && (
              <p className="font-sans text-sm text-[#4a403a]/60 text-center relative">
                {wedding.venueAddress}
              </p>
            )}

            <div className="h-px bg-gradient-to-r from-transparent via-[#c1666b]/30 to-transparent relative" />

            <Link
              href={`${BASE}/lcv`}
              className="relative flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-[#4a403a] text-[#faf5ec] font-bold font-sans text-sm tracking-[0.15em] uppercase hover:bg-[#c1666b] transition-colors"
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
          <p className="font-sans text-[11px] text-[#4a403a]/40">
            <Link href="https://uygundavet.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#c1666b] transition-colors">
              Uygun Davet
            </Link>{" "}
            {t("footerCreatedWith")}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
