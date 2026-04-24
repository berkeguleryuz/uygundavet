"use client";

import { useEffect, useRef, useState } from "react";

type Stage = "closed" | "flipping" | "emerging" | "done";

/* ── Dimensions (match 2D envelope playground) ── */
const W = 380;
const H = Math.round(W * 0.62); // 236
const D = 22; // envelope depth
const CARD_W = 300;
const CARD_H = 600;
const SCENE_H = 760;
const ENVELOPE_BOTTOM_OFFSET = 140;

/* ── Palette (matches WeddingEnvelope defaults) ── */
const ENVELOPE_COLOR = "#f5f1e8";
const ENVELOPE_WALL = "#d8d0bd";
const LINING_BG = "#1f1c17";

const PAPER_TEXTURE =
  "repeating-linear-gradient(45deg, rgba(0,0,0,0.022) 0 1px, transparent 1px 5px)";

export function Envelope3DScene() {
  const [stage, setStage] = useState<Stage>("closed");
  const [guestName] = useState("Ahmet Yılmaz");
  const [tilt, setTilt] = useState({ x: -4, y: 0 });
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
        x: clamp(-4 - dy * 6, -10, 4),
        y: clamp(dx * 7, -7, 7),
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const handleClick = () => {
    if (stage !== "closed") return;
    setStage("flipping");
    window.setTimeout(() => setStage("emerging"), 1100);
    window.setTimeout(() => setStage("done"), 3200);
  };
  const handleReset = () => setStage("closed");

  const flipped = stage !== "closed";
  const cardEmerging = stage === "emerging" || stage === "done";

  /* Envelope body flips 180° Y like 2D flip container.
     Before flip: front face (address + stamp + guest name) visible.
     After flip: back face (V-pocket) visible + lifted flap scales in + card emerges. */

  return (
    <div className="flex flex-col items-center gap-6 pb-24">
      <div
        onClick={handleClick}
        className="select-none"
        style={{
          width: "min(800px, 100%)",
          height: SCENE_H,
          overflow: "hidden",
          position: "relative",
          cursor: stage === "closed" ? "pointer" : "default",
        }}
      >
        <div
          ref={sceneRef}
          style={{
            position: "absolute",
            inset: 0,
            perspective: "2200px",
            perspectiveOrigin: "50% 70%",
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
          {/* Envelope body — anchored to bottom of scene, 3D box, flips 180° Y */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: ENVELOPE_BOTTOM_OFFSET,
              width: W,
              height: H,
              transformStyle: "preserve-3d",
              transform: `translateX(-50%) rotateY(${flipped ? 180 : 0}deg)`,
              transition: "transform 1s cubic-bezier(0.7, 0, 0.2, 1)",
            }}
          >
            {/* ══════ FRONT FACE (address side, closest to viewer pre-flip) ══════ */}
            <FrontFace guestName={guestName} />

            {/* ══════ INNER LINING — deepest layer, visible through top V opening ══════ */}
            <InnerLining />

            {/* ══════ CARD — middle layer, emerges UP through the V opening.
                Placed BEHIND PocketWalls in z-order so its lower portion stays
                hidden by the pocket paper triangles, exactly like a real card
                being pulled out of an envelope. ══════ */}
            <CardLayer
              emerging={cardEmerging}
              visible={cardEmerging}
              guestName={guestName}
            />

            {/* ══════ POCKET WALLS — three paper triangles + V-seam, CLOSEST to
                the viewer post-flip, occluding the card's bottom portion. ══════ */}
            <PocketWalls />

            {/* ══════ Side walls for real depth ══════ */}
            <SideWall axis="left" />
            <SideWall axis="right" />
            <SideWall axis="top" />
            <SideWall axis="bottom" />

            {/* ══════ FLAP PIECE (parts 4 → 5 of the envelope back).
                Closed: the 4th pocket triangle (top), paper color, flat on the
                back — completing the square with the other 3 triangles.
                Opening: hinges at its top edge (transform-origin center top)
                and rotates -180° about X, flipping up and above the envelope.
                Its paper face hides (backface) while the lining face is
                revealed — becoming the "5th piece". ═════════════════════════ */}
            <FlapPiece active={flipped} />
          </div>

          {/* Ground shadow */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: ENVELOPE_BOTTOM_OFFSET - 26,
              width: W * 1.15,
              height: 36,
              transform: `translateX(-50%) rotateX(90deg)`,
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.28) 0%, transparent 70%)",
              filter: "blur(6px)",
              opacity: flipped ? 0.55 : 0.75,
              transition: "opacity 0.6s ease",
            }}
          />
        </div>
        </div>

        {/* 2D occluder (flat overlay, not in 3D scene). Paints the strip below
            the envelope with the page background, hiding the card's body
            before it rises above the envelope top. Without this the 38px
            band beneath the envelope exposes the card's bottom — the user
            sees it "start from the empty area below the envelope" instead of
            appearing to emerge from inside the envelope's V opening. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: ENVELOPE_BOTTOM_OFFSET,
            background: "#f5f6f3",
            pointerEvents: "none",
            zIndex: 10,
          }}
        />
      </div>

      <div className="flex flex-col items-center gap-3">
        <div
          className="text-[11px] uppercase tracking-[0.3em] opacity-60"
          style={{ fontFamily: "Space Grotesk, sans-serif", color: "#555670" }}
        >
          {stage === "closed"
            ? "• zarfa tıkla •"
            : stage === "flipping"
              ? "çevriliyor…"
              : stage === "emerging"
                ? "davetiye süzülüyor…"
                : "• davetiye hazır •"}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (stage === "done") handleReset();
          }}
          disabled={stage !== "done"}
          className="px-6 py-2.5 rounded-full text-[11px] uppercase tracking-[0.25em] cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            fontFamily: "Orbitron, sans-serif",
            background: "#252224",
            color: "#d5d1ad",
            border: "1px solid #252224",
          }}
        >
          Tekrar Oynat
        </button>
      </div>
    </div>
  );
}

/* ───── Front face (address side, identical layout to 2D front) ───── */
function FrontFace({ guestName }: { guestName: string }) {
  const textColor = "#2a2420";
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `translateZ(${D / 2}px)`,
        backfaceVisibility: "hidden",
        background: ENVELOPE_COLOR,
        backgroundImage: PAPER_TEXTURE,
        borderRadius: 4,
        boxShadow:
          "0 10px 30px -8px rgba(0,0,0,0.22), inset 0 0 0 1px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}
    >
      {/* Stamp (dashed pill in top-right) */}
      <div
        style={{
          position: "absolute",
          top: "8%",
          right: "6%",
          width: "18%",
          aspectRatio: "1 / 1.2",
          background: "#b85450",
          border: "2px dashed rgba(255,255,255,0.6)",
          borderRadius: 3,
          color: "#f8f3e6",
          fontFamily: "Merienda, serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          fontWeight: 500,
          boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
        }}
      >
        H&amp;İ
      </div>

      {/* Guest info in lower-left */}
      <div
        style={{
          position: "absolute",
          bottom: "12%",
          left: "8%",
          color: textColor,
          fontFamily: "Merienda, serif",
          maxWidth: "70%",
        }}
      >
        <div
          style={{
            fontSize: 15,
            fontStyle: "italic",
            marginBottom: 3,
            lineHeight: 1.1,
          }}
        >
          Sayın <span style={{ fontWeight: 500 }}>{guestName}</span>,
        </div>
        <div
          style={{
            fontSize: 11,
            fontStyle: "italic",
            opacity: 0.85,
            marginBottom: 10,
            lineHeight: 1.15,
          }}
        >
          Bir etkinliğe davet edildiniz.
        </div>
        <div
          style={{
            display: "inline-block",
            padding: "5px 11px",
            fontSize: 11,
            fontStyle: "italic",
            borderRadius: 4,
            border: `2px solid ${textColor}`,
          }}
        >
          Davetiyeyi Görüntüle
        </div>
      </div>
    </div>
  );
}

