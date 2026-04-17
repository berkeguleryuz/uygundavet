"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { Logo } from "@/app/components/Logo";
import { ArrowRightIcon } from "../_icons/ArrowRightIcon";
import { SunIcon } from "../_icons/SunIcon";
import { HaloIcon } from "../_icons/HaloIcon";

const BASE = "/golden";

export function GoldenFooter() {
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
    <footer className="bg-[#2d2620] relative overflow-hidden">

      <div className="relative max-w-5xl mx-auto px-6 md:px-12 pt-20 pb-8">
        <div className="relative bg-[#4a403a]/60 backdrop-blur-sm border border-[#f4a900]/25 rounded-[2.5rem] p-8 md:p-12 text-center overflow-hidden">
          <HaloIcon size={240} className="absolute -right-10 -top-10 text-[#f4a900]/15" />
          <HaloIcon size={200} className="absolute -left-10 -bottom-10 text-[#c1666b]/15" />

          <div className="relative">
            <div className="flex justify-center mb-5">
              <Image src="/logo-gold-transparent.png" alt="Logo" width={56} height={56} />
            </div>
            <h3 className="font-merienda text-2xl md:text-3xl text-[#faf5ec] mb-3">
              {t("footerCtaHeading")}
            </h3>
            <p className="font-sans text-sm text-[#d4b896]/80 mb-6 max-w-md mx-auto leading-relaxed">
              {t("footerCtaText")}
            </p>
            <Link
              href="https://uygundavet.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#f4a900] text-[#2d2620] rounded-full px-8 py-3 font-sans text-sm font-bold tracking-[0.15em] uppercase hover:bg-[#ffc13d] transition-colors group"
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
            <h3 className="font-merienda text-3xl text-[#f4a900]">
              {brideFirst} &amp; {groomFirst}
            </h3>
            <p className="font-sans text-sm text-[#d4b896]/70 mt-2">{weddingDate}</p>
            {wedding.venueName && (
              <p className="font-sans text-sm text-[#d4b896]/50 mt-1">{wedding.venueName}</p>
            )}
          </div>

          <div className="flex gap-16">
            <div>
              <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#f4a900]/80 mb-4 font-bold">
                Sayfalar
              </p>
              <ul className="space-y-2.5">
                {pageLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="font-sans text-sm text-[#d4b896]/70 hover:text-[#f4a900] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#f4a900]/80 mb-4 font-bold">
                {t("contactLabel")}
              </p>
              <ul className="space-y-2.5">
                {wedding.venueName && (
                  <li className="font-sans text-sm text-[#d4b896]/70">{wedding.venueName}</li>
                )}
                {wedding.venueAddress && (
                  <li className="font-sans text-sm text-[#d4b896]/50 max-w-[220px]">{wedding.venueAddress}</li>
                )}
                <li>
                  <Link href={`${BASE}/iletisim`} className="font-sans text-sm text-[#d4b896]/70 hover:text-[#f4a900] transition-colors">
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
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#f4a900]/30 to-transparent" />
          <SunIcon size={16} className="text-[#f4a900]/50" />
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#f4a900]/30 to-transparent" />
        </div>
      </div>

      <div className="relative max-w-5xl mx-auto px-6 md:px-12 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo className="w-3.5 h-3.5 opacity-40" />
            <p className="font-sans text-[11px] text-[#d4b896]/45">
              Uygun Davet {t("footerCreatedWith")}
            </p>
          </div>
          <Link
            href="https://uygundavet.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[11px] text-[#d4b896]/35 hover:text-[#d4b896]/65 transition-colors"
          >
            {t("footerPrivacy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
