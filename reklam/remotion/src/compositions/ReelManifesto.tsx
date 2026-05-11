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
import { RsvpRip } from "../components/RsvpRip";
import { BrandLockup } from "../components/BrandLockup";
import { Frame } from "../components/Frame";

// 30s 9:16 manifesto reel
//   0.0 – 3.5   HOOK         hero video, kinetic headline burst
//   3.5 – 8.5   PROMISE      kadinerkek love-story Ken Burns + tagline
//   8.5 – 14.5  THEMES       8-tile mosaic, theme spotlight (rose)
//  14.5 – 19.5  CRAFT        crystal close-up + scrolling specs ticker
//  19.5 – 24.0  RSVP         paper invitation rip
//  24.0 – 30.0  CTA          end-card lockup with brand
export const ReelManifestoComposition: React.FC = () => {
  const { fps } = useVideoConfig();
  const t = useSeconds();

  return (
    <AbsoluteFill style={{ background: C.bgDark, overflow: "hidden" }}>
      {/* Soundtrack — warm bed across the spot */}
      <Audio src={staticFile(MUSIC.warm)} volume={0.7} />

      {/* HOOK: 0–3.5 */}
      <Sequence from={0} durationInFrames={Math.round(3.5 * fps)}>
        <HookScene />
      </Sequence>

      {/* PROMISE: 3.5–8.5 */}
      <Sequence
        from={Math.round(3.5 * fps)}
        durationInFrames={Math.round(5 * fps)}
      >
        <PromiseScene />
      </Sequence>

      {/* THEMES: 8.5–14.5 */}
      <Sequence
        from={Math.round(8.5 * fps)}
        durationInFrames={Math.round(6 * fps)}
      >
        <ThemesScene />
      </Sequence>

      {/* CRAFT: 14.5–19.5 */}
      <Sequence
        from={Math.round(14.5 * fps)}
        durationInFrames={Math.round(5 * fps)}
      >
        <CraftScene />
      </Sequence>

      {/* RSVP: 19.5–24 */}
      <Sequence
        from={Math.round(19.5 * fps)}
        durationInFrames={Math.round(4.5 * fps)}
      >
        <RsvpScene />
      </Sequence>

      {/* CTA: 24–30 */}
      <Sequence
        from={Math.round(24 * fps)}
        durationInFrames={Math.round(6 * fps)}
      >
        <CtaScene />
      </Sequence>

      {/* Persistent grain & fine letterbox feel */}
      <Grain />
    </AbsoluteFill>
  );
};

// ── HOOK ───────────────────────────────────────────────────────────────────
const HookScene: React.FC = () => {
  const t = useSeconds();
  const flash = tween({
    t,
    start: 0,
    end: 0.25,
    from: 1,
    to: 0,
    ease: EASE.outQuart,
  });

  return (
    <AbsoluteFill>
      <MediaBackdrop
        src={HERO_VIDEOS.hero}
        duration={3.5}
        zoom={{ from: 1.18, to: 1.04 }}
        pan={{ x: [-1, 1], y: [0, 0] }}
        vignette={0.5}
        tint="#1a1612"
        tintOpacity={0.35}
        fadeIn={0.0}
        fadeOut={0.5}
      />
      {/* Open flash */}
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />

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
            fontFamily: F.mono,
            fontSize: 22,
            color: "rgba(245,240,230,0.78)",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            marginBottom: 28,
            opacity: tween({ t, start: 0.4, end: 1.0, from: 0, to: 1 }),
          }}
        >
          Bir hayat. Bir akşam. Bir davetiye.
        </div>
        <KineticHeadline
          start={0.6}
          align="left"
          stagger={0.09}
          lines={[
            {
              text: "Anınız",
              font: "serif",
              size: 180,
              color: C.cream,
              weight: 300,
            },
            {
              text: "kağıttan",
              font: "serifSoft",
              italic: true,
              size: 180,
              color: C.gold,
              weight: 300,
            },
            {
              text: "büyüktür.",
              font: "serif",
              size: 180,
              color: C.cream,
              weight: 300,
            },
          ]}
        />
      </AbsoluteFill>

      <Frame tone="dark" stage="01 · BİLDİRİ" role="REELS · 01" />
    </AbsoluteFill>
  );
};

