"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import type { EnvelopeIntroTheme } from "./types";

type Props = {
  theme: EnvelopeIntroTheme;
  brideName: string;
  groomName: string;
  /** TEST modu: true iken zarf HER sayfa yenilemesinde tekrar açılır.
   *  Canlıya alırken false olmalı. */
  alwaysShow?: boolean;
};

export function EnvelopeIntroCore({
  theme,
  brideName,
  groomName,
  alwaysShow = false,
}: Props) {
  const brideFirst = brideName.split(" ")[0] ?? "";
  const groomFirst = groomName.split(" ")[0] ?? "";

  const [removed, setRemoved] = useState(false);
  const openingRef = useRef(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLButtonElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  // Bu oturumda zarf daha önce açıldıysa overlay'i hiç gösterme.
  // SSR ve ilk client render aynı olmalı; bu yüzden kaldırma efektte yapılır.
  // FOUC sınıfı (`theme.foucClass`) <html>'e per-theme inline script ile EKLENİR
  // (her tema layout.tsx'inde). Burada yalnızca TEST modunda temizleriz; normal
  // akışta tarayıcı oturum kapanınca sessionStorage'la birlikte temizlenir.
  useEffect(() => {
    if (alwaysShow) {
      // TEST modu: önceki oturumdan kalan kaydı ve FOUC sınıfını temizle.
      try {
        sessionStorage.removeItem(theme.storageKey);
      } catch {}
      document.documentElement.classList.remove(theme.foucClass);
      return;
    }
    let opened = false;
    try {
      opened = sessionStorage.getItem(theme.storageKey) === "1";
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount'ta tek seferlik, hydration-guvenli kaldirma
    if (opened) setRemoved(true);
  }, [alwaysShow, theme.storageKey, theme.foucClass]);

  // Overlay görünürken sayfa kaymasını kilitle; kaldırılınca geri ver.
  useEffect(() => {
    if (removed) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [removed]);

  // Unmount sırasında timeline'ı durdur.
  useEffect(() => {
    return () => {
      tlRef.current?.kill();
    };
  }, []);

  function finish() {
    if (!alwaysShow) {
      try {
        sessionStorage.setItem(theme.storageKey, "1");
      } catch {}
    }
    setRemoved(true);
  }

  function handleOpen() {
    if (openingRef.current) return;
    openingRef.current = true;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      gsap.to(rootRef.current, {
        opacity: 0,
        duration: 0.4,
        onComplete: finish,
      });
      return;
    }

    const tl = gsap.timeline({ onComplete: finish });
    tlRef.current = tl;
    tl.to(sealRef.current, { scale: 1.09, duration: 0.16, ease: "power2.out" })
      .to(sealRef.current, {
        y: -130,
        rotate: -28,
        opacity: 0,
        duration: 0.5,
        ease: "back.in(1.5)",
      })
      .to(
        flapRef.current,
        { rotateX: -172, duration: 0.8, ease: "power3.inOut" },
        "-=0.18",
      )
      .to(
        glowRef.current,
        { opacity: 1, duration: 0.5, ease: "power2.out" },
        "-=0.5",
      )
      // Zarf izleyiciye doğru "dalış" yapar.
      .to(
        envelopeRef.current,
        { scale: 1.95, opacity: 0, duration: 1.2, ease: "power2.in" },
        "-=0.3",
      )
      // Sıcak ışık ekranı sarar — koyu arka planı maskeler.
      .to(
        flashRef.current,
        { opacity: 1, duration: 0.7, ease: "power2.out" },
        "-=1.05",
      )
      // Işık ve overlay birlikte sönerek siteyi açığa çıkarır.
      .to(
        rootRef.current,
        { opacity: 0, duration: 0.7, ease: "power2.inOut" },
        "-=0.25",
      );
  }

  if (removed) return null;

  const flapClip = `polygon(0% 0%, 100% 0%, 50% ${theme.flapTipPercent}%)`;
  const initials = `${brideFirst.charAt(0)}&${groomFirst.charAt(0)}`;
  const coupleLine = `${brideFirst} ve ${groomFirst}`;

  return (
    <div
      ref={rootRef}
      className="envelope-intro fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: theme.overlayBg }}
    >
      {/* Zarf kutusu */}
      <div
        ref={envelopeRef}
        className="envelope relative h-[min(78vh,560px)] drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
        style={{ perspective: "1400px", aspectRatio: theme.aspect }}
      >
        {/* Taban: kapalı zarf görseli */}
        <div className="absolute inset-0">
          <Image
            src={theme.imageSrc}
            alt="Davetiye zarfı"
            fill
            priority
            sizes="min(54vh, 420px)"
            className="object-cover"
          />
        </div>

        {/* İç kısım — kapak açılınca görünür koyu cep */}
        <div
          className="absolute inset-0"
          style={{ clipPath: flapClip, background: theme.interiorBg }}
        />

        {/* Üst kapak — taban görselin dilimi, bağımsız döner */}
        <div
          ref={flapRef}
          className="envelope-flap absolute inset-0"
          style={{
            clipPath: flapClip,
            transformOrigin: "top center",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        >
          <Image
            src={theme.imageSrc}
            alt=""
            aria-hidden
            fill
            sizes="min(54vh, 420px)"
            className="object-cover"
          />
        </div>

        {/* Mum mührü — dış sarmalayıcı konumlandırır (GSAP dokunmaz),
            iç buton GSAP animasyon hedefidir. */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ top: `${theme.flapTipPercent}%` }}
        >
          <button
            ref={sealRef}
            type="button"
            aria-label="Davetiyeyi aç"
            onClick={handleOpen}
            className="envelope-seal h-[88px] w-[88px] rounded-full flex items-center justify-center cursor-pointer ring-1 ring-black/10"
            style={{
              background: theme.sealBg,
              boxShadow:
                "0 8px 20px rgba(0,0,0,0.55), inset 0 2px 6px rgba(255,255,255,0.4)",
              ["--seal-glow" as string]: theme.sealGlow,
            }}
          >
            <span
              className="text-[26px] italic select-none"
              style={{
                fontFamily: "var(--font-merienda, serif)",
                color: theme.monogramColor,
              }}
            >
              {initials}
            </span>
          </button>
        </div>

        {/* Çift altı yazılar — mührün hemen altı için ~%11 yer payı */}
        <div
          className="absolute left-0 right-0 text-center px-4 select-none"
          style={{ top: `${theme.flapTipPercent + 11}%` }}
        >
          <p
            className="text-2xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
            style={{
              fontFamily: "var(--font-merienda, serif)",
              color: theme.coupleNameColor,
            }}
          >
            {coupleLine}
          </p>
          <p
            className="mt-2 text-[10px] tracking-[0.3em] uppercase"
            style={{ color: theme.taglineColor }}
          >
            Sizi Davet Ediyor
          </p>
        </div>

        {/* Zarf üzerinde açılış glow'u */}
        <div
          ref={glowRef}
          className="envelope-glow absolute inset-0 opacity-0 pointer-events-none"
          style={{ background: theme.envelopeGlow }}
        />
      </div>

      {/* İpucu */}
      <p
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[11px] tracking-[0.25em] uppercase"
        style={{ color: theme.hintColor }}
      >
        Açmak için mühre dokun
      </p>

      {/* Siteye geçişte ekranı saran sıcak ışık */}
      <div
        ref={flashRef}
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{ background: theme.screenFlash }}
      />
    </div>
  );
}
