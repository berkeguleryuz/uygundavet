"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import { t } from "../_lib/i18n";
import { SparkleIcon } from "../_icons/SparkleIcon";
import { ArrowRightIcon } from "../_icons/ArrowRightIcon";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const BASE = "/crystal";

const photos = [
  {
    url: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=85",
    rotate: "-rotate-3",
    zIndex: "z-10",
    offset: "mt-0 md:mt-8",
  },
  {
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=85",
    rotate: "rotate-2",
    zIndex: "z-20",
    offset: "mt-0 md:-mt-4",
  },
  {
    url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=85",
    rotate: "-rotate-1",
    zIndex: "z-30",
    offset: "mt-0 md:mt-12",
  },
  {
    url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=85",
    rotate: "rotate-3",
    zIndex: "z-20",
    offset: "mt-0 md:-mt-6",
  },
  {
    url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=85",
    rotate: "-rotate-2",
    zIndex: "z-10",
    offset: "mt-0 md:mt-4",
  },
];

export function SectionGalleryPreview() {
  const gridRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cards = grid.querySelectorAll("[data-polaroid]");

    cards.forEach((card, i) => {
      const directions = [
        { x: -60, y: 40 },
        { x: 30, y: -50 },
        { x: -40, y: -30 },
        { x: 50, y: 40 },
        { x: -20, y: -60 },
      ];
      const dir = directions[i % directions.length];

      gsap.fromTo(
        card,
        {
          x: dir.x,
          y: dir.y,
          opacity: 0,
          rotation: (Math.random() - 0.5) * 10,
        },
        {
          x: 0,
          y: 0,
          opacity: 1,
          rotation: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
          delay: i * 0.12,
        }
      );
    });

    cards.forEach((card, i) => {
      gsap.to(card, {
        y: (i % 2 === 0 ? -1 : 1) * 15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-[#eee9e2] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <SparkleIcon size={14} className="text-[#b49a7c]/60" />
            <p className="font-chakra text-[10px] tracking-[0.5em] uppercase text-[#a09ba6]">
              {t("galleryLabel")}
            </p>
            <SparkleIcon size={14} className="text-[#b49a7c]/60" />
          </div>
          <h2 className="font-merienda text-2xl md:text-3xl text-[#1a1a2e]">
            {t("galleryHeading")}
          </h2>
        </motion.div>

        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 md:-mx-4 justify-items-center"
        >
          {photos.map((photo, i) => (
            <div
              key={i}
              data-polaroid
              className={`
                ${photo.zIndex} ${photo.offset}
                bg-white p-2 pb-8 rounded-sm shadow-lg
                ${photo.rotate}
                hover:rotate-0 hover:scale-105 hover:shadow-2xl
                transition-all duration-500 ease-out cursor-pointer
                w-full max-w-[200px] md:max-w-none
                ${i === 4 ? "col-span-2 md:col-span-1 justify-self-center" : ""}
              `}
              style={{ opacity: 0 }}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={photo.url}
                  alt={`${t("galleryLabel")} ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 45vw, 20vw"
                />
              </div>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center mt-16 md:mt-20"
        >
          <Link
            href={`${BASE}/galeri`}
            className="group inline-flex items-center gap-2 font-chakra text-[11px] tracking-[0.2em] uppercase text-[#1a1a2e] hover:text-[#b49a7c] transition-colors duration-300"
          >
            {t("galleryCtaButton")}
            <ArrowRightIcon
              size={14}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