// ── PROMISE ─────────────────────────────────────────────────────────────────
const PromiseScene: React.FC = () => {
  const t = useSeconds();
  return (
    <AbsoluteFill style={{ background: C.bgDark }}>
      <MediaBackdrop
        src={HERO_VIDEOS.kadinerkek}
        duration={5}
        zoom={{ from: 1.04, to: 1.16 }}
        pan={{ x: [0, -1], y: [1, -1] }}
        vignette={0.3}
        tint="#2a2520"
        tintOpacity={0.18}
        fadeIn={0.4}
        fadeOut={0.5}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          flexDirection: "column",
          padding: "10% 8% 18%",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "10px 18px",
            background: "rgba(0,0,0,0.45)",
            border: `1px solid rgba(213,209,173,0.35)`,
            borderRadius: 999,
            fontFamily: F.mono,
            fontSize: 18,
            letterSpacing: "0.3em",
            color: C.goldHi,
            textTransform: "uppercase",
            backdropFilter: "blur(10px)",
            opacity: tween({ t, start: 0.0, end: 0.7, from: 0, to: 1 }),
          }}
        >
          ✦ Söz · 2026
        </div>
        <div style={{ height: 32 }} />
        <KineticHeadline
          start={0.25}
          align="left"
          stagger={0.07}
          lines={[
            {
              text: "Davetiyeniz",
              font: "script",
              italic: false,
              size: 110,
              color: C.cream,
              weight: 400,
            },
            {
              text: "size benzesin,",
              font: "script",
              italic: false,
              size: 110,
              color: C.cream,
              weight: 400,
            },
            {
              text: "düğününüz gibi.",
              font: "script",
              italic: false,
              size: 110,
              color: C.goldHi,
              weight: 400,
            },
          ]}
        />
      </AbsoluteFill>
      <Ticker
        items={[
          "Uygun Davet",
          "8 tema",
          "Hediye listesi",
          "Anı defteri",
          "RSVP otomasyonu",
          "Çoklu dil",
          "Kendi alan adınız",
        ]}
        position="top"
        inset={0}
        height={56}
        background="rgba(0,0,0,0.4)"
        color="#d5d1ad"
        speed={90}
      />
    </AbsoluteFill>
  );
};

// ── THEMES ──────────────────────────────────────────────────────────────────
const ThemesScene: React.FC = () => {
  const t = useSeconds();
  return (
    <AbsoluteFill style={{ background: C.ivory }}>
      {/* Soft paper texture */}
      <PaperWash />
      {/* Mosaic, rose spotlight 3.0–5.5 */}
      <ThemeMosaic
        start={0.1}
        rows={4}
        cols={2}
        gap={28}
        spotlight={{ themeKey: "rose", from: 3.0, to: 5.6 }}
      />
      <AbsoluteFill
        style={{
          padding: "8% 8% 0",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 16,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: C.gold,
            opacity: tween({ t, start: 0.0, end: 0.7, from: 0, to: 1 }),
          }}
        >
          ✦ Tema · Kataloğu
        </div>
        <KineticHeadline
          start={0.2}
          align="left"
          stagger={0.05}
          lines={[
            {
              text: "Sekiz dünya,",
              font: "serif",
              size: 96,
              color: C.charcoal,
              weight: 300,
            },
            {
              text: "tek hikâye.",
              font: "serifSoft",
              italic: true,
              size: 96,
              color: C.goldDeep,
              weight: 400,
            },
          ]}
        />
      </AbsoluteFill>
      <Frame tone="light" stage="02 · TEMA" role="KATALOG" showTimecode={false} />
    </AbsoluteFill>
  );
};

// ── CRAFT ───────────────────────────────────────────────────────────────────
const CraftScene: React.FC = () => {
  const t = useSeconds();
  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      <MediaBackdrop
        src={HERO_VIDEOS.crystalRing}
        duration={5}
        zoom={{ from: 1.08, to: 1.22 }}
        pan={{ x: [0.5, -0.5], y: [-0.3, 0.3] }}
        vignette={0.55}
        tint="#000"
        tintOpacity={0.22}
        fadeIn={0.4}
        fadeOut={0.5}
      />

      {/* Spec sheet that scrolls in from the right */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-start",
          padding: "0 8% 16%",
          flexDirection: "column",
        }}
      >
        <KineticHeadline
          start={0.3}
          align="left"
          stagger={0.06}
          lines={[
            {
              text: "Detaylar",
              font: "serif",
              size: 130,
              color: C.cream,
              weight: 300,
            },
            {
              text: "asla rastlantı değildir.",
              font: "serifSoft",
              italic: true,
              size: 64,
              color: C.goldHi,
              weight: 400,
            },
          ]}
        />
      </AbsoluteFill>

      <SpecList
        items={[
          ["BLOK 01", "Açılış / Kapak"],
          ["BLOK 02", "Çift Hikâyesi"],
          ["BLOK 03", "Tören / Düğün"],
          ["BLOK 04", "Katılım Formu"],
          ["BLOK 05", "Konum / Yol"],
          ["BLOK 06", "Anı Defteri"],
          ["BLOK 07", "Hediye Listesi"],
          ["BLOK 08", "Geri Sayım"],
        ]}
        start={0.6}
      />
    </AbsoluteFill>
  );
};

