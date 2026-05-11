import React from "react";
import { HtmlInCanvas, type HtmlInCanvasOnPaint } from "remotion";
import { tween, useSeconds, EASE } from "../style/ease";
import { F } from "../style/fonts";
import { C } from "../style/colors";

type Props = {
  width: number;
  height: number;
  start?: number;
  // 0..1 across the scene — drives the effect intensity.
  durationSec: number;
  bride?: string;
  groom?: string;
  date?: string;
  venue?: string;
  // Effect mode — picks the canvas pipeline applied each paint.
  mode?: "shimmer" | "rgbShift" | "rippleFold" | "smokeReveal";
  fallbackMessage?: string;
};

// HTML-in-canvas showpiece. We render a fully-typed paper invitation as DOM,
// then let Remotion's experimental ctx.drawElementImage() resample it through
// a per-frame canvas pipeline. This produces effects that pure CSS can't —
// chromatic aberration, ripple folds, smoky reveals — while keeping the
// underlying type editorial-grade and selectable in markup.
//
// Requires Chrome Canary v149+ with chrome://flags/#canvas-draw-element
// enabled, and Remotion >=4.0.455. Renders on Lambda/Vercel/SSR via --gl=angle.
export const HtmlCanvasInvitation: React.FC<Props> = ({
  width,
  height,
  start = 0,
  durationSec,
  bride = "Tuana",
  groom = "Ateş",
  date = "26 · Eylül · 2026",
  venue = "İstanbul · Çırağan",
  mode = "shimmer",
  fallbackMessage = "Tuval üzerine HTML için Chrome Canary v149+ ve canvas-draw-element ayarı gerekir.",
}) => {
  const t = useSeconds();
  const localT = Math.max(0, t - start);
  const progress = Math.min(1, localT / durationSec);

  const onPaint = React.useCallback<HtmlInCanvasOnPaint>(
    ({ canvas, element, elementImage }) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("HtmlCanvasInvitation: no 2D context");

      ctx.reset();

      // Always draw a base paper-warm wash so even at 0 progress the canvas
      // matches the surrounding scene.
      const paper = ctx.createLinearGradient(0, 0, 0, canvas.height);
      paper.addColorStop(0, "#faf7f0");
      paper.addColorStop(1, "#ece4d3");
      ctx.fillStyle = paper;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (mode === "shimmer") {
        runShimmer(ctx, elementImage, element, progress);
      } else if (mode === "rgbShift") {
        runRgbShift(ctx, elementImage, element, progress);
      } else if (mode === "rippleFold") {
        runRippleFold(ctx, elementImage, element, progress, localT);
      } else if (mode === "smokeReveal") {
        runSmokeReveal(ctx, elementImage, element, progress, localT);
      }
    },
    [mode, progress, localT],
  );

  // SSR / non-Canary fallback. Static HTML invitation only, no canvas effects.
  if (
    typeof HtmlInCanvas === "undefined" ||
    (typeof HtmlInCanvas.isSupported === "function" &&
      !HtmlInCanvas.isSupported())
  ) {
    return (
      <div
        style={{
          width,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 18,
          background: C.paper,
          border: `1px solid ${C.line}`,
          color: C.charcoal,
          fontFamily: F.mono,
          fontSize: 14,
          letterSpacing: "0.18em",
          padding: 36,
          textAlign: "center",
        }}
      >
        <Card bride={bride} groom={groom} date={date} venue={venue} />
        <div style={{ marginTop: 24, opacity: 0.65 }}>{fallbackMessage}</div>
      </div>
    );
  }

  return (
    <HtmlInCanvas width={width} height={height} onPaint={onPaint}>
      <Card bride={bride} groom={groom} date={date} venue={venue} />
    </HtmlInCanvas>
  );
};

// ── Card markup ─────────────────────────────────────────────────────────────

type CardProps = {
  bride: string;
  groom: string;
  date: string;
  venue: string;
};

