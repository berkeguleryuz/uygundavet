"use client";

import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { MenuIcon } from "../_icons/MenuIcon";
import { CloseIcon } from "../_icons/CloseIcon";

const BASE = "/crystal";

interface NavItem {
  label: string;
  href: string;
}

export function CrystalNav() {
  const wedding = useWedding();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  const isHome = pathname === BASE || pathname === `${BASE}/`;

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

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!isOpen) {
      setIsScrolled(latest > 50);
    }
  });

  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  const isActive = (href: string) => {
    if (href === BASE) return isHome;
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[60] h-16 flex items-center px-6 md:px-12 transition-all duration-500",
        isScrolled || !isHome
          ? "bg-[#f6f3ee]/90 backdrop-blur-sm border-b border-[#1a1a2e]/[0.04]"
          : "bg-transparent"
      )}
    >
      {/* Left: Couple initials */}
      <Link
        href={BASE}
        className="shrink-0 font-merienda text-lg text-[#1a1a2e] hover:opacity-70 transition-opacity"
      >
        {brideFirst[0]} & {groomFirst[0]}
      </Link>

      {/* Center: Nav links separated by dots — desktop only */}
      <div className="hidden md:flex items-center justify-center flex-1 gap-1">
        {navItems.map((item, idx) => (
          <div key={item.label} className="flex items-center gap-1">
            {idx > 0 && (
              <span className="text-[#6d6a75]/40 text-[10px] mx-1">&middot;</span>
            )}
            <Link
              href={item.href}
              className={cn(
                "font-sans text-[11px] tracking-[0.15em] uppercase transition-colors",
                isActive(item.href)
                  ? "text-[#1a1a2e]"
                  : "text-[#6d6a75] hover:text-[#1a1a2e]"
              )}
            >
              {item.label}
            </Link>
          </div>
        ))}
      </div>

      {/* Right: LCV pill + mobile hamburger */}
      <div className="flex items-center gap-3 ml-auto">
        <Link
          href={`${BASE}/lcv`}
          className={cn(
            "hidden md:inline-flex items-center border border-[#1a1a2e]/20 rounded-full px-4 py-1 font-sans text-[11px] tracking-[0.15em] uppercase transition-colors",
            pathname.startsWith(`${BASE}/lcv`)
              ? "bg-[#1a1a2e] text-white border-[#1a1a2e]"
              : "text-[#1a1a2e] hover:bg-[#1a1a2e]/5"
          )}
        >
          {t("navRsvp")}
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-[#1a1a2e] hover:opacity-70 transition-opacity"
          aria-label="Menu"
        >
          {isOpen ? (
            <CloseIcon className="size-5" size={20} />
          ) : (
            <MenuIcon className="size-5" size={20} />
          )}
        </button>
      </div>

      {/* Mobile slide-down panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden absolute top-16 left-0 right-0 bg-[#f6f3ee] border-b border-[#1a1a2e]/[0.06]"
          >
            <div className="px-6 py-6 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block py-2.5 font-sans text-sm tracking-wide transition-colors",
                    isActive(item.href)
                      ? "text-[#1a1a2e]"
                      : "text-[#6d6a75] hover:text-[#1a1a2e]"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="h-px bg-[#1a1a2e]/[0.06] my-2" />
              <Link
                href={`${BASE}/lcv`}
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center border border-[#1a1a2e]/20 rounded-full px-5 py-2 font-sans text-[11px] tracking-[0.15em] uppercase text-[#1a1a2e] hover:bg-[#1a1a2e]/5 transition-colors mt-1"
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
