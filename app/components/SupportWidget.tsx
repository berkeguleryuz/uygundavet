"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  HelpCircle,
  Home,
  Megaphone,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSupportStore } from "@/store/support-store";
import { useSalesStore } from "@/store/sales-store";
import { THEME_OPTIONS } from "@/lib/themes";

const WHATSAPP_NUMBER = "905546789780";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

const BG_LIGHT = "#f5f6f3";
const INK = "#555670";
const DARK_TEXT = "#1c1a1b";
const GOLD = "#f5f6f3";
const GOLD_DEEP = "#d5d1ad";

type Tab = "home" | "whatsapp" | "help" | "news";

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M19.11 4.9A9.82 9.82 0 0 0 12.05 2C6.58 2 2.13 6.45 2.13 11.92c0 1.75.46 3.46 1.33 4.97L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.47 0 9.92-4.45 9.92-9.92 0-2.65-1.03-5.14-2.86-7.01ZM12.05 20.15h-.01a8.22 8.22 0 0 1-4.2-1.15l-.3-.18-3.11.82.83-3.03-.2-.31a8.22 8.22 0 0 1-1.26-4.38c0-4.55 3.7-8.25 8.25-8.25 2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.42 5.84c0 4.55-3.7 8.24-8.25 8.24Zm4.52-6.17c-.25-.12-1.46-.72-1.69-.8-.23-.09-.39-.12-.56.12-.17.25-.64.8-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.84-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.43.06-.65.31-.23.25-.85.83-.85 2.02s.87 2.34 1 2.5c.12.17 1.72 2.62 4.17 3.67.58.25 1.04.4 1.4.51.59.19 1.12.16 1.54.1.47-.07 1.46-.6 1.66-1.17.2-.58.2-1.07.14-1.17-.06-.1-.23-.17-.48-.29Z" />
    </svg>
  );
}

type WidgetMode = "support" | "sales";

interface SupportWidgetProps {
  mode?: WidgetMode;
}

