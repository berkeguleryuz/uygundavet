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

// 15s 9:16 — "Hediye Listesi"
// Çift için tek bir kayıtlı liste; her madde toplanma yüzdesini gösterir.
//   0.0 – 3.0   AÇILIŞ
//   3.0 – 11.0  LİSTE        5 madde + ilerleme çubukları
//  11.0 – 13.0  ÇERÇEVE     "Tek liste, çift için, aile için."
//  13.0 – 15.0  KAPANIŞ
export const HediyeListesiReelComposition: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.ivory, overflow: "hidden" }}>
      <Audio src={staticFile(MUSIC.warm)} volume={0.6} />

      <Sequence from={0} durationInFrames={Math.round(3 * fps)}>
        <Hook />
      </Sequence>
      <Sequence
        from={Math.round(3 * fps)}
        durationInFrames={Math.round(8 * fps)}
      >
        <List />
      </Sequence>
      <Sequence
        from={Math.round(11 * fps)}
        durationInFrames={Math.round(2 * fps)}
      >
        <FrameLine />
      </Sequence>
      <Sequence
        from={Math.round(13 * fps)}
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
          ✦ HEDİYE LİSTESİ
        </div>
        <KineticHeadline
          start={0.1}
          stagger={0.06}
          align="left"
          lines={[
            {
              text: "Bir liste,",
              font: "serif",
              size: 134,
              color: C.charcoal,
              weight: 300,
            },
            {
              text: "bir başlangıç.",
              font: "serifSoft",
              italic: true,
              size: 134,
              color: C.goldDeep,
              weight: 400,
            },
          ]}
        />
        <div
          style={{
            opacity: tween({ t, start: 1.4, end: 2.2, from: 0, to: 1 }),
            fontFamily: F.body,
            fontSize: 28,
            color: C.charcoal,
            lineHeight: 1.4,
            marginTop: 26,
            maxWidth: "92%",
          }}
        >
          Yeni bir hayatın eşyaları, tek dijital listede;
          misafiriniz hangi parçayı alacağını bir bakışta görür.
        </div>
      </AbsoluteFill>
      <Frame tone="light" stage="REELS · 01" role="LİSTE" showTimecode={false} />
    </AbsoluteFill>
  );
};

type Item = { name: string; sub: string; pct: number; total: string };

const ITEMS: Item[] = [
  { name: "Yeni evimiz için porselen", sub: "12 parçalık akşam yemeği takımı", pct: 78, total: "₺ 14.500" },
  { name: "Bal ayı fonu", sub: "Capri · 7 gece", pct: 64, total: "₺ 92.000" },
  { name: "Kahve köşesi", sub: "El yapımı seramik fincanlar", pct: 92, total: "₺ 6.200" },
  { name: "Mutfak hazırlığı", sub: "Çelik tencere seti", pct: 41, total: "₺ 18.700" },
  { name: "Kütüphane", sub: "Ahşap raf ünitesi", pct: 23, total: "₺ 24.300" },
];

const List: React.FC = () => {
  const t = useSeconds();
  return (
    <AbsoluteFill style={{ background: C.ivory }}>
      <PaperWash />

      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "8%",
          right: "8%",
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontFamily: F.serif,
            fontWeight: 300,
            fontSize: 60,
            color: C.charcoal,
            letterSpacing: "-0.02em",
          }}
        >
          Hediye Listemiz
        </div>
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 13,
            letterSpacing: "0.28em",
            color: C.mute,
            textTransform: "uppercase",
          }}
        >
          5 / 12 KAYIT
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: "8%",
          right: "8%",
          top: "20%",
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        {ITEMS.map((it, i) => {
          const start = 0.2 + i * 0.7;
          const op = tween({
            t,
            start,
            end: start + 0.4,
            from: 0,
            to: 1,
            ease: EASE.outQuart,
          });
          const tx = tween({
            t,
            start,
            end: start + 0.55,
            from: 32,
            to: 0,
            ease: EASE.outQuart,
          });
          const barW = tween({
            t,
            start: start + 0.3,
            end: start + 1.4,
            from: 0,
            to: it.pct,
            ease: EASE.outExpo,
          });
          return (
            <div
              key={i}
              style={{
                opacity: op,
                transform: `translateX(${tx}px)`,
                background: "#fff",
                border: `1px solid ${C.line}`,
                borderRadius: 12,
                padding: "20px 24px",
                boxShadow: "0 14px 28px rgba(20,16,12,0.10)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: 14,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: F.serif,
                      fontSize: 32,
                      color: C.ink,
                      fontWeight: 400,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {it.name}
                  </div>
                  <div
                    style={{
                      fontFamily: F.body,
                      fontSize: 17,
                      color: C.mute,
                      marginTop: 2,
                    }}
                  >
                    {it.sub}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: F.mono,
                    fontSize: 14,
                    letterSpacing: "0.14em",
                    color: C.charcoal,
                    whiteSpace: "nowrap",
                  }}
                >
                  {it.total}
                </div>
              </div>
              <div
                style={{
                  position: "relative",
                  height: 6,
                  background: "rgba(20,16,12,0.08)",
                  borderRadius: 6,
                  marginTop: 14,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: `${barW}%`,
                    background: `linear-gradient(90deg, ${C.gold}, ${C.goldDeep})`,
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 6,
                  fontFamily: F.mono,
                  fontSize: 12,
                  letterSpacing: "0.18em",
                  color: C.mute,
                  textTransform: "uppercase",
                }}
              >
                <span>tamamlandı</span>
                <span>%{Math.round(barW)}</span>
              </div>
            </div>
          );
        })}
      </div>

      <Frame tone="light" stage="REELS · 02" role="HEDİYE" showTimecode={false} />
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
            fontSize: 60,
            color: C.charcoal,
            lineHeight: 1.2,
          }}
        >
          Tek liste;
          <br />
          <span style={{ color: C.goldDeep }}>çift için, aile için.</span>
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
