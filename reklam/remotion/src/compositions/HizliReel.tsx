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

// 13s 9:16 — "Dakikalar İçinde"
// 4 adımlık onboarding montajı + ilerleme çubuğu 0%→100%.
//   0.0 – 2.5   AÇILIŞ
//   2.5 – 10.5  4 ADIM         ad+tarih → tema → fotoğraf → yayında
//  10.5 – 12.5  ÇERÇEVE
//  12.5 – 13.0  KAPANIŞ
export const HizliReelComposition: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.bgLight, overflow: "hidden" }}>
      <Audio src={staticFile(MUSIC.warm)} volume={0.6} />

      <Sequence from={0} durationInFrames={Math.round(2.5 * fps)}>
        <Hook />
      </Sequence>
      <Sequence
        from={Math.round(2.5 * fps)}
        durationInFrames={Math.round(8 * fps)}
      >
        <Steps />
      </Sequence>
      <Sequence
        from={Math.round(10.5 * fps)}
        durationInFrames={Math.round(2 * fps)}
      >
        <FrameLine />
      </Sequence>
      <Sequence
        from={Math.round(12.5 * fps)}
        durationInFrames={Math.round(0.5 * fps)}
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
              text: "Dakikalar",
              font: "serif",
              size: 134,
              color: C.charcoal,
              weight: 300,
            },
            {
              text: "içinde,",
              font: "serif",
              size: 134,
              color: C.charcoal,
              weight: 300,
            },
            {
              text: "kendi siteniz.",
              font: "serifSoft",
              italic: true,
              size: 96,
              color: C.goldDeep,
              weight: 400,
            },
          ]}
        />
      </AbsoluteFill>
      <Frame tone="light" stage="REELS · 01" role="HIZ" showTimecode={false} />
    </AbsoluteFill>
  );
};

const STEPS: { num: string; title: string; sub: string }[] = [
  { num: "01", title: "İsim ve tarih", sub: "Tuana & Ateş · 26 Eylül 2026" },
  { num: "02", title: "Tema seçimi", sub: "Sekizden bir dünya" },
  { num: "03", title: "Fotoğraflar", sub: "Anılarınızdan birkaç kare" },
  { num: "04", title: "Yayında", sub: "uygundavet.com/sunset" },
];

const Steps: React.FC = () => {
  const t = useSeconds();
  const stepDur = 1.7;
  const idx = Math.min(STEPS.length - 1, Math.floor(t / stepDur));
  const localPct = Math.min(1, (t - idx * stepDur) / stepDur);
  const totalPct = ((idx + localPct) / STEPS.length) * 100;

  return (
    <AbsoluteFill style={{ background: C.bgLight }}>
      <PaperWash />

      {/* Top label + progress bar */}
      <div
        style={{
          position: "absolute",
          top: "8%",
          left: "8%",
          right: "8%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              fontFamily: F.mono,
              fontSize: 14,
              letterSpacing: "0.42em",
              color: C.gold,
              textTransform: "uppercase",
            }}
          >
            ✦ KURULUM
          </div>
          <div
            style={{
              fontFamily: F.mono,
              fontSize: 13,
              letterSpacing: "0.22em",
              color: C.charcoal,
            }}
          >
            %{Math.round(totalPct)}
          </div>
        </div>
        <div
          style={{
            position: "relative",
            height: 4,
            background: "rgba(20,16,12,0.08)",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${totalPct}%`,
              background: `linear-gradient(90deg, ${C.gold}, ${C.goldDeep})`,
            }}
          />
        </div>
      </div>

      {/* Active step card */}
      <AbsoluteFill
        style={{
          padding: "18% 8% 18%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          key={idx}
          style={{
            width: "100%",
            background: "#fff",
            border: `1px solid ${C.line}`,
            borderRadius: 22,
            padding: "44px 48px",
            boxShadow: "0 30px 70px rgba(20,16,12,0.16)",
            transform: `translateY(${(1 - localPct) * 8}px)`,
            opacity: 0.4 + localPct * 0.6,
          }}
        >
          <div
            style={{
              fontFamily: F.mono,
              fontSize: 16,
              letterSpacing: "0.36em",
              color: C.gold,
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            ADIM {STEPS[idx].num}
          </div>
          <div
            style={{
              fontFamily: F.serif,
              fontWeight: 300,
              fontSize: 84,
              color: C.charcoal,
              letterSpacing: "-0.02em",
              lineHeight: 1.0,
            }}
          >
            {STEPS[idx].title}
          </div>
          <div
            style={{
              fontFamily: F.serifSoft,
              fontStyle: "italic",
              fontSize: 36,
              color: C.goldDeep,
              marginTop: 18,
              letterSpacing: "0.01em",
            }}
          >
            {STEPS[idx].sub}
          </div>
        </div>
      </AbsoluteFill>

      {/* Step list bottom */}
      <div
        style={{
          position: "absolute",
          left: "8%",
          right: "8%",
          bottom: "9%",
          display: "flex",
          gap: 12,
        }}
      >
        {STEPS.map((s, i) => {
          const active = i === idx;
          const done = i < idx;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                padding: "12px 14px",
                background: active
                  ? "rgba(184,153,104,0.16)"
                  : done
                    ? "rgba(138,154,122,0.12)"
                    : "rgba(20,16,12,0.04)",
                border: `1px solid ${active ? C.gold : done ? C.sage : "rgba(20,16,12,0.1)"}`,
                borderRadius: 10,
                fontFamily: F.mono,
                fontSize: 11,
                letterSpacing: "0.22em",
                color: active ? C.goldDeep : done ? C.sage : C.mute,
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              {done ? "✓ " : ""}
              {s.title}
            </div>
          );
        })}
      </div>

      <Frame tone="light" stage="REELS · 02" role="ADIMLAR" showTimecode={false} />
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
              text: "Beş dakikada",
              font: "serif",
              size: 92,
              color: C.cream,
              weight: 300,
            },
            {
              text: "ömürlük bir site.",
              font: "serifSoft",
              italic: true,
              size: 78,
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
        duration={0.5}
        zoom={{ from: 1.0, to: 1.02 }}
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
          gap: 10,
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
            fontSize: 22,
            color: C.goldHi,
            letterSpacing: "0.03em",
          }}
        >
          5 dakikada hazır bir web sitesi.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
