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
import { HERO_VIDEOS, MUSIC, STILL_IMAGES, THEMES } from "../style/themes";
import { tween, useSeconds, EASE } from "../style/ease";
import { MediaBackdrop } from "../components/MediaBackdrop";
import { KineticHeadline } from "../components/KineticHeadline";
import { ThemeMosaic } from "../components/ThemeMosaic";
import { Ticker } from "../components/Ticker";
import { BrandLockup } from "../components/BrandLockup";
import { Frame } from "../components/Frame";

// 30s 16:9 cinema trailer
//   0.0 – 4.0   COLD OPEN     letterboxed yuzuk macro, slate
//   4.0 – 9.5   ACT I         hero couple, manifesto headline
//   9.5 – 16.5  ACT II        theme reveal grid + spotlight (golden)
//  16.5 – 22.5  ACT III       crystal kelebek + product chrome (8 BLOCKS)
//  22.5 – 26.5  RSVP CHECK    success card animation
//  26.5 – 30.0  END CARD      brand lockup, URL
export const CinemaTrailerComposition: React.FC = () => {
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
        <RsvpCheck />
      </Sequence>
      <Sequence
        from={Math.round(26.5 * fps)}
        durationInFrames={Math.round(3.5 * fps)}
      >
        <EndCard />
      </Sequence>

      {/* Persistent letterbox bars to lock cinematic ratio */}
      <LetterBox />
    </AbsoluteFill>
  );
};

// ── Cold open ──────────────────────────────────────────────────────────────
const ColdOpen: React.FC = () => {
  const t = useSeconds();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <MediaBackdrop
        src={HERO_VIDEOS.yuzuk}
        duration={4}
        zoom={{ from: 1.05, to: 1.18 }}
        pan={{ x: [0, -0.4], y: [0.1, -0.1] }}
        vignette={0.7}
        tint="#000"
        tintOpacity={0.35}
        fadeIn={0.6}
        fadeOut={0.6}
      />
      {/* Slate */}
      <AbsoluteFill
        style={{
          padding: "16% 6%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            opacity: tween({ t, start: 0.6, end: 1.6, from: 0, to: 1 }),
          }}
        >
          <div
            style={{
              fontFamily: F.mono,
              fontSize: 14,
              letterSpacing: "0.4em",
              color: "rgba(245,240,230,0.7)",
              textTransform: "uppercase",
            }}
          >
            UYGUN DAVET / TR
          </div>
          <div
            style={{
              fontFamily: F.serif,
              fontSize: 56,
              color: C.goldHi,
              fontStyle: "italic",
              letterSpacing: "-0.02em",
              marginTop: 12,
            }}
          >
            bir sahnenin ardından
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 8,
            fontFamily: F.mono,
            fontSize: 12,
            color: "rgba(245,240,230,0.55)",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            opacity: tween({ t, start: 0.6, end: 1.6, from: 0, to: 1 }),
          }}
        >
          <span>SAH.01 / KAYIT 03</span>
          <span>2026 · İSTANBUL</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Act I ──────────────────────────────────────────────────────────────────
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
          padding: "12% 6%",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <div style={{ maxWidth: "60%" }}>
          <KineticHeadline
            start={0.3}
            align="left"
            stagger={0.07}
            lines={[
              {
                text: "Bir aşk hikâyesi",
                font: "serif",
                size: 96,
                color: C.cream,
                weight: 300,
              },
              {
                text: "yalnızca",
                font: "serif",
                size: 96,
                color: C.cream,
                weight: 300,
              },
              {
                text: "kendi sesiyle anlatılır.",
                font: "serifSoft",
                italic: true,
                size: 78,
                color: C.goldHi,
                weight: 400,
              },
            ]}
          />
        </div>
      </AbsoluteFill>
      <Frame tone="dark" stage="PERDE · I" role="BİLDİRİ" />
    </AbsoluteFill>
  );
};

