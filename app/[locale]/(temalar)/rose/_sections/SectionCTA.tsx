"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";

const BASE = "/rose";

export function SectionCTA() {
  useWedding();

  return (
    <section className="bg-white py-28 md:py-36">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="border border-[#c75050]/20 rounded-sm p-12 md:p-20 text-center relative"
        >
          {/* Corner decorations */}
          <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-[#c75050]/30" />
          <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-[#c75050]/30" />
          <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-[#c75050]/30" />
          <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-[#c75050]/30" />

          <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#c9a96e] mb-6">
            DAVETİYE
          </p>

          <h2 className="font-merienda text-3xl md:text-4xl text-[#1a1210] mb-4">
            {t("ctaHeading")}
          </h2>

          <p className="font-sans text-sm text-[#6b6560] leading-relaxed mb-10 max-w-md mx-auto">
            {t("ctaText")}
          </p>

          <Link
            href={`${BASE}/lcv`}
            className="inline-flex items-center justify-center font-sans text-xs md:text-sm font-medium tracking-[0.15em] uppercase bg-[#c75050] text-white rounded-full px-10 py-4 hover:bg-[#b04545] transition-colors duration-300"
          >
            {t("ctaButton")}
          </Link>

          {/* Sub-links */}
          <div className="flex items-center justify-center gap-6 mt-10 flex-wrap">
            {[
              { label: t("navMemory"), href: `${BASE}/ani-defteri` },
              { label: t("navGallery"), href: `${BASE}/galeri` },
              { label: t("contactLabel"), href: `${BASE}/iletisim` },
            ].map((link, i) => (
              <span key={link.label} className="flex items-center gap-6">
                {i > 0 && <span className="w-px h-3 bg-[#1a1210]/10" />}
                <Link
                  href={link.href}
                  className="font-sans text-[11px] text-[#6b6560] hover:text-[#c75050] transition-colors tracking-[0.1em] uppercase"
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
