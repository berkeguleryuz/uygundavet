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
import { CounterTicker } from "../components/CounterTicker";
import { KineticHeadline } from "../components/KineticHeadline";
import { BrandLockup } from "../components/BrandLockup";
import { Frame } from "../components/Frame";

// 12s 9:16 — "Sayılı Günler"
// Düğüne kalan günleri büyük serif ile sayar; her hane yıldan saniyeye iner.
//   0.0 – 2.0   GÜN     234 → ... durur
//   2.0 – 5.0   SAAT    saat / dakika / saniye 4 sütun
//   5.0 – 9.5   ÇERÇEVE "Sayılı günler, sayısız hatıra."
//   9.5 – 12.0  KAPANIŞ
export const GeriSayimReelComposition: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.bgDark, overflow: "hidden" }}>
      <Audio src={staticFile(MUSIC.cinematic)} volume={0.55} />

      <Sequence from={0} durationInFrames={Math.round(2 * fps)}>
        <DayCount />
      </Sequence>
      <Sequence
        from={Math.round(2 * fps)}
        durationInFrames={Math.round(3 * fps)}
      >
        <Quartet />
      </Sequence>
      <Sequence
        from={Math.round(5 * fps)}
        durationInFrames={Math.round(4.5 * fps)}
      >
        <FrameLine />
      </Sequence>
      <Sequence
        from={Math.round(9.5 * fps)}
        durationInFrames={Math.round(2.5 * fps)}
      >
        <End />
      </Sequence>
    </AbsoluteFill>
  );
};

const DayCount: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      <MediaBackdrop
        src={HERO_VIDEOS.crystalRing}
        duration={2}
        zoom={{ from: 1.06, to: 1.16 }}
        pan={{ x: [0.2, -0.2], y: [-0.1, 0.1] }}
        vignette={0.7}
        tint="#000"
        tintOpacity={0.55}
        fadeOut={0.3}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          padding: "0 6%",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 18,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: C.goldHi,
            marginBottom: 18,
          }}
        >
          DÜĞÜNE KALAN
        </div>
        <CounterTicker
          from={0}
          to={234}
          start={0.0}
          duration={1.4}
          ease={EASE.outExpo}
          style={{
            fontFamily: F.serif,
            fontWeight: 300,
            fontSize: 360,
            color: C.cream,
            letterSpacing: "-0.04em",
            lineHeight: 0.95,
          }}
        />
        <div
          style={{
            fontFamily: F.serifSoft,
            fontStyle: "italic",
            fontSize: 60,
            color: C.gold,
            marginTop: 8,
          }}
        >
          gün
        </div>
      </AbsoluteFill>
      <Frame tone="dark" stage="REELS · 01" role="GÜN" showTimecode={false} />
    </AbsoluteFill>
  );
};

type CellProps = {
  label: string;
  to: number;
  start: number;
  pad?: number;
};

const Cell: React.FC<CellProps> = ({ label, to, start, pad }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      flex: 1,
      gap: 8,
    }}
  >
    <CounterTicker
      from={0}
      to={to}
      start={start}
      duration={0.8}
      padTo={pad}
      ease={EASE.outExpo}
      style={{
        fontFamily: F.serif,
        fontWeight: 300,
        fontSize: 144,
        color: C.cream,
        letterSpacing: "-0.04em",
        lineHeight: 0.95,
      }}
    />
    <div
      style={{
        fontFamily: F.mono,
        fontSize: 14,
        letterSpacing: "0.36em",
        textTransform: "uppercase",
        color: C.gold,
      }}
    >
      {label}
    </div>
  </div>
);

const Quartet: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      <MediaBackdrop
        src={HERO_VIDEOS.crystalRing}
        duration={3}
        zoom={{ from: 1.04, to: 1.12 }}
        pan={{ x: [0, 0], y: [0, 0] }}
        vignette={0.7}
        tint="#000"
        tintOpacity={0.62}
        fadeIn={0.3}
        fadeOut={0.3}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 6%",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 16,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: C.goldHi,
            marginBottom: 36,
          }}
        >
          GÜN · SAAT · DAKİKA · SANİYE
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            gap: 12,
            alignItems: "flex-end",
          }}
        >
          <Cell label="GÜN" to={234} start={0.0} pad={3} />
          <Cell label="SAAT" to={18} start={0.15} pad={2} />
          <Cell label="DAKİKA" to={42} start={0.3} pad={2} />
          <Cell label="SANİYE" to={59} start={0.45} pad={2} />
        </div>
      </AbsoluteFill>
      <Frame tone="dark" stage="REELS · 02" role="ZAMAN" showTimecode={false} />
    </AbsoluteFill>
  );
};

const FrameLine: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      <MediaBackdrop
        src={HERO_VIDEOS.kelebek}
        duration={4.5}
        zoom={{ from: 1.04, to: 1.16 }}
        pan={{ x: [-0.2, 0.2], y: [0.1, -0.1] }}
        vignette={0.6}
        tint="#000"
        tintOpacity={0.5}
        fadeIn={0.3}
        fadeOut={0.4}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 8%",
          textAlign: "center",
        }}
      >
        <KineticHeadline
          start={0.0}
          stagger={0.07}
          align="center"
          lines={[
            {
              text: "Sayılı günler,",
              font: "serif",
              size: 110,
              color: C.cream,
              weight: 300,
            },
            {
              text: "sayısız hatıra.",
              font: "serifSoft",
              italic: true,
              size: 110,
              color: C.goldHi,
              weight: 400,
            },
          ]}
        />
      </AbsoluteFill>
      <Frame tone="dark" stage="REELS · 03" role="HATIRA" />
    </AbsoluteFill>
  );
};

const End: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.bgDark }}>
      <MediaBackdrop
        src={HERO_VIDEOS.crystalBox}
        duration={2.5}
        zoom={{ from: 1.0, to: 1.06 }}
        pan={{ x: [0, 0], y: [0, 0] }}
        vignette={0.7}
        tint="#000"
        tintOpacity={0.65}
        fadeIn={0.3}
        fadeOut={0.3}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BrandLockup
          start={0.0}
          size={300}
          tone="dark"
          cta="UYGUNDAVET.COM"
          url="instagram · uygundavetcom"
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
