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
import { HtmlCanvasInvitation } from "../components/HtmlCanvasInvitation";
import { BrandLockup } from "../components/BrandLockup";
import { Frame } from "../components/Frame";

// 22s 16:9 showcase that puts Remotion's HTML-in-Canvas at center stage.
// Each beat picks a different effect mode for the same DOM-rendered invitation,
// proving the technique is creative range, not a single trick.
//
//   0.0 – 4.0   THESIS         crystal video bg + intro headline
//   4.0 – 8.0   smokeReveal    invitation rises from fog
//   8.0 – 12.0  rgbShift       chromatic aberration calms into clarity
//  12.0 – 16.0  rippleFold     paper warps, settles
//  16.0 – 19.0  shimmer        golden sweep
//  19.0 – 22.0  END CARD       brand lockup
export const HtmlGlitchShowcaseComposition: React.FC = () => {
  const { fps, width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Audio src={staticFile(MUSIC.cinematic)} volume={0.55} />

      <Sequence from={0} durationInFrames={Math.round(4 * fps)}>
        <Thesis />
      </Sequence>

      <Sequence
        from={Math.round(4 * fps)}
        durationInFrames={Math.round(4 * fps)}
      >
        <CanvasBeat
          mode="smokeReveal"
          modeTr="SİS PERDESİ"
          label="SİS PERDESİ"
          subhead="DOM · sis · bulanıklık"
          backdropSrc={HERO_VIDEOS.crystalBox}
          backdropTint="#1a1612"
        />
      </Sequence>

      <Sequence
        from={Math.round(8 * fps)}
        durationInFrames={Math.round(4 * fps)}
      >
        <CanvasBeat
          mode="rgbShift"
          modeTr="RENK KIRINIMI"
          label="RENK KIRINIMI"
          subhead="RGB · ayrışma · netlik"
          backdropSrc={HERO_VIDEOS.kelebek}
          backdropTint="#1f2340"
        />
      </Sequence>

      <Sequence
        from={Math.round(12 * fps)}
        durationInFrames={Math.round(4 * fps)}
      >
        <CanvasBeat
          mode="rippleFold"
          modeTr="KAĞIT KIVRIMI"
          label="KAĞIT KIVRIMI"
          subhead="kâğıt · dalga · zaman"
          backdropSrc={HERO_VIDEOS.crystalRing}
          backdropTint="#000"
        />
      </Sequence>

      <Sequence
        from={Math.round(16 * fps)}
        durationInFrames={Math.round(3 * fps)}
      >
        <CanvasBeat
          mode="shimmer"
          modeTr="ALTIN PARILTI"
          label="ALTIN PARILTI"
          subhead="altın · ışık · yemin"
          backdropSrc={HERO_VIDEOS.yuzuk}
          backdropTint="#000"
        />
      </Sequence>

      <Sequence
        from={Math.round(19 * fps)}
        durationInFrames={Math.round(3 * fps)}
      >
        <ShowcaseEnd width={width} height={height} />
      </Sequence>
    </AbsoluteFill>
  );
};

