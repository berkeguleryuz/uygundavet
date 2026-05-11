import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { C } from "../style/colors";
import { F } from "../style/fonts";
import { STILL_IMAGES } from "../style/themes";
import { tween, useSeconds } from "../style/ease";

type FrameProps = {
  stage?: string;
  step?: number;
  role?: string;
  tone?: "light" | "dark";
  showCrosshair?: boolean;
  showTimecode?: boolean;
  children?: React.ReactNode;
};

// Editorial chrome — corner brackets, stage badge, brand lockup.
// Designed to feel like a director's proof sheet, not a UI overlay.
export const Frame: React.FC<FrameProps> = ({
  stage,
  step,
  role,
  tone = "light",
  showCrosshair = false,
  showTimecode = true,
  children,
}) => {
  const t = useSeconds();
  const ink = tone === "dark" ? C.cream : C.ink;
  const mute = tone === "dark" ? "rgba(236,228,211,0.55)" : C.mute;
  const line = tone === "dark" ? "rgba(236,228,211,0.22)" : C.line;
  const badge = tone === "dark" ? "rgba(26,22,18,0.55)" : "rgba(255,255,255,0.65)";

  const chromeIn = tween({ t, start: 0.2, end: 1.0, from: 0, to: 1 });
  const tc = (t * 24).toFixed(0).padStart(4, "0");

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {children}

      {/* Corner brackets */}
      {[
        { top: 32, left: 32, rot: 0 },
        { top: 32, right: 32, rot: 90 },
        { bottom: 32, right: 32, rot: 180 },
        { bottom: 32, left: 32, rot: 270 },
      ].map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...p,
            width: 28,
            height: 28,
            opacity: chromeIn * 0.9,
            transform: `rotate(${p.rot}deg)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 18,
              height: 1.4,
              background: ink,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 1.4,
              height: 18,
              background: ink,
            }}
          />
        </div>
      ))}

      {/* Stage / step badge */}
      {stage ? (
        <div
          style={{
            position: "absolute",
            top: 56,
            left: 76,
            display: "flex",
            alignItems: "center",
            gap: 14,
            opacity: chromeIn,
            transform: `translateY(${(1 - chromeIn) * 8}px)`,
            fontFamily: F.mono,
            fontSize: 13,
            letterSpacing: "0.22em",
            color: mute,
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: C.gold, fontSize: 10 }}>●</span>
          {typeof step === "number" ? (
            <span style={{ color: ink }}>
              {String(step).padStart(2, "0")}
            </span>
          ) : null}
          <span style={{ width: 28, height: 1, background: line }} />
          <span>{stage}</span>
        </div>
      ) : null}

      {/* Role chip */}
      {role ? (
        <div
          style={{
            position: "absolute",
            top: 56,
            right: 76,
            opacity: chromeIn,
            transform: `translateY(${(1 - chromeIn) * 8}px)`,
            fontFamily: F.mono,
            fontSize: 12,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: ink,
            background: badge,
            border: `1px solid ${line}`,
            borderRadius: 999,
            padding: "9px 16px",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          {role}
        </div>
      ) : null}

      {/* Brand lockup bottom-left */}
      <div
        style={{
          position: "absolute",
          bottom: 56,
          left: 76,
          display: "flex",
          alignItems: "center",
          gap: 14,
          opacity: chromeIn,
        }}
      >
        <img
          src={staticFile(STILL_IMAGES.brandText)}
          alt="Uygun Davet"
          style={{
            height: 38,
            width: "auto",
            filter: tone === "dark" ? "brightness(1.3)" : "none",
          }}
        />
        <span
          style={{
            fontFamily: F.mono,
            fontSize: 11,
            color: mute,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
          }}
        >
          · dijital düğün davetiyesi
        </span>
      </div>

      {/* Timecode bottom-right */}
      {showTimecode ? (
        <div
          style={{
            position: "absolute",
            bottom: 56,
            right: 76,
            fontFamily: F.mono,
            fontSize: 11,
            letterSpacing: "0.22em",
            color: mute,
            textTransform: "uppercase",
            opacity: chromeIn,
          }}
        >
          UYGUN DAVET · TC {tc} · {new Date().getFullYear()}
        </div>
      ) : null}

      {/* Center crosshair */}
      {showCrosshair ? (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 38,
            height: 38,
            transform: "translate(-50%,-50%)",
            opacity: chromeIn * 0.35,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              width: "100%",
              height: 1,
              background: ink,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              height: "100%",
              width: 1,
              background: ink,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: `1px solid ${ink}`,
              borderRadius: "50%",
              opacity: 0.45,
            }}
          />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
