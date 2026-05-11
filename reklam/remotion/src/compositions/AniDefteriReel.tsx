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
import { CounterTicker } from "../components/CounterTicker";
import { BrandLockup } from "../components/BrandLockup";
import { Frame } from "../components/Frame";

// 14s 9:16 — "Anı Defteri"
// Misafirlerin elle yazılmış dilekleri kâğıt üzerinde uçar gibi düşer.
//   0.0 – 3.0   AÇILIŞ        "Sözleri saklayalım."
//   3.0 – 10.0  DİLEK YIĞINI  10 dilek + 247 sayaç
//  10.0 – 12.0  ÇERÇEVE       "Kelimeleriniz, ömürlük arşivinizde."
//  12.0 – 14.0  KAPANIŞ
export const AniDefteriReelComposition: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.ivory, overflow: "hidden" }}>
      <Audio src={staticFile(MUSIC.warm)} volume={0.6} />

      <Sequence from={0} durationInFrames={Math.round(3 * fps)}>
        <Hook />
      </Sequence>
      <Sequence
        from={Math.round(3 * fps)}
        durationInFrames={Math.round(7 * fps)}
      >
        <WishStream />
      </Sequence>
      <Sequence
        from={Math.round(10 * fps)}
        durationInFrames={Math.round(2 * fps)}
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

const PaperWash: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse at 30% 20%, #faf7f0 0%, #ece4d3 60%, #d8cfbc 100%)",
    }}
  />
);

const Hook: React.FC = () => {
  const t = useSeconds();
  return (
    <AbsoluteFill style={{ background: C.ivory }}>
      <PaperWash />
      <AbsoluteFill
        style={{
          padding: "14% 8%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 16,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: C.gold,
            marginBottom: 18,
            opacity: tween({ t, start: 0.0, end: 0.5, from: 0, to: 1 }),
          }}
        >
          ✦ ANI DEFTERİ
        </div>
        <KineticHeadline
          start={0.1}
          stagger={0.06}
          align="left"
          lines={[
            {
              text: "Sözleri",
              font: "serif",
              size: 152,
              color: C.charcoal,
              weight: 300,
            },
            {
              text: "saklayalım.",
              font: "serifSoft",
              italic: true,
              size: 152,
              color: C.goldDeep,
              weight: 400,
            },
          ]}
        />
        <div
          style={{
            opacity: tween({ t, start: 1.4, end: 2.2, from: 0, to: 1 }),
            fontFamily: F.body,
            fontSize: 30,
            color: C.charcoal,
            lineHeight: 1.4,
            marginTop: 26,
            maxWidth: "92%",
          }}
        >
          Düğün gününüzde söylenenler,
          dijital kâğıdınızda ömür boyu kalsın.
        </div>
      </AbsoluteFill>
      <Frame tone="light" stage="REELS · 01" role="DEFTER" showTimecode={false} />
    </AbsoluteFill>
  );
};

const WISHES: { text: string; from: string; rot: number; x: string; w: number }[] = [
  {
    text: "Mutluluğunuz, sevdiklerinizin gözlerinde uzun bir ışık olsun.",
    from: "Elif & Mert",
    rot: -3,
    x: "6%",
    w: 540,
  },
  {
    text: "İki yürek, tek nefes; ömrünüze âferin.",
    from: "Hakan Bey",
    rot: 4,
    x: "44%",
    w: 480,
  },
  {
    text: "Bir bahçe gibi büyüyen sevginiz hep yeşersin.",
    from: "Aslı & Cem",
    rot: -2,
    x: "12%",
    w: 520,
  },
  {
    text: "Eşiniz ve evinizle birlikte, sabırla yaşlanın.",
    from: "Demir ailesi",
    rot: 5,
    x: "40%",
    w: 500,
  },
  {
    text: "Sözünüzün gücü, her sabah yeni bir başlangıç olsun.",
    from: "Selin Yılmaz",
    rot: -4,
    x: "8%",
    w: 530,
  },
  {
    text: "Bir kalpten doğan iki ses; uyumunuz ezgi olsun.",
    from: "Naz Doğan",
    rot: 3,
    x: "42%",
    w: 510,
  },
];

const WishStream: React.FC = () => {
  const t = useSeconds();
  return (
    <AbsoluteFill style={{ background: C.ivory }}>
      <PaperWash />

      {/* Top counter */}
      <div
        style={{
          position: "absolute",
          top: "8%",
          left: "8%",
          right: "8%",
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: F.mono,
              fontSize: 14,
              letterSpacing: "0.36em",
              textTransform: "uppercase",
              color: C.mute,
              marginBottom: 4,
            }}
          >
            DİLEKLERİNİZ
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
            <CounterTicker
              from={0}
              to={247}
              start={0.0}
              duration={4}
              ease={EASE.outExpo}
              style={{
                fontFamily: F.serif,
                fontWeight: 300,
                fontSize: 124,
                color: C.charcoal,
                letterSpacing: "-0.03em",
                lineHeight: 0.95,
              }}
            />
            <div
              style={{
                fontFamily: F.serifSoft,
                fontStyle: "italic",
                fontSize: 36,
                color: C.gold,
              }}
            >
              söz
            </div>
          </div>
        </div>
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 12,
            letterSpacing: "0.28em",
            color: C.mute,
            textTransform: "uppercase",
          }}
        >
          son 7 gün
        </div>
      </div>

      {/* Wish cards drift in */}
      {WISHES.map((w, i) => {
        const start = 0.4 + i * 0.7;
        const op = tween({
          t,
          start,
          end: start + 0.5,
          from: 0,
          to: 1,
          ease: EASE.outQuart,
        });
        const ty = tween({
          t,
          start,
          end: start + 0.7,
          from: 28,
          to: 0,
          ease: EASE.outBack,
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${28 + i * 9}%`,
              left: w.x,
              width: w.w,
              opacity: op,
              transform: `translateY(${ty}px) rotate(${w.rot}deg)`,
              background: "#fff",
              padding: "20px 24px",
              border: `1px solid ${C.line}`,
              borderRadius: 6,
              boxShadow: "0 18px 32px rgba(20,16,12,0.14)",
              zIndex: i + 1,
            }}
          >
            <div
              style={{
                fontFamily: F.serifSoft,
                fontStyle: "italic",
                fontSize: 26,
                color: C.charcoal,
                lineHeight: 1.35,
                letterSpacing: "0.01em",
              }}
            >
              {w.text}
            </div>
            <div
              style={{
                fontFamily: F.mono,
                fontSize: 11,
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                color: C.mute,
                marginTop: 12,
              }}
            >
              — {w.from}
            </div>
          </div>
        );
      })}

      <Frame tone="light" stage="REELS · 02" role="DİLEK" showTimecode={false} />
    </AbsoluteFill>
  );
};

const FrameLine: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.ivory }}>
      <PaperWash />
      <AbsoluteFill
        style={{
          padding: "0 8%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
          Kelimeleriniz,
          <br />
          <span style={{ color: C.goldDeep }}>ömürlük arşivinizde.</span>
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
