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
import { WaveIcon } from "../_icons/WaveIcon";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const BASE = "/ocean";

const milestones = [
  {
    title: "Liman",
    subtitle: "İlk durak, tanışma",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=85",
  },
  {
    title: "Açık Deniz",
    subtitle: "Birlikte yol alma",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=85",
  },
  {
    title: "Pusula",
    subtitle: "Rotanın belirlendiği gün",
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=85",
  },
];

export function SectionStoryPreview() {
  const wedding = useWedding();
  const sectionRef = useRef<HTMLElement>(null);
  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-ocean-story]");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: i * 0.1,
            scrollTrigger: { trigger: card, start: "top 80%", toggleActions: "play none none none" },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-[#f1faee] py-28 md:py-36 relative overflow-hidden">
      {/* Subtle wave field top & bottom */}
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute inset-x-0 top-0 w-full h-16 opacity-25 pointer-events-none">
        <path d="M0 40 Q 180 10 360 40 T 720 40 T 1080 40 T 1440 40 L 1440 0 L 0 0 Z" fill="#2d8b8b" />
      </svg>

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="h-px w-10 bg-[#2d8b8b]/50" />
            <WaveIcon size={16} className="text-[#2d8b8b]" />
            <div className="h-px w-10 bg-[#2d8b8b]/50" />
          </div>
          <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#2d8b8b] font-bold mb-3">
            {t("storyLabel")}
          </p>
          <h2 className="font-merienda text-3xl md:text-4xl text-[#1a2332]">
            {brideFirst} <span className="text-[#2d8b8b]">&amp;</span> {groomFirst}
          </h2>
          <p className="font-sans text-sm text-[#3d5763] mt-4 max-w-md mx-auto leading-relaxed">
            {t("storyText")}
          </p>
        </motion.div>

        {/* Horizontal route timeline */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-6 relative">
          {/* Connecting wave path (desktop) */}
          <svg
            viewBox="0 0 1000 40"
            preserveAspectRatio="none"
            className="hidden md:block absolute top-[140px] left-[12%] right-[12%] w-[76%] h-8 pointer-events-none"
          >
            <path
              d="M10 20 Q 125 0 250 20 T 500 20 T 750 20 T 990 20"
              stroke="#2d8b8b"
              strokeWidth="1.5"
              strokeDasharray="4 5"
              fill="none"
              opacity="0.55"
            />
          </svg>

          {milestones.map((m, idx) => (
            <div
              key={idx}
              data-ocean-story
              className="relative flex flex-col items-center text-center px-2"
              style={{ opacity: 0 }}
            >
              <div className="relative w-full aspect-[4/5] max-w-[260px] rounded-[1.5rem] overflow-hidden shadow-[0_20px_45px_-20px_rgba(26,35,50,0.35)] border-4 border-[#f1faee]">
                <Image
                  src={m.image}
                  alt={m.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 260px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1620]/40 to-transparent" />
              </div>

              {/* Node marker on route */}
              <div className="relative mt-6 mb-4 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-[#2d8b8b] border-4 border-[#f1faee] shadow-[0_0_0_3px_rgba(45,139,139,0.25)]" />
              </div>

              <span className="font-sans text-[10px] tracking-[0.35em] uppercase text-[#2d8b8b] font-bold mb-2">
                0{idx + 1} · {m.title}
              </span>
              <h3 className="font-merienda text-xl md:text-2xl text-[#1a2332]">
                {m.subtitle}
              </h3>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-16"
        >
          <Link
            href={`${BASE}/hikayemiz`}
            className="group inline-flex items-center gap-2 font-sans text-sm tracking-[0.2em] uppercase text-[#2d8b8b] hover:text-[#1a2332] transition-colors font-bold"
          >
            {t("storyCtaButton")}
            <ArrowRightIcon size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
