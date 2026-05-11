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
import { Typewriter } from "../components/Typewriter";
import { BrandLockup } from "../components/BrandLockup";
import { Frame } from "../components/Frame";

// 14s 9:16 — "Tema Seçin, Adresiniz Hazır"
// Tarayıcı çubuğunda davetiye URL'si harf-harf yazılır.
//   0.0 – 3.5   AÇILIŞ        "Tema seçin, adres hazır."
//   3.5 – 9.5   URL           tarayıcı çubuğu + uygundavet.com/sunset
//   9.5 – 12.0  ÖZET          "Davetiyeniz, tema adresinde yaşar."
//  12.0 – 14.0  KAPANIŞ
export const KendiAlanAdiniReelComposition: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#0a0a0a", overflow: "hidden" }}>
      <Audio src={staticFile(MUSIC.cinematic)} volume={0.5} />

      <Sequence from={0} durationInFrames={Math.round(3.5 * fps)}>
        <Hook />
      </Sequence>
      <Sequence
        from={Math.round(3.5 * fps)}
        durationInFrames={Math.round(6 * fps)}
      >
        <UrlScene />
      </Sequence>
      <Sequence
        from={Math.round(9.5 * fps)}
        durationInFrames={Math.round(2.5 * fps)}
      >
        <FrameLine />
      </Sequence>
      <Sequence
        from={Math.round(12 * fps)}
        durationInFrames={Math.round(2 * fps)}
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
        src={HERO_VIDEOS.crystalBox}
        duration={3.5}
        zoom={{ from: 1.04, to: 1.14 }}
        pan={{ x: [0.2, -0.2], y: [-0.1, 0.1] }}
        vignette={0.65}
        tint="#000"
        tintOpacity={0.55}
        fadeOut={0.4}
      />
      <AbsoluteFill
        style={{
          padding: "14% 8%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <KineticHeadline
          start={0.2}
          stagger={0.07}
          align="left"
          lines={[
            {
              text: "Tema seçin,",
              font: "serif",
              size: 144,
              color: C.cream,
              weight: 300,
            },
            {
              text: "adres hazır.",
              font: "serifSoft",
              italic: true,
              size: 144,
              color: C.goldHi,
              weight: 400,
            },
          ]}
        />
      </AbsoluteFill>
      <Frame tone="dark" stage="REELS · 01" role="ALAN" showTimecode={false} />
    </AbsoluteFill>
  );
};

const UrlScene: React.FC = () => {
  const t = useSeconds();
  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      <MediaBackdrop
        src={HERO_VIDEOS.kelebek}
        duration={6}
        zoom={{ from: 1.04, to: 1.12 }}
        pan={{ x: [0, 0], y: [0, 0] }}
        vignette={0.7}
        tint="#000"
        tintOpacity={0.7}
        fadeIn={0.3}
        fadeOut={0.4}
      />
      <AbsoluteFill
        style={{
          padding: "0 6%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 36,
        }}
      >
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 16,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: C.goldHi,
            opacity: tween({ t, start: 0.0, end: 0.5, from: 0, to: 1 }),
          }}
        >
          ✦ KENDİ ADRESİNİZ
        </div>
        {/* Browser bar */}
        <div
          style={{
            width: "100%",
            background: "rgba(245,240,230,0.06)",
            border: "1px solid rgba(245,240,230,0.18)",
            borderRadius: 18,
            padding: "22px 28px",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          {/* dots */}
          <div style={{ display: "flex", gap: 8 }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <div
                key={c}
                style={{
                  width: 13,
                  height: 13,
                  borderRadius: "50%",
                  background: c,
                  opacity: 0.85,
                }}
              />
            ))}
          </div>
          {/* lock */}
          <div
            style={{
              fontFamily: F.mono,
              fontSize: 18,
              color: C.gold,
              letterSpacing: "0.06em",
            }}
          >
            🔒
          </div>
          {/* url with typewriter */}
          <div
            style={{
              fontFamily: F.mono,
              fontSize: 30,
              color: C.cream,
              letterSpacing: "0.04em",
              flex: 1,
            }}
          >
            <span style={{ color: "rgba(245,240,230,0.55)" }}>https://</span>
            <Typewriter
              text="uygundavet.com/"
              start={0.4}
              speed={0.07}
              caret={false}
              style={{
                color: C.cream,
              }}
            />
            <Typewriter
              text="sunset"
              start={1.6}
              speed={0.12}
              caret
              caretChar="│"
              style={{
                color: C.goldHi,
                fontWeight: 500,
              }}
            />
          </div>
        </div>

        {/* Below: italic line that resolves once URL is finished */}
        <div
          style={{
            opacity: tween({ t, start: 3.4, end: 4.2, from: 0, to: 1 }),
            fontFamily: F.serifSoft,
            fontStyle: "italic",
            fontSize: 38,
            color: "rgba(245,240,230,0.85)",
            textAlign: "center",
            lineHeight: 1.3,
          }}
        >
          Davetiyeniz, tema adresinde yaşar.
        </div>
      </AbsoluteFill>
      <Frame tone="dark" stage="REELS · 02" role="ADRES" showTimecode={false} />
    </AbsoluteFill>
  );
};

const FrameLine: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      <MediaBackdrop
        src={HERO_VIDEOS.crystalRing}
        duration={2.5}
        zoom={{ from: 1.04, to: 1.08 }}
        pan={{ x: [0, 0], y: [0, 0] }}
        vignette={0.7}
        tint="#000"
        tintOpacity={0.7}
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
              text: "Tema sizin,",
              font: "serif",
              size: 88,
              color: C.cream,
              weight: 300,
            },
            {
              text: "adres hazır.",
              font: "serifSoft",
              italic: true,
              size: 88,
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
