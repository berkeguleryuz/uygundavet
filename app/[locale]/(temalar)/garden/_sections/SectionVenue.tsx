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
import { LeafIcon } from "../_icons/LeafIcon";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const BASE = "/garden";

const TR_MONTHS = [
  "Ocak","Şubat","Mart","Nisan","Mayıs","Haziran",
  "Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık",
];

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
          { y: 30, scale: 1.05 },
          {
            y: -30,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-[#f5f3ed] py-20 md:py-28 overflow-hidden relative">
      {/* Heading */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-12 md:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <LeafIcon size={14} className="text-[#b7472a] rotate-[-20deg]" />
            <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#b7472a] font-semibold">
              {t("venueLabel")}
            </p>
            <LeafIcon size={14} className="text-[#b7472a] rotate-[20deg] -scale-x-100" />
          </div>
          <h2 className="font-merienda text-3xl md:text-4xl text-[#2b3628]">
            {wedding.venueName || t("venueLabel")}
          </h2>
        </motion.div>
      </div>

      {/* Photo + overlapping info card */}
      <div className="max-w-5xl mx-auto px-6 relative">
        <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-30px_rgba(31,42,34,0.5)]">
          <div ref={imageRef} className="absolute inset-[-10%] will-change-transform">
            <Image
              src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1400&q=85"
              alt={wedding.venueName || "Venue"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#1f2a22]/60 via-transparent to-transparent" />
        </div>

        {/* Overlapping card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative md:-mt-24 mt-6 md:mx-12 bg-[#f5f3ed] rounded-[2rem] border border-[#4a7c59]/20 shadow-[0_25px_50px_-20px_rgba(31,42,34,0.3)] p-8 md:p-10"
        >
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-8">
            {wedding.venueAddress && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#4a7c59]/15 border border-[#4a7c59]/30 flex items-center justify-center shrink-0">
                  <MapPinIcon size={16} className="text-[#4a7c59]" />
                </div>
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#5e6b56]/80 mb-1 font-semibold">
                    {t("venueAddress")}
                  </p>
                  <p className="font-sans text-sm text-[#2b3628] leading-relaxed">
                    {wedding.venueAddress}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f9a620]/15 border border-[#f9a620]/40 flex items-center justify-center shrink-0">
                <CalendarIcon size={16} className="text-[#b7472a]" />
              </div>
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#5e6b56]/80 mb-1 font-semibold">
                  {t("venueDate")}
                </p>
                <p className="font-sans text-sm text-[#2b3628]">{formattedDate}</p>
              </div>
            </div>
            {wedding.weddingTime && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#b7472a]/10 border border-[#b7472a]/30 flex items-center justify-center shrink-0">
                  <ClockIcon size={16} className="text-[#b7472a]" />
                </div>
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#5e6b56]/80 mb-1 font-semibold">
                    {t("venueTime")}
                  </p>
                  <p className="font-sans text-sm text-[#2b3628]">{wedding.weddingTime}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <Link
              href={`${BASE}/etkinlik`}
              className="group inline-flex items-center gap-2 font-sans text-xs tracking-[0.15em] uppercase text-[#f5f3ed] bg-[#4a7c59] rounded-full px-7 py-3 font-semibold hover:bg-[#3a6447] transition-colors"
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
