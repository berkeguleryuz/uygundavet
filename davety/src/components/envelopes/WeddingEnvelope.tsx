"use client";

import { useState, type ReactNode } from "react";
import { InvitationCard, type InvitationCardProps } from "./InvitationCard";

/**
 * Wedding envelope reveal with proper 3D flip + card emerge.
 *
 * Scene layout (card slides up from below scene through envelope):
 *   ┌─────────────────────┐ scene top (y=0)
 *   │   Card top (names)  │ ← visible ABOVE envelope (final state)
 *   ├─────────────────────┤
 *   │  Envelope (V-pocket)│ ← flip container, covers middle of card
 *   ├─────────────────────┤
 *   │  Card bottom        │ ← visible BELOW envelope (final state)
 *   └─────────────────────┘ scene bottom
 *
 * Z-stack:
 *   • Card                      z = 50   (behind envelope, visible outside envelope bounds)
 *   • Flip container             z = 100  (envelope, isolates stacking)
 *     ├─ Front face (rotateY 0)           guest name + button + stamp
 *     └─ Back scene (rotateY 180)         V-pocket envelope
 *         ├─ body bg               z=0
 *         ├─ top flap              z=1   (closed V → open V with lining)
 *         └─ pocket triangles      z=99  (always in front, form V-pocket)
 *
 * Flow:
 *   1. closed:    front face visible, card BELOW scene (clipped by overflow)
 *   2. flipping:  flip container rotates Y 180°. Front face fades (backface hidden).
 *                 Back scene is inside same container at rotateY(180) — becomes visible
 *                 ONLY AFTER 90° of rotation (backface hidden prevents early show).
 *   3. emerging:  after flip completes, card translates UP from below scene to natural
 *                 position. Card passes through envelope area (hidden inside envelope
 *                 bounds because flip container z=100 covers it). Card visible above
 *                 and below envelope.
 *   4. done:      card at natural position (top at scene top, bottom at scene bottom).
 */

export type WeddingEnvelopeStage =
  | "closed"
  | "flipping"
  | "emerging"
  | "done";

export interface StampConfig {
  color?: string;
  textColor?: string;
  label?: string;
  image?: string;
  borderStyle?: "dashed" | "solid" | "perforated";
  size?: number;
}

export interface WeddingEnvelopeProps {
  guestName?: string;
  envelopeWidth?: number;
  cardWidth?: number;
  cardHeight?: number;
  envelopeColor?: string;
  flapColor?: string;
  liningPattern?: "daisy" | "rose" | "gold" | "none" | "chevron";
  liningBg?: string;
  cardProps?: InvitationCardProps;
  cardRender?: (props: { width: number; height: number }) => ReactNode;
  backStyle?: "flat" | "shaded";
  stamp?: StampConfig | null | false;
  frontExtra?: ReactNode;
  backExtra?: ReactNode;
  flapSeal?: ReactNode;
  frontBorder?: ReactNode;
  layout?: "replace" | "side-by-side";
  className?: string;
}

