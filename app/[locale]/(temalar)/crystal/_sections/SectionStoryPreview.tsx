"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { ArrowRightIcon } from "../_icons/ArrowRightIcon";

const BASE = "/crystal";

const storyCards = [
  {
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&q=85",
    video: "/crystal/kelebek.mp4",
    title: "Tanıştık",
    subtitle: "Her yolculuk bir adımla başlar",
  },
  {
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=85",
    video: null,
    title: "Sevdik",
    subtitle: "Kalplerimiz aynı ritmi buldu",
  },
  {
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&q=85",
    video: "/crystal/kutu.mp4",
    title: "Evleniyoruz",
    subtitle: "Sonsuza kadar birlikte",
  },
];

export function SectionStoryPreview() {
  const wedding = useWedding();
  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  return (
    <section className="relative bg-[#f6f3ee] overflow-hidden">
      <div className="py-24 md:py-32">
        <div className="px-8 md:px-16 lg:px-24 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-6"
          >
            <p className="font-chakra text-[10px] tracking-[0.5em] uppercase text-[#b49a7c] shrink-0">
              {t("storyLabel")}
            </p>
            <div className="h-px flex-1 bg-[#1a1a2e]/[0.08]" />
          </motion.div>
        </div>

        <div className="px-8 md:px-16 lg:px-24 mb-14 md:mb-20">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-merienda text-4xl md:text-5xl text-[#1a1a2e]"
          >
            {brideFirst} & {groomFirst}
          </motion.h2>
        </div>

        <div
          className="flex gap-6 md:gap-8 px-8 md:px-16 lg:px-24 overflow-x-auto snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {storyCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative w-[280px] md:w-[360px] shrink-0 snap-start rounded-2xl overflow-hidden border border-white/80 shadow-sm group"
            >
              <div className="relative aspect-[4/5]">
                {card.video ? (
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    src={card.video}
                  />
                ) : (
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 280px, 360px"
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-6 pt-20">
                  <p className="font-merienda text-xl text-white mb-1">
                    {card.title}
                  </p>
                  <p className="font-sans text-xs text-white/70 tracking-wide">
                    {card.subtitle}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="px-8 md:px-16 lg:px-24 mt-14 md:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href={`${BASE}/hikayemiz`}
              className="group inline-flex items-center gap-2 font-chakra text-[11px] tracking-[0.2em] uppercase text-[#1a1a2e] hover:text-[#b49a7c] transition-colors duration-300"
            >
              {t("storyCtaButton")}
              <ArrowRightIcon
                size={14}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
