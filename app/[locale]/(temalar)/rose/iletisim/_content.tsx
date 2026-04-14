"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { HeartIcon } from "../_icons/HeartIcon";
import { MapPinIcon } from "../_icons/MapPinIcon";

const BASE = "/rose";

export function IletisimContent() {
  const wedding = useWedding();
  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  return (
    <div className="min-h-svh bg-[#f5ebe4] pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <p className="font-sans text-xs tracking-[0.2em] uppercase text-[#c75050] mb-3">
            {t("contactLabel")}
          </p>
          <h1 className="font-merienda text-3xl md:text-4xl bg-gradient-to-r from-[#c75050] to-[#d4898a] bg-clip-text text-transparent">
            {brideFirst} & {groomFirst}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-white rounded-3xl border border-[#1a1210]/[0.06] shadow-sm p-8 space-y-6">
            <p className="font-sans text-sm text-[#1a1210]/60 leading-relaxed text-center">
              {t("contactText")}
            </p>

            {wedding.venueName && (
              <div className="flex items-center gap-2.5 justify-center text-[#1a1210]/60">
                <MapPinIcon className="size-4 text-[#c75050]" size={16} />
                <span className="font-sans text-sm">{wedding.venueName}</span>
              </div>
            )}

            {wedding.venueAddress && (
              <p className="font-sans text-sm text-[#1a1210]/40 text-center">
                {wedding.venueAddress}
              </p>
            )}

            <div className="h-px bg-[#1a1210]/[0.06]" />

            <Link
              href={`${BASE}/lcv`}
              className="flex items-center justify-center gap-2 w-full h-12 rounded-2xl bg-gradient-to-r from-[#c75050] to-[#d4898a] text-white font-sans font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <HeartIcon className="size-4" size={16} />
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
          <p className="font-sans text-[11px] text-[#1a1210]/30">
            <Link
              href="https://uygundavet.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#1a1210]/50 transition-colors"
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
