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

// 15s 9:16 — "Bir Akşam, Ömürlük"
// Yıllar yer değiştiriyor: 5 / 10 / 25 / 50 yıl. Davetiye duruyor.
//   0.0 – 3.0   AÇILIŞ        "Bir akşam, ömürlük."
//   3.0 – 11.0  YIL ZİNCİRİ   5 → 10 → 25 → 50, her biri ~2s
//  11.0 – 13.0  ÇERÇEVE       "Davetiyeniz, anınızla yaşar."
//  13.0 – 15.0  KAPANIŞ
export const OmurlukReelComposition: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#0a0a0a", overflow: "hidden" }}>
      <Audio src={staticFile(MUSIC.cinematic)} volume={0.6} />

      <Sequence from={0} durationInFrames={Math.round(3 * fps)}>
        <Hook />
      </Sequence>
      <Sequence
        from={Math.round(3 * fps)}
        durationInFrames={Math.round(2 * fps)}
      >
        <YearBeat year={5} caption="ilk evlilik yıldönümü" />
      </Sequence>
      <Sequence
        from={Math.round(5 * fps)}
        durationInFrames={Math.round(2 * fps)}
      >
        <YearBeat year={10} caption="çeyrek ömrünüz birlikte" />
      </Sequence>
      <Sequence
        from={Math.round(7 * fps)}
        durationInFrames={Math.round(2 * fps)}
      >
        <YearBeat year={25} caption="çocukların gözünden bir hatıra" />
      </Sequence>
      <Sequence
        from={Math.round(9 * fps)}
        durationInFrames={Math.round(2 * fps)}
      >
        <YearBeat year={50} caption="torunlara anlatılacak bir akşam" />
      </Sequence>
      <Sequence
        from={Math.round(11 * fps)}
        durationInFrames={Math.round(2 * fps)}
      >
        <FrameLine />
      </Sequence>
      <Sequence
        from={Math.round(13 * fps)}
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
        zoom={{ from: 1.18, to: 1.04 }}
        pan={{ x: [0, 0], y: [0, 0] }}
        vignette={0.6}
        tint="#000"
        tintOpacity={0.55}
        fadeOut={0.3}
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
          start={0.3}
          stagger={0.08}
          align="left"
          lines={[
            {
              text: "Bir akşam,",
              font: "serif",
              size: 152,
              color: C.cream,
              weight: 300,
            },
            {
              text: "ömürlük.",
              font: "serifSoft",
              italic: true,
              size: 152,
              color: C.goldHi,
              weight: 400,
            },
          ]}
        />
      </AbsoluteFill>
      <Frame tone="dark" stage="REELS · 01" role="ÖMÜR" showTimecode={false} />
    </AbsoluteFill>
  );
};

const YearBeat: React.FC<{ year: number; caption: string }> = ({
  year,
  caption,
}) => {
  const t = useSeconds();
  const op = tween({ t, start: 0.0, end: 0.4, from: 0, to: 1, ease: EASE.outQuart });
  const ty = tween({ t, start: 0.0, end: 0.5, from: 22, to: 0, ease: EASE.outBack });
  const lineW = tween({
    t,
    start: 0.5,
    end: 1.4,
    from: 0,
    to: 100,
    ease: EASE.outQuart,
  });
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <MediaBackdrop
        src={HERO_VIDEOS.crystalRing}
        duration={2}
        zoom={{ from: 1.06, to: 1.14 }}
        pan={{ x: [0.1, -0.1], y: [0, 0] }}
        vignette={0.65}
        tint="#000"
        tintOpacity={0.55}
        fadeIn={0.15}
        fadeOut={0.15}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          padding: "0 6%",
          textAlign: "center",
          opacity: op,
          transform: `translateY(${ty}px)`,
        }}
      >
        <div
          style={{
            fontFamily: F.serif,
            fontWeight: 300,
            fontSize: 380,
            color: C.cream,
            letterSpacing: "-0.04em",
            lineHeight: 0.95,
          }}
        >
          {year}
        </div>
        <div
          style={{
            fontFamily: F.serifSoft,
            fontStyle: "italic",
            fontSize: 56,
            color: C.gold,
            marginTop: 4,
          }}
        >
          yıl sonra
        </div>
        <div
          style={{
            height: 1,
            width: `${lineW}%`,
            maxWidth: 520,
            background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
            margin: "26px 0 18px",
          }}
        />
        <div
          style={{
            fontFamily: F.body,
            fontSize: 24,
            color: "rgba(245,240,230,0.78)",
            letterSpacing: "0.04em",
          }}
        >
          {caption}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const FrameLine: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <MediaBackdrop
        src={HERO_VIDEOS.kelebek}
        duration={2}
        zoom={{ from: 1.04, to: 1.12 }}
        pan={{ x: [0, 0], y: [0, 0] }}
        vignette={0.7}
        tint="#000"
        tintOpacity={0.6}
        fadeIn={0.25}
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
              text: "anınızla yaşar.",
              font: "serifSoft",
              italic: true,
              size: 96,
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
        duration={2}
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
          size={280}
          tone="dark"
          cta="UYGUNDAVET.COM"
          url="instagram · uygundavetcom"
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