// ── Act II — theme reveal ───────────────────────────────────────────────────
const ActTwo: React.FC = () => {
  const t = useSeconds();
  return (
    <AbsoluteFill style={{ background: C.bgLight }}>
      <PaperWash />
      <AbsoluteFill style={{ padding: "10% 6% 12%" }}>
        <KineticHeadline
          start={0.0}
          align="left"
          stagger={0.05}
          lines={[
            {
              text: "Sekiz tema.",
              font: "serif",
              size: 76,
              color: C.charcoal,
              weight: 300,
            },
            {
              text: "Bir tek siz.",
              font: "serifSoft",
              italic: true,
              size: 76,
              color: C.goldDeep,
              weight: 400,
            },
          ]}
        />
      </AbsoluteFill>

      {/* Mosaic positioned in lower 2/3, with golden spotlight 2.5–5.5 */}
      <div
        style={{
          position: "absolute",
          left: "6%",
          right: "6%",
          top: "32%",
          bottom: "10%",
        }}
      >
        <ThemeMosaic
          start={0.2}
          rows={2}
          cols={4}
          gap={18}
          spotlight={{ themeKey: "golden", from: 2.5, to: 5.6 }}
          showTaglines={false}
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
        height={48}
        background="rgba(26,22,18,0.06)"
        color={C.charcoal}
        speed={70}
      />
    </AbsoluteFill>
  );
};

// ── Act III — craft ────────────────────────────────────────────────────────
const ActThree: React.FC = () => {
  const t = useSeconds();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <MediaBackdrop
        src={HERO_VIDEOS.kelebek}
        duration={6}
        zoom={{ from: 1.1, to: 1.28 }}
        pan={{ x: [0.3, -0.3], y: [0, 0.2] }}
        vignette={0.55}
        tint="#000"
        tintOpacity={0.28}
        fadeIn={0.5}
        fadeOut={0.5}
      />

      <AbsoluteFill
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          padding: "10% 6% 14%",
          alignItems: "flex-end",
          gap: 60,
        }}
      >
        <div>
          <KineticHeadline
            start={0.2}
            align="left"
            stagger={0.05}
            lines={[
              {
                text: "Sekiz blok.",
                font: "serif",
                size: 80,
                color: C.cream,
                weight: 300,
              },
              {
                text: "Sınırsız",
                font: "serif",
                size: 80,
                color: C.cream,
                weight: 300,
              },
              {
                text: "düzenleme özgürlüğü.",
                font: "serifSoft",
                italic: true,
                size: 60,
                color: C.goldHi,
                weight: 400,
              },
            ]}
          />
        </div>
        <BlockGrid />
      </AbsoluteFill>
      <Frame tone="dark" stage="PERDE · III" role="ZANAAT" />
    </AbsoluteFill>
  );
};

const BlockGrid: React.FC = () => {
  const t = useSeconds();
  const blocks = [
    "Hero",
    "Hikâye",
    "Tören",
    "Katılım",
    "Konum",
    "Anılar",
    "Hediye",
    "Geri Sayım",
  ];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
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
          from: 16,
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
              border: "1px solid rgba(245,240,230,0.18)",
              borderRadius: 8,
              fontFamily: F.mono,
              fontSize: 16,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: C.cream,
              display: "flex",
              alignItems: "center",
              gap: 14,
              backdropFilter: "blur(8px)",
            }}
          >
            <span style={{ color: C.gold, fontSize: 12 }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span style={{ flex: 1 }}>{b}</span>
            <span style={{ color: "rgba(245,240,230,0.55)" }}>✦</span>
          </div>
        );
      })}
    </div>
  );
};

// ── RSVP check — animated success ──────────────────────────────────────────
const RsvpCheck: React.FC = () => {
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
        }}
      >
        <div
          style={{
            width: 720,
            background: "#fff",
            border: `1px solid ${C.line}`,
            borderRadius: 18,
            padding: "44px 48px",
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
              fontSize: 12,
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
              fontSize: 38,
              color: C.gold,
              marginTop: 14,
            }}
          >
            Tuana &amp; Ateş'in düğününe
          </div>
          <div
            style={{
              fontFamily: F.serif,
              fontWeight: 300,
              fontSize: 76,
              color: C.ink,
              letterSpacing: "-0.02em",
              lineHeight: 1.0,
              marginTop: 6,
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
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: C.sage,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
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
                  fontSize: 18,
                  color: C.charcoal,
                  fontWeight: 500,
                }}
              >
                Yanıt çift ve aileye iletildi
              </div>
              <div
                style={{
                  fontFamily: F.mono,
                  fontSize: 12,
                  color: C.mute,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
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

// ── End card ───────────────────────────────────────────────────────────────
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
            fontSize: 30,
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

// ── Ambient pieces ─────────────────────────────────────────────────────────
const PaperWash: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse at 30% 20%, #faf7f0 0%, #ece4d3 60%, #d8cfbc 100%)",
    }}
  />
);

const LetterBox: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: "5%",
        background: "#000",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "5%",
        background: "#000",
      }}
    />
  </AbsoluteFill>
);
