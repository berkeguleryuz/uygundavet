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

const BASE = "/ocean";

interface NavItem { label: string; href: string; }

const LIGHT_SECTIONS_SELECTORS = ["[data-section-light]"];
const lightPages = ["/lcv", "/iletisim"];

export function OceanNav() {
  const wedding = useWedding();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLightFromScroll, setIsLightFromScroll] = useState(false);

  const isHome = pathname === BASE || pathname === `${BASE}/`;

  const isOnLightPage = useMemo(
    () => lightPages.some((p) => pathname.endsWith(p)),
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
    if (isOnLightPage) return;
    const handleScroll = () => {
      const lightSections = document.querySelectorAll(LIGHT_SECTIONS_SELECTORS.join(","));
      const scrollTop = window.scrollY + 58;
      let overLight = false;
      lightSections.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const bottom = top + rect.height;
        if (scrollTop >= top && scrollTop <= bottom) overLight = true;
      });
      setIsLightFromScroll(overLight);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOnLightPage]);

  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  const isActive = (href: string) => {
    if (href === BASE) return isHome;
    return pathname.startsWith(href);
  };

  const light = isOnLightPage || isLightFromScroll;

  return (
    <nav aria-label="Ocean navigation" className="fixed top-5 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-2rem)] max-w-5xl">
      <motion.div
        initial={{ y: -18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "h-14 rounded-full flex items-center pl-3 pr-2 transition-all duration-500",
          light
            ? "bg-[#f1faee]/90 backdrop-blur-md border border-[#2d8b8b]/25 shadow-[0_10px_30px_-14px_rgba(26,35,50,0.35)]"
            : "bg-[#0d1620]/75 backdrop-blur-md border border-[#a8dadc]/20 shadow-[0_10px_30px_-14px_rgba(0,0,0,0.6)]"
        )}
      >
        <Link
          href={BASE}
          className={cn(
            "shrink-0 flex items-center gap-2 pr-2 transition-opacity hover:opacity-80",
            light ? "text-[#1a2332]" : "text-[#a8dadc]"
          )}
        >
          <Image src="/logo-gold-transparent.png" alt="Logo" width={40} height={40} />
          <span className="font-sans text-[13px] font-bold tracking-[0.1em] uppercase leading-none">
            {brideFirst[0]} · {groomFirst[0]}
          </span>
        </Link>

        <div className="hidden md:flex items-center justify-center flex-1 gap-1 px-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "font-sans text-[11px] tracking-[0.14em] uppercase px-3 py-1.5 rounded-full transition-colors",
                isActive(item.href)
                  ? light
                    ? "text-[#2d8b8b] font-bold"
                    : "text-[#a8dadc] font-bold"
                  : light
                    ? "text-[#1a2332]/60 hover:text-[#1a2332]"
                    : "text-[#f1faee]/55 hover:text-[#f1faee]"
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
              "hidden md:inline-flex items-center rounded-full px-5 py-2 font-sans text-[11px] font-bold tracking-[0.18em] uppercase transition-colors",
              light
                ? "bg-[#1a2332] text-[#f1faee] hover:bg-[#2d8b8b]"
                : "bg-[#2d8b8b] text-[#f1faee] hover:bg-[#3aa0a0]"
            )}
          >
            {t("navRsvp")}
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "md:hidden w-10 h-10 rounded-full flex items-center justify-center transition-colors",
              light
                ? "text-[#1a2332] hover:bg-[#2d8b8b]/10"
                : "text-[#f1faee] hover:bg-white/5"
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
            className="md:hidden mt-2 bg-[#f1faee] rounded-3xl shadow-xl border border-[#2d8b8b]/20 overflow-hidden"
          >
            <div className="px-6 py-5 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block py-2.5 font-sans text-sm tracking-[0.1em] uppercase transition-colors",
                    isActive(item.href)
                      ? "text-[#2d8b8b] font-bold"
                      : "text-[#1a2332]/60 hover:text-[#1a2332]"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="h-px bg-[#2d8b8b]/20 my-2" />
              <Link
                href={`${BASE}/lcv`}
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center bg-[#1a2332] text-[#f1faee] rounded-full px-5 py-2 font-sans text-xs font-bold tracking-[0.18em] uppercase mt-1"
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
