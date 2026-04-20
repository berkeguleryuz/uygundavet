"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { MorphButton } from "../components/MorphButton";
import { ContactModal } from "../components/ContactModal";
import { THEME_OPTIONS } from "@/lib/themes";

const marqueeThemes = [...THEME_OPTIONS, ...THEME_OPTIONS];

const sideImages = [
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    alt: "Wedding bouquet",
    position: "left",
  },
  {
    src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
    alt: "Wedding venue table setting",
    position: "left",
  },
  {
    src: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80",
    alt: "Wedding rings detail",
    position: "right",
  },
  {
    src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
    alt: "Wedding decoration",
    position: "right",
  },
];

export function SectionMindloopHero() {
  const t = useTranslations("Hero");
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const scrollableHeight = container.offsetHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const handleVideo1End = () => {
    if (video2Ref.current) {
      video2Ref.current.style.opacity = "1";
      video2Ref.current.currentTime = 0;
      video2Ref.current.play();
    }
    if (video1Ref.current) {
      video1Ref.current.style.opacity = "0";
    }
  };

  const handleVideo2End = () => {
    if (video1Ref.current) {
      video1Ref.current.style.opacity = "1";
      video1Ref.current.currentTime = 0;
      video1Ref.current.play();
    }
    if (video2Ref.current) {
      video2Ref.current.style.opacity = "0";
    }
  };

  const imageProgress = Math.max(0, Math.min(1, (scrollProgress - 0.2) / 0.8));

  const textOpacity = 1 - Math.max(0, Math.min(1, (imageProgress - 0.55) / 0.25));

  const centerWidth = 100 - imageProgress * 58;
  const centerHeight = 100 - imageProgress * 30;
  const sideWidth = imageProgress * 22;
  const sideOpacity = imageProgress;
  const sideTranslateLeft = -100 + imageProgress * 100;
  const sideTranslateRight = 100 - imageProgress * 100;
  const borderRadius = 12 + imageProgress * 12;
  const gap = imageProgress * 16;
  const basePadding = 8 + imageProgress * 8;
  const sideTranslateY = -(imageProgress * 15);

  return (
    <section ref={sectionRef} className="relative bg-[#252224]">
      <div ref={containerRef} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="flex h-full w-full items-center justify-center">
          <div
            className="relative flex h-full w-full items-stretch justify-center"
            style={{
              gap: `${gap}px`,
              padding: `${basePadding}px`,
              paddingBottom: `${60 + imageProgress * 40}px`,
            }}
          >
            <div
              className="flex flex-col will-change-transform"
              style={{
                width: `${sideWidth}%`,
                gap: `${gap}px`,
                transform: `translateX(${sideTranslateLeft}%) translateY(${sideTranslateY}%)`,
                opacity: sideOpacity,
              }}
            >
              {sideImages
                .filter((img) => img.position === "left")
                .map((img, idx) => (
                  <div
                    key={idx}
                    className="relative overflow-hidden will-change-transform"
                    style={{
                      flex: 1,
                      borderRadius: `${borderRadius}px`,
                    }}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="22vw"
                      className="object-cover"
                    />
                  </div>
                ))}
            </div>

            <div
              className="relative overflow-hidden will-change-transform"
              style={{
                width: `${centerWidth}%`,
                height: `${centerHeight}%`,
                flex: "0 0 auto",
                borderRadius: `${borderRadius}px`,
              }}
            >
              <video
                ref={video1Ref}
                autoPlay
                muted
                playsInline
                onContextMenu={(e) => e.preventDefault()}
                onEnded={handleVideo1End}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
              >
                <source src="/hero2.mp4" type="video/mp4" />
              </video>

              <video
                ref={video2Ref}
                muted
                playsInline
                onContextMenu={(e) => e.preventDefault()}
                onEnded={handleVideo2End}
                className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700"
              >
                <source src="/hero.mp4" type="video/mp4" />
              </video>

              <div className="absolute bottom-0 left-0 right-0 h-64 bg-linear-to-t from-[#252224]/80 to-transparent z-[1]" />

              <div
                className="pointer-events-none absolute inset-0 z-[1]"
                style={{
                  background:
                    "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0) 75%)",
                }}
              />

              <div
                className="absolute inset-0 flex flex-col items-center justify-center z-[2] px-4"
                style={{ opacity: textOpacity }}
              >
                <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center">
                  <h1
                    className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-chakra font-medium tracking-[-1px] mb-6 text-foreground"
                    style={{ textShadow: "0 2px 24px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.35)" }}
                  >
                    {t("headingPrefix")}{" "}
                    <span className="font-merienda font-normal italic lowercase text-[#d5d1ad]">
                      {t("headingHighlight")}
                    </span>{" "}
                    {t("headingSuffix")}
                  </h1>

                  <p
                    className="text-lg text-[#ecf1f6] font-sans max-w-2xl mx-auto mb-10"
                    style={{ textShadow: "0 1px 12px rgba(0,0,0,0.55)" }}
                  >
                    {t("subtitle")}
                  </p>

                  <div className="flex items-center gap-4 flex-col sm:flex-row w-full sm:w-auto">
                    <MorphButton
                      variant="filled"
                      className="w-full sm:w-auto"
                      onClick={() => setIsRegisterOpen(true)}
                    >
                      {t("cta")}
                    </MorphButton>
                    <MorphButton
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => {
                        const el = document.getElementById("temalar");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      {t("ctaSecondary")}
                    </MorphButton>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="flex flex-col will-change-transform"
              style={{
                width: `${sideWidth}%`,
                gap: `${gap}px`,
                transform: `translateX(${sideTranslateRight}%) translateY(${sideTranslateY}%)`,
                opacity: sideOpacity,
              }}
            >
              {sideImages
                .filter((img) => img.position === "right")
                .map((img, idx) => (
                  <div
                    key={idx}
                    className="relative overflow-hidden will-change-transform"
                    style={{
                      flex: 1,
                      borderRadius: `${borderRadius}px`,
                    }}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="22vw"
                      className="object-cover"
                    />
                  </div>
                ))}
            </div>
          </div>

          <div
            className="absolute top-[76%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-500"
            style={{ opacity: Math.max(0, Math.min(1, (imageProgress - 0.35) / 0.2)) }}
          >
            <span className="text-white/40 text-xs font-sans tracking-[0.2em] uppercase">
              {t("scrollHint")}
            </span>
            <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5">
              <div className="w-1 h-2 rounded-full bg-white/50 animate-bounce" />
            </div>
          </div>
        </div>
      </div>

      <div className="h-[140vh] md:h-[200vh]" />
      </div>

      <div className="w-full py-8 pl-6 pr-0 md:py-20 md:pl-10 lg:py-24 lg:pl-24 xl:pl-32 xl:pr-4">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.8fr)] lg:gap-10">
          <div className="flex flex-col gap-6 max-lg:items-center max-lg:text-center">
            <h2 className="font-chakra text-3xl leading-[1.1] tracking-tight whitespace-pre-line text-[#d5d1ad] md:text-5xl lg:max-w-[16ch] lg:whitespace-normal lg:text-6xl xl:max-w-[17ch] xl:text-7xl">
              {t("tagline")}
            </h2>
            <p className="max-w-xl font-sans text-base text-muted-foreground md:text-lg">
              {t("taglineDesc")}
            </p>
            <MorphButton
              variant="filled"
              className="mt-2 w-fit"
              onClick={() => setIsRegisterOpen(true)}
            >
              {t("taglineCta")}
            </MorphButton>
          </div>

          <div className="relative h-[360px] w-full overflow-hidden md:h-[320px] lg:h-[400px]">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-[#252224] to-transparent md:w-24" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-[#252224] to-transparent md:w-24" />
            <div
              className="flex h-full gap-4 will-change-transform"
              style={{ animation: "theme-marquee 45s linear infinite", width: "max-content" }}
            >
              {marqueeThemes.map((theme, idx) => (
                <a
                  key={`${theme.key}-${idx}`}
                  href={`/${theme.key}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative block h-full w-[220px] shrink-0 overflow-hidden rounded-2xl md:w-[260px] lg:w-[300px]"
                >
                  {"video" in theme && theme.video ? (
                    <video
                      src={theme.image}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      onContextMenu={(e) => e.preventDefault()}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <Image
                      src={theme.image}
                      alt={theme.key}
                      fill
                      sizes="300px"
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="absolute bottom-4 left-4 font-chakra text-sm uppercase tracking-[0.2em] text-white">
                    {theme.key}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ContactModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </section>
  );
}
