import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import { C } from "../style/colors";
import { F } from "../style/fonts";
import { HERO_VIDEOS, MUSIC, STILL_IMAGES, THEMES } from "../style/themes";
import { tween, useSeconds, EASE } from "../style/ease";
import { MediaBackdrop } from "../components/MediaBackdrop";
import { KineticHeadline } from "../components/KineticHeadline";
import { BrowserChrome } from "../components/BrowserChrome";
import { BrandLockup } from "../components/BrandLockup";
import { Frame } from "../components/Frame";

// 16s 9:16 — "Bir Web Sitesi Kadar Canlı"
// Tarayıcı çerçevesinde davetiye sayfası kayar; herkes anlasın ki bu bir web
// sitesi.
//   0.0 – 3.0   AÇILIŞ
//   3.0 – 12.0  WEB SAYFASI    BrowserChrome içinde 4 bölüm scroll
//  12.0 – 14.0  ÖZET
//  14.0 – 16.0  KAPANIŞ        "Dijital websitesi davetiyesi"
export const WebsiteReelComposition: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#0a0a0a", overflow: "hidden" }}>
      <Audio src={staticFile(MUSIC.cinematic)} volume={0.55} />

      <Sequence from={0} durationInFrames={Math.round(3 * fps)}>
        <Hook />
      </Sequence>
      <Sequence
        from={Math.round(3 * fps)}
        durationInFrames={Math.round(9 * fps)}
      >
        <ScrollScene />
      </Sequence>
      <Sequence
        from={Math.round(12 * fps)}
        durationInFrames={Math.round(2 * fps)}
      >
        <FrameLine />
      </Sequence>
      <Sequence
        from={Math.round(14 * fps)}
        durationInFrames={Math.round(2 * fps)}
      >
        <End />
      </Sequence>
    </AbsoluteFill>
  );
};

const Hook: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <MediaBackdrop
        src={HERO_VIDEOS.kelebek}
        duration={3}
        zoom={{ from: 1.06, to: 1.16 }}
        pan={{ x: [0.2, -0.2], y: [-0.1, 0.1] }}
        vignette={0.7}
        tint="#000"
        tintOpacity={0.6}
        fadeOut={0.4}
      />
      <AbsoluteFill
        style={{
          padding: "14% 8%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <KineticHeadline
          start={0.2}
          stagger={0.07}
          align="left"
          lines={[
            {
              text: "Bir kâğıt değil,",
              font: "serif",
              size: 100,
              color: C.cream,
              weight: 300,
            },
            {
              text: "bir web sitesi.",
              font: "serifSoft",
              italic: true,
              size: 110,
              color: C.goldHi,
              weight: 400,
            },
          ]}
        />
      </AbsoluteFill>
      <Frame tone="dark" stage="REELS · 01" role="WEB" showTimecode={false} />
    </AbsoluteFill>
  );
};

// The site content — full vertical site with 4 sections; we translate it up
// over the scroll duration to fake a scroll-through.
const SiteContent: React.FC = () => (
  <div
    style={{
      width: "100%",
      background: "#fff",
      color: C.ink,
      display: "flex",
      flexDirection: "column",
    }}
  >
    {/* HERO */}
    <div
      style={{
        position: "relative",
        height: 1100,
        overflow: "hidden",
        background: "#1a1612",
      }}
    >
      <OffthreadVideo
        src={staticFile(HERO_VIDEOS.kadinerkek)}
        muted
        loop
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          opacity: 0.7,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.65))",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          bottom: 60,
        }}
      >
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 14,
            letterSpacing: "0.42em",
            color: "rgba(245,240,230,0.78)",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          DÜĞÜNÜMÜZE DAVETLİSİNİZ
        </div>
        <div
          style={{
            fontFamily: F.serif,
            fontWeight: 300,
            fontSize: 130,
            color: "#fff",
            letterSpacing: "-0.03em",
            lineHeight: 0.95,
          }}
        >
          Tuana
          <span
            style={{
              fontFamily: F.serifSoft,
              fontStyle: "italic",
              fontSize: 80,
              color: C.goldHi,
              margin: "0 18px",
              display: "inline-block",
            }}
          >
            &amp;
          </span>
          Ateş
        </div>
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 18,
            letterSpacing: "0.32em",
            color: "rgba(245,240,230,0.85)",
            marginTop: 22,
            textTransform: "uppercase",
          }}
        >
          26 EYLÜL 2026 · ÇIRAĞAN, İSTANBUL
        </div>
      </div>
    </div>

    {/* HİKÂYE */}
    <div
      style={{
        padding: "100px 60px",
        background: "#faf7f0",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: F.mono,
          fontSize: 14,
          letterSpacing: "0.42em",
          color: C.gold,
          textTransform: "uppercase",
          marginBottom: 24,
        }}
      >
        HİKÂYEMİZ
      </div>
      <div
        style={{
          fontFamily: F.serifSoft,
          fontStyle: "italic",
          fontSize: 56,
          color: C.charcoal,
          lineHeight: 1.3,
          maxWidth: 800,
          margin: "0 auto",
        }}
      >
        İlk bakıştan beri biliyorduk;
        <br />
        bu yol birlikte uzayacak.
      </div>
    </div>

    {/* RSVP */}
    <div
      style={{
        padding: "100px 60px",
        background: "#ece4d3",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: F.mono,
          fontSize: 14,
          letterSpacing: "0.42em",
          color: C.gold,
          textTransform: "uppercase",
          marginBottom: 24,
        }}
      >
        KATILIM ONAYI
      </div>
      <div
        style={{
          fontFamily: F.serif,
          fontWeight: 300,
          fontSize: 96,
          color: C.charcoal,
          letterSpacing: "-0.02em",
          lineHeight: 1.0,
          marginBottom: 36,
        }}
      >
        Bizimle olur musunuz?
      </div>
      <div
        style={{
          display: "flex",
          gap: 20,
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: C.charcoal,
            color: "#fff",
            padding: "26px 56px",
            borderRadius: 999,
            fontFamily: F.display,
            fontWeight: 600,
            fontSize: 22,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
          }}
        >
          KATILIYORUM
        </div>
        <div
          style={{
            background: "transparent",
            color: C.charcoal,
            border: `2px solid ${C.charcoal}`,
            padding: "24px 54px",
            borderRadius: 999,
            fontFamily: F.display,
            fontWeight: 600,
            fontSize: 22,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
          }}
        >
          KATILAMIYORUM
        </div>
      </div>
    </div>

    {/* GERİ SAYIM */}
    <div
      style={{
        padding: "100px 60px",
        background: "#1a1612",
        color: "#fff",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: F.mono,
          fontSize: 14,
          letterSpacing: "0.42em",
          color: C.goldHi,
          textTransform: "uppercase",
          marginBottom: 24,
        }}
      >
        GERİ SAYIM
      </div>
      <div
        style={{
          fontFamily: F.serif,
          fontWeight: 300,
          fontSize: 200,
          color: "#fff",
          letterSpacing: "-0.04em",
          lineHeight: 0.95,
        }}
      >
        234
      </div>
      <div
        style={{
          fontFamily: F.serifSoft,
          fontStyle: "italic",
          fontSize: 38,
          color: C.goldHi,
          marginTop: 6,
        }}
      >
        gün kaldı
      </div>
    </div>
  </div>
);