/* ───── Inner lining — deep inside the pocket, visible through the V opening.
   Positioned near the inner surface of the front face (local z=+D/2-2) so
   after the body's 180° Y flip it ends up at global z ≈ -9, i.e. the farthest
   plane from the viewer. The card sits in front of it (at z=0 local → 0 global)
   and the pocket paper walls sit in front of the card. ─── */
function InnerLining() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `translateZ(${D / 2 - 2}px) rotateY(180deg)`,
        backfaceVisibility: "hidden",
        background: LINING_BG,
        boxShadow:
          "inset 0 8px 18px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(0,0,0,0.2)",
        overflow: "hidden",
        borderRadius: 4,
      }}
    >
      <LiningDaisyPattern />
    </div>
  );
}

/* ───── Pocket walls — the three paper triangles forming the pocket (left,
   right, bottom) plus the V-seam. At local z=-D/2 (outer back surface), which
   after the body flip is global z=+11, i.e. the CLOSEST plane to the viewer.
   This is the layer that occludes the card's lower portion, making the card
   visibly emerge out of the pocket's top V opening. ─── */
function PocketWalls() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `translateZ(${-D / 2}px) rotateY(180deg)`,
        backfaceVisibility: "hidden",
        pointerEvents: "none",
        filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.18))",
      }}
    >
      {/* LEFT pocket triangle */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: ENVELOPE_COLOR,
          clipPath: "polygon(0 0, 50% 50%, 0 100%)",
          backgroundImage: PAPER_TEXTURE,
        }}
      />
      {/* RIGHT pocket triangle */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: ENVELOPE_COLOR,
          clipPath: "polygon(100% 0, 100% 100%, 50% 50%)",
          backgroundImage: PAPER_TEXTURE,
        }}
      />
      {/* BOTTOM pocket triangle */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: ENVELOPE_COLOR,
          clipPath: "polygon(0 100%, 50% 50%, 100% 100%)",
          backgroundImage: PAPER_TEXTURE,
        }}
      />

      {/* V-seam crease lines */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <path
          d="M 0 0 L 50 50 L 100 0 M 0 100 L 50 50 L 100 100"
          stroke="rgba(0,0,0,0.18)"
          strokeWidth="0.3"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

/* ───── Side walls giving real 3D depth ───── */
function SideWall({ axis }: { axis: "left" | "right" | "top" | "bottom" }) {
  const common = {
    position: "absolute" as const,
    background: ENVELOPE_WALL,
    backgroundImage: PAPER_TEXTURE,
  };
  if (axis === "left") {
    return (
      <div
        style={{
          ...common,
          top: 0,
          left: 0,
          width: D,
          height: H,
          transform: `translateX(${-D / 2}px) rotateY(-90deg)`,
          transformOrigin: "left center",
        }}
      />
    );
  }
  if (axis === "right") {
    return (
      <div
        style={{
          ...common,
          top: 0,
          right: 0,
          width: D,
          height: H,
          transform: `translateX(${D / 2}px) rotateY(90deg)`,
          transformOrigin: "right center",
        }}
      />
    );
  }
  if (axis === "top") {
    return (
      <div
        style={{
          ...common,
          top: 0,
          left: 0,
          width: W,
          height: D,
          transform: `translateY(${-D / 2}px) rotateX(90deg)`,
          transformOrigin: "center top",
        }}
      />
    );
  }
  return (
    <div
      style={{
        ...common,
        bottom: 0,
        left: 0,
        width: W,
        height: D,
        transform: `translateY(${D / 2}px) rotateX(-90deg)`,
        transformOrigin: "center bottom",
      }}
    />
  );
}

/* ───── Flap piece — parts 4 & 5 of the envelope back.
   When `active` is false, it's the 4th pocket triangle: apex-down triangle
   lying flat on the top half of the back face, paper colored, completing the
   square with the three static pocket triangles. When `active` is true, the
   element hinges at its top edge and rotates -180° about X, flipping UP and
   BACK above the envelope. Its paper face is then pointing away (hidden by
   backface) and the inner lining face is revealed toward the viewer — this is
   the 5th piece. Because it's a single physical flap rotating about its own
   hinge, the animation reads as "the envelope opening", not as a new piece
   appearing out of nowhere. ───── */
function FlapPiece({ active }: { active: boolean }) {
  const FLAP_HEIGHT = Math.round(H / 2); // 118 — top half of back square
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: W,
        height: FLAP_HEIGHT,
        transformStyle: "preserve-3d",
        transformOrigin: "center top",
        // Open state also shifts the flap backward in Z so it settles BEHIND
        // the card plane (world z<0 after the body's rotateY(180)). Closed
        // state sits just in front of the pocket walls to cover the V.
        transform: `translateZ(${
          active ? -D / 2 - 0.6 + 30 : -D / 2 - 0.6
        }px) rotateY(180deg) rotateX(${active ? -180 : 0}deg)`,
        transition: active
          ? "transform 0.9s cubic-bezier(0.65, 0, 0.25, 1) 0.55s"
          : "transform 0.3s ease",
        pointerEvents: "none",
      }}
    >
      {/* Paper side — faces outward on the envelope back when closed.
          Apex points DOWN (toward the center of the back square). */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          background: ENVELOPE_COLOR,
          backgroundImage: PAPER_TEXTURE,
          backfaceVisibility: "hidden",
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)",
        }}
      />

      {/* Lining side — rotated 180° about Y so it faces the opposite direction
          of the paper side. Revealed when the flap has rotated open. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: "rotateY(180deg)",
          backfaceVisibility: "hidden",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Paper border (same triangle shape, full size) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            background: ENVELOPE_COLOR,
            backgroundImage: PAPER_TEXTURE,
            boxShadow: "0 -6px 14px -4px rgba(0,0,0,0.22)",
          }}
        />
        {/* Lining inset — paper border effect */}
        <div
          style={{
            position: "absolute",
            top: "4%",
            left: "4%",
            right: "4%",
            bottom: "10%",
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            background: LINING_BG,
            overflow: "hidden",
          }}
        >
          <LiningDaisyPattern />
        </div>
      </div>
    </div>
  );
}

