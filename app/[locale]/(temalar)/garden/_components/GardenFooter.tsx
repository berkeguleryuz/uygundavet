"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { Logo } from "@/app/components/Logo";
import { ArrowRightIcon } from "../_icons/ArrowRightIcon";
import { LeafIcon } from "../_icons/LeafIcon";
import { BloomIcon } from "../_icons/BloomIcon";

const BASE = "/garden";

export function GardenFooter() {
  const wedding = useWedding();
  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  const weddingDate = useMemo(
    () => new Date(wedding.weddingDate).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }),
    [wedding.weddingDate]
  );

  const pageLinks = [
    { label: t("navHome"), href: BASE },
    { label: t("navStory"), href: `${BASE}/hikayemiz` },
    { label: t("navEvent"), href: `${BASE}/etkinlik` },
    ...(wedding.hasGallery ? [{ label: t("navGallery"), href: `${BASE}/galeri` }] : []),
    ...(wedding.hasMemoryBook ? [{ label: t("navMemory"), href: `${BASE}/ani-defteri` }] : []),
    { label: t("navRsvp"), href: `${BASE}/lcv` },
  ];

  return (
    <footer className="bg-[#1f2a22] relative overflow-hidden">
      {/* Decorative botanical silhouettes */}
      <div aria-hidden className="absolute inset-0 pointer-events-none opacity-[0.07]">
        <LeafIcon size={220} className="absolute -left-10 top-8 text-[#f9a620] rotate-[-20deg]" />
        <LeafIcon size={160} className="absolute right-0 bottom-20 text-[#f9a620] rotate-[140deg]" />
        <BloomIcon size={180} className="absolute left-1/3 bottom-0 text-[#f9a620] translate-y-1/3" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 md:px-12 pt-16 pb-8">
        <div className="bg-[#4a7c59]/10 border border-[#f9a620]/20 rounded-[2rem] p-8 md:p-12 text-center">
          <div className="flex justify-center mb-5">
            <Image src="/logo-gold-transparent.png" alt="Logo" width={56} height={56} />
          </div>
          <h3 className="font-merienda text-2xl md:text-3xl text-[#f5f3ed] mb-3">
            {t("footerCtaHeading")}
          </h3>
          <p className="font-sans text-sm text-[#f5f3ed]/60 mb-6 max-w-md mx-auto leading-relaxed">
            {t("footerCtaText")}
          </p>
          <Link
            href="https://uygundavet.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#f9a620] text-[#1f2a22] rounded-full px-8 py-3 font-sans text-sm font-semibold tracking-[0.1em] uppercase hover:bg-[#fdb94a] transition-colors group"
          >
            {t("footerCtaButton")}
            <ArrowRightIcon size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      <div className="relative max-w-5xl mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12">
          <div>
            <h3 className="font-merienda text-3xl text-[#f9a620]">
              {brideFirst} &amp; {groomFirst}
            </h3>
            <p className="font-sans text-sm text-[#f5f3ed]/50 mt-2">{weddingDate}</p>
            {wedding.venueName && (
              <p className="font-sans text-sm text-[#f5f3ed]/30 mt-1">
                {wedding.venueName}
              </p>
            )}
          </div>

          <div className="flex gap-16">
            <div>
              <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#f9a620]/70 mb-4">
                Sayfalar
              </p>
              <ul className="space-y-2.5">
                {pageLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm text-[#f5f3ed]/55 hover:text-[#f9a620] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#f9a620]/70 mb-4">
                {t("contactLabel")}
              </p>
              <ul className="space-y-2.5">
                {wedding.venueName && (
                  <li className="font-sans text-sm text-[#f5f3ed]/55">
                    {wedding.venueName}
                  </li>
                )}
                {wedding.venueAddress && (
                  <li className="font-sans text-sm text-[#f5f3ed]/40 max-w-[220px]">
                    {wedding.venueAddress}
                  </li>
                )}
                <li>
                  <Link
                    href={`${BASE}/iletisim`}
                    className="font-sans text-sm text-[#f5f3ed]/55 hover:text-[#f9a620] transition-colors"
                  >
                    {t("contactLabel")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-5xl mx-auto px-6 md:px-12">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#f9a620]/20 to-transparent" />
          <LeafIcon size={14} className="text-[#f9a620]/40" />
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#f9a620]/20 to-transparent" />
        </div>
      </div>

      <div className="relative max-w-5xl mx-auto px-6 md:px-12 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo className="w-3.5 h-3.5 opacity-40" />
            <p className="font-sans text-[11px] text-[#f5f3ed]/40">
              Uygun Davet {t("footerCreatedWith")}
            </p>
          </div>

          <Link
            href="https://uygundavet.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[11px] text-[#f5f3ed]/30 hover:text-[#f5f3ed]/60 transition-colors"
          >
            {t("footerPrivacy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
