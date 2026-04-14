"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import { t } from "../_lib/i18n";
import { ArrowRightIcon } from "../_icons/ArrowRightIcon";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const BASE = "/pearl";

const photos = [
  {
    url: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=85",
    span: "col-span-1 row-span-1",
    accent: "hover:border-[#b8a088]/40",
  },
  {
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=85",
    span: "col-span-1 row-span-2",
    accent: "hover:border-[#c4a296]/40",
  },
  {
    url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=85",
    span: "col-span-1 row-span-1",
    accent: "hover:border-[#a89886]/40",
  },
  {
    url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=85",
    span: "col-span-1 row-span-1",
    accent: "hover:border-[#8a7d6d]/40",
  },
  {
    url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=85",
    span: "col-span-1 row-span-1",
    accent: "hover:border-[#b8a088]/40",
  },
  {
    url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=85",
    span: "col-span-1 row-span-1",
    accent: "hover:border-[#c4a296]/40",
  },
];

export function SectionGalleryPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll("[data-gallery-card]");

    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
          delay: i * 0.1,
        }
      );
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="bg-[#f7f4ef] py-24 md:py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 md:mb-20"
        >
          <p className="font-sans text-xs tracking-[0.4em] uppercase bg-gradient-to-r from-[#b8a088] via-[#c4a296] to-[#8a7d6d] bg-clip-text text-transparent font-semibold mb-4">
            {t("galleryLabel")}
          </p>
          <h2 className="font-merienda text-3xl md:text-4xl bg-gradient-to-r from-[#b8a088] via-[#c4a296] to-[#8a7d6d] bg-clip-text text-transparent">
            {t("galleryHeading")}
          </h2>
        </motion.div>

        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[200px] md:auto-rows-[260px]"
        >
          {photos.map((photo, i) => (
            <div
              key={i}
              data-gallery-card
              className={`${photo.span} relative rounded-2xl overflow-hidden border-4 border-[#b8a088]/20 ${photo.accent} hover:scale-[1.02] hover:shadow-xl transition-all duration-500 cursor-pointer group`}
              style={{ opacity: 0 }}
            >
              <Image
                src={photo.url}
                alt={`${t("galleryLabel")} ${i + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center mt-14 md:mt-20"
        >
          <Link
            href={`${BASE}/galeri`}
            className="group inline-flex items-center gap-2 font-sans text-sm tracking-[0.15em] uppercase text-[#1c1917] hover:text-[#b8a088] transition-colors duration-300 font-medium"
          >
            {t("galleryCtaButton")}
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
