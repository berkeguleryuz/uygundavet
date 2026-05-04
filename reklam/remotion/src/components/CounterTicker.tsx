import React from "react";
import { tween, useSeconds, EASE } from "../style/ease";

type Props = {
  from?: number;
  to: number;
  start?: number;
  duration?: number;
  // Pad to fixed width so the counter doesn't reflow as digits change.
  padTo?: number;
  prefix?: string;
  suffix?: string;
  style?: React.CSSProperties;
  ease?: (n: number) => number;
};

// Animated integer counter — "0 → 147 katılım" style.
// Reads as a live RSVP feed when paired with stacked cards.
export const CounterTicker: React.FC<Props> = ({
  from = 0,
  to,
  start = 0,
  duration = 2,
  padTo,
  prefix = "",
  suffix = "",
  style,
  ease = EASE.outExpo,
}) => {
  const t = useSeconds();
  const value = Math.round(
    tween({ t, start, end: start + duration, from, to, ease }),
  );
  const text =
    typeof padTo === "number"
      ? String(value).padStart(padTo, "0")
      : String(value);
  return (
    <span style={style}>
      {prefix}
      {text}
      {suffix}
    </span>
  );
};
