"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { t } from "../_lib/i18n";
import { CompassIcon } from "../_icons/CompassIcon";

const BASE = "/ocean";

export function SectionCTA() {
  return (
    <section className="bg-[#f1faee] py-28 md:py-36 relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-[#1a2332] text-[#f1faee] rounded-[2rem] p-12 md:p-20 text-center shadow-[0_30px_70px_-30px_rgba(26,35,50,0.5)] overflow-hidden"
        >
          {/* Corner wave illustrations */}
          <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="absolute top-0 left-0 w-40 h-14 pointer-events-none opacity-40">
            <path d="M0 30 Q 25 0 50 30 T 100 30 T 150 30 T 200 30" stroke="#a8dadc" strokeWidth="1.5" fill="none" />
            <path d="M0 40 Q 25 10 50 40 T 100 40 T 150 40 T 200 40" stroke="#a8dadc" strokeWidth="1.5" fill="none" opacity="0.6" />
          </svg>
          <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="absolute bottom-0 right-0 w-40 h-14 pointer-events-none opacity-40 rotate-180">
            <path d="M0 30 Q 25 0 50 30 T 100 30 T 150 30 T 200 30" stroke="#a8dadc" strokeWidth="1.5" fill="none" />
            <path d="M0 40 Q 25 10 50 40 T 100 40 T 150 40 T 200 40" stroke="#a8dadc" strokeWidth="1.5" fill="none" opacity="0.6" />
          </svg>

          <CompassIcon size={340} className="absolute -right-20 -bottom-20 text-[#2d8b8b]/12 pointer-events-none" />

          <div className="relative">
            <div className="inline-flex items-center gap-4 mb-5">
              <div className="h-px w-12 bg-[#a8dadc]/50" />
              <Image src="/logo-gold-transparent.png" alt="Logo" width={52} height={52} />
              <div className="h-px w-12 bg-[#a8dadc]/50" />
            </div>
            <p className="font-sans text-[11px] tracking-[0.5em] uppercase text-[#a8dadc] mb-6 font-bold">
              DAVETİYE
            </p>

            <h2 className="font-merienda text-3xl md:text-5xl text-[#f1faee] mb-4 leading-tight">
              {t("ctaHeading")}
            </h2>

            <p className="font-sans text-sm text-[#a8dadc]/85 leading-relaxed mb-10 max-w-md mx-auto">
              {t("ctaText")}
            </p>

            <Link
              href={`${BASE}/lcv`}
              className="inline-flex items-center gap-3 font-sans text-xs md:text-sm font-bold tracking-[0.25em] uppercase bg-[#a8dadc] text-[#0d1620] rounded-full px-12 py-4 hover:bg-[#f1faee] transition-colors duration-300"
            >
              <CompassIcon size={14} />
              {t("ctaButton")}
            </Link>

            <div className="flex items-center justify-center gap-6 mt-10 flex-wrap">
              {[
                { label: t("navMemory"), href: `${BASE}/ani-defteri` },
                { label: t("navGallery"), href: `${BASE}/galeri` },
                { label: t("contactLabel"), href: `${BASE}/iletisim` },
              ].map((link, i) => (
                <span key={link.label} className="flex items-center gap-6">
                  {i > 0 && <span className="w-px h-3 bg-[#a8dadc]/30" />}
                  <Link
                    href={link.href}
                    className="font-sans text-[11px] text-[#a8dadc]/70 hover:text-[#f1faee] transition-colors tracking-[0.18em] uppercase font-semibold"
                  >
                    {link.label}
                  </Link>
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
