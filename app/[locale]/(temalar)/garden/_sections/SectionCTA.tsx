"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { t } from "../_lib/i18n";
import { LeafIcon } from "../_icons/LeafIcon";
import { BloomIcon } from "../_icons/BloomIcon";

const BASE = "/garden";

export function SectionCTA() {
  return (
    <section className="bg-[#e3e9d6] py-28 md:py-36 relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-[#f5f3ed] rounded-[2.5rem] p-12 md:p-20 text-center border border-[#4a7c59]/20 shadow-[0_30px_60px_-30px_rgba(31,42,34,0.3)]"
        >
          {/* Wreath: leaves around corners */}
          <LeafIcon size={52} className="absolute -top-5 -left-4 text-[#4a7c59] rotate-[-45deg]" />
          <LeafIcon size={44} className="absolute -top-3 left-8 text-[#8ea68a] rotate-[-15deg]" />
          <LeafIcon size={48} className="absolute -top-4 -right-3 text-[#4a7c59] rotate-[45deg] -scale-x-100" />
          <LeafIcon size={40} className="absolute -top-2 right-10 text-[#f9a620] rotate-[25deg] -scale-x-100" />
          <LeafIcon size={48} className="absolute -bottom-4 -left-3 text-[#b7472a] rotate-[-135deg]" />
          <LeafIcon size={40} className="absolute -bottom-2 left-10 text-[#8ea68a] rotate-[-160deg]" />
          <LeafIcon size={52} className="absolute -bottom-5 -right-4 text-[#4a7c59] rotate-[135deg] -scale-x-100" />
          <LeafIcon size={44} className="absolute -bottom-3 right-8 text-[#f9a620] rotate-[165deg] -scale-x-100" />

          <div className="relative">
            <div className="inline-flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-[#4a7c59]/30" />
              <Image src="/logo-gold-transparent.png" alt="Logo" width={48} height={48} />
              <div className="h-px w-10 bg-[#4a7c59]/30" />
            </div>
            <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#4a7c59] mb-6 font-semibold">
              DAVETİYE
            </p>

            <h2 className="font-merienda text-3xl md:text-4xl text-[#2b3628] mb-4">
              {t("ctaHeading")}
            </h2>

            <p className="font-sans text-sm text-[#5e6b56] leading-relaxed mb-10 max-w-md mx-auto">
              {t("ctaText")}
            </p>

            <Link
              href={`${BASE}/lcv`}
              className="inline-flex items-center gap-2 font-sans text-xs md:text-sm font-bold tracking-[0.2em] uppercase bg-[#4a7c59] text-[#f5f3ed] rounded-full px-10 py-4 hover:bg-[#3a6447] transition-colors duration-300"
            >
              {t("ctaButton")}
              <BloomIcon size={14} className="text-[#f9a620]" />
            </Link>

            <div className="flex items-center justify-center gap-6 mt-10 flex-wrap">
              {[
                { label: t("navMemory"), href: `${BASE}/ani-defteri` },
                { label: t("navGallery"), href: `${BASE}/galeri` },
                { label: t("contactLabel"), href: `${BASE}/iletisim` },
              ].map((link, i) => (
                <span key={link.label} className="flex items-center gap-6">
                  {i > 0 && <span className="w-px h-3 bg-[#4a7c59]/20" />}
                  <Link
                    href={link.href}
                    className="font-sans text-[11px] text-[#5e6b56] hover:text-[#f9a620] transition-colors tracking-[0.15em] uppercase font-semibold"
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
