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
import { ThemeMosaic } from "../components/ThemeMosaic";
import { BrandLockup } from "../components/BrandLockup";
import { Frame } from "../components/Frame";
import { Ticker } from "../components/Ticker";

// 18s 9:16 — Kare spotun Reels uyarlaması.
//   0.0 – 4.0   AÇILIŞ        hero + başlık
//   4.0 – 9.0   TEMA          mozaik + spotlight ocean
//   9.0 – 14.0  HİKÂYE        kadinerkek + alt başlık
//  14.0 – 18.0  KAPANIŞ       marka kilidi
export const SquareSpotMobileComposition: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.bgDark, overflow: "hidden" }}>
      <Audio src={staticFile(MUSIC.warm)} volume={0.6} />

      <Sequence from={0} durationInFrames={Math.round(4 * fps)}>
        <SqHook />
      </Sequence>
      <Sequence
        from={Math.round(4 * fps)}
        durationInFrames={Math.round(5 * fps)}
      >
        <SqThemes />
      </Sequence>
      <Sequence
        from={Math.round(9 * fps)}
        durationInFrames={Math.round(5 * fps)}
      >
        <SqStory />
      </Sequence>
      <Sequence
        from={Math.round(14 * fps)}
        durationInFrames={Math.round(4 * fps)}
      >
        <SqCta />
      </Sequence>
    </AbsoluteFill>
  );
};

const SqHook: React.FC = () => {
  return (
    <AbsoluteFill>
      <MediaBackdrop
        src={HERO_VIDEOS.hero2}
        duration={4}
        zoom={{ from: 1.1, to: 1.02 }}
        pan={{ x: [0, 0], y: [-0.2, 0.2] }}
        vignette={0.45}
        tint="#1a1612"
        tintOpacity={0.32}
        fadeOut={0.4}
      />
      <AbsoluteFill
        style={{
          padding: "12% 8% 14%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <KineticHeadline
          start={0.4}
          stagger={0.08}
          lines={[
            {
              text: "Anınız",
              font: "serif",
              size: 158,
              color: C.cream,
              weight: 300,
            },
            {
              text: "kâğıttan",
              font: "serifSoft",
              italic: true,
              size: 158,
              color: C.gold,
              weight: 400,
            },
            {
              text: "büyüktür.",
              font: "serif",
              size: 158,
              color: C.cream,
              weight: 300,
            },
          ]}
        />
      </AbsoluteFill>
      <Frame tone="dark" stage="REELS · 01" role="AÇILIŞ" showTimecode={false} />
    </AbsoluteFill>
  );
};

const SqThemes: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.ivory }}>
      <PaperWash />
      <div
        style={{
          position: "absolute",
          left: "5%",
          right: "5%",
          top: "26%",
          bottom: "12%",
        }}
      >
        <ThemeMosaic
          start={0.0}
          rows={4}
          cols={2}
          gap={20}
          spotlight={{ themeKey: "ocean", from: 2.4, to: 4.6 }}
        />
      </div>
      <AbsoluteFill style={{ padding: "10% 6%", pointerEvents: "none" }}>
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 17,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: C.gold,
            marginBottom: 12,
          }}
        >
          ✦ TEMA · KATALOĞU
        </div>
        <KineticHeadline
          start={0.0}
          stagger={0.05}
          lines={[
            {
              text: "Sekiz dünya,",
              font: "serif",
              size: 86,
              color: C.charcoal,
              weight: 300,
            },
            {
              text: "tek hikâye.",
              font: "serifSoft",
              italic: true,
              size: 86,
              color: C.goldDeep,
              weight: 400,
            },
          ]}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SqStory: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <MediaBackdrop
        src={HERO_VIDEOS.kadinerkek}
        duration={5}
        zoom={{ from: 1.04, to: 1.18 }}
        pan={{ x: [-0.4, 0.4], y: [0.2, -0.2] }}
        vignette={0.4}
        tint="#1a1612"
        tintOpacity={0.18}
        fadeIn={0.5}
        fadeOut={0.5}
      />
      <AbsoluteFill
        style={{
          padding: "12% 8% 14%",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          flexDirection: "column",
        }}
      >
        <KineticHeadline
          start={0.3}
          align="left"
          stagger={0.07}
          lines={[
            {
              text: "Davetiyeniz",
              font: "script",
              size: 116,
              color: C.cream,
              weight: 400,
            },
            {
              text: "size benzesin.",
              font: "script",
              size: 116,
              color: C.goldHi,
              weight: 400,
            },
          ]}
        />
      </AbsoluteFill>
      <Ticker
        items={[
          "8 tema",
          "Katılım",
          "Anı defteri",
          "Hediye listesi",
          "Çoklu dil",
          "Kendi alan adınız",
        ]}
        position="top"
        height={52}
        background="rgba(0,0,0,0.45)"
        color="#d5d1ad"
        fontSize={15}
        speed={70}
      />
    </AbsoluteFill>
  );
};

const SqCta: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.bgDark }}>
      <MediaBackdrop
        src={HERO_VIDEOS.crystalRing}
        duration={4}
        zoom={{ from: 1.0, to: 1.1 }}
        pan={{ x: [0, 0], y: [0, 0] }}
        vignette={0.7}
        tint="#000"
        tintOpacity={0.6}
        fadeIn={0.4}
        fadeOut={0.4}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 8%",
        }}
      >
        <BrandLockup
          start={0.1}
          size={300}
          tone="dark"
          cta="UYGUNDAVET.COM"
          url="instagram · uygundavetcom"
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const PaperWash: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse at 30% 20%, #faf7f0 0%, #ece4d3 60%, #d8cfbc 100%)",
    }}
  />
);
