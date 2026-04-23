"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { InvitationCard, type InvitationCardProps } from "./InvitationCard";

/**
 * Wedding invitation envelope with davetli.com-style reveal flow.
 *
 *   front → flipping (rotateY 180°) → back → opening (flap lifts) → out (card appears)
 *
 * Mobile-first: the card REPLACES the envelope at the same position.
 * On ≥md screens the card can sit to the left of the envelope (side-by-side).
 */

export type WeddingEnvelopeStage =
  | "front"
  | "flipping"
  | "back"
  | "opening"
  | "out";

export interface WeddingEnvelopeProps {
  guestName?: string;
  /** Base envelope width; scales responsively via container. */
  envelopeWidth?: number;
  cardWidth?: number;
  cardHeight?: number;
  envelopeColor?: string;
  flapColor?: string;
  liningPattern?: "daisy" | "rose" | "gold" | "none" | "chevron";
  liningBg?: string;
  /** Card theme + content props. */
  cardProps?: InvitationCardProps;
  cardRender?: (props: { width: number; height: number }) => ReactNode;
  /** Decoration slots — per-variant visual customisation. */
  frontExtra?: ReactNode;
  backExtra?: ReactNode;
  /** Seal/medallion on the back flap's outside (fades when flap opens). */
  flapSeal?: ReactNode;
  /** Overlay border (air-mail stripes etc.) drawn on top of front face. */
  frontBorder?: ReactNode;
  /** Layout mode: "replace" = card takes envelope's spot; "side-by-side" = card left of envelope on ≥md. */
  layout?: "replace" | "side-by-side";
  className?: string;
}

