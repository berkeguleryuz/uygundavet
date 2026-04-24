import { ENVELOPE_CARD_LAYOUT } from "./envelopeGeometry.ts";

export type EnvelopeRevealPhase = "front" | "flipping" | "opening" | "emerging" | "settled";

export interface EnvelopeRevealState {
  phase: EnvelopeRevealPhase;
  envelope: {
    rotationY: number;
  };
  flap: {
    angle: number;
  };
  card: {
    visible: boolean;
    lift: number;
    forward: number;
    tilt: number;
    wobble: number;
  };
}

const FLIP_SECONDS = 1.18;
const FLAP_OPEN_SECONDS = 1.05;
const CARD_RELEASE_SECONDS = 2.35;
const SETTLED_SECONDS = 4.8;

const FLAP_FINAL_ANGLE = 2.86;
const CARD_FINAL_LIFT = ENVELOPE_CARD_LAYOUT.cardFinalLift;
const CARD_FINAL_TILT = 0.018;

export function getEnvelopeRevealState(timeSeconds: number): EnvelopeRevealState {
  const t = Math.max(0, timeSeconds);
  return {
    phase: getPhase(t),
    envelope: getEnvelope(t),
    flap: getFlap(t),
    card: getCard(t),
  };
}

function getPhase(t: number): EnvelopeRevealPhase {
  if (t < 0.08) return "front";
  if (t < FLIP_SECONDS) return "flipping";
  if (t < CARD_RELEASE_SECONDS) return "opening";
  if (t < SETTLED_SECONDS) return "emerging";
  return "settled";
}

function getEnvelope(t: number) {
  if (t <= 0) return { rotationY: 0 };
  const p = clamp01(t / FLIP_SECONDS);
  const eased = easeInOutCubic(p);
  const settle = Math.max(0, t - FLIP_SECONDS);
  const wobble = Math.exp(-settle * 4.2) * Math.sin(settle * 11) * 0.045;
  return { rotationY: Math.PI * eased + wobble };
}

function getFlap(t: number) {
  if (t < FLIP_SECONDS) return { angle: 0 };
  const elapsed = t - FLIP_SECONDS;
  const p = clamp01(elapsed / FLAP_OPEN_SECONDS);
  const settle = Math.max(0, elapsed - FLAP_OPEN_SECONDS);
  const wobble = Math.exp(-settle * 3.2) * Math.sin(settle * 9) * 0.08;
  return { angle: FLAP_FINAL_ANGLE * easeOutCubic(p) + wobble };
}

function getCard(t: number) {
  if (t < CARD_RELEASE_SECONDS) {
    return { visible: false, lift: 0, forward: 0, tilt: 0, wobble: 0 };
  }

  const elapsed = t - CARD_RELEASE_SECONDS;
  const liftProgress = clamp01(elapsed / 1.55);
  const lift = CARD_FINAL_LIFT * springRise(liftProgress);
  const settle = Math.max(0, elapsed - 1.55);
  const wobble = Math.exp(-settle * 2.8) * Math.sin(settle * 10) * 0.035;

  return {
    visible: true,
    lift,
    forward: 0,
    tilt: CARD_FINAL_TILT * easeOutCubic(liftProgress) + wobble,
    wobble,
  };
}

function springRise(t: number) {
  const p = clamp01(t);
  return clamp01(1 - Math.pow(1 - p, 3) + Math.sin(p * Math.PI) * 0.04 * (1 - p));
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - clamp01(t), 3);
}

function easeInOutCubic(t: number) {
  const p = clamp01(t);
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}
