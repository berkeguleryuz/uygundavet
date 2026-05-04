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
import { HtmlCanvasInvitation } from "../components/HtmlCanvasInvitation";
import { BrandLockup } from "../components/BrandLockup";
import { Frame } from "../components/Frame";

// 22s 9:16 — HTML × TUVAL showcase, Reels uyarlaması.
//   0.0 – 4.0   TANITIM       crystal kelebek + ana başlık
//   4.0 – 8.0   SİS PERDESİ   davetiye sisten yükselir
//   8.0 – 12.0  RENK KIRINIMI kromatik aberasyon → netlik
//  12.0 – 16.0  KAĞIT KIVRIMI dalga / kıvrım
//  16.0 – 19.0  ALTIN PARILTI altın taraması
//  19.0 – 22.0  KAPANIŞ       marka kilidi
export const HtmlGlitchMobileComposition: React.FC = () => {
  const { fps, width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Audio src={staticFile(MUSIC.cinematic)} volume={0.55} />

      <Sequence from={0} durationInFrames={Math.round(4 * fps)}>
        <Thesis />
      </Sequence>

      <Sequence
        from={Math.round(4 * fps)}
        durationInFrames={Math.round(4 * fps)}
      >
        <CanvasBeat
          mode="smokeReveal"
          modeTr="SİS PERDESİ"
          subhead="DOM · sis · bulanıklık"
          backdropSrc={HERO_VIDEOS.crystalBox}
          backdropTint="#1a1612"
          width={width}
          height={height}
        />
      </Sequence>

      <Sequence
        from={Math.round(8 * fps)}
        durationInFrames={Math.round(4 * fps)}
      >
        <CanvasBeat
          mode="rgbShift"
          modeTr="RENK KIRINIMI"
          subhead="RGB · ayrışma · netlik"
          backdropSrc={HERO_VIDEOS.kelebek}
          backdropTint="#1f2340"
          width={width}
          height={height}
        />
      </Sequence>

      <Sequence
        from={Math.round(12 * fps)}
        durationInFrames={Math.round(4 * fps)}
      >
        <CanvasBeat
          mode="rippleFold"
          modeTr="KAĞIT KIVRIMI"
          subhead="kâğıt · dalga · zaman"
          backdropSrc={HERO_VIDEOS.crystalRing}
          backdropTint="#000"
          width={width}
          height={height}
        />
      </Sequence>

      <Sequence
        from={Math.round(16 * fps)}
        durationInFrames={Math.round(3 * fps)}
      >
        <CanvasBeat
          mode="shimmer"
          modeTr="ALTIN PARILTI"
          subhead="altın · ışık · yemin"
          backdropSrc={HERO_VIDEOS.yuzuk}
          backdropTint="#000"
          width={width}
          height={height}
        />
      </Sequence>

      <Sequence
        from={Math.round(19 * fps)}
        durationInFrames={Math.round(3 * fps)}
      >
        <ShowcaseEnd />
      </Sequence>
    </AbsoluteFill>
  );
};

const Thesis: React.FC = () => {
  const t = useSeconds();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <MediaBackdrop
        src={HERO_VIDEOS.kelebek}
        duration={4}
        zoom={{ from: 1.04, to: 1.16 }}
        pan={{ x: [0, -0.4], y: [0.2, -0.2] }}
        vignette={0.7}
        tint="#000"
        tintOpacity={0.55}
        fadeIn={0.5}
        fadeOut={0.6}
      />
      <AbsoluteFill
        style={{
          padding: "12% 8%",
          display: "flex",
          alignItems: "flex-start",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 18,
            letterSpacing: "0.38em",
            color: "rgba(213,209,173,0.78)",
            textTransform: "uppercase",
            marginBottom: 20,
            opacity: tween({ t, start: 0.4, end: 1.2, from: 0, to: 1 }),
          }}
        >
          ✦ TUVAL ÜZERİNE HTML
        </div>
        <KineticHeadline
          start={0.6}
          stagger={0.07}
          align="left"
          lines={[
            {
              text: "DOM ile",
              font: "serif",
              size: 130,
              color: C.cream,
              weight: 300,
            },
            {
              text: "GPU arasında",
              font: "serif",
              size: 130,
              color: C.cream,
              weight: 300,
            },
            {
              text: "yeni bir gramer.",
              font: "serifSoft",
              italic: true,
              size: 96,
              color: C.goldHi,
              weight: 400,
            },
          ]}
        />
      </AbsoluteFill>
      <Frame tone="dark" stage="00 · TANITIM" role="GÖSTERİM" />
    </AbsoluteFill>
  );
};