const Card: React.FC<CardProps> = ({ bride, groom, date, venue }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "transparent",
      color: C.ink,
      padding: 80,
      boxSizing: "border-box",
    }}
  >
    <div
      style={{
        position: "relative",
        width: "82%",
        maxWidth: 920,
        aspectRatio: "1.15 / 1",
        background: C.paper,
        border: `1px solid ${C.line}`,
        borderRadius: 12,
        boxShadow: "inset 0 0 0 6px rgba(184,153,104,0.08)",
        padding: "8% 9%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: F.mono,
          fontSize: 14,
          letterSpacing: "0.36em",
          textTransform: "uppercase",
          color: C.gold,
        }}
      >
        Tarihi · Not Edin
      </div>

      <div>
        <div
          style={{
            fontFamily: F.serifSoft,
            fontStyle: "italic",
            fontSize: 34,
            color: C.gold,
            letterSpacing: "0.05em",
          }}
        >
          siz ve ailenizi
        </div>
        <div
          style={{
            fontFamily: F.serif,
            fontWeight: 300,
            fontSize: 132,
            letterSpacing: "-0.03em",
            lineHeight: 0.95,
            margin: "16px 0",
          }}
        >
          {bride}
        </div>
        <div
          style={{
            fontFamily: F.serifSoft,
            fontStyle: "italic",
            fontSize: 56,
            color: C.gold,
            margin: "10px 0",
          }}
        >
          &amp;
        </div>
        <div
          style={{
            fontFamily: F.serif,
            fontWeight: 300,
            fontSize: 132,
            letterSpacing: "-0.03em",
            lineHeight: 0.95,
            margin: "16px 0",
          }}
        >
          {groom}
        </div>
        <div
          style={{
            fontFamily: F.serifSoft,
            fontStyle: "italic",
            fontSize: 30,
            color: C.charcoal,
            opacity: 0.85,
            marginTop: 24,
          }}
        >
          düğün törenine davet ediyoruz
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: F.mono,
          fontSize: 14,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: C.mute,
        }}
      >
        <span>{date}</span>
        <span style={{ color: C.gold }}>✦</span>
        <span>{venue}</span>
      </div>
    </div>
  </div>
);

// ── Effect pipelines ────────────────────────────────────────────────────────
//
// Each receives a 2D context, the live HTMLImage from the DOM tree, and the
// scene progress so they can ramp on/off cleanly. We use ctx.drawElementImage
// because that's how Remotion exposes the experimental snapshot.

type Ctx = CanvasRenderingContext2D & {
  drawElementImage?: (
    img: unknown,
    x: number,
    y: number,
  ) => DOMMatrix | undefined;
};

const drawElement = (
  ctx: Ctx,
  elementImage: unknown,
  x = 0,
  y = 0,
): DOMMatrix | undefined => {
  if (typeof ctx.drawElementImage !== "function") return undefined;
  return ctx.drawElementImage(elementImage, x, y);
};

// 1. Shimmer — soft golden bloom sweeping across the card.
const runShimmer = (
  ctx: Ctx,
  elementImage: unknown,
  element: HTMLElement,
  progress: number,
) => {
  const blurAmt = 14 * (1 - EASE.outExpo(progress)) + 0.4;
  ctx.filter = `blur(${blurAmt}px) saturate(1.05)`;
  const m = drawElement(ctx, elementImage, 0, 0);
  if (m) element.style.transform = m.toString();

  // sharp pass on top once we're past 30%
  if (progress > 0.3) {
    ctx.filter = "none";
    ctx.globalAlpha = Math.min(1, (progress - 0.3) / 0.4);
    drawElement(ctx, elementImage, 0, 0);
    ctx.globalAlpha = 1;
  }

  // golden sweep
  const sweepX = (progress * 1.6 - 0.3) * ctx.canvas.width;
  const grad = ctx.createLinearGradient(
    sweepX - 200,
    0,
    sweepX + 200,
    ctx.canvas.height,
  );
  grad.addColorStop(0, "rgba(184,153,104,0)");
  grad.addColorStop(0.5, "rgba(213,209,173,0.32)");
  grad.addColorStop(1, "rgba(184,153,104,0)");
  ctx.fillStyle = grad;
  ctx.globalCompositeOperation = "screen";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.globalCompositeOperation = "source-over";
};

