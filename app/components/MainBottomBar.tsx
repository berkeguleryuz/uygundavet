"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { THEME_OPTIONS } from "@/lib/themes";

export function MainBottomBar() {
  const t = useTranslations("Navbar");
  const [isThemesOpen, setIsThemesOpen] = useState(false);
  const popRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isThemesOpen) return;
    const handler = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) {
        setIsThemesOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isThemesOpen]);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[55] px-3">
      <div className="flex items-center gap-1.5 rounded-full bg-[#1c1a1b]/90 backdrop-blur-md border border-white/10 p-1.5 shadow-[0_10px_40px_-8px_rgba(0,0,0,0.7)]">
        <Link
          href="/"
          aria-label="Uygun Davet"
          className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
        >
          <Image
            src="/logo-gold-transparent.png"
            alt=""
            width={28}
            height={28}
            className="object-contain"
          />
        </Link>

        <div ref={popRef} className="relative">
          <button
            onClick={() => setIsThemesOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-full h-11 px-4 sm:px-5 text-white/85 font-chakra text-[11px] sm:text-xs tracking-[0.15em] uppercase font-semibold hover:text-white transition-colors cursor-pointer"
            aria-expanded={isThemesOpen}
          >
            {t("themes")}
            <ChevronUp
              className={cn(
                "w-3.5 h-3.5 transition-transform",
                isThemesOpen ? "rotate-0" : "rotate-180"
              )}
            />
          </button>

          <AnimatePresence>
            {isThemesOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[220px] bg-[#1c1a1b] rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
              >
                <div className="py-2">
                  {THEME_OPTIONS.map((theme) => (
                    <Link
                      key={theme.key}
                      href={`/${theme.key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsThemesOpen(false)}
                      className="flex items-center px-5 py-2.5 text-white/80 hover:text-white hover:bg-white/5 transition-colors font-sans text-sm capitalize"
                    >
                      {theme.key}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Link
          href="/#fiyatlar"
          className="flex items-center rounded-full h-11 px-4 sm:px-5 bg-white text-[#1c1a1b] font-chakra text-[11px] sm:text-xs tracking-[0.15em] uppercase font-semibold hover:bg-white/90 transition-colors"
        >
          {t("buyNow")}
        </Link>
      </div>
    </div>
  );
}