export function WeddingEnvelope({
  guestName = "Misafir Adı",
  envelopeWidth = 420,
  cardWidth = 340,
  cardHeight = 640,
  envelopeColor = "#f5f1e8",
  flapColor,
  liningPattern = "daisy",
  liningBg = "#1f1c17",
  cardProps,
  cardRender,
  backStyle = "flat",
  stamp,
  frontExtra,
  backExtra,
  flapSeal,
  frontBorder,
  className,
}: WeddingEnvelopeProps) {
  const [stage, setStage] = useState<WeddingEnvelopeStage>("closed");

  const envelopeHeight = Math.round(envelopeWidth * 0.62);
  // Inner scene exactly contains card + envelope (envelope pinned to inner
  // bottom so card can never poke out below piece 1). Outer wrapper adds top
  // and bottom breathing room without exposing the card under the envelope.
  const sceneTopPad = 48;
  const sceneBottomPad = 80;
  const sceneSidePad = 32;
  const sceneWidth = Math.max(cardWidth, envelopeWidth) + sceneSidePad * 2;
  const innerSceneHeight = cardHeight + sceneTopPad;
  const sceneHeight = innerSceneHeight + sceneBottomPad;
  const envelopeTop = innerSceneHeight - envelopeHeight;

  const handleOpen = () => {
    if (stage !== "closed") return;
    // Timeline:
    //   0.0s  click → Y-flip begins (1s duration)
    //   1.0s  Y-flip fully done → flap starts lifting (1s, finishes at 2.0s)
    //   3.0s  1-second pause after flap open, card begins emerging (2s)
    //   5.0s  card settled → stage "done" (reset button appears)
    setStage("flipping");
    setTimeout(() => setStage("emerging"), 3000);
    setTimeout(() => setStage("done"), 5000);
  };
  const handleReset = () => setStage("closed");

  const flipped = stage !== "closed";
  const cardEmerging =
    stage === "emerging" || stage === "done";

  const actualFlapColor = flapColor ?? envelopeColor;

  // Shaded variant colors
  const shadedTop = darken(envelopeColor, 0.05);
  const shadedBottom = darken(envelopeColor, 0.05);
  const shadedLeft = darken(envelopeColor, 0.02);
  const shadedRight = darken(envelopeColor, 0.02);

  const leftTriColor = backStyle === "shaded" ? shadedLeft : envelopeColor;
  const rightTriColor = backStyle === "shaded" ? shadedRight : envelopeColor;
  const bottomTriColor = backStyle === "shaded" ? shadedBottom : envelopeColor;
  // Flap paper color (both the closed-state outer face and the opened
  // inner face's paper border). This is what the user controls via
  // "Kapak Rengi" in the editor — leaving it unused was the reason
  // changing the colour did nothing visible.
  const flapPaperColor =
    backStyle === "shaded" ? shadedTop : actualFlapColor;

  const textColor = isLight(envelopeColor) ? "#2a2420" : "#f3ecdc";

  // Card starts INSIDE envelope (translateY = envelopeTop so card's top aligns
  // with envelope's top, meaning card is "tucked in" envelope). As it animates
  // to translateY=sceneTopPad, card slides up and emerges, resting with its
  // top at the scene's top-padding line (not flush with scene edge).
  const cardTranslateStart = envelopeTop;
  const cardTranslateEnd = sceneTopPad;

  return (
    <div
      className={`relative mx-auto ${className ?? ""}`}
      style={{
        width: "100%",
        maxWidth: sceneWidth,
        height: sceneHeight,
      }}
    >
    <div
      className="relative"
      style={{
        width: "100%",
        height: innerSceneHeight,
        perspective: "900px",
        perspectiveOrigin: "50% 40%",
      }}
    >
      {/* ─── FLIP CONTAINER (z=100) — isolated stacking, Y-rotates ─── */}
      <div
        onClick={handleOpen}
        className="absolute left-1/2"
        style={{
          top: envelopeTop,
          width: envelopeWidth,
          height: envelopeHeight,
          transform: `translateX(-50%) ${
            flipped ? "rotateY(180deg)" : "rotateY(0deg)"
          }`,
          transformStyle: "preserve-3d",
          transition: "transform 1s cubic-bezier(0.7, 0, 0.2, 1)",
          zIndex: 100,
          cursor: flipped ? "default" : "pointer",
          pointerEvents: flipped ? "none" : "auto",
        }}
      >
        {/* ══ FRONT FACE (rotateY 0) ══ */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            backgroundColor: envelopeColor,
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 0 1px, transparent 1px 5px)",
            borderRadius: 4,
            boxShadow:
              "0 10px 30px -8px rgba(0,0,0,0.22), inset 0 0 0 1px rgba(0,0,0,0.05)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {frontBorder}
          {/* Preset decorations (twine, ribbon, kraft texture, postal stamp,
              window cutout, etc.) belong on the address side of a real
              envelope. Rendering them here — and stacking the address
              text on top with z-index — keeps the chosen visual treatment
              while keeping the guest name + CTA readable. */}
          {frontExtra}
          {stamp ? (
            <Stamp config={stamp} envelopeWidth={envelopeWidth} envelopeBg={envelopeColor} />
          ) : null}
          <div
            className="absolute"
            style={{
              bottom: "10%",
              left: "6%",
              color: textColor,
              fontFamily: "Merienda, serif",
              maxWidth: "72%",
              padding: "10px 14px",
              borderRadius: 6,
              // Soft same-tone backdrop so the guest name + CTA stay
              // legible even when a preset's decorations (twine, ribbon,
              // borders, kraft texture) cross the address area.
              background: `${envelopeColor}d9`,
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
              zIndex: 8,
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
              style={{ borderColor: textColor, color: textColor }}
            >
              Davetiyeyi Görüntüle
            </div>
          </div>
        </div>

        {/* ══ BACK SCENE (rotateY 180) — V-pocket envelope ══ */}
        <div
          className="absolute inset-0"
          style={{
            transform: "rotateY(180deg)",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            backgroundColor: envelopeColor,
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 0 1px, transparent 1px 5px)",
            borderRadius: 4,
            boxShadow:
              "0 10px 30px -8px rgba(0,0,0,0.22), inset 0 0 0 1px rgba(0,0,0,0.05)",
          }}
        >
          {backExtra}

          {/* Lining base (piece 4 — static pocket interior). Lives underneath
               the flap (piece 5). Starts rendered in envelope cream so nothing
               patterned bleeds through during the Y-flip. When piece 5 begins
               its 180° lift at t=1s, piece 4 crossfades to the lining colour
               and the pattern fades in at the same instant — so the inside of
               the envelope only "wakes up" as the flap actually rises. */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              clipPath: "polygon(50% 50%, 100% 0, 0 0)",
              backgroundColor: flipped ? liningBg : envelopeColor,
              zIndex: 1,
              boxShadow: "inset 0 6px 14px rgba(0,0,0,0.2)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transition: flipped
                ? "background-color 0.25s linear 1s"
                : "background-color 0.1s linear",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                opacity: flipped ? 1 : 0,
                transition: flipped
                  ? "opacity 0.25s linear 1s"
                  : "opacity 0.1s linear",
              }}
            >
              <LiningPattern kind={liningPattern} />
            </div>
          </div>

          {/* ─── CARD WRAPPER (z=50) — clips card at envelope bottom so the
                   card never peeks below piece 1, while the envelope itself is
                   free to extend during 3D rotation. ─── */}
          <div
            className="absolute left-1/2 overflow-hidden"
            style={{
              top: -envelopeTop,
              width: cardWidth,
              height: innerSceneHeight,
              transform: "translateX(-50%)",
              zIndex: 50,
              pointerEvents: "none",
            }}
          >
            <div
              className="absolute left-0 right-0"
              style={{
                top: 0,
                height: cardHeight,
                transform: `translateY(${
                  cardEmerging ? cardTranslateEnd : cardTranslateStart
                }px)`,
                opacity: cardEmerging ? 1 : 0,
                transition: cardEmerging
                  ? "transform 2s cubic-bezier(0.45, 0, 0.15, 1), opacity 0.2s ease-out"
                  : "opacity 0.1s",
                pointerEvents: stage === "done" ? "auto" : "none",
              }}
            >
              {cardRender
                ? cardRender({ width: cardWidth, height: cardHeight })
                : <InvitationCard width={cardWidth} height={cardHeight} {...cardProps} />}
            </div>
          </div>

          {/* ─── FLAP (piece 4) ─── closed = cream paper triangle covering the
                   V-opening (piece 5). Rotates -180° on top hinge to lift up;
                   back face (lining pattern) is revealed as it opens. Sits at
                   z=40 — above lining (z=1), below card (z=50). Opacity gated
                   so the inner face doesn't bleed through during the Y-flip. ─── */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: 0,
              left: 0,
              right: 0,
              height: "50%",
              transform: `rotateX(${flipped ? -180 : 0}deg)`,
              transformOrigin: "top center",
              transformStyle: "preserve-3d",
              opacity: flipped ? 1 : 0,
              transition: flipped
                ? "opacity 0.05s linear 0.5s, transform 1s cubic-bezier(0.34, 1.1, 0.64, 1) 1s"
                : "opacity 0.1s, transform 0.3s cubic-bezier(0.5, 0, 0.5, 1)",
              zIndex: 40,
            }}
          >
            {/* Outer face — flap paper, visible when closed (top triangle
                 of the front of the envelope) */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                backgroundColor: flapPaperColor,
                backgroundImage:
                  "repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 0 1px, transparent 1px 5px)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                boxShadow: "inset 0 -2px 6px rgba(0,0,0,0.12)",
              }}
            >
              {flapSeal ? (
                <div
                  className="absolute"
                  style={{
                    left: "50%",
                    top: "40%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {flapSeal}
                </div>
              ) : null}
            </div>
            {/* Inner face — lining, revealed after the flap folds -180°.
                 The face is rotateX(180) relative to the flap; clipPath is
                 UP-pointing in local coords so after the cascade of rotations
                 lands it facing the viewer, the triangle's apex sits at the top
                 and the base sits at the hinge (matches a real opened flap). */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(0 100%, 100% 100%, 50% 0)",
                transform: "rotateX(180deg)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                backgroundColor: flapPaperColor,
                backgroundImage:
                  "repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 0 1px, transparent 1px 5px)",
              }}
            >
              <div
                className="absolute overflow-hidden"
                style={{
                  top: "8%",
                  left: "5%",
                  right: "5%",
                  bottom: "5%",
                  clipPath: "polygon(0 100%, 100% 100%, 50% 0)",
                  background: liningBg,
                }}
              >
                <LiningPattern kind={liningPattern} />
              </div>
            </div>
          </div>

          {/* LEFT pocket triangle */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: leftTriColor,
              clipPath: "polygon(0 0, 50% 50%, 0 100%)",
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 0 1px, transparent 1px 5px)",
              zIndex: 99,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          />
          {/* RIGHT pocket triangle */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: rightTriColor,
              clipPath: "polygon(100% 0, 100% 100%, 50% 50%)",
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 0 1px, transparent 1px 5px)",
              zIndex: 99,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          />
          {/* BOTTOM pocket triangle */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: bottomTriColor,
              clipPath: "polygon(0 100%, 50% 50%, 100% 100%)",
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 0 1px, transparent 1px 5px)",
              zIndex: 99,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          />
          {/* V-seam crease lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
            style={{
              zIndex: 99,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <path
              d="M 0 0 L 50 50 L 100 0 M 0 100 L 50 50 L 100 100"
              stroke="rgba(0,0,0,0.14)"
              strokeWidth="0.25"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>

      {/* Reset button */}
      {stage === "done" ? (
        <button
          onClick={handleReset}
          className="absolute top-1 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground cursor-pointer border border-border rounded-full px-4 py-1.5 bg-white"
          style={{ fontFamily: "Space Grotesk, sans-serif", zIndex: 1200 }}
        >
          Tekrar Oynat
        </button>
      ) : null}
    </div>
    </div>
  );
}

