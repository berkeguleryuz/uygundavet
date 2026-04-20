"use client";

import { useState, useRef, useEffect, useId } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { THEME_OPTIONS } from "@/lib/themes";
import { useSupportStore } from "@/store/support-store";

function ChatSmileGlyph({ className }: { className?: string }) {
  const maskId = useId();
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <rect width="24" height="24" fill="white" />
          <circle cx="8" cy="10" r="1" fill="black">
            <animate
              attributeName="r"
              values="0.6;1.4;0.6"
              keyTimes="0;0.5;1"
              dur="1.2s"
              begin="0s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6;1;0.6"
              keyTimes="0;0.5;1"
              dur="1.2s"
              begin="0s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="12" cy="10" r="1" fill="black">
            <animate
              attributeName="r"
              values="0.6;1.4;0.6"
              keyTimes="0;0.5;1"
              dur="1.2s"
              begin="0.2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6;1;0.6"
              keyTimes="0;0.5;1"
              dur="1.2s"
              begin="0.2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="16" cy="10" r="1" fill="black">
            <animate
              attributeName="r"
              values="0.6;1.4;0.6"
              keyTimes="0;0.5;1"
              dur="1.2s"
              begin="0.4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6;1;0.6"
              keyTimes="0;0.5;1"
              dur="1.2s"
              begin="0.4s"
              repeatCount="indefinite"
            />
          </circle>
        </mask>
      </defs>
      <path
        mask={`url(#${maskId})`}
        d="M6 3.5A2.5 2.5 0 0 0 3.5 6v8A2.5 2.5 0 0 0 6 16.5h1.3v2.6c0 .57.68.87 1.1.48l3.4-3.08H18a2.5 2.5 0 0 0 2.5-2.5V6A2.5 2.5 0 0 0 18 3.5H6Z"
      />
    </svg>
  );
}

export function MainBottomBar() {
  const t = useTranslations("Navbar");
  const tSupport = useTranslations("Support");
  const toggleSupport = useSupportStore((s) => s.toggle);
  const supportOpen = useSupportStore((s) => s.isOpen);
  const [isThemesOpen, setIsThemesOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const popRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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
    <>
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[55] px-2 sm:px-3 max-w-[calc(00vw-1rem)]">
      <div className="flex items-center gap-3 sm:gap-5 rounded-full bg-[#1c1a1b]/90 backdrop-blur-md border border-white/10 p-1.5 pl-0 pr-2 sm:p-2 shadow-[0_10px_40px_-8px_rgba(0,0,0,0.7)]">
        <Link
          href="/"
          aria-label="Uygun Davet"
          className="shrink-0 w-14 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
        >
          <Image
            src="/logo-gold-transparent.png"
            alt=""
            width={36}
            height={36}
            className="object-contain w-9 h-9 sm:w-10 sm:h-10"
          />
        </Link>

        <div ref={popRef} className="relative">
          <button
            onClick={() => setIsThemesOpen((v) => !v)}
            className="flex items-center gap-1.5 sm:gap-2 rounded-full h-11 sm:h-14 px-3 sm:px-7 text-white/85 font-chakra text-[11px] sm:text-sm tracking-[0.12em] sm:tracking-[0.15em] uppercase font-semibold hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            aria-expanded={isThemesOpen}
          >
            {t("themes")}
            <ChevronUp
              className={cn(
                "w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform",
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
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[240px] bg-[#1c1a1b] rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
              >
                <div className="py-2">
                  {THEME_OPTIONS.map((theme) => (
                    <Link
                      key={theme.key}
                      href={`/${theme.key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsThemesOpen(false)}
                      className="flex items-center px-5 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors font-sans text-sm capitalize"
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
          className="flex items-center rounded-full h-11 sm:h-14 px-4 sm:px-7 bg-white text-[#1c1a1b] font-chakra text-[11px] sm:text-sm tracking-[0.12em] sm:tracking-[0.15em] uppercase font-semibold hover:bg-white/90 transition-colors whitespace-nowrap"
        >
          {t("buyNow")}
        </Link>

        {isMobile && (
          <button
            type="button"
            onClick={toggleSupport}
            aria-label={supportOpen ? tSupport("close") : tSupport("openSupport")}
            aria-expanded={supportOpen}
            className="relative shrink-0 w-11 h-11 rounded-full flex items-center justify-center bg-[#d5d1ad] text-[#1c1a1b] hover:bg-[#c9c39b] transition-colors cursor-pointer"
          >
            <ChatSmileGlyph className="w-5 h-5" />
            {!supportOpen && (
              <span
                className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-[#ef4444]"
                style={{ boxShadow: "0 0 0 2px #d5d1ad" }}
              />
            )}
          </button>
        )}
      </div>
    </div>

    {!isMobile && (
      <button
        type="button"
        onClick={toggleSupport}
        aria-label={supportOpen ? tSupport("close") : tSupport("openSupport")}
        aria-expanded={supportOpen}
        className="fixed right-6 bottom-5 z-[56] w-16 h-16 rounded-full flex items-center justify-center bg-white text-[#1c1a1b] hover:bg-white/90 transition-colors cursor-pointer shadow-[0_18px_40px_-12px_rgba(0,0,0,0.45)] border border-black/5"
      >
        <ChatSmileGlyph className="w-7 h-7" />
        {!supportOpen && (
          <span
            className="absolute top-1 right-1 w-3 h-3 rounded-full bg-[#ef4444]"
            style={{ boxShadow: "0 0 0 2px #ffffff" }}
          />
        )}
      </button>
    )}
    </>
  );
}
