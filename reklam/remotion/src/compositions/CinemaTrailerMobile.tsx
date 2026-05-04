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
import { ThemeMosaic } from "../components/ThemeMosaic";
import { Ticker } from "../components/Ticker";
import { BrandLockup } from "../components/BrandLockup";
import { Frame } from "../components/Frame";

// 30s 9:16 — Cinema Trailer'ın Reels uyarlaması.
//   0.0 – 4.0   AÇILIŞ        yüzük makro + slate
//   4.0 – 9.5   PERDE I       hero çift, bildiri başlığı
//   9.5 – 16.5  PERDE II      tema reveal grid + spotlight (golden)
//  16.5 – 22.5  PERDE III     crystal kelebek + 8 blok listesi
//  22.5 – 26.5  PERDE IV      katılım onayı kartı
//  26.5 – 30.0  KAPANIŞ       marka kilidi
export const CinemaTrailerMobileComposition: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#0a0a0a", overflow: "hidden" }}>
      <Audio src={staticFile(MUSIC.cinematic)} volume={0.75} />

      <Sequence from={0} durationInFrames={Math.round(4 * fps)}>
        <ColdOpen />
      </Sequence>
      <Sequence
        from={Math.round(4 * fps)}
        durationInFrames={Math.round(5.5 * fps)}
      >
        <ActOne />
      </Sequence>
      <Sequence
        from={Math.round(9.5 * fps)}
        durationInFrames={Math.round(7 * fps)}
      >
        <ActTwo />
      </Sequence>
      <Sequence
        from={Math.round(16.5 * fps)}
        durationInFrames={Math.round(6 * fps)}
      >
        <ActThree />
      </Sequence>
      <Sequence
        from={Math.round(22.5 * fps)}
        durationInFrames={Math.round(4 * fps)}
      >
        <KatilimCheck />
      </Sequence>
      <Sequence
        from={Math.round(26.5 * fps)}
        durationInFrames={Math.round(3.5 * fps)}
      >
        <EndCard />
      </Sequence>
    </AbsoluteFill>
  );
};

const ColdOpen: React.FC = () => {
  const t = useSeconds();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <MediaBackdrop
        src={HERO_VIDEOS.yuzuk}
        duration={4}
        zoom={{ from: 1.06, to: 1.2 }}
        pan={{ x: [0, 0], y: [0.1, -0.1] }}
        vignette={0.7}
        tint="#000"
        tintOpacity={0.35}
        fadeIn={0.6}
        fadeOut={0.6}
      />
      <AbsoluteFill
        style={{
          padding: "16% 8%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            opacity: tween({ t, start: 0.6, end: 1.6, from: 0, to: 1 }),
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontFamily: F.mono,
              fontSize: 18,
              letterSpacing: "0.4em",
              color: "rgba(245,240,230,0.7)",
              textTransform: "uppercase",
            }}
          >
            UYGUN DAVET
          </div>
        </div>
        <div
          style={{
            opacity: tween({ t, start: 0.7, end: 1.6, from: 0, to: 1 }),
          }}
        >
          <div
            style={{
              fontFamily: F.serif,
              fontSize: 84,
              color: C.goldHi,
              fontStyle: "italic",
              letterSpacing: "-0.02em",
              lineHeight: 1.0,
            }}
          >
            bir sahnenin
          </div>
          <div
            style={{
              fontFamily: F.serif,
              fontSize: 84,
              color: C.goldHi,
              fontStyle: "italic",
              letterSpacing: "-0.02em",
              lineHeight: 1.0,
              marginTop: 6,
            }}
          >
            ardından
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 18,
            marginTop: 28,
            fontFamily: F.mono,
            fontSize: 13,
            color: "rgba(245,240,230,0.55)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            opacity: tween({ t, start: 0.9, end: 1.7, from: 0, to: 1 }),
          }}
        >
          <span>SAH.01 / KAYIT 03</span>
          <span>2026 · İSTANBUL</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const ActOne: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <MediaBackdrop
        src={HERO_VIDEOS.kadinerkek}
        duration={5.5}
        zoom={{ from: 1.04, to: 1.16 }}
        pan={{ x: [-0.6, 0.6], y: [0, -0.2] }}
        vignette={0.45}
        tint="#1a1612"
        tintOpacity={0.18}
        fadeIn={0.5}
        fadeOut={0.6}
      />
      <AbsoluteFill
        style={{
          padding: "12% 8% 14%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <KineticHeadline
          start={0.3}
          align="left"
          stagger={0.08}
          lines={[
            {
              text: "Bir aşk hikâyesi",
              font: "serif",
              size: 110,
              color: C.cream,
              weight: 300,
            },
            {
              text: "yalnızca",
              font: "serif",
              size: 110,
              color: C.cream,
              weight: 300,
            },
            {
              text: "kendi sesiyle",
              font: "serifSoft",
              italic: true,
              size: 96,
              color: C.goldHi,
              weight: 400,
            },
            {
              text: "anlatılır.",
              font: "serifSoft",
              italic: true,
              size: 96,
              color: C.goldHi,
              weight: 400,
            },
          ]}
        />
      </AbsoluteFill>
      <Frame tone="dark" stage="PERDE · I" role="BİLDİRİ" />
    </AbsoluteFill>
  );
};

