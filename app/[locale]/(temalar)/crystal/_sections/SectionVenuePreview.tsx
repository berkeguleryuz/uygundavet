"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { MapPinIcon } from "../_icons/MapPinIcon";
import { CalendarIcon } from "../_icons/CalendarIcon";
import { ClockIcon } from "../_icons/ClockIcon";
import { ArrowRightIcon } from "../_icons/ArrowRightIcon";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const BASE = "/crystal";

const TR_MONTHS = [
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

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate()} ${TR_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function SectionVenuePreview() {
  const wedding = useWedding();
  const imageRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const image = imageRef.current;
    if (image) {
      gsap.fromTo(
        image,
        { scale: 1 },
        {
          scale: 1.05,
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
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden"
    >
      {/* Full-bleed background image */}
      <div
        ref={imageRef}
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1800&q=85"
          alt={wedding.venueName || "Venue"}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Light overlay */}
      <div className="absolute inset-0 bg-[#f6f3ee]/60" />

      {/* Floating info card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-8 md:p-12 max-w-md mx-6 my-16"
      >
        {/* Venue name */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-merienda text-2xl text-[#1a1a2e] mb-8 text-center"
        >
          {wedding.venueName || t("venueLabel")}
        </motion.h2>

        {/* Info rows */}
        <div className="space-y-5">
          {wedding.venueAddress && (
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-[#b49a7c]/10 flex items-center justify-center shrink-0 mt-0.5">
                <MapPinIcon size={15} className="text-[#b49a7c]" />
              </div>
              <div>
                <p className="font-sans text-[10px] text-[#a09ba6] uppercase tracking-[0.2em] mb-1">
                  {t("venueAddress")}
                </p>
                <p className="font-sans text-sm text-[#1a1a2e] leading-relaxed">
                  {wedding.venueAddress}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-full bg-[#b49a7c]/10 flex items-center justify-center shrink-0 mt-0.5">
              <CalendarIcon size={15} className="text-[#b49a7c]" />
            </div>
            <div>
              <p className="font-sans text-[10px] text-[#a09ba6] uppercase tracking-[0.2em] mb-1">
                {t("venueDate")}
              </p>
              <p className="font-sans text-sm text-[#1a1a2e]">
                {formatDate(wedding.weddingDate)}
              </p>
            </div>
          </div>

          {wedding.weddingTime && (
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-[#b49a7c]/10 flex items-center justify-center shrink-0 mt-0.5">
                <ClockIcon size={15} className="text-[#b49a7c]" />
              </div>
              <div>
                <p className="font-sans text-[10px] text-[#a09ba6] uppercase tracking-[0.2em] mb-1">
                  {t("venueTime")}
                </p>
                <p className="font-sans text-sm text-[#1a1a2e]">
                  {wedding.weddingTime}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-[#1a1a2e]/[0.06] my-7" />

        {/* CTA link */}
        <div className="text-center">
          <Link
            href={`${BASE}/etkinlik`}
            className="group inline-flex items-center gap-2 font-chakra text-[11px] tracking-[0.2em] uppercase text-[#1a1a2e] hover:text-[#b49a7c] transition-colors duration-300"
          >
            {t("venueCtaButton")}
            <ArrowRightIcon
              size={14}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