/* ───── Lining patterns ───── */
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

/* ───── Stamp ───── */
function Stamp({
  config,
  envelopeWidth,
  envelopeBg,
}: {
  config: StampConfig;
  envelopeWidth: number;
  envelopeBg: string;
}) {
  const sizeRatio = config.size ?? 0.18;
  const w = Math.round(envelopeWidth * sizeRatio);
  const h = Math.round(w * 1.2);
  const borderStyle = config.borderStyle ?? "dashed";
  const isBgLight = isLight(envelopeBg);
  const defaultOutline = isBgLight
    ? "rgba(40, 40, 50, 0.45)"
    : "rgba(220, 220, 230, 0.55)";
  const outline = config.color ?? defaultOutline;
  const fill = config.color ?? "transparent";
  const textColor =
    config.textColor ??
    (config.color
      ? isLight(config.color)
        ? "#2a2420"
        : "#f8f3e6"
      : isBgLight
      ? "#2a2420"
      : "#f3ecdc");
  const isPerforated = borderStyle === "perforated";
  return (
    <div
      className="absolute pointer-events-none overflow-visible"
      style={{ top: "8%", right: "6%", width: w, height: h }}
    >
      {isPerforated ? (
        <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ overflow: "visible", display: "block" }}>
          <defs>
            <mask id={`perf-${w}-${h}`}>
              <rect x="0" y="0" width={w} height={h} fill="white" />
              {perforationHoles(w, h).map((c, i) => (
                <circle key={i} cx={c.x} cy={c.y} r={c.r} fill="black" />
              ))}
            </mask>
          </defs>
          <rect x="0" y="0" width={w} height={h} fill={fill === "transparent" ? envelopeBg : fill} mask={`url(#perf-${w}-${h})`} />
          <rect x="0" y="0" width={w} height={h} fill="none" stroke={outline} strokeWidth="0.5" mask={`url(#perf-${w}-${h})`} />
          {config.image ? (
            <image href={config.image} x={w * 0.1} y={h * 0.1} width={w * 0.8} height={h * 0.8} preserveAspectRatio="xMidYMid slice" mask={`url(#perf-${w}-${h})`} />
          ) : config.label ? (
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill={textColor} fontFamily="Merienda, serif" fontSize={w * 0.32} fontWeight="500">
              {config.label}
            </text>
          ) : null}
        </svg>
      ) : (
        <div
          className="flex items-center justify-center overflow-hidden w-full h-full"
          style={{
            background: fill,
            border: `2px ${borderStyle} ${outline}`,
            borderRadius: 3,
            boxShadow: config.color ? "0 2px 4px rgba(0,0,0,0.15)" : "none",
          }}
        >
          {config.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={config.image} alt="" className="w-full h-full object-cover" draggable={false} />
          ) : config.label ? (
            <span
              className="font-medium text-center leading-tight"
              style={{
                color: textColor,
                fontFamily: "Merienda, serif",
                fontSize: Math.round(w * 0.32),
                padding: 4,
              }}
            >
              {config.label}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}

function perforationHoles(
  w: number,
  h: number
): Array<{ x: number; y: number; r: number }> {
  const holes: Array<{ x: number; y: number; r: number }> = [];
  const holeR = Math.max(2, Math.round(Math.min(w, h) * 0.04));
  const spacing = holeR * 3;
  for (let x = spacing / 2; x <= w; x += spacing) {
    holes.push({ x, y: 0, r: holeR });
    holes.push({ x, y: h, r: holeR });
  }
  for (let y = spacing / 2; y <= h; y += spacing) {
    holes.push({ x: 0, y, r: holeR });
    holes.push({ x: w, y, r: holeR });
  }
  return holes;
}

/* ───── Seal primitives ───── */
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

function isLight(hex: string): boolean {
  const h = hex.replace("#", "");
  if (h.length !== 6) return true;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.55;
}

export function darken(hex: string, amount: number): string {
  const h = hex.replace("#", "");
  if (h.length !== 6) return hex;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const f = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v * (1 - amount))))
      .toString(16)
      .padStart(2, "0");
  return `#${f(r)}${f(g)}${f(b)}`;
}
