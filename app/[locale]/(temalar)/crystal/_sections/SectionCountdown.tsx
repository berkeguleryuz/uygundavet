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

function CountdownCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-merienda text-6xl sm:text-7xl md:text-8xl text-[#1a1a2e] tabular-nums leading-none">
        {value}
      </span>
      <span className="font-chakra text-[10px] md:text-[11px] text-[#6d6a75] uppercase tracking-[0.25em] mt-3">
        {label}
      </span>
    </div>
  );
}

export function SectionCountdown() {
  const wedding = useWedding();
  const mounted = useSyncExternalStore(emptySubscribe, getMounted, getServerMounted);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(wedding.weddingDate);
    const interval = setInterval(() => setTimeLeft(computeTimeLeft(target)), 1000);
    return () => clearInterval(interval);
  }, [wedding.weddingDate]);

  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="relative py-20 md:py-28 bg-[#eee9e2] overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex items-center justify-center gap-4 sm:gap-6 md:gap-10"
          suppressHydrationWarning
        >
          {mounted ? (
            <>
              <CountdownCard value={pad(timeLeft.days)} label={t("countdownDays")} />
              <span className="text-[#b49a7c] text-lg select-none hidden sm:block">&#9671;</span>
              <CountdownCard value={pad(timeLeft.hours)} label={t("countdownHours")} />
              <span className="text-[#b49a7c] text-lg select-none hidden sm:block">&#9671;</span>
              <CountdownCard value={pad(timeLeft.minutes)} label={t("countdownMinutes")} />
              <span className="text-[#b49a7c] text-lg select-none hidden sm:block">&#9671;</span>
              <CountdownCard value={pad(timeLeft.seconds)} label={t("countdownSeconds")} />
            </>
          ) : (
            <>
              <CountdownCard value="--" label={t("countdownDays")} />
              <span className="text-[#b49a7c] text-lg select-none hidden sm:block">&#9671;</span>
              <CountdownCard value="--" label={t("countdownHours")} />
              <span className="text-[#b49a7c] text-lg select-none hidden sm:block">&#9671;</span>
              <CountdownCard value="--" label={t("countdownMinutes")} />
              <span className="text-[#b49a7c] text-lg select-none hidden sm:block">&#9671;</span>
              <CountdownCard value="--" label={t("countdownSeconds")} />
            </>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-8 text-[#a09ba6] italic font-merienda text-sm"
        >
          #{brideFirst}{groomFirst}
        </motion.p>
      </div>
    </section>
  );
}
