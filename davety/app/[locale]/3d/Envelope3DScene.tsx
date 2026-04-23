"use client";

import { useEffect, useRef, useState } from "react";

type Stage = "closed" | "opening" | "emerging" | "done";

const W = 460;
const H = 290;
const D = 28;
const FLAP_H = Math.round(H * 0.55);
const CARD_W = 300;
const CARD_H = 420;

const ENVELOPE = "#ede7d8";
const ENVELOPE_DARK = darken(ENVELOPE, 0.08);
const LINING_BG = "#252224";
const LINING_ACCENT = "#d5d1ad";
const CARD_BG = "#f5f6f3";
const CARD_TEXT = "#555670";

export function Envelope3DScene() {
  const [stage, setStage] = useState<Stage>("closed");
  const [tilt, setTilt] = useState({ x: -6, y: 0 });
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sceneRef.current;
    if (!node) return;
    const onMove = (e: MouseEvent) => {
      const r = node.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / r.width;
      const dy = (e.clientY - cy) / r.height;
      setTilt({
        x: clamp(-6 - dy * 14, -18, 10),
        y: clamp(dx * 22, -22, 22),
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const busy = stage === "opening" || stage === "emerging";

  const handleClick = () => {
    if (busy) return;
    if (stage === "closed") {
      setStage("opening");
      window.setTimeout(() => setStage("emerging"), 900);
      window.setTimeout(() => setStage("done"), 2500);
    } else if (stage === "done") {
      setStage("closed");
    }
  };

  const flapOpen = stage !== "closed";
  const cardOut = stage === "emerging" || stage === "done";

  return (
    <div className="flex flex-col items-center gap-8 pt-4 pb-24">
      <div
        ref={sceneRef}
        onClick={handleClick}
        className="select-none"
        style={{
          width: "min(900px, 100%)",
          height: 640,
          perspective: "1900px",
          perspectiveOrigin: "50% 55%",
          cursor: busy ? "wait" : stage === "done" ? "pointer" : "pointer",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            transformStyle: "preserve-3d",
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: "transform 0.55s cubic-bezier(0.2, 0.7, 0.25, 1)",
          }}
        >
          {/* ─── Envelope group, centered in scene ─── */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: W,
              height: H,
              transform: "translate(-50%, -50%)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Back panel (outer) */}
            <Face
              width={W}
              height={H}
              translateZ={-D / 2}
              background={`linear-gradient(135deg, ${ENVELOPE}, ${ENVELOPE_DARK})`}
              shadow="inset 0 0 80px rgba(0,0,0,0.18)"
            />

            {/* Inside lining — visible through the V-pocket cutout */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                transform: `translateZ(${-D / 2 + 1}px)`,
                background: LINING_BG,
                backgroundImage: `
                  radial-gradient(circle at 22% 28%, rgba(213,209,173,0.09) 0%, transparent 32%),
                  radial-gradient(circle at 78% 72%, rgba(213,209,173,0.07) 0%, transparent 28%),
                  repeating-linear-gradient(45deg, rgba(213,209,173,0.045) 0 2px, transparent 2px 12px)
                `,
                boxShadow: "inset 0 10px 28px rgba(0,0,0,0.55)",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <LiningFlourish />
            </div>

            {/* Thin depth walls */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: D,
                height: H,
                transform: `translateX(${-D / 2}px) rotateY(-90deg)`,
                transformOrigin: "left center",
                background: `linear-gradient(90deg, ${darken(ENVELOPE, 0.22)}, ${ENVELOPE})`,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: D,
                height: H,
                transform: `translateX(${D / 2}px) rotateY(90deg)`,
                transformOrigin: "right center",
                background: `linear-gradient(90deg, ${ENVELOPE}, ${darken(ENVELOPE, 0.22)})`,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: W,
                height: D,
                transform: `translateY(${D / 2}px) rotateX(-90deg)`,
                transformOrigin: "center bottom",
                background: `linear-gradient(0deg, ${darken(ENVELOPE, 0.25)}, ${ENVELOPE})`,
              }}
            />

            {/* Card tucked inside — rises out and tilts toward viewer */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: CARD_W,
                height: CARD_H,
                transformStyle: "preserve-3d",
                transform: `
                  translate(-50%, -50%)
                  translateY(${cardOut ? -CARD_H * 0.55 : CARD_H * 0.04}px)
                  translateZ(${cardOut ? 150 : 0}px)
                  rotateX(${cardOut ? -6 : 0}deg)
                `,
                transition:
                  "transform 1.6s cubic-bezier(0.42, 0.02, 0.18, 1)",
                zIndex: cardOut ? 40 : 1,
                filter: cardOut
                  ? "drop-shadow(0 30px 40px rgba(0,0,0,0.35))"
                  : "drop-shadow(0 6px 10px rgba(0,0,0,0.2))",
              }}
            >
              <InvitationCardFront />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: "translateZ(-2px) rotateY(180deg)",
                  background: darken(CARD_BG, 0.04),
                  border: `1px solid ${darken(CARD_BG, 0.1)}`,
                  borderRadius: 8,
                  backfaceVisibility: "hidden",
                }}
              />
            </div>

            {/* Front pocket panel — V-clipped so inside shows through */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                transform: `translateZ(${D / 2}px)`,
                background: `linear-gradient(160deg, ${ENVELOPE} 0%, ${darken(ENVELOPE, 0.1)} 100%)`,
                backgroundImage: `
                  linear-gradient(160deg, ${ENVELOPE} 0%, ${darken(ENVELOPE, 0.1)} 100%),
                  repeating-linear-gradient(45deg, rgba(0,0,0,0.025) 0 1px, transparent 1px 5px)
                `,
                backgroundBlendMode: "multiply",
                clipPath:
                  "polygon(0 0, 100% 0, 100% 100%, 50% 50%, 0 100%)",
                boxShadow:
                  "0 14px 40px -10px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(0,0,0,0.06)",
                borderRadius: 4,
                zIndex: 5,
              }}
            >
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                }}
              >
                <path
                  d="M 0 0 L 50 50 L 100 0 M 0 100 L 50 50 L 100 100"
                  stroke="rgba(0,0,0,0.14)"
                  strokeWidth="0.3"
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>

            {/* Hinged flap — rotates open up-and-back, revealing lining */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: W,
                height: FLAP_H,
                transformStyle: "preserve-3d",
                transformOrigin: "center top",
                transform: `
                  translateZ(${D / 2 + 0.5}px)
                  rotateX(${flapOpen ? 175 : 0}deg)
                `,
                transition:
                  "transform 0.95s cubic-bezier(0.55, 0, 0.18, 1)",
                zIndex: 30,
              }}
            >
              {/* Outer paper face (visible when closed) */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(180deg, ${ENVELOPE}, ${darken(ENVELOPE, 0.06)})`,
                  backgroundImage: `
                    linear-gradient(180deg, ${ENVELOPE}, ${darken(ENVELOPE, 0.06)}),
                    repeating-linear-gradient(45deg, rgba(0,0,0,0.022) 0 1px, transparent 1px 5px)
                  `,
                  backgroundBlendMode: "multiply",
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  backfaceVisibility: "hidden",
                  boxShadow: "0 6px 14px -6px rgba(0,0,0,0.3)",
                }}
              >
                {/* Wax seal dot at the flap tip */}
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    bottom: "6%",
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    transform: "translateX(-50%)",
                    background: `radial-gradient(circle at 35% 30%, #a8323d, #6b1c23 75%)`,
                    boxShadow:
                      "0 2px 5px rgba(0,0,0,0.35), inset 0 -3px 5px rgba(0,0,0,0.3), inset 0 2px 3px rgba(255,255,255,0.18)",
                    color: "#f5d5cf",
                    fontFamily: "Merienda, serif",
                    fontStyle: "italic",
                    fontSize: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  D
                </div>
              </div>

              {/* Inner lining face (visible when open) */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: LINING_BG,
                    backgroundImage: `
                      radial-gradient(circle at 50% 35%, rgba(213,209,173,0.14) 0%, transparent 40%),
                      repeating-linear-gradient(-45deg, rgba(213,209,173,0.055) 0 2px, transparent 2px 12px)
                    `,
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    boxShadow: "inset 0 -14px 22px rgba(0,0,0,0.45)",
                    overflow: "hidden",
                  }}
                >
                  <LiningFlourish triangle />
                </div>
              </div>
            </div>
          </div>

          {/* Ground shadow to anchor envelope in scene */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: W * 1.1,
              height: 40,
              transform: `translate(-50%, ${H / 2 + 30}px) rotateX(90deg)`,
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, transparent 70%)",
              filter: "blur(6px)",
              opacity: flapOpen ? 0.55 : 0.7,
              transition: "opacity 0.6s ease",
            }}
          />
        </div>
      </div>

      {/* Stage label */}
      <div className="flex flex-col items-center gap-3">
        <div
          className="text-[11px] uppercase tracking-[0.3em] opacity-60"
          style={{ fontFamily: "Space Grotesk, sans-serif", color: "#555670" }}
        >
          {stage === "closed"
            ? "• zarfa tıkla •"
            : stage === "opening"
              ? "kapak açılıyor…"
              : stage === "emerging"
                ? "davetiye süzülüyor…"
                : "• davetiye hazır •"}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (!busy && stage === "done") setStage("closed");
          }}
          disabled={stage !== "done"}
          className="px-6 py-2.5 rounded-full text-[11px] uppercase tracking-[0.25em] transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            fontFamily: "Orbitron, sans-serif",
            background: "#252224",
            color: "#d5d1ad",
            border: "1px solid #252224",
          }}
        >
          Tekrar Kapat
        </button>
      </div>
    </div>
  );
}

