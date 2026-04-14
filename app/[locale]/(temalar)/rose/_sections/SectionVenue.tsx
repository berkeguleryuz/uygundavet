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

gsap.registerPlugin(useGSAP, ScrollTrigger);

const BASE = "/rose";

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
          { y: 40 },
          {
            y: -40,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="bg-white overflow-hidden" data-section-dark>
      <div className="flex flex-col md:flex-row min-h-[600px] md:min-h-[700px]">
        {/* Left: Dark info panel */}
        <div className="md:w-1/2 bg-[#1a1210] flex items-center px-8 md:px-16 py-20 md:py-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#c9a96e] mb-6">
              {t("venueLabel")}
            </p>
            <h2 className="font-merienda text-3xl md:text-4xl text-[#f0e4dc] mb-8">
              {wedding.venueName || t("venueLabel")}
            </h2>

            <div className="space-y-5 mb-10">
              {wedding.venueAddress && (
                <div>
                  <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#f0e4dc]/30 mb-1">
                    {t("venueAddress")}
                  </p>
                  <p className="font-sans text-sm text-[#f0e4dc]/70 leading-relaxed">
                    {wedding.venueAddress}
                  </p>
                </div>
              )}
              <div>
                <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#f0e4dc]/30 mb-1">
                  {t("venueDate")}
                </p>
                <p className="font-sans text-sm text-[#f0e4dc]/70">
                  {formattedDate}
                </p>
              </div>
              {wedding.weddingTime && (
                <div>
                  <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#f0e4dc]/30 mb-1">
                    {t("venueTime")}
                  </p>
                  <p className="font-sans text-sm text-[#f0e4dc]/70">
                    {wedding.weddingTime}
                  </p>
                </div>
              )}
            </div>

            <Link
              href={`${BASE}/etkinlik`}
              className="group inline-flex items-center gap-2 font-sans text-sm tracking-[0.1em] uppercase text-[#c9a96e] hover:text-[#f0e4dc] transition-colors font-medium"
            >
              {t("venueCtaButton")}
              <ArrowRightIcon
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </motion.div>
        </div>

        {/* Right: Full photo */}
        <div className="md:w-1/2 relative min-h-[350px] md:min-h-0 overflow-hidden">
          <div
            ref={imageRef}
            className="absolute inset-0 will-change-transform"
            style={{ top: "-40px", bottom: "-40px" }}
          >
            <Image
              src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1000&q=80"
              alt={wedding.venueName || "Venue"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
