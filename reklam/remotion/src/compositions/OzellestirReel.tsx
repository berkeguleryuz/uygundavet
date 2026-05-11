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
import { HERO_VIDEOS, MUSIC, THEMES } from "../style/themes";
import { tween, useSeconds, EASE } from "../style/ease";
import { MediaBackdrop } from "../components/MediaBackdrop";
import { KineticHeadline } from "../components/KineticHeadline";
import { BrandLockup } from "../components/BrandLockup";
import { Frame } from "../components/Frame";

// 15s 9:16 — "Kendi Renginizde"
// Kişiselleştirme paneli + canlı önizleme.
//   0.0 – 3.0   AÇILIŞ
//   3.0 – 12.0  PANEL          renk, font, foto seçimi → preview anında değişir
//  12.0 – 14.0  ÇERÇEVE
//  14.0 – 15.0  KAPANIŞ
export const OzellestirReelComposition: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#0a0a0a", overflow: "hidden" }}>
      <Audio src={staticFile(MUSIC.warm)} volume={0.55} />

      <Sequence from={0} durationInFrames={Math.round(3 * fps)}>
        <Hook />
      </Sequence>
      <Sequence
        from={Math.round(3 * fps)}
        durationInFrames={Math.round(9 * fps)}
      >
        <Panel />
      </Sequence>
      <Sequence
        from={Math.round(12 * fps)}
        durationInFrames={Math.round(2 * fps)}
      >
        <FrameLine />
      </Sequence>
      <Sequence
        from={Math.round(14 * fps)}
        durationInFrames={Math.round(1 * fps)}
      >
        <End />
      </Sequence>
    </AbsoluteFill>
  );
};

const Hook: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.ivory }}>
      <PaperWash />
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
              text: "Kendi",
              font: "serif",
              size: 134,
              color: C.charcoal,
              weight: 300,
            },
            {
              text: "renginizde",
              font: "serif",
              size: 134,
              color: C.charcoal,
              weight: 300,
            },
            {
              text: "yazın.",
              font: "serifSoft",
              italic: true,
              size: 134,
              color: C.goldDeep,
              weight: 400,
            },
          ]}
        />
      </AbsoluteFill>
      <Frame tone="light" stage="REELS · 01" role="ÖZELLEŞTİR" showTimecode={false} />
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

// Active theme key over time, switches every 1.8s
const useActiveTheme = (start: number, dwell: number) => {
  const t = useSeconds();
  const local = t - start;
  const idx = local < 0 ? 0 : Math.floor(local / dwell) % THEMES.length;
  return THEMES[idx];
};

const Panel: React.FC = () => {
  const t = useSeconds();
  const theme = useActiveTheme(0.4, 1.8);

  return (
    <AbsoluteFill style={{ background: C.bgDark }}>
      <MediaBackdrop
        src={HERO_VIDEOS.crystalBox}
        duration={9}
        zoom={{ from: 1.0, to: 1.06 }}
        pan={{ x: [0, 0], y: [0, 0] }}
        vignette={0.75}
        tint="#000"
        tintOpacity={0.7}
        fadeIn={0.3}
        fadeOut={0.4}
      />

      {/* Top label */}
      <div
        style={{
          position: "absolute",
          top: "6%",
          left: "8%",
          right: "8%",
          fontFamily: F.mono,
          fontSize: 16,
          letterSpacing: "0.42em",
          color: C.goldHi,
          textTransform: "uppercase",
        }}
      >
        ✦ KİŞİSELLEŞTİRME PANELİ
      </div>

      {/* Phone-shaped preview that changes with theme */}
      <div
        style={{
          position: "absolute",
          top: "16%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 540,
          height: 760,
          borderRadius: 32,
          overflow: "hidden",
          border: `8px solid #2a2520`,
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          background: "#000",
        }}
      >
        <div
          key={theme.key}
          style={{
            position: "absolute",
            inset: 0,
          }}
        >
          {theme.isImage ? (
            <img
              src={staticFile(theme.src)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <OffthreadVideo
              src={staticFile(theme.src)}
              muted
              loop
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          )}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(180deg, transparent 50%, ${theme.accent}55 100%), linear-gradient(180deg, rgba(0,0,0,0.0), rgba(0,0,0,0.55))`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 28,
              right: 28,
              bottom: 38,
            }}
          >
            <div
              style={{
                fontFamily: F.mono,
                fontSize: 11,
                letterSpacing: "0.32em",
                color: "rgba(245,240,230,0.78)",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              TEMA · {theme.name.toUpperCase()}
            </div>
            <div
              style={{
                fontFamily: F.serif,
                fontWeight: 300,
                fontSize: 70,
                color: "#fff",
                letterSpacing: "-0.03em",
                lineHeight: 0.95,
              }}
            >
              Tuana
              <span
                style={{
                  fontFamily: F.serifSoft,
                  fontStyle: "italic",
                  fontSize: 42,
                  color: C.goldHi,
                  margin: "0 12px",
                }}
              >
                &amp;
              </span>
              Ateş
            </div>
          </div>
        </div>
      </div>

      {/* Theme dots / control panel below */}
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
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 13,
            letterSpacing: "0.32em",
            color: C.goldHi,
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          TEMA SEÇİMİ
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "space-between",
          }}
        >
          {THEMES.map((th) => {
            const isActive = th.key === theme.key;
            return (
              <div
                key={th.key}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: th.accent,
                    border: isActive
                      ? `3px solid ${C.gold}`
                      : "3px solid transparent",
                    transition: "border 0.2s",
                  }}
                />
                <div
                  style={{
                    fontFamily: F.mono,
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    color: isActive ? C.goldHi : "rgba(245,240,230,0.5)",
                    textTransform: "uppercase",
                  }}
                >
                  {th.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Frame tone="dark" stage="REELS · 02" role="ÖZELLEŞTİR" showTimecode={false} />
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
              text: "Davetiyeniz size,",
              font: "serif",
              size: 80,
              color: C.cream,
              weight: 300,
            },
            {
              text: "siz davetiyenize benzeyene dek.",
              font: "serifSoft",
              italic: true,
              size: 50,
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
          kendi web siteniz, kendi diliniz.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
