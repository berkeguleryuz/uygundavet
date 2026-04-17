"use client";

import { useEffect, useState, useSyncExternalStore, useMemo } from "react";
import { motion } from "framer-motion";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { LeafIcon } from "../_icons/LeafIcon";

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

const tileColors = [
  "bg-[#4a7c59] text-[#f5f3ed] border-[#3a6447]",
  "bg-[#f9a620] text-[#2b3628] border-[#d78e16]",
  "bg-[#b7472a] text-[#f5f3ed] border-[#953921]",
  "bg-[#8ea68a] text-[#1f2a22] border-[#7a9277]",
];

export function SectionCountdown() {
  const wedding = useWedding();
  const mounted = useSyncExternalStore(emptySubscribe, getMounted, getServerMounted);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  const formattedDate = useMemo(() => {
    if (!wedding.weddingDate) return "";
    const d = new Date(wedding.weddingDate);
    const months = [
      "Ocak","Şubat","Mart","Nisan","Mayıs","Haziran",
      "Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık",
    ];
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
    <section className="bg-[#f5f3ed] py-28 md:py-36 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#4a7c59]/25 to-transparent" />

      <div className="max-w-3xl mx-auto px-6 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <LeafIcon size={14} className="text-[#4a7c59] rotate-[-20deg]" />
            <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#4a7c59] font-semibold">
              {t("countdownLabel")}
            </p>
            <LeafIcon size={14} className="text-[#4a7c59] rotate-[20deg] -scale-x-100" />
          </div>
          <h2 className="font-merienda text-3xl md:text-4xl text-[#2b3628] mb-2">
            {brideFirst} <span className="text-[#f9a620]">&amp;</span> {groomFirst}
          </h2>
          <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-[#5e6b56]">
            {formattedDate}
          </p>
        </motion.div>

        <div
          className="grid grid-cols-4 gap-3 md:gap-5"
          suppressHydrationWarning
        >
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, rotate: -3 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="relative"
            >
              <div
                className={`${tileColors[i]} relative aspect-square md:aspect-[3/4] rounded-[1.5rem] border-[3px] flex flex-col items-center justify-center shadow-[0_12px_30px_-16px_rgba(31,42,34,0.5)]`}
              >
                {/* Leaf decoration on each tile */}
                <LeafIcon
                  size={28}
                  className="absolute top-3 right-3 opacity-25 rotate-[-20deg]"
                />
                <LeafIcon
                  size={20}
                  className="absolute bottom-3 left-3 opacity-20 rotate-[140deg]"
                />
                <span className="font-merienda text-4xl md:text-6xl tabular-nums leading-none">
                  {item.value}
                </span>
                <span className="mt-2 font-sans text-[9px] md:text-[10px] tracking-[0.2em] uppercase opacity-75">
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
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10"
          >
            <p className="font-merienda text-lg text-[#4a7c59]">{wedding.venueName}</p>
            {wedding.venueAddress && (
              <p className="font-sans text-xs text-[#5e6b56]/80 mt-1">
                {wedding.venueAddress}
              </p>
            )}
          </motion.div>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#4a7c59]/25 to-transparent" />
    </section>
  );
}