const SpecList: React.FC<{
  items: [string, string][];
  start: number;
}> = ({ items, start }) => {
  const t = useSeconds();
  return (
    <div
      style={{
        position: "absolute",
        top: "12%",
        right: "8%",
        width: "44%",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {items.map((item, i) => {
        const localStart = start + i * 0.08;
        const op = tween({
          t,
          start: localStart,
          end: localStart + 0.45,
          from: 0,
          to: 1,
          ease: EASE.outQuart,
        });
        const tx = tween({
          t,
          start: localStart,
          end: localStart + 0.55,
          from: 60,
          to: 0,
          ease: EASE.outQuart,
        });
        return (
          <div
            key={i}
            style={{
              opacity: op,
              transform: `translateX(${tx}px)`,
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontFamily: F.mono,
              fontSize: 22,
              color: C.cream,
              borderBottom: "1px solid rgba(245,240,230,0.18)",
              paddingBottom: 10,
            }}
          >
            <span style={{ color: C.gold, letterSpacing: "0.16em" }}>
              {item[0]}
            </span>
            <span style={{ flex: 1, opacity: 0.85 }}>{item[1]}</span>
            <span style={{ color: "rgba(245,240,230,0.45)" }}>✓</span>
          </div>
        );
      })}
    </div>
  );
};

// ── RSVP ────────────────────────────────────────────────────────────────────
const RsvpScene: React.FC = () => {
  const t = useSeconds();
  return (
    <AbsoluteFill style={{ background: C.ivory }}>
      <PaperWash />
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <RsvpRip
          start={0.1}
          width={860}
          height={580}
          names={{ a: "Tuana", b: "Ateş" }}
          date="26 · 09 · 2026"
          venue="İstanbul"
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          padding: "0 8%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          paddingBottom: "16%",
        }}
      >
        <KineticHeadline
          start={2.4}
          align="center"
          stagger={0.06}
          lines={[
            {
              text: "Misafiriniz",
              font: "serif",
              size: 88,
              color: C.charcoal,
              weight: 300,
            },
            {
              text: "tek dokunuşla yanıt versin.",
              font: "serifSoft",
              italic: true,
              size: 56,
              color: C.goldDeep,
              weight: 400,
            },
          ]}
        />
      </AbsoluteFill>
      <Frame tone="light" stage="03 · RSVP" role="OTOMATİK" />
    </AbsoluteFill>
  );
};

// ── CTA ────────────────────────────────────────────────────────────────────
const CtaScene: React.FC = () => {
  const t = useSeconds();
  return (
    <AbsoluteFill style={{ background: C.bgDark }}>
      <MediaBackdrop
        src={HERO_VIDEOS.hero2}
        duration={6}
        zoom={{ from: 1.0, to: 1.12 }}
        pan={{ x: [0, 0], y: [0, -0.6] }}
        vignette={0.7}
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
          flexDirection: "column",
          gap: 36,
          padding: "0 10%",
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
            opacity: tween({ t, start: 1.6, end: 2.4, from: 0, to: 1 }),
            fontFamily: F.script,
            fontStyle: "italic",
            fontSize: 38,
            color: C.goldHi,
            letterSpacing: "0.04em",
            maxWidth: 720,
            lineHeight: 1.2,
          }}
        >
          dakikalar içinde, sonsuza kadar.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Reusable wash + grain ──────────────────────────────────────────────────
const PaperWash: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse at 30% 20%, #faf7f0 0%, #ece4d3 60%, #d8cfbc 100%)",
    }}
  />
);

const Grain: React.FC = () => {
  const t = useSeconds();
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        mixBlendMode: "overlay",
        opacity: 0.06,
        backgroundImage: `repeating-conic-gradient(rgba(255,255,255,0.4) 0% 0.5%, transparent 0.5% 1%)`,
        transform: `translate(${(t * 17) % 8}px, ${(t * 23) % 7}px)`,
      }}
    />
  );
};
