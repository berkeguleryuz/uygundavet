import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import { C } from "../style/colors";
import { F } from "../style/fonts";
import { HERO_VIDEOS, MUSIC } from "../style/themes";
import { tween, useSeconds, EASE } from "../style/ease";
import { MediaBackdrop } from "../components/MediaBackdrop";
import { KineticHeadline } from "../components/KineticHeadline";
import { BrandLockup } from "../components/BrandLockup";
import { Frame } from "../components/Frame";

// 12s 9:16 — "Yol Gösterilmiş Bir Akşam"
//   0.0 – 3.0   AÇILIŞ
//   3.0 – 9.0   HARİTA       rota çizilir, mekân pin animasyonu
//   9.0 – 11.0  ÇERÇEVE
//  11.0 – 12.0  KAPANIŞ
export const YolReelComposition: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#0a0a0a", overflow: "hidden" }}>
      <Audio src={staticFile(MUSIC.warm)} volume={0.6} />

      <Sequence from={0} durationInFrames={Math.round(3 * fps)}>
        <Hook />
      </Sequence>
      <Sequence
        from={Math.round(3 * fps)}
        durationInFrames={Math.round(6 * fps)}
      >
        <MapScene />
      </Sequence>
      <Sequence
        from={Math.round(9 * fps)}
        durationInFrames={Math.round(2 * fps)}
      >
        <FrameLine />
      </Sequence>
      <Sequence
        from={Math.round(11 * fps)}
        durationInFrames={Math.round(1 * fps)}
      >
        <End />
      </Sequence>
    </AbsoluteFill>
  );
};

const Hook: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      <MediaBackdrop
        src={HERO_VIDEOS.crystalRing}
        duration={3}
        zoom={{ from: 1.06, to: 1.16 }}
        pan={{ x: [0.2, -0.2], y: [-0.1, 0.1] }}
        vignette={0.7}
        tint="#000"
        tintOpacity={0.55}
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
              text: "Yol gösterilmiş",
              font: "serif",
              size: 110,
              color: C.cream,
              weight: 300,
            },
            {
              text: "bir akşam.",
              font: "serifSoft",
              italic: true,
              size: 110,
              color: C.goldHi,
              weight: 400,
            },
          ]}
        />
      </AbsoluteFill>
      <Frame tone="dark" stage="REELS · 01" role="HARİTA" showTimecode={false} />
    </AbsoluteFill>
  );
};