/* ───── Face helper ───── */
function Face({
  width,
  height,
  translateZ,
  background,
  shadow,
}: {
  width: number;
  height: number;
  translateZ: number;
  background: string;
  shadow?: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        width,
        height,
        transform: `translateZ(${translateZ}px)`,
        background,
        backgroundImage: `${background}, repeating-linear-gradient(45deg, rgba(0,0,0,0.022) 0 1px, transparent 1px 5px)`,
        backgroundBlendMode: "multiply",
        boxShadow: shadow,
        borderRadius: 4,
      }}
    />
  );
}

/* ───── Invitation card face (front) ───── */
function InvitationCardFront() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(165deg, ${CARD_BG} 0%, ${darken(CARD_BG, 0.04)} 100%)`,
        border: `1px solid ${darken(CARD_BG, 0.12)}`,
        borderRadius: 8,
        boxShadow: `
          inset 0 0 0 10px ${CARD_BG},
          inset 0 0 0 11px ${LINING_ACCENT},
          0 1px 0 rgba(255,255,255,0.5) inset
        `,
        padding: "36px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        backfaceVisibility: "hidden",
        color: CARD_TEXT,
        textAlign: "center",
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: 10,
            letterSpacing: "0.35em",
            opacity: 0.55,
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          Sizi davet ediyoruz
        </div>
        <div
          style={{
            fontFamily: "Merienda, serif",
            fontSize: 26,
            fontStyle: "italic",
            lineHeight: 1.1,
          }}
        >
          Elif &amp; Mehmet
        </div>
      </div>

      <div style={{ width: "100%" }}>
        <div
          style={{
            fontFamily: "Orbitron, sans-serif",
            fontSize: 18,
            letterSpacing: "0.2em",
            fontWeight: 500,
          }}
        >
          DÜĞÜN
        </div>
        <div
          style={{
            width: 60,
            height: 1,
            background: LINING_ACCENT,
            margin: "14px auto",
          }}
        />
        <div
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: 12,
            letterSpacing: "0.15em",
          }}
        >
          15 HAZİRAN 2026
        </div>
        <div
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: 11,
            opacity: 0.7,
            marginTop: 4,
          }}
        >
          19:00 — Boğaz Terası
        </div>
      </div>

      <div
        style={{
          fontFamily: "Merienda, serif",
          fontSize: 12,
          fontStyle: "italic",
          opacity: 0.65,
        }}
      >
        ~ bize katılın ~
      </div>
    </div>
  );
}

/* ───── Lining flourish pattern ───── */
function LiningFlourish({ triangle = false }: { triangle?: boolean }) {
  return (
    <svg
      viewBox="0 0 200 100"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity: 0.3,
        clipPath: triangle ? "polygon(0 0, 100% 0, 50% 100%)" : undefined,
      }}
      preserveAspectRatio="xMidYMid slice"
    >
      {Array.from({ length: 12 }).map((_, i) => {
        const x = 14 + (i % 6) * 32;
        const y = 20 + Math.floor(i / 6) * 40;
        return (
          <g
            key={i}
            transform={`translate(${x},${y})`}
            fill="none"
            stroke={LINING_ACCENT}
            strokeWidth="0.5"
          >
            <path d="M 0 0 Q -8 -10 -14 -3 Q -18 5 -8 10 Q 2 8 0 0 Z" />
            <path d="M 0 0 Q 8 -10 14 -3 Q 18 5 8 10 Q -2 8 0 0 Z" />
            <circle r="1.6" fill={LINING_ACCENT} />
          </g>
        );
      })}
    </svg>
  );
}

/* ───── Utils ───── */
function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function darken(hex: string, amount: number): string {
  const h = hex.replace("#", "");
  if (h.length !== 6) return hex;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const f = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v * (1 - amount))))
      .toString(16)
      .padStart(2, "0");
  return `#${f(r)}${f(g)}${f(b)}`;
}
