"use client";

import { useRef, useState, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { ChevronDownIcon } from "../_icons/ChevronDownIcon";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const BASE = "/pearl";

const TR_DAYS = ["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"];
const TR_MONTHS = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];

function formatWeddingDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate()} ${TR_MONTHS[d.getMonth()]} ${d.getFullYear()}, ${TR_DAYS[d.getDay()]}`;
}

function playChime() {
  try {
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now + i * 0.15);
      gain.gain.linearRampToValueAtTime(0.12, now + i * 0.15 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 1.2);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 1.5);
    });
    setTimeout(() => ctx.close(), 3000);
  } catch { /* audio not supported */ }
}

export function SectionHero() {
  const wedding = useWedding();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const [videoEnded, setVideoEnded] = useState(false);

  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];
  const formattedDate = formatWeddingDate(wedding.weddingDate);

  const handleVideoEnd = useCallback(() => {
    setVideoEnded(true);
    playChime();
  }, []);

  useGSAP(() => {
    if (videoRef.current) {
      gsap.to(videoRef.current, {
        y: -80,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-svh bg-[#f7f4ef] overflow-hidden flex items-center"
    >
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-20 md:py-0">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 lg:gap-16">
          <div className="flex-1 flex flex-col items-start justify-center order-2 md:order-1 md:py-24 lg:py-32">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-sans text-sm md:text-base tracking-[0.2em] uppercase text-[#b8a088] mb-4 md:mb-6 font-medium"
            >
              {t("heroTagline")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1>
                <span className="block font-merienda text-6xl md:text-8xl lg:text-9xl leading-[0.85] text-[#1c1917]">
                  {brideFirst}
                </span>
                <span className="block font-merienda text-6xl md:text-8xl lg:text-9xl leading-[0.85] text-[#b8a088]">
                  {groomFirst}
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="font-sans text-sm md:text-base text-[#1c1917]/60 mt-6 md:mt-8 tracking-wide"
            >
              {formattedDate}
              {wedding.venueName && (
                <span className="text-[#1c1917]/40"> &middot; {wedding.venueName}</span>
              )}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mt-8 md:mt-10"
            >
              <Link
                href={`${BASE}/lcv`}
                className="inline-flex items-center justify-center font-sans text-sm md:text-base font-medium tracking-wide bg-gradient-to-r from-[#b8a088] to-[#c4a296] text-white rounded-full px-8 py-3.5 md:px-10 md:py-4 hover:shadow-lg hover:shadow-[#b8a088]/25 transition-all duration-300"
              >
                {t("heroCtaButton")}
              </Link>
            </motion.div>
          </div>

          <motion.div
            ref={videoRef}
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative order-1 md:order-2 w-full md:w-[45%] lg:w-[40%] shrink-0 md:mt-16 lg:mt-12 will-change-transform"
          >
            <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl shadow-[#b8a088]/20 border-4 border-white">
              <video
                autoPlay
                muted
                playsInline
                preload="auto"
                onEnded={handleVideoEnd}
                className="absolute inset-0 w-full h-full object-cover"
                src="/tuanaates.mp4"
              />
              <AnimatePresence>
                {videoEnded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute inset-0 bg-[#1c1917]/80 backdrop-blur-sm flex flex-col items-center justify-center text-center px-6"
                  >
                    <motion.p
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="font-sans text-xs tracking-[0.4em] uppercase text-[#b8a088] mb-3"
                    >
                      {brideFirst} & {groomFirst}
                    </motion.p>
                    <motion.h2
                      initial={{ opacity: 0, y: 30, scale: 0.85 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="font-merienda text-3xl md:text-5xl text-white leading-[1.1]"
                    >
                      Save<br />the Date
                    </motion.h2>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: 1.2 }}
                      className="w-16 h-px bg-[#b8a088] my-4"
                    />
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 1.5 }}
                      className="font-sans text-sm tracking-[0.15em] text-white/70"
                    >
                      {formattedDate}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-to-br from-[#b8a088]/20 via-[#c4a296]/15 to-[#8a7d6d]/10 blur-2xl" />
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDownIcon size={20} className="text-[#1c1917]/25" />
        </motion.div>
      </motion.div>
    </section>
  );
}
