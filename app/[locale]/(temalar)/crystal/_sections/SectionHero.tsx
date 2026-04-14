"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { ChevronDownIcon } from "../_icons/ChevronDownIcon";
import { HeartIcon } from "../_icons/HeartIcon";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const BASE = "/crystal";

const TR_DAYS = ["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"];
const TR_MONTHS = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];

function formatWeddingDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate()} ${TR_MONTHS[d.getMonth()]} ${d.getFullYear()}, ${TR_DAYS[d.getDay()]}`;
}

interface HeroProps {
  brideFirst: string;
  groomFirst: string;
  formattedDate: string;
  venueName: string;
}

function HeroA({ brideFirst, groomFirst, formattedDate, venueName }: HeroProps) {
  return (
    <section className="relative h-svh flex flex-col items-center justify-center overflow-hidden">
      <video autoPlay muted loop playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover" src="/crystal/yuzuk.mp4" />
      <div className="absolute inset-0 bg-[#f6f3ee]/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#f6f3ee]/40 via-transparent to-[#f6f3ee]/80" />
      <div className="absolute inset-8 md:inset-16 border border-[#1a1a2e]/[0.06] pointer-events-none" />
      <div className="relative z-10 text-center px-6">
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
          className="font-chakra text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-[#1a1a2e]/50 mb-6 md:mb-8">{t("heroTagline")}</motion.p>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}>
          <h1 className="font-merienda text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#1a1a2e] leading-[1.05]">{brideFirst}</h1>
          <div className="flex items-center justify-center gap-4 my-2 md:my-3">
            <div className="h-px w-8 md:w-12 bg-[#b49a7c]/40" />
            <span className="text-[#b49a7c] text-sm tracking-[0.3em]">&</span>
            <div className="h-px w-8 md:w-12 bg-[#b49a7c]/40" />
          </div>
          <h1 className="font-merienda text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#1a1a2e] leading-[1.05]">{groomFirst}</h1>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-8 space-y-1">
          <p className="font-sans text-xs md:text-sm text-[#1a1a2e]/60 tracking-[0.15em] uppercase">{formattedDate}</p>
          {venueName && <p className="font-sans text-xs text-[#1a1a2e]/40">{venueName}</p>}
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }} className="mt-10">
          <Link href={`${BASE}/lcv`} className="inline-flex items-center justify-center font-chakra text-[10px] tracking-[0.25em] uppercase text-[#1a1a2e] border border-[#1a1a2e]/25 rounded-full px-8 py-3 hover:bg-[#1a1a2e]/5 transition-all">{t("heroCtaButton")}</Link>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <ChevronDownIcon size={16} className="text-[#1a1a2e]/25" />
      </motion.div>
    </section>
  );
}

function HeroB({ brideFirst, groomFirst, formattedDate, venueName }: HeroProps) {
  const photoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (photoRef.current) {
      gsap.to(photoRef.current, {
        y: -60, rotation: -1, ease: "none",
        scrollTrigger: { trigger: photoRef.current.parentElement, start: "top top", end: "bottom top", scrub: true },
      });
    }
    if (textRef.current) {
      gsap.to(textRef.current, {
        y: -30, ease: "none",
        scrollTrigger: { trigger: textRef.current.parentElement, start: "top top", end: "bottom top", scrub: true },
      });
    }
  });

  return (
    <section className="relative h-svh overflow-hidden bg-[#eee9e2]">
      <video autoPlay muted loop playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover opacity-20" src="/crystal/kelebek.mp4" />

      <motion.div
        ref={photoRef}
        initial={{ opacity: 0, y: 60, rotate: 3 }}
        animate={{ opacity: 1, y: 0, rotate: 2 }}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-[8%] right-[5%] md:right-[10%] w-[55%] md:w-[40%] max-w-[500px] will-change-transform z-10"
      >
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.15)] border-[6px] border-white">
          <video autoPlay muted loop playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover" src="/crystal/yuzuk.mp4" />
        </div>
      </motion.div>

      <div ref={textRef} className="absolute bottom-[8%] md:bottom-[12%] left-[5%] md:left-[8%] z-20 will-change-transform">
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}>
          <p className="font-chakra text-[10px] tracking-[0.5em] uppercase text-[#b49a7c] mb-4">{t("heroTagline")}</p>
          <h1 className="font-merienda text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] text-[#1a1a2e] leading-[0.92] drop-shadow-[0_2px_30px_rgba(246,243,238,0.8)]">
            {brideFirst}
          </h1>
          <h1 className="font-merienda text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] text-[#1a1a2e] leading-[0.92] drop-shadow-[0_2px_30px_rgba(246,243,238,0.8)]">
            & {groomFirst}
          </h1>
          <div className="mt-6 flex items-center gap-3">
            <div className="h-px w-8 bg-[#b49a7c]/40" />
            <p className="font-sans text-sm text-[#6d6a75]">{formattedDate}</p>
          </div>
          {venueName && <p className="font-sans text-xs text-[#a09ba6] mt-1 ml-11">{venueName}</p>}
          <div className="mt-6 ml-11">
            <Link href={`${BASE}/lcv`} className="inline-flex items-center justify-center font-chakra text-[10px] tracking-[0.2em] uppercase bg-[#1a1a2e] text-white rounded-full px-7 py-2.5 hover:bg-[#1a1a2e]/90 transition-colors shadow-lg">{t("heroCtaButton")}</Link>
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />
    </section>
  );
}

function HeroC({ brideFirst, groomFirst, formattedDate, venueName }: HeroProps) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const layers = containerRef.current?.querySelectorAll("[data-parallax]");
    layers?.forEach((el, i) => {
      gsap.to(el, {
        y: -(i + 1) * 25,
        ease: "none",
        scrollTrigger: { trigger: containerRef.current, start: "top top", end: "bottom top", scrub: true },
      });
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative h-svh overflow-hidden bg-[#1a1a2e]">
      <video data-parallax autoPlay muted loop playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover opacity-60 will-change-transform" src="/crystal/yuzuk.mp4" />

      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e]/40 via-transparent to-[#1a1a2e]/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e]/30 via-transparent to-[#1a1a2e]/30" />

      <div data-parallax className="absolute inset-0 flex items-center justify-center will-change-transform">
        <motion.div initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-center px-4">
          <h1 className="font-merienda text-[4rem] sm:text-[5.5rem] md:text-[7rem] lg:text-[9rem] text-white leading-[0.88] mix-blend-difference">
            {brideFirst}
          </h1>
          <h1 className="font-merienda text-[4rem] sm:text-[5.5rem] md:text-[7rem] lg:text-[9rem] text-white leading-[0.88] mix-blend-difference">
            {groomFirst}
          </h1>
        </motion.div>
      </div>

      <motion.div data-parallax initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.7 }}
        className="absolute bottom-0 left-0 right-0 z-20 will-change-transform">
        <div className="flex flex-col md:flex-row items-center justify-between px-8 md:px-16 py-6 bg-gradient-to-t from-[#1a1a2e] to-transparent">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <HeartIcon size={14} className="text-[#b49a7c]" />
            <p className="font-sans text-xs text-white/60 tracking-[0.15em] uppercase">{formattedDate}</p>
            {venueName && <><span className="text-white/20">·</span><p className="font-sans text-xs text-white/40">{venueName}</p></>}
          </div>
          <Link href={`${BASE}/lcv`} className="inline-flex items-center justify-center font-chakra text-[10px] tracking-[0.2em] uppercase text-[#1a1a2e] bg-[#b49a7c] rounded-full px-7 py-2.5 hover:bg-[#c4a882] transition-colors">{t("heroCtaButton")}</Link>
        </div>
      </motion.div>
    </section>
  );
}

function HeroD({ brideFirst, groomFirst, formattedDate, venueName }: HeroProps) {
  return (
    <section className="relative min-h-svh bg-[#f6f3ee] flex items-center justify-center overflow-hidden py-20 px-6">
      <div className="relative w-full max-w-5xl mx-auto">
        <div className="relative h-[500px] md:h-[600px]">
          <motion.div initial={{ opacity: 0, rotate: -6, y: 40 }} animate={{ opacity: 1, rotate: -4, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-4 left-4 md:top-8 md:left-[15%] w-[70%] md:w-[45%] h-[85%] rounded-2xl overflow-hidden shadow-xl border-4 border-white will-change-transform">
            <Image src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&q=85" alt="" fill className="object-cover" sizes="45vw" />
          </motion.div>

          <motion.div initial={{ opacity: 0, rotate: 4, y: 60 }} animate={{ opacity: 1, rotate: 2, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-8 right-4 md:top-4 md:right-[10%] w-[75%] md:w-[50%] h-[90%] rounded-2xl overflow-hidden shadow-2xl border-4 border-white z-10 will-change-transform">
            <video autoPlay muted loop playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover" src="/crystal/yuzuk.mp4" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-0 left-[5%] md:left-[5%] w-[40%] md:w-[25%] aspect-square rounded-xl overflow-hidden shadow-lg border-4 border-white z-20">
            <video autoPlay muted loop playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover" src="/crystal/kutu.mp4" />
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }}
          className="relative z-30 -mt-24 md:-mt-16 text-center md:text-right md:pr-8">
          <p className="font-chakra text-[10px] tracking-[0.5em] uppercase text-[#b49a7c] mb-3">{t("heroTagline")}</p>
          <h1 className="font-merienda text-4xl md:text-6xl lg:text-7xl text-[#1a1a2e] leading-[1] drop-shadow-[0_4px_30px_rgba(246,243,238,0.9)]">
            {brideFirst} & {groomFirst}
          </h1>
          <p className="font-sans text-sm text-[#6d6a75] tracking-wider mt-4">{formattedDate}</p>
          {venueName && <p className="font-sans text-xs text-[#a09ba6] mt-1">{venueName}</p>}
          <div className="mt-6">
            <Link href={`${BASE}/lcv`} className="inline-flex items-center justify-center font-chakra text-[10px] tracking-[0.2em] uppercase bg-[#1a1a2e] text-white rounded-full px-7 py-2.5 hover:bg-[#1a1a2e]/90 transition-colors shadow-lg">{t("heroCtaButton")}</Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function HeroE({ brideFirst, groomFirst, formattedDate, venueName }: HeroProps) {
  return (
    <section className="relative h-svh overflow-hidden">
      <div className="absolute inset-0">
        <video autoPlay muted loop playsInline preload="auto" className="w-full h-full object-cover" src="/crystal/yuzuk.mp4" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f6f3ee]/30 to-[#f6f3ee]" />
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="bg-[#f6f3ee]/80 backdrop-blur-md border-t border-[#1a1a2e]/[0.06]">
          <div className="max-w-5xl mx-auto px-8 md:px-16 py-10 md:py-14">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
                <p className="font-chakra text-[10px] tracking-[0.5em] uppercase text-[#b49a7c] mb-3">{t("heroTagline")}</p>
                <h1 className="font-merienda text-5xl md:text-6xl lg:text-7xl text-[#1a1a2e] leading-[0.92]">
                  {brideFirst} <span className="text-[#b49a7c]">&</span> {groomFirst}
                </h1>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col items-start md:items-end gap-3">
                <p className="font-sans text-sm text-[#6d6a75] tracking-wider">{formattedDate}</p>
                {venueName && <p className="font-sans text-xs text-[#a09ba6]">{venueName}</p>}
                <Link href={`${BASE}/lcv`} className="inline-flex items-center justify-center font-chakra text-[10px] tracking-[0.2em] uppercase bg-[#1a1a2e] text-white rounded-full px-7 py-2.5 hover:bg-[#1a1a2e]/90 transition-colors mt-2">{t("heroCtaButton")}</Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const variants = [
  { key: "A", label: "Video Light", component: HeroA },
  { key: "B", label: "Katmanlı Derinlik", component: HeroB },
  { key: "C", label: "Sinematik Blend", component: HeroC },
  { key: "D", label: "Kart Yığını", component: HeroD },
  { key: "E", label: "Frosted Bar", component: HeroE },
];

export function SectionHero() {
  const wedding = useWedding();
  const [activeVariant, setActiveVariant] = useState("A");

  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];
  const formattedDate = formatWeddingDate(wedding.weddingDate);
  const props: HeroProps = { brideFirst, groomFirst, formattedDate, venueName: wedding.venueName };

  const ActiveComponent = variants.find((v) => v.key === activeVariant)?.component || HeroA;

  return (
    <>
      <div className="fixed bottom-4 right-4 z-[100] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-[#1a1a2e]/10 p-1.5 flex gap-1">
        {variants.map((v) => (
          <button key={v.key} onClick={() => setActiveVariant(v.key)}
            className={`px-3 py-2 rounded-xl text-[10px] font-sans font-medium tracking-wide transition-all ${activeVariant === v.key ? "bg-[#1a1a2e] text-white" : "text-[#6d6a75] hover:bg-[#1a1a2e]/5"}`}
            title={v.label}>{v.key}: {v.label}</button>
        ))}
      </div>
      <ActiveComponent {...props} />
    </>
  );
}
