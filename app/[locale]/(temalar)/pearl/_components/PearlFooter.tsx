"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { Logo } from "@/app/components/Logo";
import { ArrowRightIcon } from "../_icons/ArrowRightIcon";
import { HeartIcon } from "../_icons/HeartIcon";

const BASE = "/pearl";

export function PearlFooter() {
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
    ...(wedding.hasGallery
      ? [{ label: t("navGallery"), href: `${BASE}/galeri` }]
      : []),
    ...(wedding.hasMemoryBook
      ? [{ label: t("navMemory"), href: `${BASE}/ani-defteri` }]
      : []),
    { label: t("navRsvp"), href: `${BASE}/lcv` },
  ];

  return (
    <footer className="bg-[#1c1917]">
      <div className="max-w-5xl mx-auto px-6 md:px-12 pt-16 pb-8">
        <div className="bg-gradient-to-r from-[#b8a088]/10 to-[#c4a296]/10 border border-white/10 rounded-3xl p-8 md:p-12 text-center">
          <HeartIcon className="size-7 text-[#c4a296] mx-auto mb-5" size={28} />
          <h3 className="font-merienda text-2xl md:text-3xl text-white mb-3">
            {t("footerCtaHeading")}
          </h3>
          <p className="font-sans text-sm text-white/50 mb-6 max-w-md mx-auto leading-relaxed">
            {t("footerCtaText")}
          </p>
          <Link
            href="https://uygundavet.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#b8a088] to-[#c4a296] text-white rounded-full px-8 py-3 font-sans text-sm font-medium tracking-wide hover:opacity-90 transition-opacity group"
          >
            {t("footerCtaButton")}
            <ArrowRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform" size={16} />
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12">
          <div>
            <h3 className="font-merienda text-3xl bg-gradient-to-r from-[#b8a088] to-[#c4a296] bg-clip-text text-transparent">
              {brideFirst} & {groomFirst}
            </h3>
            <p className="font-sans text-sm text-white/40 mt-2">
              {weddingDate}
            </p>
            {wedding.venueName && (
              <p className="font-sans text-sm text-white/25 mt-1">
                {wedding.venueName}
              </p>
            )}
          </div>

          <div className="flex gap-16">
            <div>
              <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/30 mb-4">
                Sayfalar
              </p>
              <ul className="space-y-2.5">
                {pageLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/30 mb-4">
                {t("contactLabel")}
              </p>
              <ul className="space-y-2.5">
                {wedding.venueName && (
                  <li className="font-sans text-sm text-white/50">
                    {wedding.venueName}
                  </li>
                )}
                {wedding.venueAddress && (
                  <li className="font-sans text-sm text-white/40 max-w-[200px]">
                    {wedding.venueAddress}
                  </li>
                )}
                <li>
                  <Link
                    href={`${BASE}/iletisim`}
                    className="font-sans text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {t("contactLabel")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <div className="border-t border-white/[0.06]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo className="w-3.5 h-3.5 opacity-30" />
            <p className="font-sans text-[11px] text-white/30">
              Uygun Davet {t("footerCreatedWith")}
            </p>
          </div>

          <Link
            href="https://uygundavet.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-sans text-[11px] text-white/30 hover:text-white/60 transition-colors group"
          >
            {t("footerCtaHeading")}
            <ArrowRightIcon className="size-3 group-hover:translate-x-0.5 transition-transform" size={12} />
          </Link>

          <Link
            href="https://uygundavet.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[11px] text-white/20 hover:text-white/40 transition-colors"
          >
            {t("footerPrivacy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
