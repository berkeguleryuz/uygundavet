"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { HeartIcon } from "../_icons/HeartIcon";
import { MapPinIcon } from "../_icons/MapPinIcon";
import { LeafIcon } from "../_icons/LeafIcon";
import { BloomIcon } from "../_icons/BloomIcon";

const BASE = "/garden";

export function IletisimContent() {
  const wedding = useWedding();
  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  return (
    <div className="min-h-svh bg-[#e3e9d6] pt-28 pb-12 px-4 sm:px-6 relative overflow-hidden">
      <LeafIcon size={180} className="absolute -left-10 top-20 text-[#4a7c59]/15 rotate-[-20deg] pointer-events-none" />
      <LeafIcon size={160} className="absolute -right-8 bottom-20 text-[#b7472a]/15 rotate-[40deg] -scale-x-100 pointer-events-none" />

      <div className="max-w-xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <LeafIcon size={14} className="text-[#4a7c59] rotate-[-20deg]" />
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#4a7c59] font-semibold">
              {t("contactLabel")}
            </p>
            <LeafIcon size={14} className="text-[#4a7c59] rotate-[20deg] -scale-x-100" />
          </div>
          <h1 className="font-merienda text-3xl md:text-4xl text-[#2b3628]">
            {brideFirst} <span className="text-[#f9a620]">&amp;</span> {groomFirst}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-[#f5f3ed] rounded-[2rem] border border-[#4a7c59]/20 shadow-[0_20px_40px_-20px_rgba(31,42,34,0.25)] p-8 space-y-6">
            <div className="flex justify-center">
              <BloomIcon size={32} className="text-[#f9a620]" />
            </div>

            <p className="font-sans text-sm text-[#5e6b56] leading-relaxed text-center">
              {t("contactText")}
            </p>

            {wedding.venueName && (
              <div className="flex items-center gap-2.5 justify-center text-[#2b3628]/75">
                <MapPinIcon size={16} className="text-[#4a7c59]" />
                <span className="font-sans text-sm">{wedding.venueName}</span>
              </div>
            )}

            {wedding.venueAddress && (
              <p className="font-sans text-sm text-[#5e6b56]/75 text-center">
                {wedding.venueAddress}
              </p>
            )}

            <div className="h-px bg-gradient-to-r from-transparent via-[#4a7c59]/25 to-transparent" />

            <Link
              href={`${BASE}/lcv`}
              className="flex items-center justify-center gap-2 w-full h-12 rounded-2xl bg-[#4a7c59] text-[#f5f3ed] font-bold font-sans text-sm tracking-[0.1em] uppercase hover:bg-[#3a6447] transition-colors"
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
          <p className="font-sans text-[11px] text-[#2b3628]/40">
            <Link
              href="https://uygundavet.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#4a7c59] transition-colors"
            >
              Uygun Davet
            </Link>{" "}
            {t("footerCreatedWith")}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
