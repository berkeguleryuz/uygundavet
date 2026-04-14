"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { ArrowRightIcon } from "../_icons/ArrowRightIcon";

const BASE = "/rose";

const milestones = [
  {
    title: "Tanıştık",
    subtitle: "Her yolculuk bir adımla başlar",
    image:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80",
  },
  {
    title: "Sevdik",
    subtitle: "Kalplerimiz aynı ritmi buldu",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
  },
  {
    title: "Evleniyoruz",
    subtitle: "Sonsuza kadar birlikte",
    image:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80",
  },
];

export function SectionStoryPreview() {
  const wedding = useWedding();
  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  return (
    <section className="bg-[#faf7f4] py-28 md:py-36 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 md:mb-28"
        >
          <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#c75050] mb-3">
            {t("storyLabel")}
          </p>
          <h2 className="font-merienda text-3xl md:text-4xl text-[#1a1210]">
            {brideFirst} &amp; {groomFirst}
          </h2>
        </motion.div>

        {/* Vertical timeline — alternating left/right on desktop */}
        <div className="relative">
          {/* Center vertical line — desktop only */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-[#c75050]/15 -translate-x-1/2" />

          <div className="space-y-16 md:space-y-0">
            {milestones.map((m, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: idx * 0.1 }}
                  className={`md:flex md:items-center md:gap-12 ${isLeft ? "" : "md:flex-row-reverse"} md:pb-24`}
                >
                  {/* Image side */}
                  <div className="md:w-1/2 mb-6 md:mb-0">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                      <Image
                        src={m.image}
                        alt={m.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </div>

                  {/* Center dot — desktop only */}
                  <div
                    className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#c75050] border-4 border-[#faf7f4]"
                    style={{ top: `${idx * 33 + 8}%` }}
                  />

                  {/* Text side */}
                  <div
                    className={`md:w-1/2 ${isLeft ? "md:text-left" : "md:text-right"}`}
                  >
                    <span className="inline-block font-sans text-[10px] tracking-[0.3em] uppercase text-[#c9a96e] mb-2">
                      {`0${idx + 1}`}
                    </span>
                    <h3 className="font-merienda text-2xl text-[#1a1210] mb-2">
                      {m.title}
                    </h3>
                    <p className="font-sans text-sm text-[#6b6560] leading-relaxed">
                      {m.subtitle}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-16"
        >
          <Link
            href={`${BASE}/hikayemiz`}
            className="group inline-flex items-center gap-2 font-sans text-sm tracking-[0.1em] uppercase text-[#c75050] hover:text-[#1a1210] transition-colors font-medium"
          >
            {t("storyCtaButton")}
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
