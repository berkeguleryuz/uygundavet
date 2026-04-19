"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, ArrowUpRight, ChevronRight, LogOut } from "lucide-react";
import { useRouter, usePathname } from "@/i18n/navigation";
import Link from "next/link";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { authClient } from "@/lib/auth-client";
import axios from "axios";

const springTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
};

export function PillNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [subEmail, setSubEmail] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { data: session } = authClient.useSession();
  const t = useTranslations("PillNav");
  const tNav = useTranslations("Navbar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);

  const [isOverLight, setIsOverLight] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const collapsed = (isScrolled || isMobile) && !isOpen;

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!isOpen) {
      const delta = latest - lastScrollY.current;

      if (latest <= 50) {
        setIsScrolled(false);
      } else if (delta > 5) {
        setIsScrolled(true);
      } else if (delta < -5) {
        setIsScrolled(false);
      }

      lastScrollY.current = latest;
    }

    const navY = 48;
    const lightSections = document.querySelectorAll('[data-theme="light"]');
    let overLight = false;
    lightSections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (navY >= rect.top && navY <= rect.bottom) {
        overLight = true;
      }
    });
    setIsOverLight(overLight);
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const moreRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isMoreOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isMoreOpen]);

  const toggleMenu = () => {
    if (isScrolled) setIsScrolled(false);
    setIsOpen((prev) => !prev);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail || subStatus === "loading") return;
    setSubStatus("loading");
    try {
      await axios.post("/api/subscribe", { email: subEmail });
      setSubStatus("success");
      setSubEmail("");
      setTimeout(() => setSubStatus("idle"), 3000);
    } catch {
      setSubStatus("error");
      setTimeout(() => setSubStatus("idle"), 3000);
    }
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
      <nav className="fixed top-5 left-0 right-0 z-[60] px-6 md:px-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer">
            <Logo className="w-[42px] h-[42px]" />
            <span className={cn("font-merienda font-bold text-xl hidden sm:block", isOverLight ? "text-[#252224]" : "text-foreground")}>
              {tNav("brand")}
            </span>
          </Link>

          <div className={cn(
            "hidden md:flex items-center rounded-full backdrop-blur-sm border overflow-hidden",
            isOverLight ? "bg-black/8 border-black/10" : "bg-white/10 border-white/10"
          )}>
            {routing.locales.map((loc) => (
              <button
                key={loc}
                onClick={() => switchLocale(loc)}
                className={cn(
                  "px-2.5 py-1.5 text-[11px] font-sans uppercase font-medium transition-all duration-200",
                  locale === loc
                    ? isOverLight
                      ? "bg-[#252224] text-white rounded-full"
                      : "bg-white text-[#1c1a1b] rounded-full"
                    : isOverLight
                      ? "text-[#252224]/50 hover:text-[#252224]"
                      : "text-white/50 hover:text-white"
                )}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        <div
          className={cn(
            "flex items-center transition-all duration-500 ease-out",
            collapsed
              ? "gap-[2px] rounded-full p-[2px]"
              : "gap-3"
          )}
        >
          <div ref={moreRef} className="relative hidden md:block">
            <button onClick={() => { setIsOpen(false); setIsMoreOpen((prev) => !prev); }} className="group/talk flex rounded-full bg-[#1c1a1b]! text-white items-center justify-center h-14 px-10 cursor-pointer overflow-hidden liquid-glass">
              <div className="flex items-center">
                <div className="w-0 overflow-hidden opacity-0 group-hover/talk:w-6 group-hover/talk:opacity-100 transition-all duration-500 ease-out">
                  <ChevronRight className="w-5 h-5 shrink-0" />
                </div>

                <div className="relative overflow-hidden h-[18px]">
                  <span className="block font-chakra text-base tracking-[0.1em] uppercase font-semibold leading-[18px] transition-transform duration-500 ease-out group-hover/talk:-translate-y-full whitespace-nowrap">
                    {session ? (session.user.name || session.user.email.split("@")[0]) : t("more")}
                  </span>
                  <span
                    className="block font-chakra text-base tracking-[0.1em] uppercase font-semibold leading-[18px] transition-transform duration-500 ease-out group-hover/talk:-translate-y-full whitespace-nowrap"
                    aria-hidden="true"
                  >
                    {session ? (session.user.name || session.user.email.split("@")[0]) : t("more")}
                  </span>
                </div>
              </div>
            </button>

            <AnimatePresence>
              {isMoreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.97 }}
                  transition={springTransition}
                  className="absolute top-full right-0 mt-3 w-[280px]"
                >
                  <div className="bg-white rounded-[20px] overflow-hidden shadow-xl">
                    <div className="px-6 py-5">
                      {[
                        ...(!session ? [
                          { key: "register", href: "/login?mode=register" },
                          { key: "loginLink", href: "/login" },
                        ] : []),
                        { key: "dashboard", href: session ? "/dashboard" : "/login" },
                        { key: "profile", href: session ? "/dashboard/ayarlar" : "/login" },
                      ].map((item, i) => (
                        <motion.div
                          key={item.key}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.03 + i * 0.04 }}
                        >
                          <Link
                            href={item.href}
                            className="flex items-center justify-between py-3 group/mlink"
                            onClick={() => setIsMoreOpen(false)}
                          >
                            <span className="font-chakra text-sm uppercase tracking-[0.12em] text-[#1c1a1b] font-semibold group-hover/mlink:translate-x-1.5 transition-transform duration-200">
                              {t(item.key)}
                            </span>
                            <ChevronRight className="w-4 h-4 text-[#1c1a1b]/30 group-hover/mlink:text-[#1c1a1b] transition-colors duration-200" />
                          </Link>
                        </motion.div>
                      ))}
                      {session && (
                        <motion.div
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.12 }}
                        >
                          <button
                            className="flex items-center gap-2 py-3 w-full cursor-pointer group/mlink"
                            onClick={() => {
                              setIsMoreOpen(false);
                              authClient.signOut().then(() => {
                                window.location.href = "/";
                              });
                            }}
                          >
                            <LogOut className="w-4 h-4 text-red-500" />
                            <span className="font-chakra text-sm uppercase tracking-[0.12em] text-red-500 font-semibold group-hover/mlink:translate-x-1.5 transition-transform duration-200">
                              {t("logout")}
                            </span>
                          </button>
                        </motion.div>
                      )}
                    </div>
                    <div className="border-t border-black/5 px-6 py-4">
                      <Link
                        href="/demo"
                        className="flex items-center gap-2 text-sm font-sans text-[#1c1a1b]/60 hover:text-[#1c1a1b] transition-colors duration-200"
                        onClick={() => setIsMoreOpen(false)}
                      >
                        <span>{t("viewDemo")}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            onClick={toggleMenu}
            className={cn(
              "group/menu rounded-full flex items-center justify-center cursor-pointer overflow-hidden transition-[background-color,color,box-shadow] duration-300",
              isOpen
                ? "bg-white text-[#1c1a1b] shadow-lg"
                : "bg-[#dddde0] text-[#1c1a1b]"
            )}
            animate={{
              height: 48,
              paddingLeft: collapsed ? 18 : 28,
              paddingRight: collapsed ? 18 : 24,
            }}
            transition={springTransition}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.div
              className="hidden md:block overflow-hidden"
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
        </div>
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
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={springTransition}
              className="fixed top-[90px] right-6 md:right-10 z-[56] w-[92vw] max-w-[420px]"
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
                      onClick={() => setIsOpen(false)}
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
                {subStatus === "success" ? (
                  <p className="text-green-600 text-sm font-sans py-3.5 px-5">
                    {t("subscribeSuccess")}
                  </p>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex items-center bg-[#f0f0f5] rounded-full overflow-hidden">
                    <input
                      type="email"
                      required
                      value={subEmail}
                      onChange={(e) => setSubEmail(e.target.value)}
                      placeholder={t("emailPlaceholder")}
                      className="flex-1 bg-transparent px-5 py-3.5 text-sm text-[#1c1a1b] placeholder:text-black/35 outline-none font-sans"
                    />
                    <button
                      type="submit"
                      disabled={subStatus === "loading"}
                      className="w-11 h-11 flex items-center justify-center mr-1 rounded-full hover:bg-black/5 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <ArrowRight className="w-4 h-4 text-[#1c1a1b]" />
                    </button>
                  </form>
                )}
              </motion.div>

              <motion.a
                href="https://clodron.com"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#1c1a1b] text-white rounded-[24px] mt-2.5 px-7 py-5 flex items-center justify-between group/labs"
              >
                <div className="flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/clodronlogo.png"
                    alt="Clodron"
                    className="w-24 h-6 object-contain -ml-1"
                  />
                  <span className="font-chakra text-[11px] uppercase tracking-[0.15em] font-medium leading-none opacity-60">
                    {t("labs")}
                  </span>
                </div>
                <ArrowUpRight className="w-5 h-5 group-hover/labs:translate-x-0.5 group-hover/labs:-translate-y-0.5 transition-transform" />
              </motion.a>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </>
  );
}