type BeatProps = {
  mode: "smokeReveal" | "rgbShift" | "rippleFold" | "shimmer";
  modeTr: string;
  subhead: string;
  backdropSrc: string;
  backdropTint: string;
  width: number;
  height: number;
};

const CanvasBeat: React.FC<BeatProps> = ({
  mode,
  modeTr,
  subhead,
  backdropSrc,
  backdropTint,
  width,
  height,
}) => {
  const t = useSeconds();
  const dur = 4;

  // Card occupies the central two-thirds of the portrait frame.
  const cardW = Math.round(width * 0.84);
  const cardH = Math.round(height * 0.5);

  const slideIn = tween({
    t,
    start: 0.0,
    end: 1.0,
    from: 80,
    to: 0,
    ease: EASE.outBack,
  });
  const slideOut = tween({
    t,
    start: dur - 0.6,
    end: dur,
    from: 0,
    to: -40,
    ease: EASE.inOut,
  });
  const float = Math.sin(t * 1.2) * 6;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <MediaBackdrop
        src={backdropSrc}
        duration={dur}
        zoom={{ from: 1.04, to: 1.14 }}
        pan={{ x: [0.3, -0.3], y: [-0.2, 0.2] }}
        vignette={0.7}
        tint={backdropTint}
        tintOpacity={0.5}
        fadeIn={0.4}
        fadeOut={0.4}
      />

      {/* Top — mode badge + label */}
      <AbsoluteFill
        style={{
          padding: "12% 8% 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            gap: 12,
            alignItems: "center",
            padding: "10px 18px",
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(213,209,173,0.32)",
            borderRadius: 999,
            backdropFilter: "blur(8px)",
            fontFamily: F.mono,
            fontSize: 18,
            letterSpacing: "0.3em",
            color: C.goldHi,
            textTransform: "uppercase",
            opacity: tween({ t, start: 0.1, end: 0.7, from: 0, to: 1 }),
          }}
        >
          <span style={{ color: C.gold }}>●</span>
          <span>MOD · {modeTr}</span>
        </div>
        <div style={{ height: 18 }} />
        <KineticHeadline
          start={0.2}
          stagger={0.06}
          lines={[
            {
              text: modeTr,
              font: "serif",
              size: 96,
              color: C.cream,
              weight: 300,
            },
          ]}
        />
        <div
          style={{
            fontFamily: F.script,
            fontStyle: "italic",
            fontSize: 32,
            color: C.goldHi,
            letterSpacing: "0.04em",
            marginTop: 6,
            opacity: tween({ t, start: 0.7, end: 1.4, from: 0, to: 1 }),
          }}
        >
          {subhead}
        </div>
      </AbsoluteFill>

      {/* Center — canvas card */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, calc(-50% + ${float + 60}px)) translateX(${slideIn + slideOut}px)`,
          width: cardW,
          height: cardH,
          borderRadius: 22,
          overflow: "hidden",
          boxShadow:
            "0 50px 110px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(213,209,173,0.18)",
        }}
      >
        <HtmlCanvasInvitation
          width={cardW}
          height={cardH}
          start={0}
          durationSec={dur}
          mode={mode}
        />
      </div>

      <Frame tone="dark" stage={`MOD · ${modeTr}`} role="TUVAL" />
    </AbsoluteFill>
  );
};

const ShowcaseEnd: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.bgDark }}>
      <MediaBackdrop
        src={HERO_VIDEOS.crystalBox}
        duration={3}
        zoom={{ from: 1.0, to: 1.08 }}
        pan={{ x: [0, 0], y: [0, 0] }}
        vignette={0.7}
        tint="#000"
        tintOpacity={0.7}
        fadeIn={0.4}
        fadeOut={0.5}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 24,
          padding: "0 8%",
          textAlign: "center",
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
