import React from "react";
import { OffthreadVideo, Img, staticFile, AbsoluteFill } from "remotion";
import { tween, useSeconds, EASE } from "../style/ease";

type Props = {
  src: string;
  isImage?: boolean;
  start?: number;
  duration?: number;
  // Ken Burns: gentle scale + drift
  zoom?: { from: number; to: number };
  pan?: { x: [number, number]; y: [number, number] };
  // Color grading
  vignette?: number; // 0..1
  tint?: string; // overlay rgba/hex
  tintOpacity?: number;
  // Letterbox / aspect lock
  blackBars?: boolean;
  // Optional crossfade in/out lengths in seconds
  fadeIn?: number;
  fadeOut?: number;
  totalDuration?: number;
  loop?: boolean;
};

// A cinematic backdrop slot. Either a still or a video, with Ken Burns,
// vignette, tint and letterboxing — wrapped in one component so scenes
// just say "show this video for these seconds with this mood".
export const MediaBackdrop: React.FC<Props> = ({
  src,
  isImage = false,
  start = 0,
  duration,
  zoom = { from: 1.06, to: 1.16 },
  pan = { x: [0, 0], y: [0, 0] },
  vignette = 0.35,
  tint,
  tintOpacity = 0.18,
  blackBars = false,
  fadeIn = 0.4,
  fadeOut = 0.4,
  totalDuration,
  loop = true,
}) => {
  const t = useSeconds();
  const localT = t - start;
  const dur = duration ?? totalDuration ?? 8;

  const z = tween({
    t: localT,
    start: 0,
    end: dur,
    from: zoom.from,
    to: zoom.to,
    ease: EASE.inOutSine,
  });
  const px = tween({
    t: localT,
    start: 0,
    end: dur,
    from: pan.x[0],
    to: pan.x[1],
    ease: EASE.inOutSine,
  });
  const py = tween({
    t: localT,
    start: 0,
    end: dur,
    from: pan.y[0],
    to: pan.y[1],
    ease: EASE.inOutSine,
  });

  // Fade
  const fIn = tween({
    t: localT,
    start: 0,
    end: fadeIn,
    from: 0,
    to: 1,
    ease: EASE.outQuart,
  });
  const fOut = tween({
    t: localT,
    start: dur - fadeOut,
    end: dur,
    from: 1,
    to: 0,
    ease: EASE.inOut,
  });
  const fade = Math.min(fIn, fOut);

  return (
    <AbsoluteFill style={{ opacity: fade, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${z}) translate(${px}%, ${py}%)`,
          transformOrigin: "center",
        }}
      >
        {isImage ? (
          <Img
            src={staticFile(src)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <OffthreadVideo
            src={staticFile(src)}
            muted
            loop={loop}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
      </div>

      {tint ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: tint,
            opacity: tintOpacity,
            mixBlendMode: "multiply",
          }}
        />
      ) : null}

      {vignette > 0 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,${vignette}) 100%)`,
          }}
        />
      ) : null}

      {blackBars ? (
        <>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: "8%",
              background: "#000",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: "8%",
              background: "#000",
            }}
          />
        </>
      ) : null}
    </AbsoluteFill>
  );
};