export function WeddingEnvelope({
  guestName = "Misafir Adı",
  envelopeWidth = 440,
  cardWidth = 360,
  cardHeight = 680,
  envelopeColor = "#f5f1e8",
  flapColor,
  liningPattern = "daisy",
  liningBg = "#1f1c17",
  cardProps,
  cardRender,
  frontExtra,
  backExtra,
  flapSeal,
  frontBorder,
  layout = "replace",
  className,
}: WeddingEnvelopeProps) {
  const [stage, setStage] = useState<WeddingEnvelopeStage>("front");
  const [isWide, setIsWide] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const envelopeHeight = Math.round(envelopeWidth * 0.62);

  // Observe container width — switch to side-by-side on wide enough containers
  useEffect(() => {
    if (layout !== "side-by-side" || !wrapRef.current) return;
    const threshold = cardWidth + envelopeWidth + 60;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        setIsWide(e.contentRect.width >= threshold);
      }
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [layout, cardWidth, envelopeWidth]);

  const handleStart = () => {
    if (stage !== "front") return;
    setStage("flipping");
    setTimeout(() => setStage("back"), 1000);
    setTimeout(() => setStage("opening"), 1200);
    setTimeout(() => setStage("out"), 1800);
  };
  const handleReset = () => setStage("front");

  const flipped = stage !== "front";
  const flapOpen = stage === "opening" || stage === "out";
  const cardOut = stage === "out";

  // Scene dimensions
  const sideBySide = layout === "side-by-side" && isWide;
  const gap = 28;
  const sceneWidth = sideBySide ? cardWidth + gap + envelopeWidth : Math.max(cardWidth, envelopeWidth);
  const sceneHeight = sideBySide ? Math.max(cardHeight, envelopeHeight) : cardOut ? cardHeight : envelopeHeight;

  // Envelope position within scene
  const envLeft = sideBySide ? cardWidth + gap : (sceneWidth - envelopeWidth) / 2;
  const envTop = sideBySide ? (sceneHeight - envelopeHeight) / 2 : 0;

  // Card position within scene
  const cardLeftFinal = sideBySide ? 0 : (sceneWidth - cardWidth) / 2;
  const cardLeftStart = envLeft + (envelopeWidth - cardWidth) / 2; // "behind" envelope
  const cardTopFinal = 0;
  const cardTopStart = envTop + (envelopeHeight - cardHeight) / 2;

  return (
    <div
      ref={wrapRef}
      className={`relative mx-auto ${className ?? ""}`}
      style={{
        width: "100%",
        maxWidth: sceneWidth,
        height: sceneHeight,
        transition: "height 0.7s cubic-bezier(0.7, 0, 0.2, 1)",
      }}
    >
      {/* Card — positioned absolutely, fades in + moves to final spot */}
      <div
        className="absolute"
        style={{
          width: cardWidth,
          height: cardHeight,
          left: cardOut ? cardLeftFinal : cardLeftStart,
          top: cardOut ? cardTopFinal : cardTopStart,
          opacity: cardOut ? 1 : 0,
          transform: cardOut ? "scale(1)" : "scale(0.85)",
          transition:
            "left 0.8s cubic-bezier(0.7, 0, 0.2, 1), top 0.8s cubic-bezier(0.7, 0, 0.2, 1), opacity 0.55s ease-out, transform 0.8s cubic-bezier(0.7, 0, 0.2, 1)",
          zIndex: cardOut ? 3 : 1,
          pointerEvents: cardOut ? "auto" : "none",
        }}
      >
        {cardRender
          ? cardRender({ width: cardWidth, height: cardHeight })
          : <InvitationCard width={cardWidth} height={cardHeight} {...cardProps} />}
      </div>

      {/* Envelope — flips around Y axis */}
      <div
        className="absolute"
        style={{
          left: envLeft,
          top: envTop,
          width: envelopeWidth,
          height: envelopeHeight,
          perspective: "1800px",
          zIndex: 2,
          opacity: !sideBySide && cardOut ? 0 : 1,
          pointerEvents: !sideBySide && cardOut ? "none" : "auto",
          transition: "opacity 0.4s ease-out, left 0.7s cubic-bezier(0.7, 0, 0.2, 1), top 0.7s cubic-bezier(0.7, 0, 0.2, 1)",
        }}
      >
        <div
          className="relative w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transition: "transform 1s cubic-bezier(0.7, 0, 0.2, 1)",
          }}
        >
          <EnvelopeFront
            width={envelopeWidth}
            height={envelopeHeight}
            bg={envelopeColor}
            guestName={guestName}
            onOpen={handleStart}
            extra={frontExtra}
            border={frontBorder}
          />
          <EnvelopeBack
            width={envelopeWidth}
            height={envelopeHeight}
            bg={envelopeColor}
            flapColor={flapColor ?? envelopeColor}
            flapOpen={flapOpen}
            liningPattern={liningPattern}
            liningBg={liningBg}
            extra={backExtra}
            flapSeal={flapSeal}
          />
        </div>
      </div>

      {/* Reset button */}
      {stage === "out" ? (
        <button
          onClick={handleReset}
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground cursor-pointer border border-border rounded-full px-4 py-1.5 bg-white z-10"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          Tekrar Oynat
        </button>
      ) : null}
    </div>
  );
}

/* =====================================================================
 * Envelope Front
 * ===================================================================== */
function EnvelopeFront({
  width,
  height,
  bg,
  guestName,
  onOpen,
  extra,
  border,
}: {
  width: number;
  height: number;
  bg: string;
  guestName: string;
  onOpen: () => void;
  extra?: ReactNode;
  border?: ReactNode;
}) {
  return (
    <div
      className="absolute inset-0 overflow-hidden cursor-pointer"
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        background: bg,
        backgroundImage:
          "repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 0 1px, transparent 1px 5px)",
        borderRadius: 4,
        boxShadow:
          "0 10px 30px -8px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(0,0,0,0.05)",
      }}
      onClick={onOpen}
    >
      {/* Optional border overlay (air-mail stripes etc.) */}
      {border}

      {/* Stamp area top-right (dashed square) */}
      <div
        className="absolute"
        style={{
          top: "10%",
          right: "8%",
          width: Math.round(width * 0.15),
          height: Math.round(width * 0.15),
          border: "2px dashed rgba(60, 120, 160, 0.55)",
          borderRadius: 3,
        }}
      />

      {/* Content bottom-left */}
      <div
        className="absolute"
        style={{
          bottom: "12%",
          left: "8%",
          color: "#2a2420",
          fontFamily: "Merienda, serif",
          maxWidth: "70%",
        }}
      >
        <div className="text-lg italic mb-1 leading-tight">
          Sayın <span className="font-medium">{guestName}</span>,
        </div>
        <div className="text-sm italic opacity-85 mb-3 leading-tight">
          Bir etkinliğe davet edildiniz.
        </div>
        <div
          className="inline-block px-3 py-1.5 text-sm italic rounded border-2"
          style={{
            borderColor: "#2a2420",
            color: "#2a2420",
          }}
        >
          Davetiyeyi Görüntüle
        </div>
      </div>

      {/* Extra decorations (stamps, stickers) */}
      {extra}
    </div>
  );
}

