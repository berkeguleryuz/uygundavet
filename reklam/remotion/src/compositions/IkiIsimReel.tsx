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
import { Typewriter } from "../components/Typewriter";
import { BrandLockup } from "../components/BrandLockup";
import { Frame } from "../components/Frame";
import { MediaBackdrop } from "../components/MediaBackdrop";

// 12s 9:16 — "İki İsim"
// Cartier minimalizmi. Yalnızca tipografi: bir ad, bir ad, bir tarih, bir mekân.
//   0.0 – 3.0   TUANA
//   3.0 – 6.0   ATEŞ
//   6.0 – 9.5   TARİH + MEKÂN
//   9.5 – 12.0  KAPANIŞ
export const IkiIsimReelComposition: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#0a0a0a", overflow: "hidden" }}>
      <Audio src={staticFile(MUSIC.cinematic)} volume={0.45} />

      {/* Persistent paper-grain wash, very subtle */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, #1a1612 0%, #0a0807 70%)",
          opacity: 1,
        }}
      />

      <Sequence from={0} durationInFrames={Math.round(3 * fps)}>
        <NameScene name="Tuana" stageNo="01" hint="bir aşkın yarısı" />
      </Sequence>
      <Sequence
        from={Math.round(3 * fps)}
        durationInFrames={Math.round(3 * fps)}
      >
        <NameScene name="Ateş" stageNo="02" hint="diğer yarısı" />
      </Sequence>
      <Sequence
        from={Math.round(6 * fps)}
        durationInFrames={Math.round(3.5 * fps)}
      >
        <DateVenue />
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

type NameProps = { name: string; stageNo: string; hint: string };

const NameScene: React.FC<NameProps> = ({ name, stageNo, hint }) => {
  const t = useSeconds();
  const op = tween({ t, start: 0.0, end: 0.4, from: 0, to: 1, ease: EASE.outQuart });
  const lineW = tween({
    t,
    start: 1.6,
    end: 2.6,
    from: 0,
    to: 100,
    ease: EASE.outQuart,
  });
  const hintOp = tween({
    t,
    start: 1.7,
    end: 2.4,
    from: 0,
    to: 1,
    ease: EASE.outQuart,
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "0 6%",
        opacity: op,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: F.mono,
          fontSize: 16,
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: "rgba(213,209,173,0.55)",
          marginBottom: 28,
        }}
      >
        İSİM · {stageNo}
      </div>
      <Typewriter
        text={name}
        start={0.2}
        speed={0.16}
        caret
        caretChar="│"
        style={{
          fontFamily: F.serif,
          fontWeight: 300,
          fontSize: 280,
          color: C.goldHi,
          letterSpacing: "-0.04em",
          lineHeight: 0.95,
          display: "inline-block",
        }}
      />
      <div
        style={{
          height: 1,
          width: `${lineW}%`,
          maxWidth: 540,
          background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
          marginTop: 26,
        }}
      />
      <div
        style={{
          opacity: hintOp,
          fontFamily: F.script,
          fontStyle: "italic",
          fontSize: 32,
          color: "rgba(245,240,230,0.72)",
          marginTop: 16,
          letterSpacing: "0.02em",
        }}
      >
        {hint}
      </div>
      <Frame tone="dark" stage={`İSİM · ${stageNo}`} role="MAHREM" showTimecode={false} />
    </AbsoluteFill>
  );
};

const DateVenue: React.FC = () => {
  const t = useSeconds();
  const lineW = tween({
    t,
    start: 1.4,
    end: 2.4,
    from: 0,
    to: 100,
    ease: EASE.outQuart,
  });

  return (
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
          fontSize: 16,
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: "rgba(213,209,173,0.55)",
          marginBottom: 32,
          opacity: tween({ t, start: 0.0, end: 0.5, from: 0, to: 1 }),
        }}
      >
        TARİH VE MEKÂN
      </div>
      <Typewriter
        text="26 · Eylül · 2026"
        start={0.2}
        speed={0.07}
        caret={false}
        style={{
          fontFamily: F.serif,
          fontWeight: 300,
          fontSize: 110,
          color: C.cream,
          letterSpacing: "-0.01em",
          lineHeight: 1.0,
          display: "inline-block",
        }}
      />
      <div
        style={{
          height: 1,
          width: `${lineW}%`,
          maxWidth: 540,
          background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
          margin: "30px 0 24px",
        }}
      />
      <Typewriter
        text="Çırağan · İstanbul"
        start={1.4}
        speed={0.08}
        caret={false}
        style={{
          fontFamily: F.serifSoft,
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: 64,
          color: C.goldHi,
          letterSpacing: "0.02em",
          lineHeight: 1.0,
          display: "inline-block",
        }}
      />
      <Frame tone="dark" stage="REELS · 03" role="VAKIT" showTimecode={false} />
    </AbsoluteFill>
  );
};

const End: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      <MediaBackdrop
        src={HERO_VIDEOS.crystalBox}
        duration={2.5}
        zoom={{ from: 1.0, to: 1.05 }}
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
          padding: "0 8%",
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
