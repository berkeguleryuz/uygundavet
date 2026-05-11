import React from "react";
import { Img, OffthreadVideo, staticFile } from "remotion";
import { THEMES, Theme } from "../style/themes";
import { tween, useSeconds, EASE } from "../style/ease";
import { F } from "../style/fonts";
import { C } from "../style/colors";

type Props = {
  start?: number;
  rows?: number;
  cols?: number;
  gap?: number;
  // Optional override of which theme to spotlight (full-bleed) at a given time.
  spotlight?: { themeKey: string; from: number; to: number };
  cardStyle?: React.CSSProperties;
  showTaglines?: boolean;
};

// Asymmetric editorial mosaic of all 8 themes. Cards rise in random order,
// each settling into a slight Polaroid tilt. A single card can be promoted
// to full-bleed via `spotlight` for a hero moment.
export const ThemeMosaic: React.FC<Props> = ({
  start = 0,
  rows = 4,
  cols = 2,
  gap = 24,
  spotlight,
  cardStyle,
  showTaglines = true,
}) => {
  const t = useSeconds();
  const order = [4, 1, 6, 2, 0, 7, 3, 5]; // shuffled reveal order
  const tilts = [-2.4, 1.6, -1.1, 2.2, -1.8, 0.9, -0.6, 2.0];

  const items = THEMES.slice(0, rows * cols);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap,
        padding: 64,
      }}
    >
      {items.map((theme, idx) => {
        const revealOrder = order[idx] ?? idx;
        const localStart = start + revealOrder * 0.13;
        const op = tween({
          t,
          start: localStart,
          end: localStart + 0.5,
          from: 0,
          to: 1,
          ease: EASE.outExpo,
        });
        const ty = tween({
          t,
          start: localStart,
          end: localStart + 0.7,
          from: 36,
          to: 0,
          ease: EASE.outExpo,
        });
        const tilt = tilts[idx % tilts.length];

        // Spotlight transformation: scale up, lose tilt, dim others.
        let spotScale = 1;
        let spotZ = 1;
        let othersDim = 1;
        if (spotlight && t >= spotlight.from && t <= spotlight.to) {
          const local = (t - spotlight.from) / (spotlight.to - spotlight.from);
          const eased = EASE.inOutSine(Math.min(1, Math.max(0, local)));
          if (theme.key === spotlight.themeKey) {
            spotScale = 1 + eased * 0.18;
            spotZ = 10;
          } else {
            othersDim = 1 - eased * 0.65;
          }
        }

        return (
          <ThemeCard
            key={theme.key}
            theme={theme}
            opacity={op * othersDim}
            ty={ty}
            tilt={tilt * (1 - (spotZ > 1 ? 1 : 0))}
            scale={spotScale}
            zIndex={spotZ}
            showTagline={showTaglines}
            extraStyle={cardStyle}
          />
        );
      })}
    </div>
  );
};

type CardProps = {
  theme: Theme;
  opacity: number;
  ty: number;
  tilt: number;
  scale: number;
  zIndex: number;
  showTagline: boolean;
  extraStyle?: React.CSSProperties;
};

const ThemeCard: React.FC<CardProps> = ({
  theme,
  opacity,
  ty,
  tilt,
  scale,
  zIndex,
  showTagline,
  extraStyle,
}) => {
  return (
    <div
      style={{
        position: "relative",
        opacity,
        transform: `translate3d(0, ${ty}px, 0) rotate(${tilt}deg) scale(${scale})`,
        transformOrigin: "center",
        zIndex,
        background: C.paper,
        border: `1px solid ${C.line}`,
        borderRadius: 14,
        padding: 14,
        boxShadow:
          "0 18px 40px rgba(20,16,12,0.18), 0 4px 10px rgba(20,16,12,0.10)",
        overflow: "hidden",
        ...extraStyle,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        {theme.isImage ? (
          <Img
            src={staticFile(theme.src)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <OffthreadVideo
            src={staticFile(theme.src)}
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        )}
        {/* Color wash, very subtle, to lock palette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, transparent 55%, ${theme.accent}33 100%)`,
            mixBlendMode: "multiply",
          }}
        />
        {/* Caption strip */}
        <div
          style={{
            position: "absolute",
            left: 16,
            bottom: 14,
            right: 16,
            display: "flex",
            alignItems: "baseline",
            gap: 12,
          }}
        >
          <span
            style={{
              fontFamily: F.serif,
              fontSize: 28,
              fontWeight: 500,
              color: C.white,
              textShadow: "0 2px 14px rgba(0,0,0,0.55)",
              letterSpacing: "-0.01em",
            }}
          >
            {theme.name}
          </span>
          {showTagline ? (
            <span
              style={{
                fontFamily: F.mono,
                fontSize: 11,
                color: "rgba(255,255,255,0.78)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                textShadow: "0 1px 6px rgba(0,0,0,0.55)",
              }}
            >
              {theme.tagline}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};