/* =====================================================================
 * Envelope Back
 * ===================================================================== */
function EnvelopeBack({
  width,
  height,
  bg,
  flapColor,
  flapOpen,
  liningPattern,
  liningBg,
  extra,
  flapSeal,
}: {
  width: number;
  height: number;
  bg: string;
  flapColor: string;
  flapOpen: boolean;
  liningPattern: "daisy" | "rose" | "gold" | "none" | "chevron";
  liningBg: string;
  extra?: ReactNode;
  flapSeal?: ReactNode;
}) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: "rotateY(180deg)",
        background: bg,
        backgroundImage:
          "repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 0 1px, transparent 1px 5px)",
        borderRadius: 4,
        boxShadow:
          "0 10px 30px -8px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(0,0,0,0.05)",
      }}
    >
      {/* Back body — uniform envelope color */}
      <div
        className="absolute inset-0"
        style={{ background: bg, zIndex: 1 }}
      />
      {/* V-seam crease lines — very subtle, only show the paper fold structure */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        style={{ zIndex: 1 }}
      >
        <path
          d="M 0 0 L 50 50 M 100 0 L 50 50 M 0 100 L 50 50 M 100 100 L 50 50"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth="0.15"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Extra decorations behind flap */}
      {extra}

      {/* Lining triangle — revealed when top flap collapses */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: "polygon(0 0, 100% 0, 50% 50%)",
          background: liningBg,
          zIndex: 3,
        }}
      >
        <LiningPattern kind={liningPattern} />
      </div>

      {/* Top flap — cream outer face, collapses on open */}
      <div
        className="absolute inset-0"
        style={{
          background: flapColor,
          clipPath: flapOpen
            ? "polygon(0 0, 100% 0, 50% 0)"
            : "polygon(0 0, 100% 0, 50% 50%)",
          transition: "clip-path 0.55s cubic-bezier(0.7, 0, 0.2, 1)",
          boxShadow: flapOpen ? "none" : "inset 0 -8px 12px rgba(0,0,0,0.08)",
          zIndex: 4,
        }}
      />

      {/* Flap seal (wax seal / monogram) — sits on outer flap, fades when flap opens */}
      {flapSeal ? (
        <div
          className="absolute"
          style={{
            left: "50%",
            top: "30%",
            transform: `translate(-50%, -50%) scale(${flapOpen ? 0 : 1}) rotate(${
              flapOpen ? 180 : 0
            }deg)`,
            opacity: flapOpen ? 0 : 1,
            transition:
              "transform 0.5s cubic-bezier(0.7, 0, 0.2, 1), opacity 0.4s ease-out",
            zIndex: 5,
          }}
        >
          {flapSeal}
        </div>
      ) : null}
    </div>
  );
}

/* =====================================================================
 * Lining patterns
 * ===================================================================== */
