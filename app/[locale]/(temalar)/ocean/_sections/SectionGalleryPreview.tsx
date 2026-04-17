"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { t } from "../_lib/i18n";
import { ArrowRightIcon } from "../_icons/ArrowRightIcon";
import { WaveIcon } from "../_icons/WaveIcon";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const BASE = "/ocean";

const photos = [
  { url: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=85", span: "col-span-2 row-span-2", offset: "mt-0" },
  { url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=85", span: "col-span-1 row-span-1", offset: "md:mt-8" },
  { url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=85", span: "col-span-1 row-span-2", offset: "md:-mt-4" },
  { url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=85", span: "col-span-1 row-span-1", offset: "md:mt-6" },
  { url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=85", span: "col-span-2 row-span-1", offset: "md:mt-4" },
  { url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=85", span: "col-span-1 row-span-1", offset: "md:-mt-2" },
];

export function SectionGalleryPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!gridRef.current) return;
      const items = gridRef.current.querySelectorAll("[data-ocean-photo]");
      items.forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none none" },
            delay: i * 0.09,
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-[#1a2332] py-28 md:py-36 overflow-hidden relative">
      {/* Top wave divider */}
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute inset-x-0 top-0 w-full h-12 pointer-events-none">
        <path d="M0 40 Q 180 10 360 40 T 720 40 T 1080 40 T 1440 40 L 1440 0 L 0 0 Z" fill="#f1faee" />
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
            <div className="h-px w-10 bg-[#a8dadc]/40" />
            <WaveIcon size={16} className="text-[#a8dadc]" />
            <div className="h-px w-10 bg-[#a8dadc]/40" />
          </div>
          <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#a8dadc] font-bold mb-3">
            {t("galleryLabel")}
          </p>
          <h2 className="font-merienda text-3xl md:text-4xl text-[#f1faee]">
            {t("galleryHeading")}
          </h2>
        </motion.div>

        {/* Wave-offset masonry */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 auto-rows-[150px] md:auto-rows-[200px]"
        >
          {photos.map((photo, i) => (
            <div
              key={i}
              data-ocean-photo
              className={`${photo.span} ${photo.offset} relative rounded-[1.25rem] overflow-hidden group cursor-pointer shadow-[0_15px_40px_-15px_rgba(0,0,0,0.5)] border border-[#a8dadc]/15`}
              style={{ opacity: 0 }}
            >
              <Image
                src={photo.url}
                alt={`Gallery ${i + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1620]/60 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-[#2d8b8b]/0 group-hover:bg-[#2d8b8b]/20 transition-colors duration-500" />
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center mt-16"
        >
          <Link
            href={`${BASE}/galeri`}
            className="group inline-flex items-center gap-2 font-sans text-sm tracking-[0.2em] uppercase text-[#a8dadc] hover:text-[#f1faee] transition-colors font-bold"
          >
            {t("galleryCtaButton")}
            <ArrowRightIcon size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
