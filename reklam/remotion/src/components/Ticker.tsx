import React from "react";
import { useSeconds } from "../style/ease";
import { F } from "../style/fonts";

type Props = {
  items: string[];
  speed?: number; // px per second
  fontSize?: number;
  color?: string;
  divider?: string;
  position?: "top" | "bottom";
  inset?: number;
  height?: number;
  background?: string;
};

// Editorial ticker — never sleeps. Drifts horizontally, looping seamlessly.
// Used as a faux broadcast strip across the spots.
export const Ticker: React.FC<Props> = ({
  items,
  speed = 80,
  fontSize = 18,
  color = "#1a1612",
  divider = "✦",
  position = "bottom",
  inset = 0,
  height = 56,
  background = "transparent",
}) => {
  const t = useSeconds();
  const offset = -t * speed;
  const text = items.join(`   ${divider}   `);
  const pad = `   ${divider}   `;
  const repeated = `${text}${pad}${text}${pad}${text}${pad}${text}`;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        [position]: inset,
        height,
        overflow: "hidden",
        background,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          whiteSpace: "nowrap",
          transform: `translate3d(${offset}px, 0, 0)`,
          fontFamily: F.mono,
          fontSize,
          color,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
        }}
      >
        {repeated}
      </div>
    </div>
  );
};
