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
import { MapPinIcon } from "../_icons/MapPinIcon";
import { CalendarIcon } from "../_icons/CalendarIcon";
import { ClockIcon } from "../_icons/ClockIcon";
import { ArrowRightIcon } from "../_icons/ArrowRightIcon";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const BASE = "/pearl";

const TR_MONTHS = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate()} ${TR_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function SectionVenuePreview() {
  const wedding = useWedding();
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { scale: 1.08 },
        {
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
  }, { scope: sectionRef });

  const infoItems = useMemo(() => [
    ...(wedding.venueAddress
      ? [{
          icon: <MapPinIcon size={20} className="text-[#b8a088]" />,
          label: t("venueAddress"),
          value: wedding.venueAddress,
          bg: "bg-[#b8a088]/10",
        }]
      : []),
    {
      icon: <CalendarIcon size={20} className="text-[#c4a296]" />,
      label: t("venueDate"),
      value: formatDate(wedding.weddingDate),
      bg: "bg-[#c4a296]/10",
    },
    ...(wedding.weddingTime
      ? [{
          icon: <ClockIcon size={20} className="text-[#a89886]" />,
          label: t("venueTime"),
          value: wedding.weddingTime,
          bg: "bg-[#a89886]/10",
        }]
      : []),
  ], [wedding.venueAddress, wedding.weddingDate, wedding.weddingTime]);

  return (
    <section ref={sectionRef} className="bg-[#1c1917] py-24 md:py-32 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-sans text-xs uppercase tracking-[0.3em] text-white/30 mb-10 md:mb-14"
        >
          {t("venueLabel")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden mb-12 md:mb-16"
        >
          <div ref={imageRef} className="relative aspect-[16/9] md:aspect-[2/1] will-change-transform">
            <Image
              src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1800&q=85"
              alt={wedding.venueName || "Venue"}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917]/80 via-transparent to-transparent flex items-end p-6 md:p-10">
            <h3 className="font-merienda text-2xl md:text-4xl text-white">
              {wedding.venueName || t("venueLabel")}
            </h3>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 md:gap-6">
          {infoItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center flex-1 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8"
            >
              <div className={`w-12 h-12 rounded-full ${item.bg} flex items-center justify-center mb-4`}>
                {item.icon}
              </div>
              <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-white/40 mb-2">
                {item.label}
              </p>
              <p className="font-sans text-sm md:text-base text-white/80 leading-relaxed">
                {item.value}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12 md:mt-16"
        >
          <Link
            href={`${BASE}/etkinlik`}
            className="group inline-flex items-center gap-2 font-sans text-sm tracking-[0.15em] uppercase text-white/50 hover:text-[#b8a088] transition-colors duration-300 font-medium"
          >
            {t("venueCtaButton")}
            <ArrowRightIcon
              size={16}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
