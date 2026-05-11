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

// 10s 9:16 — "Kutudan Çıkan Davet"
// Mücevher kutusu açılır, davetiye çıkar.
//   0.0 – 4.0   KUTU      kutu video, "Bir kutu, bir an, bir ömür."
//   4.0 – 8.0   YÜZÜK     yüzük close-up, alt başlık
//   8.0 – 10.0  KAPANIŞ
export const KutuReelComposition: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#0a0a0a", overflow: "hidden" }}>
      <Audio src={staticFile(MUSIC.cinematic)} volume={0.6} />

      <Sequence from={0} durationInFrames={Math.round(4 * fps)}>
        <Box />
      </Sequence>
      <Sequence
        from={Math.round(4 * fps)}
        durationInFrames={Math.round(4 * fps)}
      >
        <Ring />
      </Sequence>
      <Sequence
        from={Math.round(8 * fps)}
        durationInFrames={Math.round(2 * fps)}
      >
        <End />
      </Sequence>
    </AbsoluteFill>
  );
};

const Box: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <MediaBackdrop
        src={HERO_VIDEOS.kutu}
        duration={4}
        zoom={{ from: 1.06, to: 1.18 }}
        pan={{ x: [0.1, -0.1], y: [-0.1, 0.1] }}
        vignette={0.55}
        tint="#000"
        tintOpacity={0.32}
        fadeIn={0.3}
        fadeOut={0.4}
      />
      <AbsoluteFill
        style={{
          padding: "12% 8% 16%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <KineticHeadline
          start={0.4}
          stagger={0.18}
          align="left"
          lines={[
            {
              text: "Bir kutu,",
              font: "serif",
              size: 130,
              color: C.cream,
              weight: 300,
            },
            {
              text: "bir an,",
              font: "serif",
              size: 130,
              color: C.cream,
              weight: 300,
            },
            {
              text: "bir ömür.",
              font: "serifSoft",
              italic: true,
              size: 130,
              color: C.goldHi,
              weight: 400,
            },
          ]}
        />
      </AbsoluteFill>
      <Frame tone="dark" stage="REELS · 01" role="KUTU" showTimecode={false} />
    </AbsoluteFill>
  );
};

const Ring: React.FC = () => {
  const t = useSeconds();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <MediaBackdrop
        src={HERO_VIDEOS.yuzuk}
        duration={4}
        zoom={{ from: 1.06, to: 1.2 }}
        pan={{ x: [-0.2, 0.2], y: [0.1, -0.1] }}
        vignette={0.6}
        tint="#000"
        tintOpacity={0.32}
        fadeIn={0.3}
        fadeOut={0.3}
      />
      <AbsoluteFill
        style={{
          padding: "12% 8%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <div
          style={{
            opacity: tween({ t, start: 0.2, end: 1.0, from: 0, to: 1 }),
            fontFamily: F.serifSoft,
            fontStyle: "italic",
            fontSize: 60,
            color: C.cream,
            lineHeight: 1.2,
            letterSpacing: "0.01em",
            maxWidth: "92%",
          }}
        >
          Davetiyeniz de mücevher gibi
          <br />
          <span style={{ color: C.goldHi }}>özenle saklansın.</span>
        </div>
      </AbsoluteFill>
      <Frame tone="dark" stage="REELS · 02" role="YÜZÜK" showTimecode={false} />
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
