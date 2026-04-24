export type BoxRevealPhase = "closed" | "opening" | "emerging" | "settled";

export interface BoxRevealState {
  phase: BoxRevealPhase;
  lid: {
    angle: number;
    lift: number;
  };
  card: {
    visible: boolean;
    lift: number;
    forward: number;
    tilt: number;
    wobble: number;
  };
}

const LID_FINAL_ANGLE = 2.18;
const CARD_FINAL_LIFT = 1.78;
const CARD_FINAL_FORWARD = 1.68;
const CARD_FINAL_TILT = 0.02;
const LID_OPEN_SECONDS = 1.55;
const CARD_RELEASE_SECONDS = 1.45;
const CARD_FORWARD_RELEASE_SECONDS = 1.95;
const CARD_SETTLE_SECONDS = 4.2;

export function getBoxRevealState(timeSeconds: number): BoxRevealState {
  const t = Math.max(0, timeSeconds);
  const phase = getPhase(t);
  const lid = getLidState(t);
  const card = getCardState(t);

  return { phase, lid, card };
}

function getPhase(t: number): BoxRevealPhase {
  if (t < 0.08) return "closed";
  if (t < LID_OPEN_SECONDS) return "opening";
  if (t < CARD_SETTLE_SECONDS) return "emerging";
  return "settled";
}

function getLidState(t: number) {
  if (t <= 0) {
    return { angle: 0, lift: 0 };
  }

  if (t < LID_OPEN_SECONDS) {
    const p = clamp01(t / LID_OPEN_SECONDS);
    return {
      angle: LID_FINAL_ANGLE * easeOutCubic(p),
      lift: 0.05 * easeOutCubic(p),
    };
  }

  const settleTime = t - LID_OPEN_SECONDS;
  const wobble = Math.exp(-settleTime * 2.6) * Math.sin(settleTime * 8.5) * 0.16;

  return {
    angle: LID_FINAL_ANGLE + wobble,
    lift: 0.05,
  };
}

function getCardState(t: number) {
  if (t < CARD_RELEASE_SECONDS) {
    return {
      visible: false,
      lift: 0,
      forward: 0,
      tilt: 0,
      wobble: 0,
    };
  }

  const elapsed = t - CARD_RELEASE_SECONDS;
  const liftProgress = clamp01(elapsed / CARD_FORWARD_RELEASE_SECONDS);
  const forwardProgress = clamp01((elapsed - CARD_FORWARD_RELEASE_SECONDS) / 1.15);
  const liftEased = springRise(liftProgress);
  const forwardEased = springRise(forwardProgress);
  const settle = Math.max(0, elapsed - 1.1);
  const wobble = Math.exp(-settle * 2.2) * Math.sin(settle * 11) * 0.11;

  return {
    visible: true,
    lift: CARD_FINAL_LIFT * liftEased,
    forward: CARD_FINAL_FORWARD * forwardEased,
    tilt: CARD_FINAL_TILT * easeOutCubic(forwardProgress) + wobble,
    wobble,
  };
}

function springRise(t: number) {
  const eased = 1 - Math.pow(1 - t, 3);
  const overshoot = Math.sin(t * Math.PI) * 0.045 * (1 - t);
  return clamp01(eased + overshoot);
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - clamp01(t), 3);
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}
