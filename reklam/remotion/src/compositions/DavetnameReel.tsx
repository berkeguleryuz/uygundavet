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
import { HERO_VIDEOS, MUSIC, STILL_IMAGES } from "../style/themes";
import { tween, useSeconds, EASE } from "../style/ease";
import { MediaBackdrop } from "../components/MediaBackdrop";
import { KineticHeadline } from "../components/KineticHeadline";
import { RsvpRip } from "../components/RsvpRip";
import { BrandLockup } from "../components/BrandLockup";
import { Frame } from "../components/Frame";

// 16s 9:16 — "Bir mektup gibi açılsın"
// Mektup açılışıyla başlayan, hat sanatından ilham alan, davetiyenin
// hatıra olduğunu vurgulayan ağır vurgulu bir spot.
//   0.0 – 3.0   AÇILIŞ        kâğıt arka plan + Cormorant italik açılış
//   3.0 – 9.0   SÖZ           yüzük + üç sözcük
//   9.0 – 13.0  MÜHÜR         davetiye kartı yırtılır
//  13.0 – 16.0  KAPANIŞ       marka kilidi
export const DavetnameReelComposition: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.ivory, overflow: "hidden" }}>
      <Audio src={staticFile(MUSIC.warm)} volume={0.7} />

      <Sequence from={0} durationInFrames={Math.round(3 * fps)}>
        <SceneOpen />
      </Sequence>
      <Sequence
        from={Math.round(3 * fps)}
        durationInFrames={Math.round(6 * fps)}
      >
        <SceneSoz />
      </Sequence>
      <Sequence
        from={Math.round(9 * fps)}
        durationInFrames={Math.round(4 * fps)}
      >
        <SceneMuhur />
      </Sequence>
      <Sequence
        from={Math.round(13 * fps)}
        durationInFrames={Math.round(3 * fps)}
      >
        <SceneEnd />
      </Sequence>
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

const SceneOpen: React.FC = () => {
  const t = useSeconds();
  const op1 = tween({ t, start: 0.2, end: 1.0, from: 0, to: 1, ease: EASE.outQuart });
  const op2 = tween({ t, start: 0.9, end: 1.8, from: 0, to: 1, ease: EASE.outQuart });
  const ty1 = tween({ t, start: 0.2, end: 1.0, from: 16, to: 0, ease: EASE.outQuart });

  return (
    <AbsoluteFill style={{ background: C.ivory }}>
      <PaperWash />
      {/* Faint ornament rule top */}
      <div
        style={{
          position: "absolute",
          top: "12%",
          left: "12%",
          right: "12%",
          height: 1,
          background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
          opacity: op1 * 0.45,
        }}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          padding: "0 8%",
          textAlign: "center",
          gap: 28,
        }}
      >
        <div
          style={{
            opacity: op1,
            transform: `translateY(${ty1}px)`,
            fontFamily: F.mono,
            fontSize: 18,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: C.gold,
          }}
        >
          DAVETNAME · MMXXVI
        </div>
        <div
          style={{
            opacity: op2,
            fontFamily: F.serifSoft,
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: 96,
            color: C.charcoal,
            lineHeight: 1.04,
            letterSpacing: "-0.02em",
          }}
        >
          Bir davet,
          <br />
          bir mektup gibi
          <br />
          açılsın.
        </div>
      </AbsoluteFill>
      {/* Bottom rule */}
      <div
        style={{
          position: "absolute",
          bottom: "12%",
          left: "12%",
          right: "12%",
          height: 1,
          background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
          opacity: op1 * 0.45,
        }}
      />
      <Frame tone="light" stage="REELS · 01" role="DAVETNAME" showTimecode={false} />
    </AbsoluteFill>
  );
};

const SceneSoz: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <MediaBackdrop
        src={HERO_VIDEOS.yuzuk}
        duration={6}
        zoom={{ from: 1.06, to: 1.2 }}
        pan={{ x: [-0.3, 0.3], y: [0.1, -0.1] }}
        vignette={0.6}
        tint="#000"
        tintOpacity={0.32}
        fadeIn={0.5}
        fadeOut={0.5}
      />
      <AbsoluteFill
        style={{
          padding: "14% 8%",
          display: "flex",
          alignItems: "flex-start",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <KineticHeadline
          start={0.4}
          stagger={0.4}
          align="left"
          lines={[
            { text: "Söz.", font: "serif", size: 168, color: C.cream, weight: 300 },
            { text: "Mühür.", font: "serif", size: 168, color: C.cream, weight: 300 },
            {
              text: "Hatıra.",
              font: "serifSoft",
              italic: true,
              size: 168,
              color: C.goldHi,
              weight: 400,
            },
          ]}
        />
        <div style={{ height: 24 }} />
        <div
          style={{
            fontFamily: F.script,
            fontStyle: "italic",
            fontSize: 38,
            color: "rgba(245,240,230,0.85)",
            letterSpacing: "0.04em",
            maxWidth: "90%",
            lineHeight: 1.3,
          }}
        >
          Üç kelime, bir ömrü taşır.
        </div>
      </AbsoluteFill>
      <Frame tone="dark" stage="REELS · 02" role="SÖZ" />
    </AbsoluteFill>
  );
};

const SceneMuhur: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.ivory }}>
      <PaperWash />
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <RsvpRip
          start={0.1}
          width={920}
          height={620}
          names={{ a: "Tuana", b: "Ateş" }}
          date="26 · 09 · 2026"
          venue="İstanbul"
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          padding: "0 8%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          paddingBottom: "14%",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: F.serifSoft,
            fontStyle: "italic",
            fontSize: 48,
            color: C.goldDeep,
            letterSpacing: "0.01em",
            lineHeight: 1.2,
          }}
        >
          Mührünüz dijital olsun;
          <br />
          duygunuz gerçek.
        </div>
      </AbsoluteFill>
      <Frame tone="light" stage="REELS · 03" role="MÜHÜR" />
    </AbsoluteFill>
  );
};

const SceneEnd: React.FC = () => {
  const t = useSeconds();
  return (
    <AbsoluteFill style={{ background: C.bgDark }}>
      <MediaBackdrop
        src={HERO_VIDEOS.crystalBox}
        duration={3}
        zoom={{ from: 1.0, to: 1.06 }}
        pan={{ x: [0, 0], y: [0, 0] }}
        vignette={0.7}
        tint="#000"
        tintOpacity={0.65}
        fadeIn={0.4}
        fadeOut={0.4}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          padding: "0 8%",
          textAlign: "center",
          gap: 22,
        }}
      >
        <BrandLockup
          start={0.0}
          size={300}
          tone="dark"
          cta="UYGUNDAVET.COM"
          url="instagram · uygundavetcom"
        />
        <div
          style={{
            opacity: tween({ t, start: 1.2, end: 2.0, from: 0, to: 1 }),
            fontFamily: F.script,
            fontStyle: "italic",
            fontSize: 30,
            color: C.goldHi,
            letterSpacing: "0.03em",
          }}
        >
          dijital davetiye, ömürlük hatıra.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