/* ───── Invitation card inside pocket (emerges up + forward) ───── */
function CardLayer({
  emerging,
  visible,
  guestName,
}: {
  emerging: boolean;
  visible: boolean;
  guestName: string;
}) {
  // Card stays BEHIND the V-pocket back face in 3D depth (local z just behind
  // the back face plane). The only motion is vertical translateY, matching the
  // 2D WeddingEnvelope exactly. After the body's 180° Y flip the back face is
  // between the viewer and the card, so the portion of the card that overlaps
  // the envelope XY bounds is hidden behind the V-pocket panel. The portion
  // that moves ABOVE the envelope top becomes visible — it reads as the card
  // sliding up out of the pocket opening. A tiny strip pokes out below the
  // envelope too, reinforcing the "card passes through envelope" feel.
  const CARD_TOP_REST = 0;
  const ENVELOPE_TOP_IN_SCENE = SCENE_H - ENVELOPE_BOTTOM_OFFSET - H;
  const CARD_RISE = ENVELOPE_TOP_IN_SCENE; // card top travels from envelope top to scene top

  return (
    <div
      style={{
        position: "absolute",
        left: (W - CARD_W) / 2,
        top: CARD_TOP_REST,
        width: CARD_W,
        height: CARD_H,
        transform: `
          translateZ(0px)
          rotateY(180deg)
          translateY(${emerging ? -CARD_RISE : 0}px)
        `,
        transition: emerging
          ? "transform 2s cubic-bezier(0.45, 0, 0.15, 1)"
          : "none",
        pointerEvents: emerging ? "auto" : "none",
        visibility: visible ? "visible" : "hidden",
      }}
    >
      <InvitationCardFront guestName={guestName} />
    </div>
  );
}

