"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";

const BASE = "/crystal";

const TR_DAYS = ["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"];
const TR_MONTHS = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];

function formatWeddingDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate()} ${TR_MONTHS[d.getMonth()]} ${d.getFullYear()}, ${TR_DAYS[d.getDay()]}`;
}

export function SectionHero() {
  const wedding = useWedding();
  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];
  const formattedDate = formatWeddingDate(wedding.weddingDate);
  const venueName = wedding.venueName;

  return (
    <section className="relative min-h-svh bg-[#f6f3ee] flex items-center justify-center overflow-hidden py-20 px-6">
      <div className="relative w-full max-w-5xl mx-auto">
        <div className="relative h-[500px] md:h-[600px]">
          <motion.div
            initial={{ opacity: 0, rotate: -6, y: 40 }}
            animate={{ opacity: 1, rotate: -4, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-4 left-4 md:top-8 md:left-[15%] w-[70%] md:w-[45%] h-[85%] rounded-2xl overflow-hidden shadow-xl border-4 border-white will-change-transform"
          >
            <Image
              src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&q=85"
              alt=""
              fill
              className="object-cover"
              sizes="45vw"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, rotate: 4, y: 60 }}
            animate={{ opacity: 1, rotate: 2, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-8 right-4 md:top-4 md:right-[10%] w-[75%] md:w-[50%] h-[90%] rounded-2xl overflow-hidden shadow-2xl border-4 border-white z-10 will-change-transform"
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
              src="/crystal/yuzuk.mp4"
            />
            <div className="absolute inset-0 bg-[#f6f3ee]/50 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#f6f3ee]/40 via-transparent to-[#f6f3ee]/80 pointer-events-none" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-0 left-[5%] md:left-[5%] w-[40%] md:w-[25%] aspect-square rounded-xl overflow-hidden shadow-lg border-4 border-white z-20"
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
              src="/crystal/kutu.mp4"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="relative z-30 -mt-24 md:-mt-16 text-center md:text-right md:pr-8"
        >
          <p className="font-chakra text-xs md:text-sm tracking-[0.4em] uppercase font-bold text-[#8a6a48] mb-3">
            {t("heroTagline")}
          </p>
          <h1 className="font-merienda text-4xl md:text-6xl lg:text-7xl text-[#1a1a2e] leading-[1] drop-shadow-[0_4px_30px_rgba(246,243,238,0.9)]">
            {brideFirst} & {groomFirst}
          </h1>
          <p className="font-sans text-sm text-[#6d6a75] tracking-wider mt-4">
            {formattedDate}
          </p>
          {venueName && (
            <p className="font-sans text-xs text-[#a09ba6] mt-1">{venueName}</p>
          )}
          <div className="mt-6">
            <Link
              href={`${BASE}/lcv`}
              className="inline-flex items-center justify-center font-chakra text-[10px] tracking-[0.2em] uppercase bg-[#1a1a2e] text-white rounded-full px-7 py-2.5 hover:bg-[#1a1a2e]/90 transition-colors shadow-lg"
            >
              {t("heroCtaButton")}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
