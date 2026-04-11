"use client";

import { useState } from "react";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";

export function SectionHero() {
  const t = useTranslations("FashionHero");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <section className="relative w-full h-screen bg-black overflow-hidden flex flex-col">
      <video
        autoPlay
        loop
        muted
        playsInline
        onContextMenu={(e) => e.preventDefault()}
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260303_175853_da9ead9c-0e05-40d9-b9bd-06a9b5a73d27.mp4"
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent z-0" />

      <nav className="absolute top-0 left-0 right-0 w-full p-6 flex items-start justify-between z-20 pointer-events-none">
        <button className="pointer-events-auto bg-black rounded-full flex items-center justify-center w-12 h-12 md:w-22 md:h-22 shrink-0 border border-white/10 hover:bg-black/90 transition-colors">
          <div className="w-6 h-6 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center">
            <span className="font-chakra font-bold text-black text-xs md:text-xl">D</span>
          </div>
        </button>

        <div className="hidden md:flex items-center gap-4 pointer-events-auto">
          <button className="bg-black rounded-full flex items-center justify-center w-22 h-22 shrink-0 text-white hover:bg-black/90 transition-colors border border-white/10">
            <Search className="w-8 h-8" />
          </button>

          <button className="bg-black rounded-full flex items-center justify-center w-22 h-22 shrink-0 text-white hover:bg-black/90 transition-colors border border-white/10">
            <ShoppingCart className="w-8 h-8" />
          </button>

          <button className="bg-black rounded-full flex items-center h-22 pl-2 pr-10 gap-4 text-white hover:bg-black/90 transition-colors border border-white/10">
            <div className="w-18 h-18 bg-white rounded-full flex items-center justify-center text-black shrink-0">
              <User className="w-8 h-8" />
            </div>
            <span className="font-sans font-medium text-lg uppercase tracking-wider">{t("contact")}</span>
          </button>
        </div>

        <div className="flex flex-col items-end pointer-events-auto md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="bg-black rounded-full flex items-center justify-center w-12 h-12 shrink-0 text-white border border-white/10 hover:bg-black/90 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {isMobileMenuOpen && (
            <div className="bg-black/95 backdrop-blur-md mt-4 p-4 rounded-3xl w-48 text-white border border-white/10 flex flex-col gap-4">
              <button className="flex items-center gap-4 text-sm font-medium hover:text-gray-300 transition-colors">
                <Search className="w-5 h-5" />
                <span>{t("search")}</span>
              </button>
              <button className="flex items-center gap-4 text-sm font-medium hover:text-gray-300 transition-colors">
                <ShoppingCart className="w-5 h-5" />
                <span>{t("cart")}</span>
              </button>
              <button className="flex items-center gap-4 text-sm font-medium hover:text-gray-300 transition-colors">
                <User className="w-5 h-5" />
                <span>{t("contact")}</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="hidden md:block absolute inset-0 z-10 pointer-events-none">
        <div className="absolute left-[8%] top-[18%] flex items-center pointer-events-auto group cursor-pointer">
          <div className="text-white mr-4 transition-transform group-hover:-translate-x-2">
            <h3 className="text-sm tracking-[0.15em] font-medium font-sans uppercase">{t("neurovibe")}</h3>
            <p className="text-sm font-sans mt-0.5 text-right">{t("neurovibePrice")}</p>
          </div>
          <div className="h-px bg-white/40 w-20 group-hover:w-24 group-hover:bg-white transition-all"></div>
          <div className="w-2.5 h-2.5 rounded-full border-2 border-white/60 group-hover:border-white group-hover:scale-150 transition-all ml-4"></div>
        </div>

        <div className="absolute right-[8%] top-[42%] flex items-center pointer-events-auto group cursor-pointer">
          <div className="w-2.5 h-2.5 rounded-full border-2 border-white/60 group-hover:border-white group-hover:scale-150 transition-all mr-4"></div>
          <div className="h-px bg-white/40 w-16 group-hover:w-24 group-hover:bg-white transition-all"></div>
          <div className="text-white ml-4 transition-transform group-hover:translate-x-2">
            <h3 className="text-sm tracking-[0.15em] font-medium font-sans uppercase">{t("voidblade")}</h3>
            <p className="text-sm font-sans mt-0.5">{t("voidbladePrice")}</p>
          </div>
        </div>

        <div className="absolute right-[8%] top-[58%] flex items-center pointer-events-auto group cursor-pointer">
          <div className="w-2.5 h-2.5 rounded-full border-2 border-white/60 group-hover:border-white group-hover:scale-150 transition-all mr-4"></div>
          <div className="h-px bg-white/40 w-16 group-hover:w-24 group-hover:bg-white transition-all"></div>
          <div className="text-white ml-4 transition-transform group-hover:translate-x-2">
            <h3 className="text-sm tracking-[0.15em] font-medium font-sans uppercase">{t("shadowCircuit")}</h3>
            <p className="text-sm font-sans mt-0.5">{t("shadowCircuitPrice")}</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[8%] left-[3%] z-10 pointer-events-none text-white selection:bg-white/20">
        <h1 className="font-chakra uppercase text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight flex flex-col">
          <span>{t("heroLine1")}</span>
          <span>{t("heroLine2")}</span>
          <span>{t("heroLine3")}</span>
        </h1>
      </div>

      <button className="absolute bottom-0 right-0 z-20 bg-black text-white rounded-tl-3xl px-8 py-4 md:px-12 md:py-6 group hover:bg-black/90 transition-colors">
        <span className="font-chakra tracking-[0.2em] uppercase whitespace-nowrap block text-sm md:text-base group-hover:scale-105 transition-transform origin-bottom-right">
          <span className="md:hidden">{t("shop")}</span>
          <span className="hidden md:inline">{t("shopNow")}</span>
        </span>
      </button>
    </section>
  );
}
