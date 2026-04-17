"use client";

import { useEffect, useState, useSyncExternalStore, useMemo } from "react";
import { motion } from "framer-motion";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { WaveIcon } from "../_icons/WaveIcon";
import { CompassIcon } from "../_icons/CompassIcon";

const emptySubscribe = () => () => {};
const getMounted = () => true;
const getServerMounted = () => false;

function computeTimeLeft(target: Date) {
  const diff = target.getTime() - new Date().getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function SectionCountdown() {
  const wedding = useWedding();
  const mounted = useSyncExternalStore(emptySubscribe, getMounted, getServerMounted);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  const formattedDate = useMemo(() => {
    if (!wedding.weddingDate) return "";
    const d = new Date(wedding.weddingDate);
    const months = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
    const days = ["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}, ${days[d.getDay()]}`;
  }, [wedding.weddingDate]);

  useEffect(() => {
    const target = new Date(wedding.weddingDate);
    const tick = () => setTimeLeft(computeTimeLeft(target));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [wedding.weddingDate]);

  const pad = (n: number) => String(n).padStart(2, "0");

  const items = mounted
    ? [
        { value: pad(timeLeft.days), label: t("countdownDays") },
        { value: pad(timeLeft.hours), label: t("countdownHours") },
        { value: pad(timeLeft.minutes), label: t("countdownMinutes") },
        { value: pad(timeLeft.seconds), label: t("countdownSeconds") },
      ]
    : [
        { value: "--", label: t("countdownDays") },
        { value: "--", label: t("countdownHours") },
        { value: "--", label: t("countdownMinutes") },
        { value: "--", label: t("countdownSeconds") },
      ];

  return (
    <section className="bg-[#0d1620] py-28 md:py-36 relative overflow-hidden">
      {/* Decorative compass on the left */}
      <CompassIcon size={500} className="absolute -left-48 top-1/2 -translate-y-1/2 text-[#2d8b8b]/8 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-10 bg-[#a8dadc]/40" />
            <WaveIcon size={16} className="text-[#a8dadc]" />
            <div className="h-px w-10 bg-[#a8dadc]/40" />
          </div>
          <p className="font-sans text-[11px] tracking-[0.45em] uppercase text-[#a8dadc] font-semibold mb-4">
            {t("countdownLabel")}
          </p>
          <h2 className="font-merienda text-3xl md:text-5xl text-[#f1faee] mb-2">
            {brideFirst} <span className="text-[#a8dadc]">&amp;</span> {groomFirst}
          </h2>
          <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-[#a8dadc]/70">
            {formattedDate}
          </p>
        </motion.div>

        {/* Ship compass bearing dial — 4 compass markers on arc */}
        <div className="relative" suppressHydrationWarning>
          {/* Center arc line */}
          <div aria-hidden className="absolute top-[58px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#a8dadc]/40 to-transparent" />

          <div className="grid grid-cols-4 gap-3 md:gap-6 relative">
            {items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="flex flex-col items-center"
              >
                {/* Dial marker above */}
                <div className="w-px h-5 bg-[#a8dadc]/60 mb-1" />
                <div className="w-3 h-3 rounded-full bg-[#a8dadc] border-2 border-[#0d1620] relative z-10" />
                <div className="w-px h-5 bg-[#a8dadc]/60 mb-3" />

                <div className="relative bg-[#1a2332] border border-[#a8dadc]/25 rounded-[1.25rem] w-full px-4 py-6 md:py-8 flex flex-col items-center shadow-[0_20px_50px_-20px_rgba(45,139,139,0.45)]">
                  {/* Corner ticks */}
                  <span aria-hidden className="absolute top-2 left-2 w-2 h-px bg-[#a8dadc]/50" />
                  <span aria-hidden className="absolute top-2 left-2 w-px h-2 bg-[#a8dadc]/50" />
                  <span aria-hidden className="absolute top-2 right-2 w-2 h-px bg-[#a8dadc]/50" />
                  <span aria-hidden className="absolute top-2 right-2 w-px h-2 bg-[#a8dadc]/50" />
                  <span aria-hidden className="absolute bottom-2 left-2 w-2 h-px bg-[#a8dadc]/50" />
                  <span aria-hidden className="absolute bottom-2 left-2 w-px h-2 bg-[#a8dadc]/50" />
                  <span aria-hidden className="absolute bottom-2 right-2 w-2 h-px bg-[#a8dadc]/50" />
                  <span aria-hidden className="absolute bottom-2 right-2 w-px h-2 bg-[#a8dadc]/50" />

                  <span className="font-merienda text-4xl md:text-6xl text-[#f1faee] tabular-nums leading-none">
                    {item.value}
                  </span>
                  <span className="mt-3 font-sans text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-[#a8dadc] font-semibold">
                    {item.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {wedding.venueName && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12"
          >
            <p className="font-merienda text-lg text-[#a8dadc]">{wedding.venueName}</p>
            {wedding.venueAddress && (
              <p className="font-sans text-xs text-[#f1faee]/40 mt-1 tracking-wide">
                {wedding.venueAddress}
              </p>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