const ActTwo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.bgLight }}>
      <PaperWash />
      <AbsoluteFill style={{ padding: "10% 6%" }}>
        <KineticHeadline
          start={0.0}
          align="left"
          stagger={0.06}
          lines={[
            {
              text: "Sekiz tema.",
              font: "serif",
              size: 96,
              color: C.charcoal,
              weight: 300,
            },
            {
              text: "Bir tek siz.",
              font: "serifSoft",
              italic: true,
              size: 96,
              color: C.goldDeep,
              weight: 400,
            },
          ]}
        />
      </AbsoluteFill>

      {/* Mosaic in lower 60% — 4 rows × 2 cols suits portrait */}
      <div
        style={{
          position: "absolute",
          left: "5%",
          right: "5%",
          top: "26%",
          bottom: "12%",
        }}
      >
        <ThemeMosaic
          start={0.2}
          rows={4}
          cols={2}
          gap={20}
          spotlight={{ themeKey: "golden", from: 2.8, to: 5.8 }}
        />
      </div>

      <Frame
        tone="light"
        stage="PERDE · II"
        role="TEMA"
        showTimecode={false}
      />
      <Ticker
        items={THEMES.map((th) => `${th.name.toUpperCase()} · ${th.tagline}`)}
        position="bottom"
        inset={32}
        height={40}
        background="rgba(26,22,18,0.06)"
        color={C.charcoal}
        speed={70}
        fontSize={13}
      />
    </AbsoluteFill>
  );
};

const ActThree: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <MediaBackdrop
        src={HERO_VIDEOS.kelebek}
        duration={6}
        zoom={{ from: 1.1, to: 1.28 }}
        pan={{ x: [0.3, -0.3], y: [0, 0.2] }}
        vignette={0.6}
        tint="#000"
        tintOpacity={0.45}
        fadeIn={0.5}
        fadeOut={0.5}
      />
      <AbsoluteFill style={{ padding: "12% 6%" }}>
        <KineticHeadline
          start={0.2}
          align="left"
          stagger={0.05}
          lines={[
            {
              text: "Sekiz blok.",
              font: "serif",
              size: 96,
              color: C.cream,
              weight: 300,
            },
            {
              text: "Sınırsız",
              font: "serif",
              size: 96,
              color: C.cream,
              weight: 300,
            },
            {
              text: "düzenleme",
              font: "serifSoft",
              italic: true,
              size: 76,
              color: C.goldHi,
              weight: 400,
            },
            {
              text: "özgürlüğü.",
              font: "serifSoft",
              italic: true,
              size: 76,
              color: C.goldHi,
              weight: 400,
            },
          ]}
        />
      </AbsoluteFill>
      <BlockColumn />
      <Frame tone="dark" stage="PERDE · III" role="ZANAAT" />
    </AbsoluteFill>
  );
};

