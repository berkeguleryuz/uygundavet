"use client";

import { useState, useEffect, useMemo } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useWedding } from "../_lib/context";
import { ThemeBottomBar } from "@/app/components/ThemeBottomBar";
import { t } from "../_lib/i18n";
import { MenuIcon } from "../_icons/MenuIcon";
import { CloseIcon } from "../_icons/CloseIcon";
import { UserIcon } from "../_icons/UserIcon";
import Image from "next/image";

const BASE = "/pearl";

interface NavItem {
  label: string;
  href: string;
}

const DARK_SECTIONS_SELECTORS = [
  "[data-section-dark]",
];

const darkPages = ["/ani-defteri", "/etkinlik"];

export function PearlNav() {
  const wedding = useWedding();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkFromScroll, setIsDarkFromScroll] = useState(false);

  const isHome = pathname === BASE || pathname === `${BASE}/`;

  const isOnDarkPage = useMemo(
    () => darkPages.some((p) => pathname.endsWith(p)),
    [pathname]
  );

  const navItems: NavItem[] = [
    { label: t("navHome"), href: BASE },
    { label: t("navStory"), href: `${BASE}/hikayemiz` },
    { label: t("navEvent"), href: `${BASE}/etkinlik` },
    ...(wedding.hasGallery
      ? [{ label: t("navGallery"), href: `${BASE}/galeri` }]
      : []),
    ...(wedding.hasMemoryBook
      ? [{ label: t("navMemory"), href: `${BASE}/ani-defteri` }]
      : []),
  ];

  useEffect(() => {
    if (isOnDarkPage) return;

    const handleScroll = () => {
      const darkSections = document.querySelectorAll(DARK_SECTIONS_SELECTORS.join(","));
      const navHeight = 48;
      const scrollTop = window.scrollY + navHeight + 10;

      let overDark = false;
      darkSections.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const bottom = top + rect.height;
        if (scrollTop >= top && scrollTop <= bottom) {
          overDark = true;
        }
      });
      setIsDarkFromScroll(overDark);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOnDarkPage]);

  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  const isActive = (href: string) => {
    if (href === BASE) return isHome;
    return pathname.startsWith(href);
  };

  const dark = isOnDarkPage || isDarkFromScroll;

  return (
    <>
    <nav aria-label="Ana navigasyon" className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-2rem)] max-w-5xl">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "h-12 rounded-full flex items-center px-4 transition-all duration-500",
          dark
            ? "bg-[#1c1917]/80 backdrop-blur-md border border-white/10 shadow-sm"
            : "bg-white/80 backdrop-blur-md border border-[#1c1917]/[0.06] shadow-sm"
        )}
      >
        <Link
          href={BASE}
          className="shrink-0 flex items-center gap-2 font-merienda text-base font-bold bg-gradient-to-r from-[#b8a088] to-[#c4a296] bg-clip-text text-transparent hover:opacity-70 transition-opacity"
        >
          <Image src="/logo-gold-transparent.png" alt="Logo" width={76} height={76} />
          {brideFirst[0]} & {groomFirst[0]}
        </Link>

        <div className="hidden md:flex items-center justify-center flex-1 gap-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "font-sans text-xs tracking-wide px-3 py-1.5 rounded-full transition-colors",
                isActive(item.href)
                  ? "text-[#b8a088] font-medium"
                  : dark
                    ? "text-white/60 hover:text-white"
                    : "text-[#1c1917]/60 hover:text-[#1c1917]"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Link
            href={`${BASE}/lcv`}
            className={cn(
              "hidden md:inline-flex items-center bg-gradient-to-r from-[#b8a088] to-[#c4a296] text-white rounded-full px-5 py-1.5 font-sans text-xs font-medium tracking-wide transition-opacity hover:opacity-90"
            )}
          >
            {t("navRsvp")}
          </Link>

          <Link
            href={`${BASE}/iletisim`}
            className={cn(
              "hidden md:flex items-center justify-center w-8 h-8 rounded-full transition-colors",
              dark
                ? "text-white/50 hover:text-white"
                : "text-[#1c1917]/40 hover:text-[#1c1917]"
            )}
          >
            <UserIcon className="size-4" size={16} />
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "md:hidden p-2 transition-opacity hover:opacity-70",
              dark ? "text-white" : "text-[#1c1917]"
            )}
            aria-label="Menu"
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <CloseIcon className="size-5" size={20} />
            ) : (
              <MenuIcon className="size-5" size={20} />
            )}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden mt-2 bg-white rounded-3xl shadow-xl border border-[#1c1917]/[0.06] overflow-hidden"
          >
            <div className="px-6 py-5 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block py-2.5 font-sans text-sm tracking-wide transition-colors",
                    isActive(item.href)
                      ? "text-[#b8a088] font-medium"
                      : "text-[#1c1917]/60 hover:text-[#1c1917]"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="h-px bg-[#1c1917]/[0.06] my-2" />
              <Link
                href={`${BASE}/lcv`}
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center bg-gradient-to-r from-[#b8a088] to-[#c4a296] text-white rounded-full px-5 py-2 font-sans text-xs font-medium tracking-wide mt-1"
              >
                {t("navRsvp")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    <ThemeBottomBar
      base="/pearl"
      items={[
        ...(wedding.hasGallery ? [{ label: t("navGallery"), href: "/pearl/galeri" }] : []),
        ...(wedding.hasMemoryBook ? [{ label: t("navMemory"), href: "/pearl/ani-defteri" }] : []),
        { label: t("navRsvp"), href: "/pearl/lcv" },
      ]}
    />
    </>
  );
}
