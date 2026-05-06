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
import { BrandLockup } from "../components/BrandLockup";
import { Frame } from "../components/Frame";

// 13s 9:16 — "Geleceğe Bir Galeri"
// Foto galerisi sayfa sayfa açılır.
//   0.0 – 3.0   AÇILIŞ
//   3.0 – 10.0  GALERİ          12 kareden oluşan grid, sırayla doldurulur
//  10.0 – 12.0  ÇERÇEVE
//  12.0 – 13.0  KAPANIŞ
export const GaleriReelComposition: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#0a0a0a", overflow: "hidden" }}>
      <Audio src={staticFile(MUSIC.warm)} volume={0.6} />

      <Sequence from={0} durationInFrames={Math.round(3 * fps)}>
        <Hook />
      </Sequence>
      <Sequence
        from={Math.round(3 * fps)}
        durationInFrames={Math.round(7 * fps)}
      >
        <Gallery />
      </Sequence>
      <Sequence
        from={Math.round(10 * fps)}
        durationInFrames={Math.round(2 * fps)}
      >
        <FrameLine />
      </Sequence>
      <Sequence
        from={Math.round(12 * fps)}
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
        src={HERO_VIDEOS.kadinerkek}
        duration={3}
        zoom={{ from: 1.06, to: 1.16 }}
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
          justifyContent: "flex-end",
        }}
      >
        <KineticHeadline
          start={0.2}
          stagger={0.07}
          align="left"
          lines={[
            {
              text: "Geleceğe",
              font: "serif",
              size: 142,
              color: C.cream,
              weight: 300,
            },
            {
              text: "bir galeri.",
              font: "serifSoft",
              italic: true,
              size: 142,
              color: C.goldHi,
              weight: 400,
            },
          ]}
        />
      </AbsoluteFill>
      <Frame tone="dark" stage="REELS · 01" role="GALERİ" showTimecode={false} />
    </AbsoluteFill>
  );
};

// Reuse the wedding photo and the available videos to fill 12 cells.
const TILES: { src: string; isImage: boolean }[] = [
  { src: STILL_IMAGES.weddingPhoto, isImage: true },
  { src: HERO_VIDEOS.kadinerkek, isImage: false },
  { src: HERO_VIDEOS.tuana, isImage: false },
  { src: HERO_VIDEOS.yuzuk, isImage: false },
  { src: STILL_IMAGES.weddingPhoto, isImage: true },
  { src: HERO_VIDEOS.kelebek, isImage: false },
  { src: HERO_VIDEOS.crystalRing, isImage: false },
  { src: HERO_VIDEOS.kutu, isImage: false },
  { src: STILL_IMAGES.weddingPhoto, isImage: true },
  { src: HERO_VIDEOS.tuana, isImage: false },
  { src: HERO_VIDEOS.kadinerkek, isImage: false },
  { src: HERO_VIDEOS.yuzuk, isImage: false },
];

const ORDER = [4, 0, 7, 2, 9, 5, 1, 11, 6, 3, 10, 8];

const Gallery: React.FC = () => {
  const t = useSeconds();
  return (
    <AbsoluteFill style={{ background: C.bgDark }}>
      <MediaBackdrop
        src={HERO_VIDEOS.crystalBox}
        duration={7}
        zoom={{ from: 1.0, to: 1.06 }}
        pan={{ x: [0, 0], y: [0, 0] }}
        vignette={0.75}
        tint="#000"
        tintOpacity={0.7}
        fadeIn={0.3}
        fadeOut={0.4}
      />
      {/* Top header */}
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
            color: C.goldHi,
            textTransform: "uppercase",
          }}
        >
          ✦ ANI GALERİSİ
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
          12 / 248
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: "6%",
          right: "6%",
          top: "13%",
          bottom: "8%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridAutoRows: "1fr",
          gap: 10,
        }}
      >
        {TILES.map((tile, i) => {
          const revealOrder = ORDER[i] ?? i;
          const start = 0.2 + revealOrder * 0.13;
          const op = tween({
            t,
            start,
            end: start + 0.45,
            from: 0,
            to: 1,
            ease: EASE.outQuart,
          });
          const sc = tween({
            t,
            start,
            end: start + 0.6,
            from: 0.92,
            to: 1,
            ease: EASE.outBack,
          });
          return (
            <div
              key={i}
              style={{
                opacity: op,
                transform: `scale(${sc})`,
                background: "#000",
                borderRadius: 8,
                overflow: "hidden",
                border: `1px solid rgba(213,209,173,0.18)`,
              }}
            >
              {tile.isImage ? (
                <img
                  src={staticFile(tile.src)}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              ) : (
                <OffthreadVideo
                  src={staticFile(tile.src)}
                  muted
                  loop
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              )}
            </div>
          );
        })}
      </div>

      <Frame tone="dark" stage="REELS · 02" role="ANILAR" showTimecode={false} />
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
              text: "Anılarınız",
              font: "serif",
              size: 102,
              color: C.cream,
              weight: 300,
            },
            {
              text: "siteden silinmesin.",
              font: "serifSoft",
              italic: true,
              size: 76,
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
          bir galeri kadar kalıcı.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
