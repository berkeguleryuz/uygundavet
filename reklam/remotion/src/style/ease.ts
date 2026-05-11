import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Curves we lean on across all spots. Centralizing keeps motion coherent.
export const EASE = {
  // Smooth in/out — almost everything default
  inOut: (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  // Heavy first half, glide out — cinematic reveals
  outExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  // Snap-in, used for chrome appearing
  outQuart: (t: number) => 1 - Math.pow(1 - t, 4),
  // Slight overshoot — satisfying for headlines
  outBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  // Sine — for ambient drifts, breathing
  inOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
};

// Helper: time-based interpolation in seconds, anchored to current frame.
// Makes scenes read like a screenplay instead of a frame counter.
export const useSeconds = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

// Drop-in: animate from->to over [start,end] seconds with chosen ease.
export const tween = ({
  t,
  start,
  end,
  from,
  to,
  ease = EASE.inOut,
}: {
  t: number;
  start: number;
  end: number;
  from: number;
  to: number;
  ease?: (n: number) => number;
}) => {
  if (t <= start) return from;
  if (t >= end) return to;
  const local = (t - start) / (end - start);
  return from + (to - from) * ease(local);
};

// Springy entrance — useful for chrome/badges.
export const useSpringIn = (delaySec: number, config = { damping: 18, mass: 0.6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - delaySec * fps,
    fps,
    config,
  });
};

// Linear convenience.
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Clamp.
export const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

// Re-export Remotion's interpolate so consumers only import from here.
export { interpolate };
