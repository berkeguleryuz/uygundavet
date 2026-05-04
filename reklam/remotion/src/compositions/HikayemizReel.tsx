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
import { BrandLockup } from "../components/BrandLockup";
import { Frame } from "../components/Frame";

// 18s 9:16 — "Hikâyemiz Buradan Başladı"
// Üç polaroid kartla bir çiftin kronolojisi açılır, ardından video arka plana
// geçilir, "bir hikâye davetiye olur" söylemi yapılır.
//   0.0 – 6.0   POLAROID YIĞINI    "İlk bakış · 2021" / "Söz · 2024" / "Hayat · 2026"
//   6.0 – 12.0  HİKÂYE              kadinerkek video + ana başlık
//  12.0 – 15.0  ÇERÇEVE             "Bir hikâye, bir davetiye olur."
//  15.0 – 18.0  KAPANIŞ
export const HikayemizReelComposition: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.ivory, overflow: "hidden" }}>
      <Audio src={staticFile(MUSIC.warm)} volume={0.65} />

      <Sequence from={0} durationInFrames={Math.round(6 * fps)}>
        <PolaroidStack />
      </Sequence>
      <Sequence
        from={Math.round(6 * fps)}
        durationInFrames={Math.round(6 * fps)}
      >
        <StoryScene />
      </Sequence>
      <Sequence
        from={Math.round(12 * fps)}
        durationInFrames={Math.round(3 * fps)}
      >
        <FrameScene />
      </Sequence>
      <Sequence
        from={Math.round(15 * fps)}
        durationInFrames={Math.round(3 * fps)}
      >
        <End />
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

type Card = {
  src: string;
  isImage: boolean;
  caption: string;
  date: string;
  rotate: number;
  x: string;
  y: string;
};

const POLAROIDS: Card[] = [
  {
    src: STILL_IMAGES.weddingPhoto,
    isImage: true,
    caption: "İlk bakış",
    date: "2021",
    rotate: -7,
    x: "8%",
    y: "12%",
  },
  {
    src: HERO_VIDEOS.kadinerkek,
    isImage: false,
    caption: "Söz",
    date: "2024",
    rotate: 5,
    x: "30%",
    y: "30%",
  },
  {
    src: HERO_VIDEOS.tuana,
    isImage: false,
    caption: "Hayat",
    date: "2026",
    rotate: -3,
    x: "16%",
    y: "52%",
  },
];

const PolaroidStack: React.FC = () => {
  const t = useSeconds();
  return (
    <AbsoluteFill style={{ background: C.ivory }}>
      <PaperWash />
      <AbsoluteFill style={{ padding: "10% 6% 0" }}>
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 16,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: C.gold,
            marginBottom: 12,
            opacity: tween({ t, start: 0.0, end: 0.5, from: 0, to: 1 }),
          }}
        >
          ✦ HİKÂYEMİZ
        </div>
        <KineticHeadline
          start={0.1}
          stagger={0.06}
          align="left"
          lines={[
            {
              text: "Hikâyemiz",
              font: "serif",
              size: 116,
              color: C.charcoal,
              weight: 300,
            },
            {
              text: "buradan başladı.",
              font: "serifSoft",
              italic: true,
              size: 88,
              color: C.goldDeep,
              weight: 400,
            },
          ]}
        />
      </AbsoluteFill>

      {POLAROIDS.map((p, i) => {
        const start = 1.0 + i * 0.6;
        const op = tween({
          t,
          start,
          end: start + 0.4,
          from: 0,
          to: 1,
          ease: EASE.outQuart,
        });
        const ty = tween({
          t,
          start,
          end: start + 0.6,
          from: 36,
          to: 0,
          ease: EASE.outBack,
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: p.y,
              left: p.x,
              width: 480,
              opacity: op,
              transform: `translateY(${ty}px) rotate(${p.rotate}deg)`,
              background: "#fff",
              padding: "18px 18px 70px",
              boxShadow:
                "0 30px 60px rgba(20,16,12,0.22), 0 6px 14px rgba(20,16,12,0.12)",
              border: `1px solid ${C.line}`,
              zIndex: i + 1,
            }}
          >
            <div
              style={{
                width: "100%",
                aspectRatio: "1 / 1",
                overflow: "hidden",
                background: "#000",
              }}
            >
              {p.isImage ? (
                <img
                  src={staticFile(p.src)}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <video
                  src={staticFile(p.src)}
                  muted
                  autoPlay
                  loop
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              )}
            </div>
            <div
              style={{
                position: "absolute",
                left: 22,
                right: 22,
                bottom: 18,
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontFamily: F.serifSoft,
                  fontStyle: "italic",
                  fontSize: 36,
                  color: C.charcoal,
                  letterSpacing: "0.02em",
                }}
              >
                {p.caption}
              </span>
              <span
                style={{
                  fontFamily: F.mono,
                  fontSize: 16,
                  color: C.mute,
                  letterSpacing: "0.18em",
                }}
              >
                {p.date}
              </span>
            </div>
          </div>
        );
      })}

      <Frame tone="light" stage="REELS · 01" role="HİKÂYE" showTimecode={false} />
    </AbsoluteFill>
  );
};

const StoryScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <MediaBackdrop
        src={HERO_VIDEOS.kadinerkek}
        duration={6}
        zoom={{ from: 1.04, to: 1.16 }}
        pan={{ x: [-0.6, 0.6], y: [0, -0.2] }}
        vignette={0.45}
        tint="#1a1612"
        tintOpacity={0.22}
        fadeIn={0.5}
        fadeOut={0.5}
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
          start={0.3}
          stagger={0.07}
          align="left"
          lines={[
            {
              text: "Bir hikâye,",
              font: "serif",
              size: 124,
              color: C.cream,
              weight: 300,
            },
            {
              text: "bir davetiye",
              font: "serif",
              size: 124,
              color: C.cream,
              weight: 300,
            },
            {
              text: "olur.",
              font: "serifSoft",
              italic: true,
              size: 124,
              color: C.goldHi,
              weight: 400,
            },
          ]}
        />
      </AbsoluteFill>
      <Frame tone="dark" stage="REELS · 02" role="ANLATIM" />
    </AbsoluteFill>
  );
};

const FrameScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.ivory }}>
      <PaperWash />
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          padding: "0 8%",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: F.serifSoft,
            fontStyle: "italic",
            fontSize: 64,
            color: C.charcoal,
            lineHeight: 1.2,
            letterSpacing: "0.01em",
          }}
        >
          Sizin hikâyeniz, sizin diliniz;
          <br />
          <span style={{ color: C.goldDeep }}>davetiyeniz de öyle olsun.</span>
        </div>
      </AbsoluteFill>
      <Frame tone="light" stage="REELS · 03" role="ÇERÇEVE" />
    </AbsoluteFill>
  );
};

const End: React.FC = () => {
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
