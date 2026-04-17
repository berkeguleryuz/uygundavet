"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { MenuIcon } from "../_icons/MenuIcon";
import { CloseIcon } from "../_icons/CloseIcon";

const BASE = "/golden";

interface NavItem { label: string; href: string; }

const DARK_SECTIONS_SELECTORS = ["[data-section-dark]"];
const darkPages = ["/ani-defteri"];

export function GoldenNav() {
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
    ...(wedding.hasGallery ? [{ label: t("navGallery"), href: `${BASE}/galeri` }] : []),
    ...(wedding.hasMemoryBook ? [{ label: t("navMemory"), href: `${BASE}/ani-defteri` }] : []),
  ];

  useEffect(() => {
    if (isOnDarkPage) return;
    const handleScroll = () => {
      const darkSections = document.querySelectorAll(DARK_SECTIONS_SELECTORS.join(","));
      const scrollTop = window.scrollY + 58;
      let overDark = false;
      darkSections.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const bottom = top + rect.height;
        if (scrollTop >= top && scrollTop <= bottom) overDark = true;
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
    <nav aria-label="Golden navigation" className="fixed top-5 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-2rem)] max-w-5xl">
      <motion.div
        initial={{ y: -18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "h-14 rounded-full flex items-center pl-3 pr-2 transition-all duration-500",
          dark
            ? "bg-[#2d2620]/85 backdrop-blur-md border border-[#f4a900]/30 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)]"
            : "bg-[#faf5ec]/90 backdrop-blur-md border border-[#c1666b]/20 shadow-[0_10px_30px_-14px_rgba(74,64,58,0.3)]"
        )}
      >
        <Link
          href={BASE}
          className={cn(
            "shrink-0 flex items-center gap-2 pr-2 transition-opacity hover:opacity-80",
            dark ? "text-[#f4a900]" : "text-[#4a403a]"
          )}
        >
          <Image src="/logo-gold-transparent.png" alt="Logo" width={40} height={40} />
          <span className="font-merienda text-[15px] font-bold leading-none">
            {brideFirst[0]} &amp; {groomFirst[0]}
          </span>
        </Link>

        <div className="hidden md:flex items-center justify-center flex-1 gap-1 px-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "font-sans text-[11px] tracking-[0.1em] uppercase px-3 py-1.5 rounded-full transition-colors",
                isActive(item.href)
                  ? dark
                    ? "text-[#f4a900] font-bold"
                    : "text-[#c1666b] font-bold"
                  : dark
                    ? "text-[#d4b896]/70 hover:text-[#d4b896]"
                    : "text-[#4a403a]/60 hover:text-[#4a403a]"
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
              "hidden md:inline-flex items-center rounded-full px-5 py-2 font-sans text-[11px] font-bold tracking-[0.15em] uppercase transition-colors",
              dark
                ? "bg-[#f4a900] text-[#2d2620] hover:bg-[#ffc13d]"
                : "bg-[#4a403a] text-[#faf5ec] hover:bg-[#c1666b]"
            )}
          >
            {t("navRsvp")}
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "md:hidden w-10 h-10 rounded-full flex items-center justify-center transition-colors",
              dark
                ? "text-[#faf5ec] hover:bg-white/5"
                : "text-[#4a403a] hover:bg-[#f4a900]/10"
            )}
            aria-label="Menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
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
            className="md:hidden mt-2 bg-[#faf5ec] rounded-3xl shadow-xl border border-[#c1666b]/20 overflow-hidden"
          >
            <div className="px-6 py-5 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block py-2.5 font-sans text-sm tracking-[0.08em] uppercase transition-colors",
                    isActive(item.href)
                      ? "text-[#c1666b] font-bold"
                      : "text-[#4a403a]/60 hover:text-[#4a403a]"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="h-px bg-[#c1666b]/20 my-2" />
              <Link
                href={`${BASE}/lcv`}
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center bg-[#4a403a] text-[#faf5ec] rounded-full px-5 py-2 font-sans text-xs font-bold tracking-[0.15em] uppercase mt-1"
              >
                {t("navRsvp")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
