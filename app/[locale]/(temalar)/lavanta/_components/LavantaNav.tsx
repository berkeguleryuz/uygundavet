"use client";

import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWedding } from "../_lib/context";

const BASE = "/lavanta";

interface NavItem {
  label: string;
  href: string;
  accent?: boolean;
}

export function LavantaNav() {
  const wedding = useWedding();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);

  const isHome = pathname === BASE || pathname === `${BASE}/`;

  const navItems: NavItem[] = [
    { label: "Ana Sayfa", href: BASE },
    { label: "Hikayemiz", href: `${BASE}/hikayemiz` },
    { label: "Etkinlik", href: `${BASE}/etkinlik` },
    { label: "Galeri", href: `${BASE}/galeri` },
    { label: "Anı Defteri", href: `${BASE}/ani-defteri` },
    { label: "LCV", href: `${BASE}/lcv`, accent: true },
  ];

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!isOpen) {
      if (latest <= 50) {
        setIsScrolled(false);
      } else if (latest - lastScrollY.current > 5) {
        setIsScrolled(true);
      } else if (lastScrollY.current - latest > 5) {
        setIsScrolled(false);
      }
      lastScrollY.current = latest;
    }
  });

  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  const isActive = (href: string) => {
    if (href === BASE) return isHome;
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] px-3 md:px-6 pt-3">
      <motion.div
        className={cn(
          "max-w-5xl mx-auto flex items-center justify-between rounded-full px-4 md:px-5 h-11 transition-colors duration-300",
          isScrolled || !isHome
            ? "bg-[#252224]/90 backdrop-blur-md border border-white/8 shadow-lg"
            : "bg-white/[0.04] backdrop-blur-sm border border-white/[0.06]"
        )}
      >
        <Link
          href={BASE}
          className="font-merienda text-sm text-[#d5d1ad] hover:text-[#d5d1ad]/80 transition-colors"
        >
          {brideFirst} & {groomFirst}
        </Link>

        <div className="hidden md:flex items-center gap-0.5">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-sans transition-all",
                item.accent
                  ? "bg-[#d5d1ad]/10 border border-[#d5d1ad]/25 text-[#d5d1ad] hover:bg-[#d5d1ad]/20"
                  : isActive(item.href)
                    ? "text-[#d5d1ad]"
                    : "text-white/50 hover:text-white/80"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`${BASE}/iletisim`}
            className="hidden md:block text-xs font-sans text-white/40 hover:text-white/70 transition-colors"
          >
            İletişim
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-1.5 text-white/60 hover:text-white transition-colors"
          >
            {isOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="md:hidden mt-1.5 max-w-5xl mx-auto bg-[#252224]/95 backdrop-blur-md border border-white/8 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="p-3 space-y-0.5">
              {[...navItems, { label: "İletişim", href: `${BASE}/iletisim` }].map(
                (item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center px-3 py-2.5 rounded-lg text-sm font-sans transition-all",
                      isActive(item.href)
                        ? "bg-[#d5d1ad]/10 text-[#d5d1ad]"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