function LiningPattern({
  kind,
}: {
  kind: "daisy" | "rose" | "gold" | "none" | "chevron";
}) {
  if (kind === "none") return null;

  if (kind === "gold") {
    return (
      <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <g stroke="#d4b886" strokeWidth="1.2" fill="none" opacity="0.85">
          {Array.from({ length: 6 }).map((_, i) => {
            const x = 20 + i * 32;
            return (
              <g key={i} transform={`translate(${x}, 40)`}>
                <path d="M 0 0 Q -10 -15 -20 -5 Q -25 10 -10 15 Q 5 12 0 0 Z" />
                <path d="M 0 0 Q 10 -15 20 -5 Q 25 10 10 15 Q -5 12 0 0 Z" />
                <circle cx="0" cy="0" r="2" fill="#d4b886" />
              </g>
            );
          })}
        </g>
      </svg>
    );
  }

  if (kind === "rose") {
    return (
      <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        {Array.from({ length: 18 }).map((_, i) => {
          const x = 10 + (i % 6) * 32;
          const y = 15 + Math.floor(i / 6) * 30;
          return (
            <g key={i} transform={`translate(${x},${y})`}>
              <circle r="10" fill="#d88189" opacity="0.9" />
              <circle r="7" fill="#c26470" />
              <circle r="4" fill="#a94a58" />
            </g>
          );
        })}
      </svg>
    );
  }

  if (kind === "chevron") {
    return (
      <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <pattern id="chev" width="18" height="10" patternUnits="userSpaceOnUse">
            <path d="M 0 10 L 9 0 L 18 10" fill="none" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1.5" />
          </pattern>
        </defs>
        <rect width="200" height="100" fill="url(#chev)" />
      </svg>
    );
  }

  // daisy
  return (
    <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="dl" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbe06a" />
          <stop offset="100%" stopColor="#d48f1e" />
        </radialGradient>
      </defs>
      {Array.from({ length: 18 }).map((_, i) => {
        const x = 15 + (i % 6) * 32 + (Math.floor(i / 6) % 2) * 14;
        const y = 15 + Math.floor(i / 6) * 28;
        return (
          <g key={i} transform={`translate(${x},${y})`}>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <ellipse
                key={a}
                rx="3.5"
                ry="9"
                cx="0"
                cy="-7"
                fill="#ffffff"
                stroke="#d4b886"
                strokeWidth="0.4"
                transform={`rotate(${a})`}
              />
            ))}
            <circle r="3" fill="url(#dl)" />
          </g>
        );
      })}
    </svg>
  );
}

/* =====================================================================
 * Seal primitives — used by variants to decorate the back flap
 * ===================================================================== */

export function WaxSeal({
  letter = "D",
  color = "#a8323d",
  dark = "#6b1c23",
  text = "#f5d5cf",
  size = 52,
}: {
  letter?: string;
  color?: string;
  dark?: string;
  text?: string;
  size?: number;
}) {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 30%, ${color}, ${dark} 75%)`,
        boxShadow:
          "0 4px 8px rgba(0,0,0,0.35), inset 0 -4px 6px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.18)",
        color: text,
        fontFamily: "Merienda, serif",
        fontStyle: "italic",
        fontSize: size * 0.42,
        lineHeight: 1,
      }}
    >
      {letter}
    </div>
  );
}

export function PillSeal({
  letter = "D",
  color = "#f97316",
  dark = "#c2410c",
  text = "#7c2d12",
  border = "#7c2d12",
  size = 44,
}: {
  letter?: string;
  color?: string;
  dark?: string;
  text?: string;
  border?: string;
  size?: number;
}) {
  return (
    <div
      className="flex items-center justify-center font-semibold text-xs"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 25%, ${color}, ${dark} 80%)`,
        color: text,
        clipPath:
          "polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)",
        border: `3px solid ${border}`,
      }}
    >
      {letter}
    </div>
  );
}

export function MonogramSeal({
  letter = "D",
  gold = "#d4b886",
  size = 60,
}: {
  letter?: string;
  gold?: string;
  size?: number;
}) {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `2px solid ${gold}`,
        color: gold,
        fontFamily: "Merienda, serif",
        fontStyle: "italic",
        fontSize: size * 0.5,
        lineHeight: 1,
        background: "rgba(212,184,134,0.08)",
        textShadow: "0 1px 2px rgba(0,0,0,0.5)",
      }}
    >
      {letter}
    </div>
  );
}

