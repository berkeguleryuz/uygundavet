import React from "react";
import { F } from "../style/fonts";
import { C } from "../style/colors";
import { tween, useSeconds, EASE } from "../style/ease";

type Props = {
  start?: number;
  width?: number;
  height?: number;
  names?: { a: string; b: string };
  date?: string;
  venue?: string;
};

// A paper invitation RSVP card that slides in, then "tears" along a perforation
// and rotates apart. Tactile, editorial, instantly says "wedding".
export const RsvpRip: React.FC<Props> = ({
  start = 0,
  width = 720,
  height = 460,
  names = { a: "Tuana", b: "Ateş" },
  date = "26 · Eylül · 2026",
  venue = "İstanbul · Çırağan",
}) => {
  const t = useSeconds();

  const inProgress = tween({
    t,
    start,
    end: start + 0.9,
    from: 0,
    to: 1,
    ease: EASE.outBack,
  });
  const rip = tween({
    t,
    start: start + 1.6,
    end: start + 2.4,
    from: 0,
    to: 1,
    ease: EASE.outQuart,
  });
  const drift = tween({
    t,
    start: start + 2.4,
    end: start + 3.4,
    from: 0,
    to: 1,
    ease: EASE.inOut,
  });

  const enterY = (1 - inProgress) * 80;
  const enterRot = (1 - inProgress) * -3;
  const ripGap = rip * 90 + drift * 60;
  const ripRotL = rip * -8 + drift * -2;
  const ripRotR = rip * 8 + drift * 2;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        opacity: inProgress,
        transform: `translateY(${enterY}px) rotate(${enterRot}deg)`,
        filter: `drop-shadow(0 24px 60px rgba(20,16,12,0.32))`,
      }}
    >
      <Half
        side="left"
        width={width}
        height={height}
        names={names}
        date={date}
        venue={venue}
        gap={ripGap}
        rot={ripRotL}
      />
      <Half
        side="right"
        width={width}
        height={height}
        names={names}
        date={date}
        venue={venue}
        gap={ripGap}
        rot={ripRotR}
      />
      {/* Perforation indicator — barely visible, classy */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 12,
          bottom: 12,
          width: 0,
          borderLeft: `1px dashed ${C.line}`,
          opacity: rip > 0.05 ? 0 : 0.6,
          transition: "opacity 0.2s",
        }}
      />
    </div>
  );
};

type HalfProps = {
  side: "left" | "right";
  width: number;
  height: number;
  names: { a: string; b: string };
  date: string;
  venue: string;
  gap: number;
  rot: number;
};

const Half: React.FC<HalfProps> = ({
  side,
  width,
  height,
  names,
  date,
  venue,
  gap,
  rot,
}) => {
  const isLeft = side === "left";
  const x = isLeft ? -gap : gap;
  const w = width / 2;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        [isLeft ? "left" : "right"]: 0,
        width: w,
        height,
        background: C.paper,
        border: `1px solid ${C.line}`,
        borderRight: isLeft ? "none" : `1px solid ${C.line}`,
        borderLeft: isLeft ? `1px solid ${C.line}` : "none",
        borderRadius: isLeft ? "8px 0 0 8px" : "0 8px 8px 0",
        transform: `translateX(${x}px) rotate(${rot}deg)`,
        transformOrigin: isLeft ? "right center" : "left center",
        overflow: "hidden",
      }}
    >
      {/* Inner ornament frame */}
      <div
        style={{
          position: "absolute",
          inset: 18,
          border: `1px solid ${C.line}`,
          borderRadius: 4,
          opacity: 0.6,
        }}
      />

      {/* Content — shows fully on left half, peeks on right half */}
      <div
        style={{
          position: "absolute",
          inset: 36,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: C.ink,
        }}
      >
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 11,
            letterSpacing: "0.32em",
            color: C.mute,
            textTransform: "uppercase",
          }}
        >
          {isLeft ? "DAVETİYE №078" : "RSVP · KABUL"}
        </div>

        <div style={{ textAlign: "center" }}>
          {isLeft ? (
            <>
              <div
                style={{
                  fontFamily: F.serifSoft,
                  fontStyle: "italic",
                  fontSize: 34,
                  color: C.gold,
                  letterSpacing: "0.04em",
                }}
              >
                Düğünümüze Davetlisiniz
              </div>
              <div
                style={{
                  fontFamily: F.serif,
                  fontWeight: 300,
                  fontSize: 92,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.0,
                  marginTop: 14,
                }}
              >
                {names.a}
                <span
                  style={{
                    display: "block",
                    fontFamily: F.serifSoft,
                    fontStyle: "italic",
                    fontSize: 36,
                    color: C.gold,
                    margin: "10px 0",
                  }}
                >
                  &
                </span>
                {names.b}
              </div>
            </>
          ) : (
            <div
              style={{
                fontFamily: F.serifSoft,
                fontStyle: "italic",
                fontSize: 28,
                color: C.charcoal,
                opacity: 0.85,
              }}
            >
              Lütfen 12 Eylül'e dek
              <br />
              bize bildiriniz
            </div>
          )}
        </div>

        <div
          style={{
            fontFamily: F.mono,
            fontSize: 11,
            letterSpacing: "0.28em",
            color: C.mute,
            textTransform: "uppercase",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>{date}</span>
          <span>{venue}</span>
        </div>
      </div>

      {/* Stamp — only on left */}
      {isLeft ? (
        <div
          style={{
            position: "absolute",
            top: 30,
            right: 30,
            width: 78,
            height: 78,
            borderRadius: "50%",
            border: `2px solid ${C.gold}`,
            color: C.gold,
            fontFamily: F.mono,
            fontSize: 9,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "rotate(-12deg)",
            textAlign: "center",
            lineHeight: 1.2,
            opacity: 0.85,
          }}
        >
          UYGUN
          <br />
          DAVET
        </div>
      ) : null}
    </div>
  );
};
