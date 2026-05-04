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
import { HERO_VIDEOS, MUSIC, THEMES } from "../style/themes";
import { tween, useSeconds, EASE } from "../style/ease";
import { MediaBackdrop } from "../components/MediaBackdrop";
import { KineticHeadline } from "../components/KineticHeadline";
import { HtmlCanvasInvitation } from "../components/HtmlCanvasInvitation";
import { BrandLockup } from "../components/BrandLockup";

// 12s 9:16 — fast story spot. The HtmlCanvasInvitation rises from smoke,
// then the spot snaps to the brand lockup. Built for IG/TikTok stories.
export const StoryBurstComposition: React.FC = () => {
  const { fps, width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Audio src={staticFile(MUSIC.cinematic)} volume={0.6} />

      <Sequence from={0} durationInFrames={Math.round(2.5 * fps)}>
        <Hook />
      </Sequence>

      <Sequence
        from={Math.round(2.5 * fps)}
        durationInFrames={Math.round(6 * fps)}
      >
        <CanvasReveal width={width} height={height} />
      </Sequence>

      <Sequence
        from={Math.round(8.5 * fps)}
        durationInFrames={Math.round(3.5 * fps)}
      >
        <End />
      </Sequence>
    </AbsoluteFill>
  );
};

const Hook: React.FC = () => {
  const t = useSeconds();
  return (
    <AbsoluteFill>
      <MediaBackdrop
        src={HERO_VIDEOS.kelebek}
        duration={2.5}
        zoom={{ from: 1.16, to: 1.04 }}
        pan={{ x: [0, 0], y: [0, 0] }}
        vignette={0.65}
        tint="#000"
        tintOpacity={0.55}
        fadeOut={0.35}
      />
      <AbsoluteFill
        style={{
          padding: "12% 8%",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <KineticHeadline
          start={0.2}
          stagger={0.07}
          lines={[
            {
              text: "Bir davetiye,",
              font: "serif",
              size: 130,
              color: C.cream,
              weight: 300,
            },
            {
              text: "bir akşamdan",
              font: "serif",
              size: 130,
              color: C.cream,
              weight: 300,
            },
            {
              text: "daha uzun yaşar.",
              font: "serifSoft",
              italic: true,
              size: 92,
              color: C.goldHi,
              weight: 400,
            },
          ]}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const CanvasReveal: React.FC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  const t = useSeconds();
  const cardW = Math.round(width * 0.82);
  const cardH = Math.round(height * 0.6);

  const float = Math.sin(t * 1.2) * 8;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <MediaBackdrop
        src={HERO_VIDEOS.crystalRing}
        duration={6}
        zoom={{ from: 1.04, to: 1.16 }}
        pan={{ x: [0.2, -0.2], y: [-0.2, 0.2] }}
        vignette={0.65}
        tint="#000"
        tintOpacity={0.55}
        fadeIn={0.4}
        fadeOut={0.5}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: cardW,
            height: cardH,
            transform: `translateY(${float}px)`,
            borderRadius: 22,
            overflow: "hidden",
            boxShadow:
              "0 50px 120px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(213,209,173,0.18)",
          }}
        >
          <HtmlCanvasInvitation
            width={cardW}
            height={cardH}
            durationSec={6}
            mode="smokeReveal"
          />
        </div>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          padding: "10% 8%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            gap: 10,
            alignItems: "center",
            padding: "10px 18px",
            background: "rgba(0,0,0,0.42)",
            border: "1px solid rgba(213,209,173,0.32)",
            borderRadius: 999,
            backdropFilter: "blur(10px)",
            fontFamily: F.mono,
            fontSize: 18,
            letterSpacing: "0.32em",
            color: C.goldHi,
            textTransform: "uppercase",
            opacity: tween({ t, start: 0.2, end: 0.8, from: 0, to: 1 }),
          }}
        >
          ✦ HTML × TUVAL
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const End: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.bgDark }}>
      <MediaBackdrop
        src={HERO_VIDEOS.crystalBox}
        duration={3.5}
        zoom={{ from: 1.0, to: 1.08 }}
        pan={{ x: [0, 0], y: [0, 0] }}
        vignette={0.7}
        tint="#000"
        tintOpacity={0.65}
        fadeIn={0.3}
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
