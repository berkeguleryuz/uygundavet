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

gsap.registerPlugin(useGSAP, ScrollTrigger);

const BASE = "/rose";

const photos = [
  {
    url: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80",
    area: "col-span-2 row-span-2",
  },
  {
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
    area: "col-span-1 row-span-1",
  },
  {
    url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80",
    area: "col-span-1 row-span-1",
  },
  {
    url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80",
    area: "col-span-1 row-span-1",
  },
  {
    url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80",
    area: "col-span-1 row-span-1",
  },
  {
    url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80",
    area: "col-span-2 row-span-1",
  },
];

export function SectionGalleryPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!gridRef.current) return;
      const items = gridRef.current.querySelectorAll("[data-bento]");
      items.forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              toggleActions: "play none none none",
            },
            delay: i * 0.08,
          },
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="bg-[#faf7f4] py-28 md:py-36 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#c75050] mb-3">
            {t("galleryLabel")}
          </p>
          <h2 className="font-merienda text-3xl md:text-4xl text-[#1a1210]">
            {t("galleryHeading")}
          </h2>
        </motion.div>

        {/* Bento grid — 4 columns, asymmetric */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[220px]"
        >
          {photos.map((photo, i) => (
            <div
              key={i}
              data-bento
              className={`${photo.area} relative rounded-xl overflow-hidden group cursor-pointer`}
              style={{ opacity: 0 }}
            >
              <Image
                src={photo.url}
                alt={`Gallery ${i + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
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
            className="group inline-flex items-center gap-2 font-sans text-sm tracking-[0.1em] uppercase text-[#c75050] hover:text-[#1a1210] transition-colors font-medium"
          >
            {t("galleryCtaButton")}
            <ArrowRightIcon
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
