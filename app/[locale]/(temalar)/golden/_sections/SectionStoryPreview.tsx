"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { ArrowRightIcon } from "../_icons/ArrowRightIcon";
import { SunIcon } from "../_icons/SunIcon";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const BASE = "/golden";

const milestones = [
  {
    title: "Şafak",
    subtitle: "İlk ışık, ilk karşılaşma",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=85",
    tilt: "-rotate-2",
  },
  {
    title: "Öğle",
    subtitle: "Günün en parlak saati",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=85",
    tilt: "rotate-2",
  },
  {
    title: "Altın Saat",
    subtitle: "Gün batımı, söz verme",
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=85",
    tilt: "-rotate-1",
  },
];

export function SectionStoryPreview() {
  const wedding = useWedding();
  const sectionRef = useRef<HTMLElement>(null);
  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-golden-polaroid]");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 60, rotate: 0 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            delay: i * 0.15,
            scrollTrigger: { trigger: card, start: "top 82%", toggleActions: "play none none none" },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="bg-[#d4b896]/35 py-28 md:py-36 relative overflow-hidden"
    >
      {/* Sun glow corners */}
      <div aria-hidden className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[radial-gradient(circle,_rgba(244,169,0,0.35)_0%,_rgba(244,169,0,0)_70%)] pointer-events-none" />
      <div aria-hidden className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-[radial-gradient(circle,_rgba(193,102,107,0.25)_0%,_rgba(193,102,107,0)_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="h-px w-10 bg-[#c1666b]/50" />
            <SunIcon size={16} className="text-[#f4a900]" />
            <div className="h-px w-10 bg-[#c1666b]/50" />
          </div>
          <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#c1666b] font-bold mb-3">
            {t("storyLabel")}
          </p>
          <h2 className="font-merienda text-3xl md:text-5xl text-[#4a403a]">
            {brideFirst} <span className="text-[#f4a900]">&amp;</span> {groomFirst}
          </h2>
          <p className="font-sans text-sm text-[#4a403a]/70 mt-4 max-w-md mx-auto leading-relaxed">
            {t("storyText")}
          </p>
        </motion.div>

        {/* Polaroid-like tilted cards */}
        <div className="grid md:grid-cols-3 gap-10 md:gap-8 relative">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              data-golden-polaroid
              className={`${m.tilt} relative bg-[#faf5ec] p-3 rounded-[0.5rem] shadow-[0_20px_50px_-20px_rgba(74,64,58,0.45)] hover:rotate-0 hover:shadow-[0_25px_60px_-22px_rgba(74,64,58,0.55)] transition-all duration-500 flex flex-col`}
              style={{ opacity: 0 }}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
                <Image
                  src={m.image}
                  alt={m.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-[#f4a900]/10 mix-blend-multiply" />
              </div>

              <div className="pt-5 pb-4 px-3 text-center">
                <div className="inline-flex items-center gap-1.5 mb-2">
                  <SunIcon size={11} className="text-[#f4a900]" />
                  <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-[#c1666b] font-bold">
                    0{idx + 1} · {m.title}
                  </span>
                  <SunIcon size={11} className="text-[#f4a900]" />
                </div>
                <h3 className="font-merienda text-base md:text-lg text-[#4a403a] leading-snug">
                  {m.subtitle}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-20"
        >
          <Link
            href={`${BASE}/hikayemiz`}
            className="group inline-flex items-center gap-2 font-sans text-sm tracking-[0.2em] uppercase text-[#c1666b] hover:text-[#4a403a] transition-colors font-bold"
          >
            {t("storyCtaButton")}
            <ArrowRightIcon size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
