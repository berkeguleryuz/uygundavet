import React from "react";
import { useSeconds, EASE } from "../style/ease";

type Props = {
  text: string;
  start?: number;
  // Seconds per character. 0.06 reads as confident; 0.12 reads as ceremonial.
  speed?: number;
  caret?: boolean;
  caretChar?: string;
  // The wrapping element controls font/color/etc.
  style?: React.CSSProperties;
  // Optional pause at the end before children render in.
  hold?: number;
  className?: string;
};

// Letter-by-letter reveal with an optional blinking caret. Output is plain
// text; styling lives in the parent. Designed for ceremonial type cards.
export const Typewriter: React.FC<Props> = ({
  text,
  start = 0,
  speed = 0.07,
  caret = true,
  caretChar = "│",
  style,
  hold = 0,
  className,
}) => {
  const t = useSeconds();
  const local = Math.max(0, t - start);
  const totalReveal = text.length * speed;
  const charsShown = Math.min(text.length, Math.floor(local / speed));
  const visible = text.slice(0, charsShown);

  const finished = local >= totalReveal + hold;
  const caretOn = caret && (Math.floor(local * 2) % 2 === 0) && !finished;

  return (
    <span style={style} className={className}>
      {visible}
      {caretOn ? (
        <span
          style={{
            display: "inline-block",
            marginLeft: "0.05em",
            opacity: 0.78,
          }}
        >
          {caretChar}
        </span>
      ) : null}
    </span>
  );
};
