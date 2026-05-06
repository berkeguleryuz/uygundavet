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

// 12s 9:16 — "Tek bağlantı, herkes davetli"
//   0.0 – 3.0   AÇILIŞ
//   3.0 – 9.0   PAYLAŞIM AKIŞI    URL kopyalanır → WhatsApp → Instagram Story
//   9.0 – 11.0  ÇERÇEVE
//  11.0 – 12.0  KAPANIŞ        "Bir bağlantı, bir web sitesi."
export const PaylasReelComposition: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#0a0a0a", overflow: "hidden" }}>
      <Audio src={staticFile(MUSIC.warm)} volume={0.6} />

      <Sequence from={0} durationInFrames={Math.round(3 * fps)}>
        <Hook />
      </Sequence>
      <Sequence
        from={Math.round(3 * fps)}
        durationInFrames={Math.round(6 * fps)}
      >
        <ShareFlow />
      </Sequence>
      <Sequence
        from={Math.round(9 * fps)}
        durationInFrames={Math.round(2 * fps)}
      >
        <FrameLine />
      </Sequence>
      <Sequence
        from={Math.round(11 * fps)}
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
        src={HERO_VIDEOS.crystalRing}
        duration={3}
        zoom={{ from: 1.06, to: 1.16 }}
        pan={{ x: [0.2, -0.2], y: [-0.1, 0.1] }}
        vignette={0.7}
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
              text: "Tek bağlantı,",
              font: "serif",
              size: 130,
              color: C.cream,
              weight: 300,
            },
            {
              text: "herkes davetli.",
              font: "serifSoft",
              italic: true,
              size: 130,
              color: C.goldHi,
              weight: 400,
            },
          ]}
        />
      </AbsoluteFill>
      <Frame tone="dark" stage="REELS · 01" role="PAYLAŞIM" showTimecode={false} />
    </AbsoluteFill>
  );
};

const ShareFlow: React.FC = () => {
  const t = useSeconds();
  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      <MediaBackdrop
        src={HERO_VIDEOS.crystalBox}
        duration={6}
        zoom={{ from: 1.04, to: 1.1 }}
        pan={{ x: [0, 0], y: [0, 0] }}
        vignette={0.7}
        tint="#000"
        tintOpacity={0.7}
        fadeIn={0.3}
        fadeOut={0.4}
      />

      {/* Step 1: URL pill (0-1.6s) */}
      <Step
        start={0.0}
        end={2.2}
        top="22%"
        label="01 · BAĞLANTIYI KOPYALAYIN"
        body={
          <div
            style={{
              fontFamily: F.mono,
              fontSize: 24,
              color: C.cream,
              letterSpacing: "0.04em",
              padding: "20px 28px",
              background: "rgba(245,240,230,0.06)",
              border: "1px solid rgba(245,240,230,0.22)",
              borderRadius: 14,
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <span style={{ color: C.gold }}>🔗</span>
            uygundavet.com/sunset
            <span style={{ flex: 1 }} />
            <span
              style={{
                color: C.goldHi,
                fontSize: 14,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              KOPYALANDI ✓
            </span>
          </div>
        }
      />

      {/* Step 2: WhatsApp message (1.8-3.6s) */}
      <Step
        start={2.0}
        end={4.0}
        top="42%"
        label="02 · GÖNDERİN"
        body={
          <div
            style={{
              background: "#075e54",
              borderRadius: 14,
              padding: "18px 22px",
              maxWidth: 640,
              alignSelf: "flex-start",
              boxShadow: "0 14px 30px rgba(0,0,0,0.35)",
            }}
          >
            <div
              style={{
                fontFamily: F.body,
                fontSize: 18,
                color: "#fff",
                lineHeight: 1.4,
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 6 }}>
                Tuana & Ateş'in Düğünü
              </div>
              Sevgili dostlarımız, düğünümüze davetlisiniz.
              <br />
              Detaylar ve katılım onayı için:
              <br />
              <span style={{ color: "#a7e3a4" }}>
                uygundavet.com/sunset
              </span>
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 12,
                color: "rgba(255,255,255,0.6)",
                textAlign: "right",
              }}
            >
              13:42 ✓✓
            </div>
          </div>
        }
      />

      {/* Step 3: IG Story tease (3.8-5.6s) */}
      <Step
        start={3.8}
        end={6.0}
        top="64%"
        label="03 · HİKÂYEDE PAYLAŞIN"
        body={
          <div
            style={{
              background: "linear-gradient(135deg, #c89a93, #b89968)",
              borderRadius: 18,
              padding: "20px 24px",
              maxWidth: 640,
              boxShadow: "0 14px 30px rgba(0,0,0,0.35)",
              color: "#fff",
            }}
          >
            <div
              style={{
                fontFamily: F.mono,
                fontSize: 12,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                opacity: 0.85,
                marginBottom: 6,
              }}
            >
              INSTAGRAM HİKÂYEN
            </div>
            <div
              style={{
                fontFamily: F.serif,
                fontSize: 32,
                fontWeight: 400,
                letterSpacing: "-0.01em",
              }}
            >
              Düğün davetiyemiz çıktı 🤍
            </div>
            <div
              style={{
                fontFamily: F.mono,
                fontSize: 14,
                marginTop: 8,
                opacity: 0.92,
              }}
            >
              uygundavet.com/sunset
            </div>
          </div>
        }
      />

      <Frame tone="dark" stage="REELS · 02" role="AKIŞ" showTimecode={false} />
    </AbsoluteFill>
  );
};

const Step: React.FC<{
  start: number;
  end: number;
  top: string;
  label: string;
  body: React.ReactNode;
}> = ({ start, end, top, label, body }) => {
  const t = useSeconds();
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
    end: start + 0.5,
    from: 22,
    to: 0,
    ease: EASE.outBack,
  });
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: "8%",
        right: "8%",
        opacity: op,
        transform: `translateY(${ty}px)`,
      }}
    >
      <div
        style={{
          fontFamily: F.mono,
          fontSize: 13,
          letterSpacing: "0.32em",
          color: C.goldHi,
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      {body}
    </div>
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
              text: "Bir bağlantı,",
              font: "serif",
              size: 96,
              color: C.cream,
              weight: 300,
            },
            {
              text: "bir web sitesi.",
              font: "serifSoft",
              italic: true,
              size: 96,
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
          gap: 14,
          padding: "0 8%",
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
            fontSize: 26,
            color: C.goldHi,
            letterSpacing: "0.03em",
          }}
        >
          web tabanlı dijital davetiye.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