// 2. RGB shift — chromatic aberration that calms into a clean image.
const runRgbShift = (
  ctx: Ctx,
  elementImage: unknown,
  element: HTMLElement,
  progress: number,
) => {
  const shift = (1 - EASE.outQuart(progress)) * 28;

  // R
  ctx.globalCompositeOperation = "screen";
  ctx.filter = "url('#none')";
  ctx.fillStyle = "rgba(255,80,80,0)";

  ctx.globalAlpha = 0.8;
  ctx.filter = `drop-shadow(${shift}px 0 0 rgba(220,60,60,0.65))`;
  drawElement(ctx, elementImage, -shift, 0);

  ctx.filter = `drop-shadow(${-shift}px 0 0 rgba(60,120,220,0.65))`;
  drawElement(ctx, elementImage, shift, 0);

  ctx.filter = `drop-shadow(0 ${shift * 0.4}px 0 rgba(70,200,120,0.5))`;
  drawElement(ctx, elementImage, 0, -shift * 0.4);

  ctx.globalAlpha = 1;
  ctx.filter = "none";
  ctx.globalCompositeOperation = "source-over";

  const m = drawElement(ctx, elementImage, 0, 0);
  if (m) element.style.transform = m.toString();
};

// 3. Ripple fold — page warps like wind catching paper.
const runRippleFold = (
  ctx: Ctx,
  elementImage: unknown,
  element: HTMLElement,
  progress: number,
  t: number,
) => {
  const intensity = (1 - EASE.outExpo(progress)) * 0.06;
  const slices = 36;
  const sliceH = ctx.canvas.height / slices;

  // Snapshot the element to a temp canvas via drawElementImage, then stretch
  // each horizontal slice with a sine-driven X offset.
  const off = document.createElement("canvas");
  off.width = ctx.canvas.width;
  off.height = ctx.canvas.height;
  const offCtx = off.getContext("2d") as Ctx;
  if (!offCtx) return;
  drawElement(offCtx, elementImage, 0, 0);

  for (let i = 0; i < slices; i++) {
    const ny = i / slices;
    const wave =
      Math.sin(ny * Math.PI * 4 + t * 1.6) * intensity * ctx.canvas.width;
    ctx.drawImage(
      off,
      0,
      i * sliceH,
      ctx.canvas.width,
      sliceH,
      wave,
      i * sliceH,
      ctx.canvas.width,
      sliceH,
    );
  }

  // Soft inner shadow for depth
  const grad = ctx.createRadialGradient(
    ctx.canvas.width / 2,
    ctx.canvas.height / 2,
    Math.min(ctx.canvas.width, ctx.canvas.height) * 0.3,
    ctx.canvas.width / 2,
    ctx.canvas.height / 2,
    Math.max(ctx.canvas.width, ctx.canvas.height) * 0.7,
  );
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(1, "rgba(20,16,12,0.35)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Hide raw element
  element.style.transform = "translate(-200vw,-200vh)";
};

// 4. Smoke reveal — invitation rises out of soft fog as progress increases.
const runSmokeReveal = (
  ctx: Ctx,
  elementImage: unknown,
  element: HTMLElement,
  progress: number,
  t: number,
) => {
  const reveal = EASE.outExpo(progress);
  const blurAmt = (1 - reveal) * 22 + 0.4;
  ctx.filter = `blur(${blurAmt}px)`;
  ctx.globalAlpha = reveal;
  const m = drawElement(ctx, elementImage, 0, 0);
  if (m) element.style.transform = m.toString();
  ctx.filter = "none";
  ctx.globalAlpha = 1;

  // Lay smoke on top, thinning as progress completes.
  const layers = 5;
  for (let i = 0; i < layers; i++) {
    const ly = (i / layers + ((t * 0.05) % 1)) % 1;
    const radius = ctx.canvas.width * (0.4 + (i % 2) * 0.2);
    const cx = ctx.canvas.width * (0.3 + 0.4 * Math.sin(t * 0.3 + i));
    const cy = ctx.canvas.height * ly;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    const op = (1 - reveal) * 0.18 + 0.04;
    grad.addColorStop(0, `rgba(245,240,230,${op})`);
    grad.addColorStop(1, "rgba(245,240,230,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
};
