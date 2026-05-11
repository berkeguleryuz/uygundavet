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
import { BrandLockup } from "../components/BrandLockup";
import { Frame } from "../components/Frame";

// 15s 9:16 — "Bir Tarayıcı, Bir Kalp"
// Tüm özelliklerin minik kartlar halinde akıp birleştiği final spot.
//   0.0 – 3.0   AÇILIŞ
//   3.0 – 12.0  KART AKINI    8 özellik kartı sırayla yığılır
//  12.0 – 14.0  ÇERÇEVE
//  14.0 – 15.0  KAPANIŞ
export const SonsuzReelComposition: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#0a0a0a", overflow: "hidden" }}>
      <Audio src={staticFile(MUSIC.cinematic)} volume={0.6} />

      <Sequence from={0} durationInFrames={Math.round(3 * fps)}>
        <Hook />
      </Sequence>
      <Sequence
        from={Math.round(3 * fps)}
        durationInFrames={Math.round(9 * fps)}
      >
        <Cards />
      </Sequence>
      <Sequence
        from={Math.round(12 * fps)}
        durationInFrames={Math.round(2 * fps)}
      >
        <FrameLine />
      </Sequence>
      <Sequence
        from={Math.round(14 * fps)}
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
        src={HERO_VIDEOS.kelebek}
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
              text: "Bir tarayıcı,",
              font: "serif",
              size: 130,
              color: C.cream,
              weight: 300,
            },
            {
              text: "bir kalp.",
              font: "serifSoft",
              italic: true,
              size: 130,
              color: C.goldHi,
              weight: 400,
            },
          ]}
        />
      </AbsoluteFill>
      <Frame tone="dark" stage="REELS · 01" role="HEPSİ" showTimecode={false} />
    </AbsoluteFill>
  );
};

const FEATURE_CARDS: { tag: string; title: string; sub: string; tilt: number }[] = [
  { tag: "DAVETİYE", title: "Hikâyeniz Bölümü", sub: "Sizin sözleriniz", tilt: -3 },
  { tag: "LCV", title: "Online katılım formu", sub: "Otomatik takip", tilt: 4 },
  { tag: "TEMA", title: "Sekiz dünya", sub: "Bir tek siz", tilt: -2 },
  { tag: "MÜZİK", title: "Arka plan müziği", sub: "Sayfaya bir nefes", tilt: 5 },
  { tag: "HATIRLATMA", title: "Bildirim akışı", sub: "Tarih yaklaşırken", tilt: -4 },
  { tag: "HARİTA", title: "Konum & yol tarifi", sub: "Mekâna kapıdan kapıya", tilt: 3 },
  { tag: "QR KOD", title: "Fiziksel köprü", sub: "Sticker ile davetiye", tilt: -3 },
  { tag: "GALERİ", title: "Fotoğraflarınız", sub: "Anı defteriyle birlikte", tilt: 2 },
];

const Cards: React.FC = () => {
  const t = useSeconds();
  return (
    <AbsoluteFill style={{ background: C.bgDark }}>
      <MediaBackdrop
        src={HERO_VIDEOS.crystalBox}
        duration={9}
        zoom={{ from: 1.0, to: 1.06 }}
        pan={{ x: [0, 0], y: [0, 0] }}
        vignette={0.75}
        tint="#000"
        tintOpacity={0.7}
        fadeIn={0.3}
        fadeOut={0.4}
      />

      <div
        style={{
          position: "absolute",
          top: "5%",
          left: "8%",
          right: "8%",
          fontFamily: F.mono,
          fontSize: 16,
          letterSpacing: "0.42em",
          color: C.goldHi,
          textTransform: "uppercase",
        }}
      >
        ✦ HEPSİ TEK BİR WEB SİTESİNDE
      </div>

      {FEATURE_CARDS.map((c, i) => {
        const start = 0.2 + i * 0.65;
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
          end: start + 0.6,
          from: 60,
          to: 0,
          ease: EASE.outBack,
        });
        const col = i % 2 === 0 ? "8%" : "auto";
        const right = i % 2 === 1 ? "8%" : "auto";
        const top = `${18 + Math.floor(i / 2) * 19}%`;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: col,
              right: right,
              top,
              width: "44%",
              opacity: op,
              transform: `translateY(${ty}px) rotate(${c.tilt}deg)`,
              background: "rgba(245,240,230,0.07)",
              border: "1px solid rgba(245,240,230,0.22)",
              borderRadius: 16,
              padding: "22px 26px",
              backdropFilter: "blur(12px)",
              boxShadow: "0 18px 36px rgba(0,0,0,0.4)",
              zIndex: i + 1,
            }}
          >
            <div
              style={{
                fontFamily: F.mono,
                fontSize: 12,
                letterSpacing: "0.32em",
                color: C.gold,
                textTransform: "uppercase",
              }}
            >
              {c.tag}
            </div>
            <div
              style={{
                fontFamily: F.serif,
                fontWeight: 400,
                fontSize: 30,
                color: C.cream,
                letterSpacing: "-0.01em",
                marginTop: 6,
                lineHeight: 1.05,
              }}
            >
              {c.title}
            </div>
            <div
              style={{
                fontFamily: F.serifSoft,
                fontStyle: "italic",
                fontSize: 18,
                color: "rgba(245,240,230,0.72)",
                marginTop: 4,
              }}
            >
              {c.sub}
            </div>
          </div>
        );
      })}

      <Frame tone="dark" stage="REELS · 02" role="HEPSİ" showTimecode={false} />
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
              text: "Bu bir davetiye değil;",
              font: "serif",
              size: 76,
              color: C.cream,
              weight: 300,
            },
            {
              text: "bu, sizin web siteniz.",
              font: "serifSoft",
              italic: true,
              size: 76,
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
          gap: 12,
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
            fontSize: 24,
            color: C.goldHi,
            letterSpacing: "0.03em",
          }}
        >
          dijital websitesi davetiyesi.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