const ScrollScene: React.FC = () => {
  const t = useSeconds();
  // Scroll vertical content from top to ~85% over the 9s
  const scrollPct = tween({
    t,
    start: 0.4,
    end: 8.4,
    from: 0,
    to: -76,
    ease: EASE.inOutSine,
  });
  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      <MediaBackdrop
        src={HERO_VIDEOS.crystalBox}
        duration={9}
        zoom={{ from: 1.04, to: 1.1 }}
        pan={{ x: [0, 0], y: [0, 0] }}
        vignette={0.7}
        tint="#000"
        tintOpacity={0.7}
        fadeIn={0.3}
        fadeOut={0.4}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "8% 5% 14%",
        }}
      >
        <BrowserChrome
          url="uygundavet.com/sunset"
          width="100%"
          height="100%"
          variant="light"
          tabTitle="Tuana & Ateş · Davetiyemiz"
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              transform: `translateY(${scrollPct}%)`,
            }}
          >
            <SiteContent />
          </div>
          {/* Scroll progress bar at right edge */}
          <div
            style={{
              position: "absolute",
              right: 6,
              top: 12,
              bottom: 12,
              width: 3,
              background: "rgba(20,16,12,0.05)",
              borderRadius: 3,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: `${Math.max(0, Math.min(85, -scrollPct))}%`,
                width: "100%",
                height: "12%",
                background: C.gold,
                borderRadius: 3,
              }}
            />
          </div>
        </BrowserChrome>
      </AbsoluteFill>

      {/* Top label */}
      <div
        style={{
          position: "absolute",
          top: "5%",
          left: "8%",
          right: "8%",
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 16,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: C.goldHi,
          }}
        >
          ✦ TARAYICIDA
        </div>
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 12,
            letterSpacing: "0.28em",
            color: "rgba(245,240,230,0.55)",
            textTransform: "uppercase",
          }}
        >
          CANLI · 4 BÖLÜM
        </div>
      </div>
      <Frame tone="dark" stage="REELS · 02" role="WEB SİTESİ" showTimecode={false} />
    </AbsoluteFill>
  );
};

const FrameLine: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      <MediaBackdrop
        src={HERO_VIDEOS.kelebek}
        duration={2}
        zoom={{ from: 1.04, to: 1.1 }}
        pan={{ x: [0, 0], y: [0, 0] }}
        vignette={0.7}
        tint="#000"
        tintOpacity={0.6}
        fadeIn={0.3}
        fadeOut={0.3}
      />
      <AbsoluteFill
        style={{
          padding: "0 8%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <KineticHeadline
          start={0.0}
          stagger={0.06}
          align="center"
          lines={[
            {
              text: "Davetiyeniz,",
              font: "serif",
              size: 96,
              color: C.cream,
              weight: 300,
            },
            {
              text: "bir web sitesi olarak yaşar.",
              font: "serifSoft",
              italic: true,
              size: 60,
              color: C.goldHi,
              weight: 400,
            },
          ]}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const End: React.FC = () => {
  const t = useSeconds();
  return (
    <AbsoluteFill style={{ background: C.bgDark }}>
      <MediaBackdrop
        src={HERO_VIDEOS.crystalBox}
        duration={2}
        zoom={{ from: 1.0, to: 1.06 }}
        pan={{ x: [0, 0], y: [0, 0] }}
        vignette={0.7}
        tint="#000"
        tintOpacity={0.7}
        fadeIn={0.3}
        fadeOut={0.3}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 22,
          padding: "0 8%",
          textAlign: "center",
        }}
      >
        <BrandLockup
          start={0.0}
          size={280}
          tone="dark"
          cta="UYGUNDAVET.COM"
          url="instagram · uygundavetcom"
        />
        <div
          style={{
            opacity: tween({ t, start: 1.0, end: 1.7, from: 0, to: 1 }),
            fontFamily: F.script,
            fontStyle: "italic",
            fontSize: 30,
            color: C.goldHi,
            letterSpacing: "0.03em",
          }}
        >
          dijital websitesi davetiyesi.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
