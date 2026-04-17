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
import { LeafIcon } from "../_icons/LeafIcon";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const BASE = "/garden";

const photos = [
  { url: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=85", span: "col-span-2 row-span-2", rotate: "rotate-[-2deg]" },
  { url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=85", span: "col-span-1 row-span-1", rotate: "rotate-[2deg]" },
  { url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=85", span: "col-span-1 row-span-2", rotate: "rotate-[-1deg]" },
  { url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=85", span: "col-span-1 row-span-1", rotate: "rotate-[1.5deg]" },
  { url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=85", span: "col-span-2 row-span-1", rotate: "rotate-[-1.5deg]" },
  { url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=85", span: "col-span-1 row-span-1", rotate: "rotate-[2deg]" },
];

export function SectionGalleryPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!gridRef.current) return;
      const items = gridRef.current.querySelectorAll("[data-garden-photo]");
      items.forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 30, scale: 0.92 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none none",
            },
            delay: i * 0.09,
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-[#f5f3ed] py-28 md:py-36 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <LeafIcon size={14} className="text-[#f9a620] rotate-[-20deg]" />
            <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#f9a620] font-semibold">
              {t("galleryLabel")}
            </p>
            <LeafIcon size={14} className="text-[#f9a620] rotate-[20deg] -scale-x-100" />
          </div>
          <h2 className="font-merienda text-3xl md:text-4xl text-[#2b3628]">
            {t("galleryHeading")}
          </h2>
        </motion.div>

        {/* Garden bed: asymmetric grid with subtle tilt */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 auto-rows-[150px] md:auto-rows-[200px]"
        >
          {photos.map((photo, i) => (
            <div
              key={i}
              data-garden-photo
              className={`${photo.span} ${photo.rotate} relative rounded-[1.5rem] overflow-hidden group cursor-pointer shadow-[0_15px_30px_-15px_rgba(31,42,34,0.35)] border-[3px] border-[#f5f3ed] hover:rotate-0 transition-transform duration-500`}
              style={{ opacity: 0 }}
            >
              <Image
                src={photo.url}
                alt={`Gallery ${i + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#4a7c59]/0 to-[#4a7c59]/0 group-hover:from-[#4a7c59]/10 group-hover:to-[#b7472a]/15 transition-colors duration-500" />
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
            className="group inline-flex items-center gap-2 font-sans text-sm tracking-[0.15em] uppercase text-[#4a7c59] hover:text-[#f9a620] transition-colors font-semibold"
          >
            {t("galleryCtaButton")}
            <ArrowRightIcon size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