// ── Thesis ──────────────────────────────────────────────────────────────────
const Thesis: React.FC = () => {
  const t = useSeconds();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <MediaBackdrop
        src={HERO_VIDEOS.kelebek}
        duration={4}
        zoom={{ from: 1.04, to: 1.16 }}
        pan={{ x: [0, -0.4], y: [0.2, -0.2] }}
        vignette={0.7}
        tint="#000"
        tintOpacity={0.55}
        fadeIn={0.5}
        fadeOut={0.6}
      />
      <AbsoluteFill
        style={{
          padding: "10% 6%",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <div style={{ maxWidth: "70%" }}>
          <div
            style={{
              fontFamily: F.mono,
              fontSize: 18,
              letterSpacing: "0.4em",
              color: "rgba(213,209,173,0.78)",
              textTransform: "uppercase",
              marginBottom: 22,
              opacity: tween({ t, start: 0.4, end: 1.2, from: 0, to: 1 }),
            }}
          >
            ✦ TUVAL ÜZERİNE HTML · REMOTION 4.0.455+
          </div>
          <KineticHeadline
            start={0.6}
            stagger={0.07}
            align="left"
            lines={[
              {
                text: "DOM ile",
                font: "serif",
                size: 120,
                color: C.cream,
                weight: 300,
              },
              {
                text: "GPU arasında",
                font: "serif",
                size: 120,
                color: C.cream,
                weight: 300,
              },
              {
                text: "yeni bir gramer.",
                font: "serifSoft",
                italic: true,
                size: 92,
                color: C.goldHi,
                weight: 400,
              },
            ]}
          />
        </div>
      </AbsoluteFill>
      <Frame tone="dark" stage="00 · TANITIM" role="GÖSTERİM" />
    </AbsoluteFill>
  );
};

// ── Canvas beat ─────────────────────────────────────────────────────────────
type BeatProps = {
  mode: "smokeReveal" | "rgbShift" | "rippleFold" | "shimmer";
  modeTr: string;
  label: string;
  subhead: string;
  backdropSrc: string;
  backdropTint: string;
};

const CanvasBeat: React.FC<BeatProps> = ({
  mode,
  modeTr,
  label,
  subhead,
  backdropSrc,
  backdropTint,
}) => {
  const { width, height } = useVideoConfig();
  const t = useSeconds();
  const dur = 4;

  const cardW = Math.round(width * 0.46);
  const cardH = Math.round(height * 0.78);

  // Card slides in from the right and gently floats.
  const slideIn = tween({
    t,
    start: 0.0,
    end: 1.0,
    from: 80,
    to: 0,
    ease: EASE.outBack,
  });
  const slideOut = tween({
    t,
    start: dur - 0.6,
    end: dur,
    from: 0,
    to: -40,
    ease: EASE.inOut,
  });
  const float = Math.sin(t * 1.4) * 6;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <MediaBackdrop
        src={backdropSrc}
        duration={dur}
        zoom={{ from: 1.04, to: 1.14 }}
        pan={{ x: [0.3, -0.3], y: [-0.2, 0.2] }}
        vignette={0.7}
        tint={backdropTint}
        tintOpacity={0.5}
        fadeIn={0.4}
        fadeOut={0.4}
      />

      {/* Beat label, left side */}
      <AbsoluteFill
        style={{
          padding: "6% 6%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <div style={{ maxWidth: "44%" }}>
          <div
            style={{
              display: "inline-flex",
              gap: 12,
              alignItems: "center",
              padding: "8px 14px",
              background: "rgba(0,0,0,0.4)",
              border: "1px solid rgba(213,209,173,0.32)",
              borderRadius: 999,
              backdropFilter: "blur(8px)",
              fontFamily: F.mono,
              fontSize: 14,
              letterSpacing: "0.3em",
              color: C.goldHi,
              textTransform: "uppercase",
              marginBottom: 22,
              opacity: tween({ t, start: 0.1, end: 0.7, from: 0, to: 1 }),
            }}
          >
            <span style={{ color: C.gold }}>●</span>
            <span>MOD · {modeTr}</span>
          </div>
          <KineticHeadline
            start={0.25}
            stagger={0.06}
            lines={[
              {
                text: label,
                font: "serif",
                size: 92,
                color: C.cream,
                weight: 300,
              },
            ]}
          />
          <div
            style={{
              fontFamily: F.script,
              fontStyle: "italic",
              fontSize: 36,
              color: C.goldHi,
              letterSpacing: "0.04em",
              marginTop: 12,
              opacity: tween({ t, start: 0.7, end: 1.4, from: 0, to: 1 }),
            }}
          >
            {subhead}
          </div>
        </div>
      </AbsoluteFill>

      {/* Right-side canvas card */}
      <div
        style={{
          position: "absolute",
          right: "6%",
          top: "50%",
          transform: `translateY(calc(-50% + ${float}px)) translateX(${slideIn + slideOut}px)`,
          width: cardW,
          height: cardH,
          borderRadius: 18,
          overflow: "hidden",
          boxShadow:
            "0 40px 100px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(213,209,173,0.18)",
        }}
      >
        <HtmlCanvasInvitation
          width={cardW}
          height={cardH}
          start={0}
          durationSec={dur}
          mode={mode}
        />
      </div>

      <Frame tone="dark" stage={`MOD · ${modeTr}`} role="TUVAL" />
    </AbsoluteFill>
  );
};

// ── Showcase end ────────────────────────────────────────────────────────────
const ShowcaseEnd: React.FC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  const t = useSeconds();
  return (
    <AbsoluteFill style={{ background: C.bgDark }}>
      <MediaBackdrop
        src={HERO_VIDEOS.crystalBox}
        duration={3}
        zoom={{ from: 1.0, to: 1.06 }}
        pan={{ x: [0, 0], y: [0, 0] }}
        vignette={0.7}
        tint="#000"
        tintOpacity={0.7}
        fadeIn={0.4}
        fadeOut={0.5}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 24,
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