export function SupportWidget({ mode = "support" }: SupportWidgetProps) {
  const t = useTranslations(mode === "sales" ? "Sales" : "Support");
  const tPricing = useTranslations("Pricing");
  const locale = useLocale();
  const supportOpen = useSupportStore((s) => s.isOpen);
  const supportClose = useSupportStore((s) => s.close);
  const salesOpen = useSalesStore((s) => s.isOpen);
  const salesClose = useSalesStore((s) => s.close);
  const open = mode === "sales" ? salesOpen : supportOpen;
  const close = mode === "sales" ? salesClose : supportClose;
  const isSales = mode === "sales";
  const [tab, setTab] = useState<Tab>("home");
  const [query, setQuery] = useState("");

  const packages = useMemo(
    () => [
      {
        key: "starter",
        name: tPricing("starter.name"),
        price: tPricing("starter.price"),
        desc: tPricing("starter.desc"),
      },
      {
        key: "pro",
        name: tPricing("pro.name"),
        price: tPricing("pro.price"),
        desc: tPricing("pro.desc"),
        recommended: true,
      },
      {
        key: "business",
        name: tPricing("business.name"),
        price: tPricing("business.price"),
        desc: tPricing("business.desc"),
      },
    ],
    [tPricing]
  );

  const helpItems = useMemo(
    () => [t("helpItem1"), t("helpItem2"), t("helpItem3"), t("helpItem4")],
    [t]
  );

  const filteredHelp = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    if (!q) return helpItems;
    return helpItems.filter((item) =>
      item.toLocaleLowerCase("tr").includes(q)
    );
  }, [helpItems, query]);

  const openWhatsApp = () => {
    if (typeof window === "undefined") return;
    window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer");
  };

  const handleTab = (next: Tab) => {
    if (next === "whatsapp") {
      openWhatsApp();
      return;
    }
    setTab(next);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="support-panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-4 sm:right-6 bottom-24 sm:bottom-28 z-[70] w-[min(22rem,calc(100vw-2rem))] h-[min(34rem,calc(100vh-10rem))] rounded-[1.75rem] overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)] flex flex-col border border-black/5"
            style={{ backgroundColor: BG_LIGHT }}
          >
            <div
              className="px-5 pt-5 pb-6 flex items-start justify-between"
              style={{
                background: `linear-gradient(180deg, ${GOLD} 0%, ${GOLD} 55%, ${BG_LIGHT} 100%)`,
              }}
            >
              <div
                className="font-chakra text-xl font-black tracking-tight"
                style={{ color: DARK_TEXT }}
              >
                UygunDavet
              </div>
              <button
                onClick={close}
                aria-label={t("close")}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#1c1a1b]/70 hover:text-[#1c1a1b] hover:bg-black/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" strokeWidth={2.2} />
              </button>
            </div>

            <div className="px-5 pb-5">
              <h2
                className="font-chakra text-[1.55rem] leading-[1.1] font-extrabold tracking-tight"
                style={{ color: DARK_TEXT }}
              >
                {t("greetingTitle")}
                <br />
                <span style={{ color: INK }} className="font-semibold">
                  {t("greetingSubtitle")}
                </span>
              </h2>
            </div>

            <div
              className="flex-1 rounded-t-[1.5rem] px-4 pt-4 pb-3 overflow-y-auto bg-white"
            >
              <AnimatePresence mode="wait">
                {tab === "home" && (
                  <motion.div
                    key="home"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-3"
                  >
                    <label className="flex items-center gap-2 px-4 h-12 rounded-xl bg-[#f5f6f3] border border-black/5 focus-within:border-[#d5d1ad] transition-colors">
                      <Search
                        className="w-4 h-4 shrink-0"
                        style={{ color: GOLD_DEEP }}
                      />
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t("searchPlaceholder")}
                        className="flex-1 bg-transparent outline-none text-sm font-sans text-[#1c1a1b] placeholder:text-[#555670]/70"
                        aria-label={t("searchPlaceholder")}
                      />
                      {query && (
                        <button
                          type="button"
                          onClick={() => setQuery("")}
                          aria-label={t("close")}
                          className="text-[#555670]/70 hover:text-[#1c1a1b] cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </label>

                    {query ? (
                      <div className="rounded-xl bg-[#f5f6f3] border border-black/5 overflow-hidden">
                        {filteredHelp.length === 0 ? (
                          <div className="px-4 py-6 text-sm text-[#555670] text-center font-sans">
                            —
                          </div>
                        ) : (
                          filteredHelp.map((label, i, arr) => (
                            <button
                              key={label}
                              onClick={openWhatsApp}
                              className={cn(
                                "w-full flex items-center gap-2 text-left px-4 py-3 hover:bg-white transition-colors cursor-pointer",
                                i !== arr.length - 1 &&
                                  "border-b border-black/5"
                              )}
                            >
                              <span className="flex-1 text-sm text-[#1c1a1b] font-sans">
                                {label}
                              </span>
                              <ChevronRight
                                className="w-4 h-4"
                                style={{ color: INK }}
                              />
                            </button>
                          ))
                        )}
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={openWhatsApp}
                          className="w-full text-left rounded-xl bg-[#f5f6f3] border border-black/5 p-4 flex items-start gap-3 hover:bg-white transition-colors cursor-pointer"
                        >
                          <span className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white shrink-0">
                            <WhatsAppGlyph className="w-5 h-5" />
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="block text-sm font-chakra font-semibold text-[#1c1a1b]">
                              {t("whatsappTitle")}
                            </span>
                            <span className="block text-xs text-[#555670] font-sans mt-0.5 line-clamp-2">
                              {t("whatsappDesc")}
                            </span>
                          </span>
                          <ChevronRight
                            className="w-4 h-4 mt-1 shrink-0"
                            style={{ color: GOLD_DEEP }}
                          />
                        </button>

                        <div className="rounded-xl bg-[#f5f6f3] border border-black/5 overflow-hidden">
                          {helpItems.slice(0, 3).map((label, i, arr) => (
                            <button
                              key={label}
                              onClick={() => setTab("help")}
                              className={cn(
                                "w-full flex items-center gap-2 text-left px-4 py-3 hover:bg-white transition-colors cursor-pointer",
                                i !== arr.length - 1 &&
                                  "border-b border-black/5"
                              )}
                            >
                              <span className="flex-1 text-sm text-[#1c1a1b] font-sans">
                                {label}
                              </span>
                              <ChevronRight
                                className="w-4 h-4"
                                style={{ color: INK }}
                              />
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </motion.div>
                )}

                {tab === "help" && (
                  <motion.div
                    key="help"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-3"
                  >
                    <h3
                      className="font-chakra text-sm uppercase tracking-[0.18em]"
                      style={{ color: INK }}
                    >
                      {t("helpTitle")}
                    </h3>
                    {isSales ? (
                      <>
                        <div className="space-y-2">
                          {packages.map((pkg) => (
                            <Link
                              key={pkg.key}
                              href={`/${locale}/#fiyatlar`}
                              onClick={close}
                              className="block rounded-xl bg-[#f5f6f3] border border-black/5 p-4 hover:bg-white transition-colors cursor-pointer"
                            >
                              <div className="flex items-baseline justify-between gap-3">
                                <span className="text-sm font-chakra font-semibold text-[#1c1a1b] flex items-center gap-2">
                                  {pkg.name}
                                  {pkg.recommended && (
                                    <span
                                      className="text-[10px] font-sans font-medium uppercase tracking-[0.1em] px-2 py-0.5 rounded-full"
                                      style={{
                                        backgroundColor: GOLD_DEEP,
                                        color: DARK_TEXT,
                                      }}
                                    >
                                      {tPricing("pro.badge")}
                                    </span>
                                  )}
                                </span>
                                <span
                                  className="text-sm font-chakra font-bold"
                                  style={{ color: DARK_TEXT }}
                                >
                                  {pkg.price}
                                </span>
                              </div>
                              <p className="text-xs font-sans text-[#555670] mt-1">
                                {pkg.desc}
                              </p>
                            </Link>
                          ))}
                        </div>
                        <Link
                          href={`/${locale}/#fiyatlar`}
                          onClick={close}
                          className="w-full flex items-center justify-center gap-2 rounded-xl py-3 font-chakra text-sm uppercase tracking-[0.15em] font-semibold transition-colors hover:opacity-90"
                          style={{
                            backgroundColor: DARK_TEXT,
                            color: GOLD_DEEP,
                          }}
                        >
                          <span>{t("ctaStart")}</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </>
                    ) : (
                      <div className="rounded-xl bg-[#f5f6f3] border border-black/5 overflow-hidden">
                        {helpItems.map((label, i, arr) => (
                          <button
                            key={label}
                            onClick={openWhatsApp}
                            className={cn(
                              "w-full flex items-center gap-2 text-left px-4 py-3 hover:bg-white transition-colors cursor-pointer",
                              i !== arr.length - 1 &&
                                "border-b border-black/5"
                            )}
                          >
                            <span className="flex-1 text-sm text-[#1c1a1b] font-sans">
                              {label}
                            </span>
                            <ChevronRight
                              className="w-4 h-4"
                              style={{ color: GOLD_DEEP }}
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {tab === "news" && (
                  <motion.div
                    key="news"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-3"
                  >
                    <h3
                      className="font-chakra text-sm uppercase tracking-[0.18em]"
                      style={{ color: INK }}
                    >
                      {t("newsTitle")}
                    </h3>
                    {isSales ? (
                      <div className="grid grid-cols-2 gap-2">
                        {THEME_OPTIONS.map((theme) => (
                          <Link
                            key={theme.key}
                            href={`/${locale}/${theme.key}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between rounded-xl bg-[#f5f6f3] border border-black/5 px-3 py-2.5 hover:bg-white transition-colors cursor-pointer group"
                          >
                            <span className="text-xs font-chakra font-semibold uppercase tracking-[0.1em] text-[#1c1a1b] capitalize">
                              {theme.key}
                            </span>
                            <ChevronRight
                              className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
                              style={{ color: GOLD_DEEP }}
                            />
                          </Link>
                        ))}
                      </div>
                    ) : (
                      [
                        {
                          title: t("newsItem1Title"),
                          desc: t("newsItem1Desc"),
                        },
                        {
                          title: t("newsItem2Title"),
                          desc: t("newsItem2Desc"),
                        },
                      ].map((item) => (
                        <div
                          key={item.title}
                          className="rounded-xl bg-[#f5f6f3] border border-black/5 p-4"
                        >
                          <div className="text-sm font-chakra font-semibold text-[#1c1a1b]">
                            {item.title}
                          </div>
                          <div className="text-xs font-sans text-[#555670] mt-1">
                            {item.desc}
                          </div>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <nav
              className="border-t border-black/5 flex items-stretch"
              style={{ backgroundColor: BG_LIGHT }}
              aria-label="Support navigation"
            >
              {(
                [
                  {
                    key: "home" as const,
                    label: t("homeTab"),
                    icon: <Home className="w-5 h-5" strokeWidth={2} />,
                  },
                  {
                    key: "whatsapp" as const,
                    label: t("whatsappTab"),
                    icon: <WhatsAppGlyph className="w-5 h-5" />,
                  },
                  {
                    key: "help" as const,
                    label: t("helpTab"),
                    icon: <HelpCircle className="w-5 h-5" strokeWidth={2} />,
                  },
                  {
                    key: "news" as const,
                    label: t("newsTab"),
                    icon: <Megaphone className="w-5 h-5" strokeWidth={2} />,
                    dot: true,
                  },
                ]
              ).map(({ key, label, icon, dot }) => {
                const active = tab === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleTab(key)}
                    className="flex-1 flex flex-col items-center justify-center gap-1 py-3 cursor-pointer"
                    aria-current={active ? "page" : undefined}
                  >
                    <span
                      className="relative transition-colors"
                      style={{ color: active ? GOLD_DEEP : INK }}
                    >
                      {icon}
                      {dot && (
                        <span
                          className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#ef4444] ring-2"
                          style={{ boxShadow: `0 0 0 2px ${BG_LIGHT}` }}
                        />
                      )}
                    </span>
                    <span
                      className="text-[0.7rem] font-sans font-medium transition-colors"
                      style={{ color: active ? GOLD_DEEP : INK }}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}
