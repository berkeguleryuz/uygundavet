"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { MorphButton } from "../components/MorphButton";
import { ContactModal } from "../components/ContactModal";

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
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollableHeight = window.innerHeight * 2;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
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

  const textOpacity = Math.max(0, 1 - scrollProgress / 0.2);

  const imageProgress = Math.max(0, Math.min(1, (scrollProgress - 0.2) / 0.8));

  const centerWidth = 100 - imageProgress * 58;
  const centerHeight = 100 - imageProgress * 30;
  const sideWidth = imageProgress * 22;
  const sideOpacity = imageProgress;
  const sideTranslateLeft = -100 + imageProgress * 100;
  const sideTranslateRight = 100 - imageProgress * 100;
  const borderRadius = imageProgress * 24;
  const gap = imageProgress * 16;
  const sideTranslateY = -(imageProgress * 15);

  return (
    <section ref={sectionRef} className="relative bg-[#252224]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="flex h-full w-full items-center justify-center">
          <div
            className="relative flex h-full w-full items-stretch justify-center"
            style={{
              gap: `${gap}px`,
              padding: `${imageProgress * 16}px`,
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
                className="absolute inset-0 flex flex-col items-center justify-center z-[2] px-4"
                style={{ opacity: textOpacity }}
              >
                <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center">
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-chakra font-medium tracking-[-2px] mb-6 text-foreground">
                    {t("headingPrefix")}{" "}
                    <span className="font-merienda font-normal italic lowercase text-white">
                      {t("headingHighlight")}
                    </span>{" "}
                    {t("headingSuffix")}
                  </h1>

                  <p className="text-lg text-[#ecf1f6] font-sans max-w-2xl mx-auto mb-10">
                    {t("subtitle")}
                  </p>

                  <div className="flex items-center gap-4 flex-col sm:flex-row w-full sm:w-auto">
                    <MorphButton variant="filled" className="w-full sm:w-auto">
                      {t("cta")}
                    </MorphButton>
                    <MorphButton variant="outline" className="w-full sm:w-auto">
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
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-500"
            style={{ opacity: imageProgress > 0.85 ? 1 : 0 }}
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

      <div className="h-[200vh]" />

      <div className="px-6 pt-16 pb-16 md:pt-20 md:px-12 md:pb-20 lg:px-20 lg:pt-24 lg:pb-24 flex flex-col items-center">
        <p className="mx-auto max-w-2xl text-center text-2xl leading-relaxed text-muted-foreground md:text-3xl lg:text-[2.5rem] lg:leading-snug font-sans whitespace-pre-line mb-10">
          {t("tagline")}
        </p>
        <MorphButton
          variant="filled"
          onClick={() => setIsRegisterOpen(true)}
        >
          {t("taglineCta")}
        </MorphButton>
      </div>

      <ContactModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </section>
  );
}
