"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { Logo } from "@/app/components/Logo";
import { ArrowRightIcon } from "../_icons/ArrowRightIcon";
import { WaveIcon } from "../_icons/WaveIcon";
import { CompassIcon } from "../_icons/CompassIcon";

const BASE = "/ocean";

export function OceanFooter() {
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
    <footer className="bg-[#0d1620] relative overflow-hidden">
      {/* Animated wave band */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-20 overflow-hidden opacity-40 pointer-events-none">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-full">
          <path
            d="M0 40 Q 180 0 360 40 T 720 40 T 1080 40 T 1440 40 L 1440 0 L 0 0 Z"
            fill="#2d8b8b"
            fillOpacity="0.25"
          />
          <path
            d="M0 60 Q 180 20 360 60 T 720 60 T 1080 60 T 1440 60 L 1440 0 L 0 0 Z"
            fill="#a8dadc"
            fillOpacity="0.15"
          />
        </svg>
      </div>

      <div className="relative max-w-5xl mx-auto px-6 md:px-12 pt-24 pb-8">
        <div className="bg-gradient-to-br from-[#2d8b8b]/15 via-[#1a2332]/40 to-[#0d1620] border border-[#a8dadc]/15 rounded-[2rem] p-8 md:p-12 text-center relative overflow-hidden">
          <CompassIcon size={260} className="absolute -right-10 -bottom-14 text-[#2d8b8b]/10" />

          <div className="relative">
            <div className="flex justify-center mb-5">
              <Image src="/logo-gold-transparent.png" alt="Logo" width={56} height={56} />
            </div>
            <h3 className="font-merienda text-2xl md:text-3xl text-[#f1faee] mb-3">
              {t("footerCtaHeading")}
            </h3>
            <p className="font-sans text-sm text-[#f1faee]/55 mb-6 max-w-md mx-auto leading-relaxed">
              {t("footerCtaText")}
            </p>
            <Link
              href="https://uygundavet.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#2d8b8b] text-[#f1faee] rounded-full px-8 py-3 font-sans text-sm font-bold tracking-[0.15em] uppercase hover:bg-[#3aa0a0] transition-colors group"
            >
              {t("footerCtaButton")}
              <ArrowRightIcon size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      <div className="relative max-w-5xl mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12">
          <div>
            <h3 className="font-merienda text-3xl text-[#a8dadc]">
              {brideFirst} &amp; {groomFirst}
            </h3>
            <p className="font-sans text-sm text-[#f1faee]/50 mt-2">{weddingDate}</p>
            {wedding.venueName && (
              <p className="font-sans text-sm text-[#f1faee]/30 mt-1">{wedding.venueName}</p>
            )}
          </div>

          <div className="flex gap-16">
            <div>
              <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#a8dadc]/70 mb-4 font-semibold">
                Sayfalar
              </p>
              <ul className="space-y-2.5">
                {pageLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="font-sans text-sm text-[#f1faee]/55 hover:text-[#a8dadc] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#a8dadc]/70 mb-4 font-semibold">
                {t("contactLabel")}
              </p>
              <ul className="space-y-2.5">
                {wedding.venueName && (
                  <li className="font-sans text-sm text-[#f1faee]/55">{wedding.venueName}</li>
                )}
                {wedding.venueAddress && (
                  <li className="font-sans text-sm text-[#f1faee]/40 max-w-[220px]">{wedding.venueAddress}</li>
                )}
                <li>
                  <Link href={`${BASE}/iletisim`} className="font-sans text-sm text-[#f1faee]/55 hover:text-[#a8dadc] transition-colors">
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
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#a8dadc]/25 to-transparent" />
          <WaveIcon size={18} className="text-[#a8dadc]/50" />
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#a8dadc]/25 to-transparent" />
        </div>
      </div>

      <div className="relative max-w-5xl mx-auto px-6 md:px-12 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo className="w-3.5 h-3.5 opacity-40" />
            <p className="font-sans text-[11px] text-[#f1faee]/40">
              Uygun Davet {t("footerCreatedWith")}
            </p>
          </div>
          <Link
            href="https://uygundavet.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[11px] text-[#f1faee]/30 hover:text-[#f1faee]/60 transition-colors"
          >
            {t("footerPrivacy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
