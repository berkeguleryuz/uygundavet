"use client";

import { motion } from "framer-motion";
import { useWedding } from "../_lib/context";
import Link from "next/link";

const TR_DAYS = [
  "Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi",
];
const TR_MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

function formatWeddingDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate()} ${TR_MONTHS[d.getMonth()]} ${d.getFullYear()}, ${TR_DAYS[d.getDay()]}`;
}

const BASE = "/lavanta";

const ease = [0.16, 1, 0.3, 1] as const;

export function SectionHero() {
  const wedding = useWedding();
  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];
  const formattedDate = formatWeddingDate(wedding.weddingDate);

  return (
    <section className="relative h-svh flex flex-col overflow-hidden bg-[#1a1817]">
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://cdn.pixabay.com/video/2024/02/18/201122-914092992_large.mp4"
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#252224]" />
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
      }} />

      <div className="absolute inset-6 sm:inset-10 md:inset-14 border border-white/[0.05] pointer-events-none" />

      <div className="absolute top-6 sm:top-10 md:top-14 left-6 sm:left-10 md:left-14 w-12 h-12">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-[#d5d1ad]/30 to-transparent" />
        <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-[#d5d1ad]/30 to-transparent" />
      </div>
      <div className="absolute top-6 sm:top-10 md:top-14 right-6 sm:right-10 md:right-14 w-12 h-12">
        <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-l from-[#d5d1ad]/30 to-transparent" />
        <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-[#d5d1ad]/30 to-transparent" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease }}
          className="mb-8 md:mb-10"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-[#d5d1ad]/20 flex items-center justify-center">
            <span className="font-merienda text-lg md:text-xl text-[#d5d1ad]/60">
              {brideFirst[0]}&{groomFirst[0]}
            </span>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-sans text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-6 md:mb-8"
        >
          Evleniyoruz
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.7, ease }}
        >
          <h1 className="font-merienda text-[2.8rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] text-white leading-[1.05] drop-shadow-2xl">
            {brideFirst}
          </h1>
          <div className="flex items-center justify-center gap-5 my-3 md:my-4">
            <div className="h-px w-10 md:w-16 bg-gradient-to-r from-transparent to-[#d5d1ad]/30" />
            <span className="font-merienda text-base md:text-lg text-[#d5d1ad]/40 italic">&</span>
            <div className="h-px w-10 md:w-16 bg-gradient-to-l from-transparent to-[#d5d1ad]/30" />
          </div>
          <h1 className="font-merienda text-[2.8rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] text-white leading-[1.05] drop-shadow-2xl">
            {groomFirst}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-8 md:mt-12 space-y-2"
        >
          <p className="font-sans text-[11px] md:text-xs tracking-[0.25em] uppercase text-white/50">
            {formattedDate}
          </p>
          {wedding.venueName && (
            <p className="font-sans text-[11px] text-white/30 tracking-wider">
              {wedding.venueName}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="mt-10 md:mt-14"
        >
          <Link
            href={`${BASE}/lcv`}
            className="group relative inline-flex items-center gap-2 font-sans text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-[#d5d1ad] px-8 py-3.5 transition-all duration-500"
          >
            <span className="absolute inset-0 border border-[#d5d1ad]/25 rounded-full group-hover:border-[#d5d1ad]/50 group-hover:scale-105 transition-all duration-500" />
            <span className="relative">Davetiyeyi Yanıtla</span>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.2 }}
        className="relative z-10 flex flex-col items-center pb-8"
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/20">Keşfet</span>
          <div className="w-px h-6 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
