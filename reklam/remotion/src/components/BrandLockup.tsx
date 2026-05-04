import React from "react";
import { Img, staticFile } from "remotion";
import { F } from "../style/fonts";
import { C } from "../style/colors";
import { STILL_IMAGES } from "../style/themes";
import { tween, useSeconds, EASE } from "../style/ease";

type Props = {
  start?: number;
  size?: number;
  tone?: "light" | "dark" | "gold";
  cta?: string;
  url?: string;
  align?: "center" | "left";
};

// End-card brand lockup — gold logo, hairline rule, CTA.
// Built to read in a half-second.
export const BrandLockup: React.FC<Props> = ({
  start = 0,
  size = 240,
  tone = "dark",
  cta = "uygundavet.com",
  url,
  align = "center",
}) => {
  const t = useSeconds();
  const op = tween({
    t,
    start,
    end: start + 0.7,
    from: 0,
    to: 1,
    ease: EASE.outQuart,
  });
  const ty = tween({
    t,
    start,
    end: start + 0.9,
    from: 22,
    to: 0,
    ease: EASE.outBack,
  });
  const lineW = tween({
    t,
    start: start + 0.4,
    end: start + 1.4,
    from: 0,
    to: 100,
    ease: EASE.outQuart,
  });
  const ctaOp = tween({
    t,
    start: start + 0.8,
    end: start + 1.5,
    from: 0,
    to: 1,
    ease: EASE.outQuart,
  });

  const txtCol =
    tone === "dark" ? C.goldHi : tone === "gold" ? C.gold : C.charcoal;
  const subCol =
    tone === "dark" ? "rgba(213,209,173,0.6)" : C.mute;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        gap: 18,
        opacity: op,
        transform: `translateY(${ty}px)`,
      }}
    >
      <Img
        src={staticFile(STILL_IMAGES.logoGold)}
        style={{ width: size, height: "auto", display: "block" }}
      />
      <div
        style={{
          height: 1,
          width: `${lineW}%`,
          maxWidth: size * 1.2,
          background:
            "linear-gradient(90deg, transparent, " +
            (tone === "dark" ? C.gold : C.gold) +
            ", transparent)",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: align === "center" ? "center" : "flex-start",
          gap: 4,
          opacity: ctaOp,
        }}
      >
        <div
          style={{
            fontFamily: F.script,
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: 22,
            color: subCol,
            letterSpacing: "0.04em",
          }}
        >
          dijital düğün davetiyesi
        </div>
        <div
          style={{
            fontFamily: F.display,
            fontWeight: 600,
            fontSize: 28,
            color: txtCol,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
          }}
        >
          {cta}
        </div>
        {url ? (
          <div
            style={{
              fontFamily: F.mono,
              fontSize: 12,
              color: subCol,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              marginTop: 6,
            }}
          >
            {url}
          </div>
        ) : null}
      </div>
    </div>
  );
};
