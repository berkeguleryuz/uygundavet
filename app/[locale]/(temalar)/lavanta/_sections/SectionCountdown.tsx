"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useWedding } from "../_lib/context";
import { ScrollReveal } from "../_components/ScrollReveal";
import { CountdownUnit } from "../_components/CountdownUnit";

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
  const targetTimestamp = new Date(wedding.weddingDate).getTime();
  const [timeLeft, setTimeLeft] = useState(() =>
    computeTimeLeft(new Date(targetTimestamp))
  );

  useEffect(() => {
    const target = new Date(targetTimestamp);
    const interval = setInterval(() => setTimeLeft(computeTimeLeft(target)), 1000);
    return () => clearInterval(interval);
  }, [targetTimestamp]);

  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  return (
    <section className="relative py-28 md:py-36 bg-[#252224] overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#d5d1ad]/[0.015] blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <ScrollReveal>
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#d5d1ad]/40 mb-3">
            Geri Sayım
          </p>
          <h2 className="font-merienda text-2xl md:text-3xl text-[#d5d1ad]/80">
            Büyük Gün Yaklaşıyor
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="mt-14 md:mt-16">
            <div className="grid grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full max-w-lg mx-auto">
              {[
                { value: timeLeft.days, label: "Gün" },
                { value: timeLeft.hours, label: "Saat" },
                { value: timeLeft.minutes, label: "Dakika" },
                { value: timeLeft.seconds, label: "Saniye" },
              ].map((unit, i) => (
                <motion.div
                  key={unit.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                  className="relative bg-white/[0.03] border border-white/[0.06] rounded-2xl py-5 md:py-7"
                >
                  <CountdownUnit value={unit.value} label={unit.label} />
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <p className="font-merienda text-sm text-white/10 mt-12 italic">
            #{brideFirst}Ve{groomFirst}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
