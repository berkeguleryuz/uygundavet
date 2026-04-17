"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { t } from "../_lib/i18n";
import { SunIcon } from "../_icons/SunIcon";
import { HaloIcon } from "../_icons/HaloIcon";

const BASE = "/golden";

export function SectionCTA() {
  return (
    <section className="bg-[#faf5ec] py-28 md:py-36 relative overflow-hidden">
      <div aria-hidden className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-[radial-gradient(circle,_rgba(244,169,0,0.18)_0%,_rgba(244,169,0,0)_70%)] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-[#4a403a] text-[#faf5ec] rounded-[2.5rem] p-12 md:p-20 text-center shadow-[0_35px_75px_-30px_rgba(74,64,58,0.6)] overflow-hidden"
        >
          {/* Wax seals on top corners */}
          <div
            aria-hidden
            className="absolute -top-5 -left-5 w-16 h-16 rounded-full bg-gradient-to-br from-[#c1666b] to-[#8a3e43] shadow-lg flex items-center justify-center rotate-[-15deg] z-10"
          >
            <SunIcon size={22} className="text-[#f4a900]" />
          </div>
          <div
            aria-hidden
            className="absolute -top-5 -right-5 w-16 h-16 rounded-full bg-gradient-to-br from-[#f4a900] to-[#c78800] shadow-lg flex items-center justify-center rotate-[15deg] z-10"
          >
            <SunIcon size={22} className="text-[#4a403a]" />
          </div>

          {/* Halo backgrounds */}
          <HaloIcon size={360} className="absolute -right-16 -bottom-16 text-[#f4a900]/15 pointer-events-none" />
          <HaloIcon size={280} className="absolute -left-10 -top-10 text-[#c1666b]/15 pointer-events-none" />

          <div className="relative">
            <div className="inline-flex items-center gap-4 mb-5">
              <div className="h-px w-12 bg-[#f4a900]/50" />
              <Image src="/logo-gold-transparent.png" alt="Logo" width={52} height={52} />
              <div className="h-px w-12 bg-[#f4a900]/50" />
            </div>
            <p className="font-sans text-[11px] tracking-[0.5em] uppercase text-[#f4a900] mb-6 font-bold">
              DAVETİYE
            </p>

            <h2 className="font-merienda text-3xl md:text-5xl text-[#faf5ec] mb-4 leading-tight">
              {t("ctaHeading")}
            </h2>

            <p className="font-sans text-sm text-[#d4b896]/85 leading-relaxed mb-10 max-w-md mx-auto">
              {t("ctaText")}
            </p>

            <Link
              href={`${BASE}/lcv`}
              className="inline-flex items-center gap-3 font-sans text-xs md:text-sm font-bold tracking-[0.25em] uppercase bg-[#f4a900] text-[#2d2620] rounded-full px-12 py-4 hover:bg-[#ffc13d] transition-colors duration-300"
            >
              <SunIcon size={14} />
              {t("ctaButton")}
            </Link>

            <div className="flex items-center justify-center gap-6 mt-10 flex-wrap">
              {[
                { label: t("navMemory"), href: `${BASE}/ani-defteri` },
                { label: t("navGallery"), href: `${BASE}/galeri` },
                { label: t("contactLabel"), href: `${BASE}/iletisim` },
              ].map((link, i) => (
                <span key={link.label} className="flex items-center gap-6">
                  {i > 0 && <span className="w-px h-3 bg-[#f4a900]/30" />}
                  <Link
                    href={link.href}
                    className="font-sans text-[11px] text-[#d4b896]/75 hover:text-[#f4a900] transition-colors tracking-[0.18em] uppercase font-bold"
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
