import React from "react";
import { tween, useSeconds, EASE } from "../style/ease";
import { F } from "../style/fonts";
import { C } from "../style/colors";

type Line = {
  text: string;
  font?: keyof typeof F;
  italic?: boolean;
  color?: string;
  size?: number;
  letter?: string;
  weight?: number;
};

type Props = {
  lines: Line[];
  start?: number;
  stagger?: number;
  align?: "left" | "center" | "right";
  splitWords?: boolean;
};

// Editorial 3-tier headline. Words cascade up with slight rotational drift,
// echoing letterpress feel. Stays readable at any aspect.
export const KineticHeadline: React.FC<Props> = ({
  lines,
  start = 0,
  stagger = 0.12,
  align = "left",
  splitWords = true,
}) => {
  const t = useSeconds();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        textAlign: align,
        alignItems:
          align === "center"
            ? "center"
            : align === "right"
              ? "flex-end"
              : "flex-start",
      }}
    >
      {lines.map((line, li) => {
        const fontFamily = F[line.font ?? "serif"];
        const tokens = splitWords ? line.text.split(" ") : [line.text];
        return (
          <div
            key={li}
            style={{
              display: "flex",
              gap: splitWords ? "0.32em" : 0,
              flexWrap: "wrap",
              justifyContent:
                align === "center"
                  ? "center"
                  : align === "right"
                    ? "flex-end"
                    : "flex-start",
              fontFamily,
              fontStyle: line.italic ? "italic" : "normal",
              fontWeight: line.weight ?? 400,
              fontSize: line.size ?? 96,
              color: line.color ?? C.ink,
              letterSpacing: line.letter ?? "-0.01em",
              lineHeight: 0.96,
            }}
          >
            {tokens.map((tok, ti) => {
              const localStart = start + (li * tokens.length + ti) * stagger;
              const op = tween({
                t,
                start: localStart,
                end: localStart + 0.55,
                from: 0,
                to: 1,
                ease: EASE.outExpo,
              });
              const ty = tween({
                t,
                start: localStart,
                end: localStart + 0.7,
                from: 28,
                to: 0,
                ease: EASE.outExpo,
              });
              const rot = tween({
                t,
                start: localStart,
                end: localStart + 0.7,
                from: ti % 2 === 0 ? -1.2 : 1.2,
                to: 0,
                ease: EASE.outExpo,
              });
              return (
                <span
                  key={ti}
                  style={{
                    display: "inline-block",
                    opacity: op,
                    transform: `translate3d(0, ${ty}px, 0) rotate(${rot}deg)`,
                  }}
                >
                  {tok}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