function InvitationCardFront({ guestName }: { guestName: string }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(165deg, #f5f6f3 0%, #eceadb 100%)",
        border: "1px solid #d8d5c4",
        borderRadius: 8,
        boxShadow:
          "inset 0 0 0 8px #f5f6f3, inset 0 0 0 9px #d5d1ad, 0 20px 50px -12px rgba(0,0,0,0.35)",
        padding: "48px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        backfaceVisibility: "hidden",
        color: "#555670",
        textAlign: "center",
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: 11,
            letterSpacing: "0.35em",
            opacity: 0.55,
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Sayın {guestName}
        </div>
        <div
          style={{
            fontFamily: "Merienda, serif",
            fontSize: 13,
            fontStyle: "italic",
            opacity: 0.7,
          }}
        >
          sizi davet ediyoruz
        </div>
      </div>

      <div>
        <div
          style={{
            fontFamily: "Orbitron, sans-serif",
            fontSize: 20,
            letterSpacing: "0.22em",
            marginBottom: 10,
          }}
        >
          DÜĞÜN
        </div>
        <div
          style={{
            fontFamily: "Merienda, serif",
            fontSize: 30,
            fontStyle: "italic",
            lineHeight: 1.05,
          }}
        >
          Hilal &amp; İbrahim
        </div>
        <div
          style={{
            width: 60,
            height: 1,
            background: "#d5d1ad",
            margin: "18px auto",
          }}
        />
        <div
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: 13,
            letterSpacing: "0.12em",
          }}
        >
          15 HAZİRAN 2026
        </div>
        <div
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: 11,
            opacity: 0.65,
            marginTop: 6,
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
          opacity: 0.6,
        }}
      >
        ~ bize katılın ~
      </div>
    </div>
  );
}

/* ───── Daisy lining pattern (matches 2D WeddingEnvelope default) ───── */
function LiningDaisyPattern() {
  return (
    <svg
      viewBox="0 0 200 100"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="daisy-center" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbe06a" />
          <stop offset="100%" stopColor="#d48f1e" />
        </radialGradient>
      </defs>
      {Array.from({ length: 18 }).map((_, i) => {
        const x = 15 + (i % 6) * 32 + (Math.floor(i / 6) % 2) * 14;
        const y = 15 + Math.floor(i / 6) * 28;
        return (
          <g key={i} transform={`translate(${x},${y})`}>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <ellipse
                key={a}
                rx="3.5"
                ry="9"
                cx="0"
                cy="-7"
                fill="#ffffff"
                stroke="#d4b886"
                strokeWidth="0.4"
                transform={`rotate(${a})`}
              />
            ))}
            <circle r="3" fill="url(#daisy-center)" />
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
