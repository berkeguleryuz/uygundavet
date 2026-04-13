"use client";

import Link from "next/link";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { Logo } from "@/app/components/Logo";
import { ArrowRightIcon } from "../_icons/ArrowRightIcon";

const BASE = "/crystal";

export function CrystalFooter() {
  const wedding = useWedding();
  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  const weddingDate = new Date(wedding.weddingDate).toLocaleDateString(
    "tr-TR",
    { day: "numeric", month: "long", year: "numeric" }
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
    <footer>
      {/* Top section — two columns */}
      <div className="bg-[#eee9e2]">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-16">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12">
            {/* Left: Couple name + date */}
            <div>
              <h3 className="font-merienda text-3xl text-[#1a1a2e]">
                {brideFirst} & {groomFirst}
              </h3>
              <p className="font-sans text-sm text-[#6d6a75] mt-2">
                {weddingDate}
              </p>
              {wedding.venueName && (
                <p className="font-sans text-sm text-[#a09ba6] mt-1">
                  {wedding.venueName}
                </p>
              )}
            </div>

            {/* Right: Nav columns */}
            <div className="flex gap-16">
              {/* Pages column */}
              <div>
                <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#a09ba6] mb-4">
                  Sayfalar
                </p>
                <ul className="space-y-2.5">
                  {pageLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="font-sans text-sm text-[#6d6a75] hover:text-[#1a1a2e] transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact column */}
              <div>
                <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#a09ba6] mb-4">
                  {t("contactLabel")}
                </p>
                <ul className="space-y-2.5">
                  {wedding.venueName && (
                    <li className="font-sans text-sm text-[#6d6a75]">
                      {wedding.venueName}
                    </li>
                  )}
                  {wedding.venueAddress && (
                    <li className="font-sans text-sm text-[#6d6a75] max-w-[200px]">
                      {wedding.venueAddress}
                    </li>
                  )}
                  <li>
                    <Link
                      href={`${BASE}/iletisim`}
                      className="font-sans text-sm text-[#6d6a75] hover:text-[#1a1a2e] transition-colors"
                    >
                      {t("contactLabel")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#eee9e2]">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="border-t border-[#1a1a2e]/[0.06]" />
        </div>
      </div>

      {/* Bottom section */}
      <div className="bg-[#eee9e2]">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Left: Created with */}
            <div className="flex items-center gap-2">
              <Logo className="w-3.5 h-3.5 opacity-40" />
              <p className="font-sans text-[11px] text-[#a09ba6]">
                Uygun Davet {t("footerCreatedWith")}
              </p>
            </div>

            {/* Center: CTA text link */}
            <Link
              href="https://uygundavet.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-sans text-[11px] text-[#6d6a75] hover:text-[#1a1a2e] transition-colors group"
            >
              {t("footerCtaHeading")}
              <ArrowRightIcon className="size-3 group-hover:translate-x-0.5 transition-transform" size={12} />
            </Link>

            {/* Right: Privacy */}
            <Link
              href="https://uygundavet.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[11px] text-[#a09ba6] hover:text-[#6d6a75] transition-colors"
            >
              {t("footerPrivacy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
