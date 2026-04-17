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
import { WaveIcon } from "../_icons/WaveIcon";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const BASE = "/ocean";

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
            y: -40,
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
    <section ref={sectionRef} className="bg-[#0d1620] overflow-hidden relative">
      <div className="flex flex-col md:flex-row min-h-[620px] md:min-h-[720px]">
        {/* Left: Image with teal tint */}
        <div className="md:w-3/5 relative min-h-[360px] md:min-h-0 overflow-hidden">
          <div ref={imageRef} className="absolute inset-[-10%] will-change-transform">
            <Image
              src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1400&q=85"
              alt={wedding.venueName || "Venue"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d1620]/60 via-transparent to-[#0d1620]/30" />
          <div className="absolute inset-0 bg-[#2d8b8b]/15 mix-blend-multiply" />
        </div>

        {/* Right: Dark info panel with lighthouse-style teal accent */}
        <div className="md:w-2/5 bg-[#0d1620] relative px-8 md:px-14 py-20 md:py-0 flex items-center overflow-hidden">
          {/* Teal spotlight gradient */}
          <div aria-hidden className="absolute top-0 -left-32 w-64 h-64 bg-[#2d8b8b]/35 rounded-full blur-3xl pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative w-full"
          >
            <div className="inline-flex items-center gap-2 mb-6">
              <WaveIcon size={14} className="text-[#a8dadc]" />
              <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#a8dadc] font-bold">
                {t("venueLabel")}
              </p>
            </div>
            <h2 className="font-merienda text-3xl md:text-4xl text-[#f1faee] mb-8 leading-tight">
              {wedding.venueName || t("venueLabel")}
            </h2>

            <div className="space-y-5 mb-10">
              {wedding.venueAddress && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2d8b8b]/20 border border-[#a8dadc]/25 flex items-center justify-center shrink-0">
                    <MapPinIcon size={16} className="text-[#a8dadc]" />
                  </div>
                  <div>
                    <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#a8dadc]/70 mb-1 font-semibold">
                      {t("venueAddress")}
                    </p>
                    <p className="font-sans text-sm text-[#f1faee]/80 leading-relaxed">
                      {wedding.venueAddress}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2d8b8b]/20 border border-[#a8dadc]/25 flex items-center justify-center shrink-0">
                  <CalendarIcon size={16} className="text-[#a8dadc]" />
                </div>
                <div>
                  <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#a8dadc]/70 mb-1 font-semibold">
                    {t("venueDate")}
                  </p>
                  <p className="font-sans text-sm text-[#f1faee]/80">{formattedDate}</p>
                </div>
              </div>
              {wedding.weddingTime && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2d8b8b]/20 border border-[#a8dadc]/25 flex items-center justify-center shrink-0">
                    <ClockIcon size={16} className="text-[#a8dadc]" />
                  </div>
                  <div>
                    <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#a8dadc]/70 mb-1 font-semibold">
                      {t("venueTime")}
                    </p>
                    <p className="font-sans text-sm text-[#f1faee]/80">{wedding.weddingTime}</p>
                  </div>
                </div>
              )}
            </div>

            <Link
              href={`${BASE}/etkinlik`}
              className="group inline-flex items-center gap-2 font-sans text-xs tracking-[0.2em] uppercase text-[#0d1620] bg-[#a8dadc] rounded-full px-7 py-3 font-bold hover:bg-[#f1faee] transition-colors"
            >
              {t("venueCtaButton")}
              <ArrowRightIcon size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
