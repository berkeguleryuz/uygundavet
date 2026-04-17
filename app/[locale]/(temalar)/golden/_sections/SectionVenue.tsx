"use client";

import { useRef, useMemo } from "react";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { ArrowRightIcon } from "../_icons/ArrowRightIcon";
import { MapPinIcon } from "../_icons/MapPinIcon";
import { CalendarIcon } from "../_icons/CalendarIcon";
import { ClockIcon } from "../_icons/ClockIcon";
import { SunIcon } from "../_icons/SunIcon";
import { HaloIcon } from "../_icons/HaloIcon";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const BASE = "/golden";

const TR_MONTHS = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];

export function SectionVenue() {
  const wedding = useWedding();
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const formattedDate = useMemo(() => {
    if (!wedding.weddingDate) return "";
    const d = new Date(wedding.weddingDate);
    return `${d.getDate()} ${TR_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  }, [wedding.weddingDate]);

  useGSAP(
    () => {
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { y: 40, scale: 1.1 },
          {
            y: -30,
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-[#faf5ec] py-20 md:py-28 relative overflow-hidden">
      <div aria-hidden className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,_rgba(244,169,0,0.25)_0%,_rgba(244,169,0,0)_70%)] pointer-events-none" />

      {/* Heading */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-12 md:mb-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="h-px w-10 bg-[#f4a900]/50" />
            <SunIcon size={16} className="text-[#f4a900]" />
            <div className="h-px w-10 bg-[#f4a900]/50" />
          </div>
          <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#f4a900] font-bold mb-3">
            {t("venueLabel")}
          </p>
          <h2 className="font-merienda text-3xl md:text-4xl text-[#4a403a]">
            {wedding.venueName || t("venueLabel")}
          </h2>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative">
        {/* Image with golden vignette halo */}
        <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-25px_rgba(74,64,58,0.5)]">
          <div ref={imageRef} className="absolute inset-[-10%] will-change-transform">
            <Image
              src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1400&q=85"
              alt={wedding.venueName || "Venue"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80vw"
            />
          </div>
          {/* Warm golden hour tint */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#f4a900]/20 via-transparent to-[#c1666b]/30 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#4a403a]/50 via-transparent to-transparent" />
        </div>

        {/* Overlapping card with seal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative md:-mt-24 mt-6 md:mx-12 bg-[#faf5ec] rounded-[2rem] border-[3px] border-[#f4a900]/40 shadow-[0_25px_60px_-20px_rgba(74,64,58,0.4)] p-8 md:p-10 overflow-hidden"
        >
          {/* Wax seal corner */}
          <div
            aria-hidden
            className="absolute -top-5 -right-5 w-20 h-20 rounded-full bg-gradient-to-br from-[#c1666b] to-[#8a3e43] shadow-lg flex items-center justify-center rotate-12"
          >
            <SunIcon size={28} className="text-[#f4a900] -rotate-12" />
          </div>
          <HaloIcon size={220} className="absolute -bottom-10 -left-10 text-[#f4a900]/10 pointer-events-none" />

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-8 relative">
            {wedding.venueAddress && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#c1666b]/15 border border-[#c1666b]/35 flex items-center justify-center shrink-0">
                  <MapPinIcon size={16} className="text-[#c1666b]" />
                </div>
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#c1666b] mb-1 font-bold">
                    {t("venueAddress")}
                  </p>
                  <p className="font-sans text-sm text-[#4a403a] leading-relaxed">
                    {wedding.venueAddress}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f4a900]/15 border border-[#f4a900]/40 flex items-center justify-center shrink-0">
                <CalendarIcon size={16} className="text-[#f4a900]" />
              </div>
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#c1666b] mb-1 font-bold">
                  {t("venueDate")}
                </p>
                <p className="font-sans text-sm text-[#4a403a]">{formattedDate}</p>
              </div>
            </div>
            {wedding.weddingTime && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#8a7560]/15 border border-[#8a7560]/35 flex items-center justify-center shrink-0">
                  <ClockIcon size={16} className="text-[#8a7560]" />
                </div>
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#c1666b] mb-1 font-bold">
                    {t("venueTime")}
                  </p>
                  <p className="font-sans text-sm text-[#4a403a]">{wedding.weddingTime}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center relative">
            <Link
              href={`${BASE}/etkinlik`}
              className="group inline-flex items-center gap-2 font-sans text-xs tracking-[0.18em] uppercase text-[#faf5ec] bg-[#4a403a] rounded-full px-7 py-3 font-bold hover:bg-[#c1666b] transition-colors"
            >
              {t("venueCtaButton")}
              <ArrowRightIcon size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
