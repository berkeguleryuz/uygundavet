"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
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

const cardStyles = [
  { bg: "bg-[#b8a088]/10", accent: "text-[#b8a088]", border: "border-[#b8a088]/20" },
  { bg: "bg-[#c4a296]/10", accent: "text-[#c4a296]", border: "border-[#c4a296]/20" },
  { bg: "bg-[#a89886]/10", accent: "text-[#a89886]", border: "border-[#a89886]/20" },
  { bg: "bg-[#8a7d6d]/10", accent: "text-[#8a7d6d]", border: "border-[#8a7d6d]/20" },
];

function CountdownCard({
  value,
  label,
  style,
  index,
}: {
  value: string;
  label: string;
  style: (typeof cardStyles)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`flex flex-col items-center justify-center rounded-3xl border border-white/10 ${style.bg} px-6 py-8 md:px-10 md:py-12 min-w-[140px] md:min-w-[180px]`}
    >
      <span className="font-merienda text-6xl md:text-7xl text-white tabular-nums leading-none">
        {value}
      </span>
      <span className={`font-sans text-xs md:text-sm uppercase tracking-[0.2em] mt-4 font-medium ${style.accent}`}>
        {label}
      </span>
    </motion.div>
  );
}

export function SectionCountdown() {
  const wedding = useWedding();
  const mounted = useSyncExternalStore(emptySubscribe, getMounted, getServerMounted);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(wedding.weddingDate);
    const tick = () => setTimeLeft(computeTimeLeft(target));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [wedding.weddingDate]);

  const pad = (n: number) => String(n).padStart(2, "0");

  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

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
    <section className="bg-[#1c1917] py-24 md:py-32 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-sans text-xs md:text-sm uppercase tracking-[0.3em] text-white/30 mb-12 md:mb-16"
        >
          {t("countdownLabel")}
        </motion.p>

        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          suppressHydrationWarning
        >
          {items.map((item, i) => (
            <CountdownCard
              key={i}
              value={item.value}
              label={item.label}
              style={cardStyles[i]}
              index={i}
            />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-10 md:mt-14 font-merienda text-sm text-white/20 italic"
        >
          #{brideFirst}{groomFirst}
        </motion.p>
      </div>
    </section>
  );
}
