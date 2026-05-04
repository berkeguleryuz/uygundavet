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

// 12s 9:16 — "Misafiriniz Hangi Dilde?"
// Aynı davet cümlesi üç dilde sırayla yazılır; sonunda dil seçici peeer
//   0.0 – 3.0   TR
//   3.0 – 6.0   EN
//   6.0 – 8.5   DE
//   8.5 – 10.0  ÖZET     "Üç dil, tek davet."
//  10.0 – 12.0  KAPANIŞ
export const CokDilliReelComposition: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.bgDark, overflow: "hidden" }}>
      <Audio src={staticFile(MUSIC.warm)} volume={0.55} />

      <Sequence from={0} durationInFrames={Math.round(3 * fps)}>
        <Lang
          tag="TR · TÜRKÇE"
          line1="Düğünümüze davetlisiniz."
          line2="26 Eylül 2026 · Çırağan, İstanbul"
          script="Sevgilerimizle"
          flag="🇹🇷"
        />
      </Sequence>
      <Sequence
        from={Math.round(3 * fps)}
        durationInFrames={Math.round(3 * fps)}
      >
        <Lang
          tag="EN · ENGLISH"
          line1="You are invited to our wedding."
          line2="26 September 2026 · Çırağan, Istanbul"
          script="With love"
          flag="🇬🇧"
        />
      </Sequence>
      <Sequence
        from={Math.round(6 * fps)}
        durationInFrames={Math.round(2.5 * fps)}
      >
        <Lang
          tag="DE · DEUTSCH"
          line1="Wir laden Sie zu unserer Hochzeit ein."
          line2="26. September 2026 · Çırağan, Istanbul"
          script="Mit Liebe"
          flag="🇩🇪"
        />
      </Sequence>
      <Sequence
        from={Math.round(8.5 * fps)}
        durationInFrames={Math.round(1.5 * fps)}
      >
        <Frame3 />
      </Sequence>
      <Sequence
        from={Math.round(10 * fps)}
        durationInFrames={Math.round(2 * fps)}
      >
        <End />
      </Sequence>
    </AbsoluteFill>
  );
};

type LangProps = {
  tag: string;
  line1: string;
  line2: string;
  script: string;
  flag: string;
};

const Lang: React.FC<LangProps> = ({ tag, line1, line2, script, flag }) => {
  const t = useSeconds();
  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      <MediaBackdrop
        src={HERO_VIDEOS.kelebek}
        duration={3}
        zoom={{ from: 1.04, to: 1.12 }}
        pan={{ x: [0.1, -0.1], y: [-0.1, 0.1] }}
        vignette={0.65}
        tint="#000"
        tintOpacity={0.55}
        fadeIn={0.2}
        fadeOut={0.3}
      />
      <AbsoluteFill
        style={{
          padding: "12% 8%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            gap: 12,
            alignItems: "center",
            padding: "10px 18px",
            background: "rgba(0,0,0,0.45)",
            border: "1px solid rgba(213,209,173,0.32)",
            borderRadius: 999,
            backdropFilter: "blur(8px)",
            fontFamily: F.mono,
            fontSize: 16,
            letterSpacing: "0.32em",
            color: C.goldHi,
            textTransform: "uppercase",
            opacity: tween({ t, start: 0.0, end: 0.4, from: 0, to: 1 }),
            alignSelf: "flex-start",
            marginBottom: 28,
          }}
        >
          <span style={{ fontSize: 22 }}>{flag}</span>
          <span>{tag}</span>
        </div>
        <KineticHeadline
          start={0.1}
          stagger={0.05}
          align="left"
          lines={[
            {
              text: line1,
              font: "serif",
              size: 76,
              color: C.cream,
              weight: 300,
            },
          ]}
        />
        <div
          style={{
            opacity: tween({ t, start: 0.7, end: 1.4, from: 0, to: 1 }),
            fontFamily: F.body,
            fontSize: 24,
            color: "rgba(245,240,230,0.78)",
            marginTop: 20,
            letterSpacing: "0.04em",
          }}
        >
          {line2}
        </div>
        <div
          style={{
            opacity: tween({ t, start: 1.2, end: 1.8, from: 0, to: 1 }),
            fontFamily: F.serifSoft,
            fontStyle: "italic",
            fontSize: 30,
            color: C.gold,
            marginTop: 18,
          }}
        >
          {script}
        </div>
      </AbsoluteFill>
      <Frame tone="dark" stage="REELS · ÇOK DİL" role={tag.split(" · ")[0]} showTimecode={false} />
    </AbsoluteFill>
  );
};

const Frame3: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      <MediaBackdrop
        src={HERO_VIDEOS.kelebek}
        duration={1.5}
        zoom={{ from: 1.04, to: 1.08 }}
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
          padding: "0 8%",
          textAlign: "center",
        }}
      >
        <KineticHeadline
          start={0.0}
          stagger={0.06}
          align="center"
          lines={[
            {
              text: "Üç dil,",
              font: "serif",
              size: 130,
              color: C.cream,
              weight: 300,
            },
            {
              text: "tek davet.",
              font: "serifSoft",
              italic: true,
              size: 130,
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
