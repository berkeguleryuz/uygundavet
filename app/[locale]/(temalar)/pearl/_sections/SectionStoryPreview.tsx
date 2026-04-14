"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { ArrowRightIcon } from "../_icons/ArrowRightIcon";

const BASE = "/pearl";

const storyCards = [
  {
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&q=85",
    video: "/yuzuk.mp4",
    title: "Tanıştık",
    subtitle: "Her yolculuk bir adımla başlar",
    accentColor: "#b8a088",
  },
  {
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=85",
    video: null,
    title: "Sevdik",
    subtitle: "Kalplerimiz aynı ritmi buldu",
    accentColor: "#c4a296",
  },
  {
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&q=85",
    video: "/kutu.mp4",
    title: "Evleniyoruz",
    subtitle: "Sonsuza kadar birlikte",
    accentColor: "#a89886",
  },
];

export function SectionStoryPreview() {
  const wedding = useWedding();
  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  return (
    <section className="bg-[#f2ece4] py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <p className="font-sans text-xs tracking-[0.4em] uppercase bg-gradient-to-r from-[#b8a088] via-[#c4a296] to-[#8a7d6d] bg-clip-text text-transparent font-semibold">
            {t("storyLabel")}
          </p>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-merienda text-3xl md:text-5xl text-[#1c1917] mb-14 md:mb-20"
        >
          {brideFirst} & {groomFirst}
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {storyCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative rounded-3xl overflow-hidden shadow-lg group"
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
                    sizes="(max-width: 768px) 300px, 380px"
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6 pt-24">
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

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 md:mt-20"
        >
          <Link
            href={`${BASE}/hikayemiz`}
            className="group inline-flex items-center gap-2 font-sans text-sm tracking-[0.15em] uppercase text-[#1c1917] hover:text-[#b8a088] transition-colors duration-300 font-medium"
          >
            {t("storyCtaButton")}
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
