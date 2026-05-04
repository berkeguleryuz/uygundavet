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
import { MUSIC, THEMES, HERO_VIDEOS } from "../style/themes";
import { tween, useSeconds, EASE } from "../style/ease";
import { MediaBackdrop } from "../components/MediaBackdrop";
import { KineticHeadline } from "../components/KineticHeadline";
import { BrandLockup } from "../components/BrandLockup";
import { Frame } from "../components/Frame";

// 20s 9:16 — "Sekiz Dünya"
// Sekiz tema, her birine 2 saniye full-bleed güzellik anı + iki satır
// edebi alt yazı. Cinematik defile akışı.
//   0.0 – 2.0   AÇILIŞ        "Sekiz dünya, tek davetiyeniz."
//   2.0 – 18.0  GEÇİT         8 × 2.0s tema spotları
//  18.0 – 20.0  KAPANIŞ
export const TemaGalerisiReelComposition: React.FC = () => {
  const { fps } = useVideoConfig();

  // Custom-tailored Turkish lines per theme — keeping CLAUDE.md tone register.
  const themeCopy: Record<string, [string, string]> = {
    crystal: ["Şeffaf zarafet", "ışığın geçtiği yerden anı geçer"],
    grow: ["Yeşeren bir başlangıç", "filiz veren her hayalin kâğıdı"],
    sunset: ["Altın saat", "günün kapanışı, gecenin ilk dansı"],
    rose: ["Yumuşak romantizm", "bir gül kadar, bir kadeh kadar"],
    pearl: ["İncimsi minimalizm", "söze gerek bırakmayan zarafet"],
    ocean: ["Derin sükûnet", "bir denizin soluğu kadar sakin"],
    golden: ["Klasik ihtişam", "altın yaldızdaki sonsuzluk"],
    garden: ["Bahçe nostaljisi", "ferah bir öğleden sonra"],
  };

  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Audio src={staticFile(MUSIC.cinematic)} volume={0.65} />

      {/* Açılış */}
      <Sequence from={0} durationInFrames={Math.round(2 * fps)}>
        <Opening />
      </Sequence>

      {/* 8 spot, 2 saniyede bir */}
      {THEMES.map((theme, i) => {
        const start = 2 + i * 2;
        const [title, sub] = themeCopy[theme.key] ?? [theme.name, theme.tagline];
        return (
          <Sequence
            key={theme.key}
            from={Math.round(start * fps)}
            durationInFrames={Math.round(2 * fps)}
          >
            <ThemeBeat
              src={theme.src}
              isImage={theme.isImage}
              accent={theme.accent}
              title={title}
              sub={sub}
              index={i + 1}
              themeName={theme.name}
            />
          </Sequence>
        );
      })}

      <Sequence
        from={Math.round(18 * fps)}
        durationInFrames={Math.round(2 * fps)}
      >
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};

const Opening: React.FC = () => {
  const t = useSeconds();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <MediaBackdrop
        src={HERO_VIDEOS.kelebek}
        duration={2}
        zoom={{ from: 1.18, to: 1.04 }}
        pan={{ x: [0, 0], y: [0, 0] }}
        vignette={0.6}
        tint="#000"
        tintOpacity={0.6}
        fadeIn={0.0}
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
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 18,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: C.goldHi,
            opacity: tween({ t, start: 0.0, end: 0.8, from: 0, to: 1 }),
            marginBottom: 22,
          }}
        >
          ✦ TEMA · GEÇİDİ
        </div>
        <KineticHeadline
          start={0.2}
          stagger={0.06}
          align="left"
          lines={[
            {
              text: "Sekiz dünya,",
              font: "serif",
              size: 142,
              color: C.cream,
              weight: 300,
            },
            {
              text: "tek davetiyeniz.",
              font: "serifSoft",
              italic: true,
              size: 132,
              color: C.goldHi,
              weight: 400,
            },
          ]}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

type BeatProps = {
  src: string;
  isImage: boolean;
  accent: string;
  title: string;
  sub: string;
  index: number;
  themeName: string;
};

const ThemeBeat: React.FC<BeatProps> = ({
  src,
  isImage,
  accent,
  title,
  sub,
  index,
  themeName,
}) => {
  const t = useSeconds();
  const dur = 2;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <MediaBackdrop
        src={src}
        isImage={isImage}
        duration={dur}
        zoom={{ from: 1.06, to: 1.18 }}
        pan={{ x: [0.2, -0.2], y: [0, 0] }}
        vignette={0.55}
        tint={accent}
        tintOpacity={0.18}
        fadeIn={0.25}
        fadeOut={0.35}
      />

      {/* Number plaque, top-left */}
      <div
        style={{
          position: "absolute",
          top: "12%",
          left: "8%",
          fontFamily: F.mono,
          fontSize: 16,
          letterSpacing: "0.4em",
          color: "rgba(245,240,230,0.9)",
          textTransform: "uppercase",
          opacity: tween({ t, start: 0.0, end: 0.5, from: 0, to: 1 }),
          mixBlendMode: "difference",
        }}
      >
        {String(index).padStart(2, "0")} / 08
      </div>

      {/* Caption block, bottom */}
      <div
        style={{
          position: "absolute",
          left: "8%",
          right: "8%",
          bottom: "14%",
        }}
      >
        <div
          style={{
            opacity: tween({ t, start: 0.1, end: 0.5, from: 0, to: 1 }),
            fontFamily: F.mono,
            fontSize: 18,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(245,240,230,0.85)",
            marginBottom: 14,
          }}
        >
          {themeName}
        </div>
        <div
          style={{
            opacity: tween({ t, start: 0.25, end: 0.7, from: 0, to: 1 }),
            transform: `translateY(${tween({ t, start: 0.25, end: 0.7, from: 14, to: 0 })}px)`,
            fontFamily: F.serif,
            fontSize: 110,
            color: C.cream,
            fontWeight: 300,
            letterSpacing: "-0.02em",
            lineHeight: 1.0,
            textShadow: "0 2px 18px rgba(0,0,0,0.35)",
          }}
        >
          {title}
        </div>
        <div
          style={{
            opacity: tween({ t, start: 0.5, end: 0.9, from: 0, to: 1 }),
            fontFamily: F.serifSoft,
            fontStyle: "italic",
            fontSize: 36,
            color: "rgba(245,240,230,0.85)",
            marginTop: 8,
            letterSpacing: "0.02em",
          }}
        >
          {sub}
        </div>
      </div>

      {/* Subtle progress strip, bottom — 8 dashes, current one highlighted */}
      <div
        style={{
          position: "absolute",
          bottom: "8%",
          left: "8%",
          right: "8%",
          display: "flex",
          gap: 6,
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 2,
              background:
                i + 1 < index
                  ? "rgba(245,240,230,0.85)"
                  : i + 1 === index
                    ? `linear-gradient(90deg, ${C.gold}, ${C.goldHi})`
                    : "rgba(245,240,230,0.18)",
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.bgDark }}>
      <MediaBackdrop
        src={HERO_VIDEOS.crystalBox}
        duration={2}
        zoom={{ from: 1.0, to: 1.06 }}
        pan={{ x: [0, 0], y: [0, 0] }}
        vignette={0.7}
        tint="#000"
        tintOpacity={0.7}
        fadeIn={0.3}
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
          gap: 20,
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
