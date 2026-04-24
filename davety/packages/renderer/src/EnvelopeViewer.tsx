"use client";

import {
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { useState, type ReactNode } from "react";

export type EnvelopeState = "closed" | "open";

export interface EnvelopeViewerProps {
  state?: EnvelopeState;
  onToggle?: (next: EnvelopeState) => void;
  color?: string;
  flapColor?: string;
  liningPattern?: "daisy" | "rose" | "none";
  liningImage?: string;
  viewLabel?: string;
  editLabel?: string;
  onEdit?: () => void;
  children?: ReactNode;
  className?: string;
  /** size in px of envelope width */
  width?: number;
}

const DEFAULT_ASPECT = 1.4;

/**
 * 3-layer CSS-3D envelope:
 *   - back pocket (plain)
 *   - card (slides up when open, contains children)
 *   - front pocket V-shape (clip-path triangle)
 *   - flap (rotates 180° around top edge when open, showing lining)
 *
 * No WebGL. Uses CSS 3D transforms + Framer Motion.
 */
export function EnvelopeViewer({
  state: controlled,
  onToggle,
  color = "#f5eedb",
  flapColor = "#eee0be",
  liningPattern = "daisy",
  liningImage,
  viewLabel = "Görüntüle",
  editLabel,
  onEdit,
  children,
  className,
  width = 360,
}: EnvelopeViewerProps) {
  const [internal, setInternal] = useState<EnvelopeState>("closed");
  const state = controlled ?? internal;
  const reduced = useReducedMotion();
  const isOpen = state === "open";
  const height = Math.round(width * DEFAULT_ASPECT);

  const toggle = () => {
    const next: EnvelopeState = isOpen ? "closed" : "open";
    if (onToggle) onToggle(next);
    else setInternal(next);
  };

  const liningBg = liningImage
    ? `url(${liningImage})`
    : liningPattern === "daisy"
    ? `url("data:image/svg+xml;utf8,${encodeURIComponent(DAISY_SVG)}")`
    : liningPattern === "rose"
    ? `url("data:image/svg+xml;utf8,${encodeURIComponent(ROSE_SVG)}")`
    : "none";

  const flapVariants: Variants = reduced
    ? { closed: { rotateX: 0 }, open: { rotateX: 180 } }
    : {
        closed: {
          rotateX: 0,
          transition: { duration: 1, ease: [0.76, 0, 0.24, 1] },
        },
        open: {
          rotateX: 180,
          transition: { duration: 1, ease: [0.76, 0, 0.24, 1] },
        },
      };

  const cardVariants: Variants = reduced
    ? { closed: { y: 0 }, open: { y: -height * 0.55, scale: 1 } }
    : {
        closed: { y: 0, scale: 1, transition: { duration: 0.4 } },
        open: {
          y: -height * 0.55,
          scale: 1.02,
          transition: {
            type: "spring",
            stiffness: 120,
            damping: 18,
            delay: 0.9,
          },
        },
      };

  return (
    <div
      className={`envelope-scene relative mx-auto ${className ?? ""}`}
      style={{
        width,
        height: height + (isOpen ? height * 0.55 : 0),
        perspective: 1400,
        transition: "height 1.2s cubic-bezier(0.76, 0, 0.24, 1)",
      }}
    >
      <div
        className="envelope-body absolute left-0 right-0 bottom-0"
        style={{
          width,
          height,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Back pocket */}
        <div
          className="absolute inset-0 rounded-lg shadow-2xl"
          style={{ background: color, zIndex: 1 }}
        />

        {/* Card inside pocket — slides up when open */}
        <motion.div
          className="absolute rounded-md bg-white shadow-xl overflow-hidden"
          style={{
            left: "4%",
            right: "4%",
            top: "6%",
            bottom: "32%",
            zIndex: 2,
            transformOrigin: "bottom center",
          }}
          initial={false}
          animate={state}
          variants={cardVariants}
        >
          {children}
        </motion.div>

        {/* Front pocket V-shape */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: color,
            clipPath:
              "polygon(0 35%, 50% 78%, 100% 35%, 100% 100%, 0 100%)",
            zIndex: 3,
          }}
        />

        {/* Flap (rotates 180° on open, lining on the back face) */}
        <motion.div
          className="envelope-flap absolute inset-x-0 top-0 cursor-pointer"
          style={{
            height: "55%",
            transformOrigin: "top center",
            transformStyle: "preserve-3d",
            zIndex: isOpen ? 0 : 4,
          }}
          initial={false}
          animate={state}
          variants={flapVariants}
          onClick={toggle}
          aria-label={viewLabel}
        >
          {/* Front face (when closed) */}
          <div
            className="absolute inset-0"
            style={{
              background: flapColor,
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              backfaceVisibility: "hidden",
              boxShadow: "inset 0 -8px 12px rgba(0,0,0,0.06)",
            }}
          />
          {/* Back face (visible when open — daisy lining) */}
          <div
            className="absolute inset-0"
            style={{
              transform: "rotateX(180deg)",
              backfaceVisibility: "hidden",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              background: flapColor,
              backgroundImage: liningBg,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </motion.div>

        {/* Action buttons (visible when closed) */}
        {!isOpen ? (
          <div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full flex items-center gap-1 bg-white/95 backdrop-blur rounded-full shadow-lg px-1 py-1"
            style={{ zIndex: 10 }}
          >
            <button
              onClick={toggle}
              className="font-chakra uppercase tracking-[0.2em] text-xs px-5 py-2 text-foreground hover:bg-muted rounded-full cursor-pointer"
            >
              {viewLabel}
            </button>
            <span className="w-px h-5 bg-border" />
            <button
              className="p-2 rounded-full hover:bg-muted cursor-pointer"
              aria-label="Favorite"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 21s-7-4.35-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.65-7 10-7 10Z" /></svg>
            </button>
            {onEdit && editLabel ? (
              <>
                <span className="w-px h-5 bg-border" />
                <button
                  onClick={onEdit}
                  className="font-chakra uppercase tracking-[0.2em] text-xs px-5 py-2 text-foreground hover:bg-muted rounded-full cursor-pointer"
                >
                  {editLabel}
                </button>
              </>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

// Minimal inline daisy pattern (repeats via background-size: cover)
const DAISY_SVG = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 280'>
  <defs>
    <radialGradient id='p' cx='50%' cy='50%' r='50%'>
      <stop offset='0%' stop-color='%23fbe589'/>
      <stop offset='100%' stop-color='%23f4d36a'/>
    </radialGradient>
  </defs>
  <rect width='200' height='280' fill='%23f9f1d9'/>
  ${Array.from({ length: 14 })
    .map((_, i) => {
      const cx = 20 + (i % 5) * 40 + (Math.floor(i / 5) % 2) * 20;
      const cy = 30 + Math.floor(i / 5) * 60;
      return `<g transform='translate(${cx},${cy})'>
        ${Array.from({ length: 8 })
          .map(
            (__, j) =>
              `<ellipse rx='4' ry='10' cx='0' cy='-9' fill='white' transform='rotate(${
                j * 45
              })'/>`
          )
          .join("")}
        <circle r='4' fill='url(%23p)'/>
      </g>`;
    })
    .join("")}
</svg>`;

const ROSE_SVG = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 280'>
  <rect width='200' height='280' fill='%23f7e6e4'/>
  ${Array.from({ length: 10 })
    .map((_, i) => {
      const cx = 30 + (i % 4) * 50;
      const cy = 40 + Math.floor(i / 4) * 70;
      return `<g transform='translate(${cx},${cy})'>
        <circle r='12' fill='%23d88189'/>
        <circle r='8' fill='%23c26470'/>
        <circle r='4' fill='%23a94a58'/>
      </g>`;
    })
    .join("")}
</svg>`;
