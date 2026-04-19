"use client";

import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWedding } from "../_lib/context";
import { ThemeBottomBar } from "@/app/components/ThemeBottomBar";

const BASE = "/grow";

interface NavItem {
  label: string;
  href: string;
  accent?: boolean;
}

export function GrowNav() {
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
    <>
    <nav className="fixed top-0 left-0 right-0 z-[60] px-3 md:px-6 pt-3">
      <motion.div
        className={cn(
          "max-w-5xl mx-auto flex items-center justify-between rounded-full px-2 md:px-3 h-11 transition-colors duration-300",
          isScrolled || !isHome
            ? "bg-[#252224]/90 backdrop-blur-md border border-white/8 shadow-lg"
            : "bg-white/[0.04] backdrop-blur-sm border border-white/[0.06]"
        )}
      >
        <Link
          href={BASE}
          className="flex items-center gap-2 pl-1 shrink-0"
        >
          <Image
            src="/logo-gold-transparent.png"
            alt="Uygun Davet"
            width={22}
            height={22}
            className="opacity-60"
          />
          <span className="font-merienda text-sm text-[#d5d1ad] hover:text-[#d5d1ad]/80 transition-colors">
            {brideFirst} & {groomFirst}
          </span>
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

        <div className="flex items-center gap-1.5">
          <Link
            href="https://uygundavet.com/login" target="_blank" rel="noopener noreferrer"
            className="hidden md:flex items-center justify-center size-7 rounded-full bg-white/[0.06] border border-white/[0.08] hover:bg-white/10 transition-colors"
          >
            <User className="size-3.5 text-white/50" />
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
              {navItems.map((item) => (
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
              ))}
              <div className="h-px bg-white/[0.06] my-1" />
              <Link
                href="https://uygundavet.com/login" target="_blank" rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-sans text-white/60 hover:bg-white/5 hover:text-white transition-all"
              >
                <User className="size-3.5" />
                Giriş Yap
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    <ThemeBottomBar
      base="/grow"
      items={[
        ...(wedding.hasGallery ? [{ label: "Galeri", href: "/grow/galeri" }] : []),
        ...(wedding.hasMemoryBook ? [{ label: "Anı Defteri", href: "/grow/ani-defteri" }] : []),
        { label: "LCV", href: "/grow/lcv" },
      ]}
    />
    </>
  );
}