const BlockColumn: React.FC = () => {
  const t = useSeconds();
  const blocks: [string, string][] = [
    ["01", "Açılış"],
    ["02", "Hikâye"],
    ["03", "Tören"],
    ["04", "Katılım"],
    ["05", "Konum"],
    ["06", "Anılar"],
    ["07", "Hediye"],
    ["08", "Geri Sayım"],
  ];
  return (
    <div
      style={{
        position: "absolute",
        left: "6%",
        right: "6%",
        bottom: "10%",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
      }}
    >
      {blocks.map((b, i) => {
        const start = 0.4 + i * 0.07;
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
          end: start + 0.6,
          from: 18,
          to: 0,
          ease: EASE.outQuart,
        });
        return (
          <div
            key={i}
            style={{
              opacity: op,
              transform: `translateY(${ty}px)`,
              padding: "16px 18px",
              background: "rgba(245,240,230,0.06)",
              border: "1px solid rgba(245,240,230,0.2)",
              borderRadius: 8,
              fontFamily: F.mono,
              fontSize: 18,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: C.cream,
              display: "flex",
              alignItems: "center",
              gap: 12,
              backdropFilter: "blur(8px)",
            }}
          >
            <span style={{ color: C.gold, fontSize: 13 }}>BLOK {b[0]}</span>
            <span style={{ flex: 1, opacity: 0.85 }}>{b[1]}</span>
            <span style={{ color: "rgba(245,240,230,0.55)" }}>✦</span>
          </div>
        );
      })}
    </div>
  );
};

const KatilimCheck: React.FC = () => {
  const t = useSeconds();
  const cardOp = tween({ t, start: 0.0, end: 0.6, from: 0, to: 1, ease: EASE.outQuart });
  const cardTy = tween({ t, start: 0.0, end: 0.6, from: 22, to: 0, ease: EASE.outBack });
  const checkScale = tween({ t, start: 0.5, end: 1.1, from: 0, to: 1, ease: EASE.outBack });

  return (
    <AbsoluteFill style={{ background: C.bgLight }}>
      <PaperWash />
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 6%",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 920,
            background: "#fff",
            border: `1px solid ${C.line}`,
            borderRadius: 22,
            padding: "44px 44px",
            boxShadow: "0 30px 80px rgba(20,16,12,0.18)",
            opacity: cardOp,
            transform: `translateY(${cardTy}px)`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontFamily: F.mono,
              fontSize: 14,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: C.mute,
            }}
          >
            <span>KATILIM · ONAYI</span>
            <span>02:14</span>
          </div>
          <div
            style={{
              fontFamily: F.serifSoft,
              fontStyle: "italic",
              fontSize: 44,
              color: C.gold,
              marginTop: 18,
            }}
          >
            Tuana &amp; Ateş'in
          </div>
          <div
            style={{
              fontFamily: F.serifSoft,
              fontStyle: "italic",
              fontSize: 36,
              color: C.gold,
              marginTop: 4,
            }}
          >
            düğününe
          </div>
          <div
            style={{
              fontFamily: F.serif,
              fontWeight: 300,
              fontSize: 100,
              color: C.ink,
              letterSpacing: "-0.02em",
              lineHeight: 1.0,
              marginTop: 10,
            }}
          >
            Katılıyorum.
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              marginTop: 36,
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: C.sage,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 34,
                fontWeight: 600,
                transform: `scale(${checkScale})`,
              }}
            >
              ✓
            </div>
            <div>
              <div
                style={{
                  fontFamily: F.body,
                  fontSize: 22,
                  color: C.charcoal,
                  fontWeight: 500,
                }}
              >
                Yanıt çift ve aileye iletildi
              </div>
              <div
                style={{
                  fontFamily: F.mono,
                  fontSize: 13,
                  color: C.mute,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  marginTop: 4,
                }}
              >
                takvime otomatik eklendi
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <Frame tone="light" stage="PERDE · IV" role="KATILIM" />
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const t = useSeconds();
  return (
    <AbsoluteFill style={{ background: C.bgDark }}>
      <MediaBackdrop
        src={HERO_VIDEOS.crystalBox}
        duration={3.5}
        zoom={{ from: 1.0, to: 1.08 }}
        pan={{ x: [0, 0], y: [0, 0] }}
        vignette={0.7}
        tint="#000"
        tintOpacity={0.62}
        fadeIn={0.4}
        fadeOut={0.5}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 28,
          padding: "0 8%",
          textAlign: "center",
        }}
      >
        <BrandLockup
          start={0.2}
          size={300}
          tone="dark"
          cta="UYGUNDAVET.COM"
          url="instagram · uygundavetcom"
        />
        <div
          style={{
            opacity: tween({ t, start: 1.4, end: 2.2, from: 0, to: 1 }),
            fontFamily: F.script,
            fontStyle: "italic",
            fontSize: 36,
            color: C.goldHi,
            letterSpacing: "0.04em",
          }}
        >
          dakikalar içinde, sonsuza kadar.
        </div>
      </AbsoluteFill>
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