const MapScene: React.FC = () => {
  const t = useSeconds();
  // Animated SVG route from start to venue
  const routeLen = 800;
  const drawPct = tween({
    t,
    start: 0.4,
    end: 3.0,
    from: 0,
    to: 1,
    ease: EASE.outQuart,
  });
  const pinScale = tween({
    t,
    start: 2.6,
    end: 3.2,
    from: 0,
    to: 1,
    ease: EASE.outBack,
  });
  const cardOp = tween({
    t,
    start: 3.2,
    end: 4.0,
    from: 0,
    to: 1,
    ease: EASE.outQuart,
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, #1f2540 0%, #0a0a14 70%)",
      }}
    >
      {/* Faux map graticule */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.08,
          backgroundImage:
            "linear-gradient(rgba(213,209,173,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(213,209,173,0.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* SVG with route */}
      <svg
        viewBox="0 0 1080 1920"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      >
        {/* Faint roads */}
        <path
          d="M 100 1500 Q 350 1300, 500 1100 T 900 700"
          stroke="rgba(213,209,173,0.15)"
          strokeWidth="20"
          fill="none"
        />
        <path
          d="M 50 1100 L 950 1300"
          stroke="rgba(213,209,173,0.1)"
          strokeWidth="14"
          fill="none"
        />
        <path
          d="M 700 200 L 600 1700"
          stroke="rgba(213,209,173,0.08)"
          strokeWidth="14"
          fill="none"
        />

        {/* Animated route */}
        <path
          d="M 140 1640 Q 320 1520, 460 1380 Q 580 1260, 640 1080 Q 700 880, 820 720"
          stroke={C.gold}
          strokeWidth="8"
          fill="none"
          strokeDasharray={routeLen}
          strokeDashoffset={routeLen * (1 - drawPct)}
          strokeLinecap="round"
        />

        {/* Start pin */}
        <circle
          cx={140}
          cy={1640}
          r={14}
          fill="#fff"
          stroke={C.gold}
          strokeWidth="4"
        />

        {/* Venue pin (animates in) */}
        <g
          transform={`translate(820, 720) scale(${pinScale})`}
          style={{ transformOrigin: "820px 720px" }}
        >
          <circle r={36} fill={C.gold} opacity={0.25} />
          <circle r={20} fill={C.gold} />
          <circle r={9} fill="#fff" />
        </g>
      </svg>

      {/* Venue card */}
      <div
        style={{
          position: "absolute",
          left: "8%",
          right: "8%",
          bottom: "10%",
          background: "rgba(245,240,230,0.06)",
          border: "1px solid rgba(245,240,230,0.22)",
          borderRadius: 18,
          padding: "26px 30px",
          backdropFilter: "blur(14px)",
          opacity: cardOp,
          transform: `translateY(${(1 - cardOp) * 18}px)`,
        }}
      >
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 13,
            letterSpacing: "0.32em",
            color: C.goldHi,
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          VARIŞ
        </div>
        <div
          style={{
            fontFamily: F.serif,
            fontWeight: 300,
            fontSize: 64,
            color: C.cream,
            letterSpacing: "-0.02em",
            lineHeight: 1.0,
          }}
        >
          Çırağan Sarayı
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginTop: 14,
            fontFamily: F.body,
            fontSize: 18,
            color: "rgba(245,240,230,0.78)",
          }}
        >
          <span>Çırağan Cad. No: 32, Beşiktaş</span>
          <span style={{ color: C.gold, fontFamily: F.mono, fontSize: 14, letterSpacing: "0.18em" }}>
            18 DK
          </span>
        </div>
      </div>

      {/* Top label */}
      <div
        style={{
          position: "absolute",
          top: "6%",
          left: "8%",
          right: "8%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 16,
            letterSpacing: "0.42em",
            color: C.goldHi,
            textTransform: "uppercase",
          }}
        >
          ✦ ROTA · CANLI
        </div>
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 12,
            letterSpacing: "0.28em",
            color: "rgba(245,240,230,0.6)",
            textTransform: "uppercase",
          }}
        >
          26 EYL · 19:30
        </div>
      </div>
      <Frame tone="dark" stage="REELS · 02" role="YOL" showTimecode={false} />
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
        tintOpacity={0.65}
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
              text: "Davetiyenizdeki",
              font: "serif",
              size: 78,
              color: C.cream,
              weight: 300,
            },
            {
              text: "haritayla geliyorlar.",
              font: "serifSoft",
              italic: true,
              size: 78,
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
  return (
    <AbsoluteFill style={{ background: C.bgDark }}>
      <MediaBackdrop
        src={HERO_VIDEOS.crystalBox}
        duration={1}
        zoom={{ from: 1.0, to: 1.04 }}
        pan={{ x: [0, 0], y: [0, 0] }}
        vignette={0.7}
        tint="#000"
        tintOpacity={0.7}
        fadeIn={0.2}
        fadeOut={0.2}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 12,
          textAlign: "center",
        }}
      >
        <BrandLockup
          start={0.0}
          size={260}
          tone="dark"
          cta="UYGUNDAVET.COM"
          url="instagram · uygundavetcom"
        />
        <div
          style={{
            fontFamily: F.script,
            fontStyle: "italic",
            fontSize: 24,
            color: C.goldHi,
            letterSpacing: "0.03em",
          }}
        >
          web tabanlı, yol haritalı.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
