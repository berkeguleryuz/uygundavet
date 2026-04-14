"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { HeartIcon } from "../_icons/HeartIcon";

const BASE = "/pearl";

export function SectionCTA() {
  useWedding();

  return (
    <section className="relative bg-gradient-to-br from-[#b8a088] via-[#c4a296] to-[#8a7d6d] py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, #1c1917 1px, transparent 0)`,
        backgroundSize: "24px 24px",
      }} />

      <div className="relative z-10 max-w-xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-8"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <HeartIcon size={32} className="text-[#1c1917]" />
          </motion.div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-merienda text-3xl md:text-5xl text-[#1c1917] mb-6 leading-[1.2]"
        >
          {t("ctaHeading")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-sans text-base text-[#1c1917]/70 leading-[1.8] mb-12 max-w-md mx-auto"
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
            className="inline-flex items-center justify-center font-sans text-sm md:text-base font-medium tracking-wide bg-[#1c1917] text-white rounded-full px-10 py-4 hover:bg-[#1c1917]/90 hover:shadow-xl transition-all duration-300"
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
              {i > 0 && <span className="w-px h-3 bg-[#1c1917]/15" />}
              <Link
                href={link.href}
                className="font-sans text-xs text-[#1c1917]/40 hover:text-[#1c1917]/70 transition-colors tracking-[0.15em] uppercase"
              >
                {link.label}
              </Link>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
