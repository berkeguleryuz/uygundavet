"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { HeartIcon } from "../_icons/HeartIcon";

const BASE = "/crystal";

export function SectionCTA() {
  useWedding(); 

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative bg-[#1a1a2e] py-28 md:py-36 overflow-hidden"
    >
      <div className="relative z-10 max-w-xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-8"
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <HeartIcon size={28} className="text-[#b49a7c]" />
          </motion.div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-merienda text-3xl md:text-4xl text-white mb-5 leading-[1.3]"
        >
          {t("ctaHeading")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-sans text-sm text-white/60 leading-[1.8] mb-12 max-w-sm mx-auto"
        >
          {t("ctaText")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link
            href={`${BASE}/lcv`}
            className="inline-flex items-center justify-center font-chakra text-[11px] tracking-[0.2em] uppercase bg-[#b49a7c] text-white rounded-full px-10 py-4 hover:bg-[#c4a882] transition-colors duration-300"
          >
            {t("ctaButton")}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center justify-center gap-6 mt-12 flex-wrap"
        >
          {[
            { label: t("navMemory"), href: `${BASE}/ani-defteri` },
            { label: t("navGallery"), href: `${BASE}/galeri` },
            { label: t("contactLabel"), href: `${BASE}/iletisim` },
          ].map((link, i) => (
            <span key={link.label} className="flex items-center gap-6">
              {i > 0 && <span className="w-px h-3 bg-white/10" />}
              <Link
                href={link.href}
                className="font-sans text-[10px] text-white/30 hover:text-white/60 transition-colors tracking-[0.2em] uppercase"
              >
                {link.label}
              </Link>
            </span>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
