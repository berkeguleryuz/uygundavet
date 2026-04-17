"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { ArrowRightIcon } from "../_icons/ArrowRightIcon";
import { LeafIcon } from "../_icons/LeafIcon";

const BASE = "/garden";

const milestones = [
  {
    title: "Tohum",
    subtitle: "İlk bakışta atılan tohum",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=85",
  },
  {
    title: "Filiz",
    subtitle: "Birlikte büyüyen bir duygu",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=85",
  },
  {
    title: "Çiçek",
    subtitle: "Sonsuza kadar tek bir bahçede",
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=85",
  },
];

export function SectionStoryPreview() {
  const wedding = useWedding();
  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  return (
    <section className="bg-[#e3e9d6] py-28 md:py-36 overflow-hidden relative">
      {/* Central vine SVG backdrop */}
      <div
        aria-hidden
        className="hidden md:block absolute left-1/2 top-24 bottom-24 -translate-x-1/2 w-px"
      >
        <svg
          viewBox="0 0 20 1000"
          preserveAspectRatio="none"
          className="w-10 h-full -translate-x-[18px]"
        >
          <path
            d="M10 0 C 0 200, 20 400, 10 600 C 0 800, 20 1000, 10 1000"
            stroke="#4a7c59"
            strokeOpacity="0.35"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 relative">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 md:mb-28"
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <LeafIcon size={14} className="text-[#4a7c59] rotate-[-20deg]" />
            <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#4a7c59] font-semibold">
              {t("storyLabel")}
            </p>
            <LeafIcon size={14} className="text-[#4a7c59] rotate-[20deg] -scale-x-100" />
          </div>
          <h2 className="font-merienda text-3xl md:text-4xl text-[#2b3628]">
            {brideFirst} <span className="text-[#f9a620]">&amp;</span> {groomFirst}
          </h2>
          <p className="font-sans text-sm text-[#5e6b56] mt-4 max-w-md mx-auto leading-relaxed">
            {t("storyText")}
          </p>
        </motion.div>

        <div className="space-y-20 md:space-y-28 relative">
          {milestones.map((m, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: idx * 0.12 }}
                className={`md:flex md:items-center md:gap-16 ${isLeft ? "" : "md:flex-row-reverse"} relative`}
              >
                {/* Photo medallion */}
                <div className="md:w-1/2 mb-8 md:mb-0 flex md:justify-center">
                  <div className="relative w-full max-w-[340px] aspect-square rounded-full overflow-hidden shadow-[0_20px_50px_-20px_rgba(31,42,34,0.4)] border-[6px] border-[#f5f3ed]">
                    <Image
                      src={m.image}
                      alt={m.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 340px"
                    />
                  </div>
                </div>

                {/* Center branch node — desktop only */}
                <div
                  aria-hidden
                  className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#f9a620] border-4 border-[#e3e9d6] items-center justify-center shadow-md z-10"
                >
                  <LeafIcon size={14} className="text-[#1f2a22] rotate-[-20deg]" />
                </div>

                {/* Text */}
                <div className={`md:w-1/2 ${isLeft ? "md:text-left" : "md:text-right"}`}>
                  <span className="inline-block font-sans text-[10px] tracking-[0.3em] uppercase text-[#b7472a] mb-2 font-bold">
                    0{idx + 1} · {m.title}
                  </span>
                  <h3 className="font-merienda text-2xl md:text-3xl text-[#2b3628] mb-3">
                    {m.subtitle}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-16"
        >
          <Link
            href={`${BASE}/hikayemiz`}
            className="group inline-flex items-center gap-2 font-sans text-sm tracking-[0.15em] uppercase text-[#4a7c59] hover:text-[#f9a620] transition-colors font-semibold"
          >
            {t("storyCtaButton")}
            <ArrowRightIcon size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
