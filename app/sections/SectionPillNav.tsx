"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Logo } from "../components/Logo";

const springTransition = {
  type: "spring" as const,
  stiffness: 360,
  damping: 28,
};

export function SectionPillNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const t = useTranslations("PillNav");
  const tNav = useTranslations("Navbar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { scrollY } = useScroll();

  const collapsed = isScrolled && !isOpen;

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!isOpen) {
      setIsScrolled(latest > 50);
    }
  });

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleMenu = () => {
    if (isScrolled) {
      setIsScrolled(false);
    }
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as "tr" | "en" | "de" });
  };

  const navLinks = [
    { key: "features", label: tNav("features"), href: "#ozellikler", active: true },
    { key: "howItWorks", label: tNav("howItWorks"), href: "#nasil-calisir", active: false },
    { key: "pricing", label: tNav("pricing"), href: "#fiyatlar", active: false },
    { key: "themes", label: tNav("themes"), href: "#temalar", active: false },
  ];

  return (
    <>
      <svg className="absolute h-0 w-0">
        <defs>
          <filter id="pill-nav-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <nav className="fixed top-5 left-0 right-0 z-[60] px-6 md:px-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <Logo className="w-7 h-7" />
            <span className="font-chakra font-bold text-lg text-foreground hidden sm:block">
              {tNav("brand")}
            </span>
          </div>

          <div className="flex items-center rounded-full bg-white/10 backdrop-blur-sm border border-white/10 overflow-hidden">
            {routing.locales.map((loc) => (
              <button
                key={loc}
                onClick={() => switchLocale(loc)}
                className={cn(
                  "px-2.5 py-1.5 text-[11px] font-sans uppercase font-medium transition-all duration-200",
                  locale === loc
                    ? "bg-white text-[#1c1a1b] rounded-full"
                    : "text-white/50 hover:text-white"
                )}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          className="relative flex items-center"
          animate={{
            paddingLeft: collapsed ? 0 : 16,
            paddingRight: collapsed ? 0 : 16,
            gap: collapsed ? 0 : 12,
          }}
          transition={springTransition}
        >
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -left-6 -right-6 z-0"
            animate={{
              opacity: collapsed ? 1 : 0,
              scale: collapsed ? 1 : 0.82,
            }}
            transition={springTransition}
            style={{ filter: "url(#pill-nav-goo)" }}
          >
            <motion.span
              className="absolute left-2 top-1/2 rounded-full bg-[#1c1a1b]/72"
              animate={{
                x: collapsed ? 6 : 20,
                y: "-50%",
                width: collapsed ? 18 : 8,
                height: collapsed ? 18 : 8,
                opacity: collapsed ? 1 : 0,
              }}
              transition={springTransition}
            />
            <motion.span
              className="absolute left-8 top-1/2 rounded-full bg-[#1c1a1b]/55"
              animate={{
                x: collapsed ? 0 : 14,
                y: "-50%",
                width: collapsed ? 10 : 4,
                height: collapsed ? 10 : 4,
                opacity: collapsed ? 0.9 : 0,
              }}
              transition={springTransition}
            />
            <motion.span
              className="absolute left-1/2 top-1/2 rounded-full bg-[#a8a7ac]/88"
              animate={{
                x: "-50%",
                y: "-50%",
                width: collapsed ? 42 : 0,
                height: collapsed ? 28 : 0,
                scaleX: collapsed ? 1.15 : 0.2,
                scaleY: collapsed ? 1 : 0.6,
                opacity: collapsed ? 1 : 0,
              }}
              transition={springTransition}
            />
            <motion.span
              className="absolute right-8 top-1/2 rounded-full bg-[#dddde0]/62"
              animate={{
                x: collapsed ? 0 : -14,
                y: "-50%",
                width: collapsed ? 10 : 4,
                height: collapsed ? 10 : 4,
                opacity: collapsed ? 0.9 : 0,
              }}
              transition={springTransition}
            />
            <motion.span
              className="absolute right-2 top-1/2 rounded-full bg-[#dddde0]/85"
              animate={{
                x: collapsed ? -6 : -20,
                y: "-50%",
                width: collapsed ? 18 : 8,
                height: collapsed ? 18 : 8,
                opacity: collapsed ? 1 : 0,
              }}
              transition={springTransition}
            />
          </motion.div>

          <motion.a
            href="#iletisim"
            onClick={closeMenu}
            className="group/talk rounded-full bg-[#1c1a1b] text-white flex items-center justify-center h-14 px-10 cursor-pointer overflow-hidden relative z-[1]"
            animate={{
              x: collapsed ? 7 : 0,
              scaleX: collapsed ? 1.045 : 1,
              scaleY: collapsed ? 0.94 : 1,
            }}
            transition={springTransition}
          >
            <div className="flex items-center">
              <div className="w-0 overflow-hidden opacity-0 group-hover/talk:w-6 group-hover/talk:opacity-100 transition-all duration-500 ease-out">
                <ChevronRight className="w-5 h-5 shrink-0" />
              </div>

              <div className="relative overflow-hidden h-[18px]">
                <span className="block font-chakra text-base tracking-[0.1em] uppercase font-semibold leading-[18px] transition-transform duration-500 ease-out group-hover/talk:-translate-y-full">
                  {t("letsTalk")}
                </span>
                <span
                  className="block font-chakra text-base tracking-[0.1em] uppercase font-semibold leading-[18px] transition-transform duration-500 ease-out group-hover/talk:-translate-y-full"
                  aria-hidden="true"
                >
                  {t("letsTalk")}
                </span>
              </div>
            </div>
          </motion.a>

          <motion.button
            onClick={toggleMenu}
            className={cn(
              "group/menu rounded-full flex items-center justify-center cursor-pointer overflow-hidden transition-[background-color,color,box-shadow] duration-300 relative z-[1]",
              isOpen
                ? "bg-white text-[#1c1a1b] shadow-lg"
                : "bg-[#dddde0] text-[#1c1a1b]"
            )}
            animate={{
              x: collapsed ? -7 : 0,
              height: 56,
              paddingLeft: collapsed ? 22 : 28,
              paddingRight: collapsed ? 22 : 24,
              scaleX: collapsed ? 1.065 : 1,
              scaleY: collapsed ? 0.94 : 1,
            }}
            transition={springTransition}
            whileHover={{ scale: collapsed ? 1.04 : 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.div
              className="overflow-hidden"
              animate={{
                width: collapsed ? 0 : "auto",
                opacity: collapsed ? 0 : 1,
                marginRight: collapsed ? 0 : 12,
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative overflow-hidden h-[18px]">
                <span className="block font-chakra text-base tracking-[0.1em] uppercase font-semibold leading-[18px] whitespace-nowrap transition-transform duration-500 ease-out group-hover/menu:-translate-y-full">
                  {isOpen ? t("close") : t("menu")}
                </span>
                <span
                  className="block font-chakra text-base tracking-[0.1em] uppercase font-semibold leading-[18px] whitespace-nowrap transition-transform duration-500 ease-out group-hover/menu:-translate-y-full"
                  aria-hidden="true"
                >
                  {isOpen ? t("close") : t("menu")}
                </span>
              </div>
            </motion.div>
            <motion.div
              className="flex shrink-0 gap-[5px]"
              animate={{ rotate: collapsed || isOpen ? 90 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span className="w-2 h-2 rounded-full bg-[#1c1a1b]" />
              <span className="w-2 h-2 rounded-full bg-[#1c1a1b]" />
            </motion.div>
          </motion.button>
        </motion.div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[55]"
              onClick={closeMenu}
            />

            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={springTransition}
              className="fixed top-[76px] right-6 md:right-10 z-[56] w-[92vw] max-w-[420px]"
            >
              <div className="bg-white rounded-[24px] overflow-hidden">
                <div className="px-7 py-6">
                  {navLinks.map((link, i) => (
                    <motion.a
                      key={link.key}
                      href={link.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.05 }}
                      className="flex items-center justify-between py-3.5 group/link"
                      onClick={closeMenu}
                    >
                      <span className="font-chakra text-base md:text-lg uppercase tracking-[0.12em] text-[#1c1a1b] font-semibold group-hover/link:translate-x-1.5 transition-transform duration-200">
                        {link.label}
                      </span>
                      {link.active && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#1c1a1b]" />
                      )}
                    </motion.a>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-[24px] mt-2.5 px-7 py-7"
              >
                <h3 className="font-merienda text-xl md:text-2xl text-[#1c1a1b] mb-5 leading-tight">
                  {t("subscribeHeading")}
                </h3>
                <div className="flex items-center bg-[#f0f0f5] rounded-full overflow-hidden">
                  <input
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    className="flex-1 bg-transparent px-5 py-3.5 text-sm text-[#1c1a1b] placeholder:text-black/35 outline-none font-sans"
                  />
                  <button className="w-11 h-11 flex items-center justify-center mr-1 rounded-full hover:bg-black/5 transition-colors">
                    <ArrowRight className="w-4 h-4 text-[#1c1a1b]" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
