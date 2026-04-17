"use client";

import { useEffect, useState, useSyncExternalStore, useMemo } from "react";
import { motion } from "framer-motion";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { SunIcon } from "../_icons/SunIcon";
import { HaloIcon } from "../_icons/HaloIcon";

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
    <section className="bg-[#faf5ec] py-28 md:py-36 relative overflow-hidden">

      <div className="max-w-4xl mx-auto px-6 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-10 bg-[#c1666b]/50" />
            <SunIcon size={16} className="text-[#f4a900]" />
            <div className="h-px w-10 bg-[#c1666b]/50" />
          </div>
          <p className="font-sans text-[11px] tracking-[0.45em] uppercase text-[#c1666b] font-bold mb-4">
            {t("countdownLabel")}
          </p>
          <h2 className="font-merienda text-3xl md:text-5xl text-[#4a403a] mb-2">
            {brideFirst} <span className="text-[#f4a900]">&amp;</span> {groomFirst}
          </h2>
          <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-[#8a7560]">
            {formattedDate}
          </p>
        </motion.div>

        {/* Clockface-style arc of tiles */}
        <div className="grid grid-cols-4 gap-3 md:gap-5 relative" suppressHydrationWarning>
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="relative"
            >
              {/* Halo rings behind each tile */}
              <HaloIcon
                size={140}
                className="absolute inset-0 m-auto text-[#f4a900]/15 pointer-events-none"
              />

              <div className="relative bg-[#4a403a] text-[#faf5ec] border-[3px] border-[#f4a900]/40 rounded-[1.5rem] px-3 py-6 md:py-8 flex flex-col items-center shadow-[0_20px_50px_-20px_rgba(74,64,58,0.45)] overflow-hidden">
                {/* Inner radial sun */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,169,0,0.25)_0%,_rgba(244,169,0,0)_60%)] pointer-events-none"
                />
                <SunIcon
                  size={22}
                  className="absolute top-3 right-3 text-[#f4a900]/50"
                />
                <span className="relative font-merienda text-4xl md:text-6xl text-[#f4a900] tabular-nums leading-none">
                  {item.value}
                </span>
                <span className="relative mt-3 font-sans text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-[#d4b896] font-bold">
                  {item.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {wedding.venueName && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12"
          >
            <p className="font-merienda text-lg text-[#c1666b]">{wedding.venueName}</p>
            {wedding.venueAddress && (
              <p className="font-sans text-xs text-[#8a7560] mt-1 tracking-wide">
                {wedding.venueAddress}
              </p>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
