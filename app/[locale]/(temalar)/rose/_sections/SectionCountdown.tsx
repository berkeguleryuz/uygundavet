"use client";

import { useEffect, useState, useSyncExternalStore, useMemo } from "react";
import { motion } from "framer-motion";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";

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
  const mounted = useSyncExternalStore(
    emptySubscribe,
    getMounted,
    getServerMounted,
  );
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  const formattedDate = useMemo(() => {
    if (!wedding.weddingDate) return "";
    const d = new Date(wedding.weddingDate);
    const months = [
      "Ocak",
      "Şubat",
      "Mart",
      "Nisan",
      "Mayıs",
      "Haziran",
      "Temmuz",
      "Ağustos",
      "Eylül",
      "Ekim",
      "Kasım",
      "Aralık",
    ];
    const days = [
      "Pazar",
      "Pazartesi",
      "Salı",
      "Çarşamba",
      "Perşembe",
      "Cuma",
      "Cumartesi",
    ];
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
    <section className="bg-white py-28 md:py-36">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="border border-[#1a1210]/10 rounded-sm p-10 md:p-16 text-center relative"
        >
          {/* Corner decorations — thin L-shaped lines */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-[#c9a96e]/40" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-[#c9a96e]/40" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-[#c9a96e]/40" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-[#c9a96e]/40" />

          {/* Couple names */}
          <p className="font-merienda text-3xl md:text-4xl text-[#1a1210] mb-2">
            {brideFirst} <span className="text-[#c9a96e]">&amp;</span>{" "}
            {groomFirst}
          </p>

          {/* Date */}
          <p className="font-sans text-xs tracking-[0.2em] uppercase text-[#6b6560] mb-10">
            {formattedDate}
          </p>

          {/* Thin separator */}
          <div className="w-12 h-px bg-[#c75050]/30 mx-auto mb-10" />

          {/* Countdown in one horizontal row */}
          <div
            className="flex items-center justify-center gap-6 md:gap-10"
            suppressHydrationWarning
          >
            {items.map((item, i) => (
              <div key={i} className="text-center">
                <span className="block font-merienda text-3xl md:text-4xl text-[#c75050] tabular-nums">
                  {item.value}
                </span>
                <span className="block font-sans text-[10px] md:text-xs uppercase tracking-[0.15em] text-[#6b6560] mt-2">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Venue info below countdown */}
          {wedding.venueName && (
            <>
              <div className="w-12 h-px bg-[#c75050]/30 mx-auto my-10" />
              <p className="font-sans text-sm text-[#6b6560]">
                {wedding.venueName}
              </p>
              {wedding.venueAddress && (
                <p className="font-sans text-xs text-[#6b6560]/60 mt-1">
                  {wedding.venueAddress}
                </p>
              )}
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
