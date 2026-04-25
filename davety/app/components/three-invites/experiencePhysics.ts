export type InviteExperiencePhase = "closed" | "opening" | "revealing" | "settled";

export interface InviteExperienceState {
  phase: InviteExperiencePhase;
  opener: number;
  invitation: {
    visible: boolean;
    lift: number;
    forward: number;
    rotationY: number;
    wobble: number;
  };
}

const OPEN_SECONDS = 1.75;
const REVEAL_DELAY_SECONDS = 2.1;
const SETTLE_SECONDS = 5.2;
const CARD_LIFT = 1.72;

export function getInviteExperienceState(timeSeconds: number): InviteExperienceState {
  const t = Math.max(0, timeSeconds);
  return {
    phase: getPhase(t),
    opener: getOpener(t),
    invitation: getInvitation(t),
  };
}

function getPhase(t: number): InviteExperiencePhase {
  if (t < 0.08) return "closed";
  if (t < REVEAL_DELAY_SECONDS) return "opening";
  if (t < SETTLE_SECONDS) return "revealing";
  return "settled";
}

function getOpener(t: number) {
  const p = clamp01(t / OPEN_SECONDS);
  const settle = Math.max(0, t - OPEN_SECONDS);
  const wobble = Math.exp(-settle * 4.4) * Math.sin(settle * 10) * 0.025;
  return clamp01(easeOutCubic(p) + wobble);
}

function getInvitation(t: number) {
  if (t < REVEAL_DELAY_SECONDS) {
    return { visible: false, lift: 0, forward: 0, rotationY: 0, wobble: 0 };
  }

  const elapsed = t - REVEAL_DELAY_SECONDS;
  const p = clamp01(elapsed / 1.6);
  const settle = Math.max(0, elapsed - 1.6);
  const wobble = Math.exp(-settle * 3.3) * Math.sin(settle * 8) * 0.026;
  return {
    visible: true,
    lift: CARD_LIFT * springRise(p),
    forward: 0,
    rotationY: wobble * 0.25,
    wobble,
  };
}

function springRise(t: number) {
  const p = clamp01(t);
  return clamp01(1 - Math.pow(1 - p, 3) + Math.sin(p * Math.PI) * 0.035 * (1 - p));
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - clamp01(t), 3);
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}
