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
import { SunIcon } from "../_icons/SunIcon";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const BASE = "/golden";

const photos = [
  { url: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=85", span: "col-span-2 row-span-2", tilt: "-rotate-[3deg]" },
  { url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=85", span: "col-span-1 row-span-1", tilt: "rotate-[4deg]" },
  { url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=85", span: "col-span-1 row-span-2", tilt: "-rotate-[2deg]" },
  { url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=85", span: "col-span-1 row-span-1", tilt: "rotate-[3deg]" },
  { url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=85", span: "col-span-2 row-span-1", tilt: "-rotate-[2deg]" },
  { url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=85", span: "col-span-1 row-span-1", tilt: "rotate-[4deg]" },
];

export function SectionGalleryPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!gridRef.current) return;
      const items = gridRef.current.querySelectorAll("[data-golden-photo]");
      items.forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 35, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
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
    <section ref={sectionRef} className="bg-[#d4b896]/30 py-28 md:py-36 overflow-hidden relative">
      <div aria-hidden className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,_rgba(244,169,0,0.2)_0%,_rgba(244,169,0,0)_70%)] pointer-events-none" />

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
            {t("galleryLabel")}
          </p>
          <h2 className="font-merienda text-3xl md:text-4xl text-[#4a403a]">
            {t("galleryHeading")}
          </h2>
        </motion.div>

        {/* Tilted vintage-print grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6 auto-rows-[150px] md:auto-rows-[200px]"
        >
          {photos.map((photo, i) => (
            <div
              key={i}
              data-golden-photo
              className={`${photo.span} ${photo.tilt} relative bg-[#faf5ec] p-2 pb-5 rounded-sm shadow-[0_18px_40px_-18px_rgba(74,64,58,0.45)] hover:rotate-0 hover:z-10 hover:shadow-[0_25px_55px_-20px_rgba(74,64,58,0.55)] transition-all duration-500 cursor-pointer`}
              style={{ opacity: 0 }}
            >
              <div className="relative w-full h-full overflow-hidden rounded-sm">
                <Image
                  src={photo.url}
                  alt={`Gallery ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-[#f4a900]/10 mix-blend-multiply" />
              </div>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center mt-20"
        >
          <Link
            href={`${BASE}/galeri`}
            className="group inline-flex items-center gap-2 font-sans text-sm tracking-[0.2em] uppercase text-[#c1666b] hover:text-[#4a403a] transition-colors font-bold"
          >
            {t("galleryCtaButton")}
            <ArrowRightIcon size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
