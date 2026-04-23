"use client";

import { useState, type ReactNode } from "react";
import { InvitationCard } from "./InvitationCard";

/* =====================================================================
 * FourFlapStage — Pseudo-3D envelope via 4 clip-path triangles.
 *
 * All 4 triangles meet at center (50%, 50%). Slight shade differences
 * between triangles create the folded-paper depth illusion.
 *
 * On open:
 *   - Top triangle collapses to a horizontal line (flap lifted)
 *   - Seal fades + rotates + scales out
 *   - Card (behind flaps) slides up; its top content overflows above
 *     the envelope so the wedding info becomes visible
 *
 * Timing mimics the reference:
 *   - Flap snap open FAST (0.1s), close SLOW (1s)
 *   - Card rise SLOW (1s), return FAST (0.3s)
 * ===================================================================== */

interface FourFlapProps {
  width?: number;
  cardContent?: ReactNode;
}

interface FlapColors {
  tp: string; // top flap (animated)
  lft: string; // left flap (static)
  rgt: string; // right flap (static)
  btm: string; // bottom flap (static)
}

interface StageConfig {
  colors: FlapColors;
  /** Background behind flaps (shows only if clip-path gaps; normally invisible). */
  bg?: string;
  /** Wax seal / medallion in center, fades out on open. */
  seal?: ReactNode;
  /** Extra decoration (stamp, ribbon, stripes). Stays visible. */
  sticker?: ReactNode;
  /** Card inner content (defaults to InvitationCard). */
  cardContent?: ReactNode;
  /** Card background (defaults to white). */
  cardBg?: string;
}

function useOpen() {
  const [open, setOpen] = useState(false);
  return { open, toggle: () => setOpen((o) => !o) };
}

function FourFlapStage({
  width = 320,
  colors,
  bg = "#1a1a1a",
  seal,
  sticker,
  cardContent,
  cardBg = "#ffffff",
}: StageConfig & FourFlapProps) {
  const { open, toggle } = useOpen();
  const height = Math.round((width * 9) / 16);
  const rise = Math.round(height * 0.88);

  return (
    <div
      onClick={toggle}
      className="relative cursor-pointer select-none"
      style={{ width, height, background: bg }}
    >
      {/* Card behind flaps — slides up when open */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{
          background: cardBg,
          transform: `translateY(${open ? -rise : 0}px)`,
          transition: `transform ${open ? "1s" : "0.3s"} cubic-bezier(0.7, 0, 0.2, 1)`,
          zIndex: 1,
          boxShadow: open ? "0 8px 24px -6px rgba(0,0,0,0.25)" : "none",
        }}
      >
        {cardContent ?? <InvitationCard />}
      </div>

      {/* Wax seal / medallion — fades + scales + rotates out */}
      {seal ? (
        <div
          className="absolute"
          style={{
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) scale(${open ? 0 : 1}) rotate(${
              open ? 180 : 0
            }deg)`,
            opacity: open ? 0 : 1,
            transition: "transform 1s cubic-bezier(0.7, 0, 0.2, 1), opacity 0.8s",
            zIndex: 40,
          }}
        >
          {seal}
        </div>
      ) : null}

      {/* Top flap — animated: collapses to a line on open */}
      <div
        className="absolute inset-0"
        style={{
          background: colors.tp,
          clipPath: open
            ? "polygon(50% 0%, 100% 0, 0 0)"
            : "polygon(50% 50%, 100% 0, 0 0)",
          transition: `clip-path ${open ? "0.1s" : "1s"} cubic-bezier(0.7, 0, 0.2, 1)`,
          zIndex: 10,
        }}
      />
      {/* Left flap (static) */}
      <div
        className="absolute inset-0"
        style={{
          background: colors.lft,
          clipPath: "polygon(50% 50%, 0 0, 0 100%)",
          zIndex: 10,
        }}
      />
      {/* Right flap (static) */}
      <div
        className="absolute inset-0"
        style={{
          background: colors.rgt,
          clipPath: "polygon(50% 50%, 100% 0, 100% 100%)",
          zIndex: 10,
        }}
      />
      {/* Bottom flap (static) */}
      <div
        className="absolute inset-0"
        style={{
          background: colors.btm,
          clipPath: "polygon(50% 50%, 100% 100%, 0 100%)",
          zIndex: 10,
        }}
      />

      {/* Sticker / decoration on top of flaps (stays visible) */}
      {sticker}
    </div>
  );
}

/* =====================================================================
 * Shared small pieces used by seals and stickers
 * ===================================================================== */

function WaxSeal({
  letter = "D",
  color = "#a8323d",
  dark = "#6b1c23",
  text = "#f5d5cf",
  size = 46,
}: {
  letter?: string;
  color?: string;
  dark?: string;
  text?: string;
  size?: number;
}) {
  return (
    <div
      className="flex items-center justify-center font-semibold"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 30%, ${color}, ${dark} 75%)`,
        boxShadow:
          "0 4px 8px rgba(0,0,0,0.35), inset 0 -4px 6px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.18)",
        color: text,
        fontFamily: "Merienda, serif",
        fontStyle: "italic",
        fontSize: size * 0.42,
        lineHeight: 1,
      }}
    >
      {letter}
    </div>
  );
}

function PillSeal({
  letter = "D",
  color = "#f5a623",
  dark = "#8a4a0a",
  text = "#5e2a00",
  border = "#3d1a00",
  size = 40,
}: {
  letter?: string;
  color?: string;
  dark?: string;
  text?: string;
  border?: string;
  size?: number;
}) {
  return (
    <div
      className="flex items-center justify-center font-semibold text-[10px]"
      style={{
        width: size,
        height: size,
        background: color,
        color: text,
        clipPath:
          "polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)",
        borderRadius: 0,
        border: `3px solid ${border}`,
        backgroundImage: `radial-gradient(circle at 30% 25%, ${color}, ${dark} 80%)`,
      }}
    >
      {letter}
    </div>
  );
}

/* =====================================================================
 * V1 — Klasik V (classic beige with wax seal)
 * ===================================================================== */
export function Envelope01Classic({ width = 320, cardContent }: FourFlapProps) {
  return (
    <FourFlapStage
      width={width}
      cardContent={cardContent}
      bg="#2a2520"
      cardBg="#fffdf7"
      colors={{
        tp: "#e8dcbb",
        lft: "#f0e5c6",
        rgt: "#e2d5b1",
        btm: "#d5c9a8",
      }}
      seal={<WaxSeal letter="D" color="#b88a54" dark="#6b5230" text="#f5eedb" />}
    />
  );
}

/* =====================================================================
 * V2 — Modern Yatay (two-tone clean, no seal)
 * ===================================================================== */
export function Envelope02Horizontal({
  width = 320,
  cardContent,
}: FourFlapProps) {
  return (
    <FourFlapStage
      width={width}
      cardContent={cardContent}
      bg="#1d1b17"
      cardBg="#fdfcf7"
      colors={{
        tp: "#d8cdb3",
        lft: "#ebe4d0",
        rgt: "#d2c7ad",
        btm: "#c5b995",
      }}
    />
  );
}

/* =====================================================================
 * V3 — Mum Mühürü (red wax seal, cream flaps)
 * ===================================================================== */
export function Envelope03WaxSeal({
  width = 320,
  cardContent,
}: FourFlapProps) {
  return (
    <FourFlapStage
      width={width}
      cardContent={cardContent}
      bg="#2a1f1d"
      cardBg="#fdf8f0"
      colors={{
        tp: "#e8dcc8",
        lft: "#f3ebda",
        rgt: "#e0d3be",
        btm: "#d3c4ac",
      }}
      seal={<WaxSeal letter="D" color="#b82a3a" dark="#6b1520" size={50} />}
    />
  );
}

/* =====================================================================
 * V4 — Pencereli (window effect — small pale patch on bottom flap)
 * ===================================================================== */
export function Envelope04Window({
  width = 320,
  cardContent,
}: FourFlapProps) {
  return (
    <FourFlapStage
      width={width}
      cardContent={cardContent}
      bg="#1a1a1a"
      cardBg="#fefcf4"
      colors={{
        tp: "#ddd4b9",
        lft: "#eee5ca",
        rgt: "#d2c9ae",
        btm: "#c5bba0",
      }}
      sticker={
        <div
          className="absolute pointer-events-none"
          style={{
            left: "22%",
            right: "22%",
            top: "70%",
            height: "12%",
            background: "rgba(255,255,255,0.55)",
            border: "1px solid rgba(0,0,0,0.15)",
            zIndex: 20,
            borderRadius: 1,
          }}
        />
      }
    />
  );
}

/* =====================================================================
 * V5 — Kraft + İp (kraft paper + twine across middle)
 * ===================================================================== */
export function Envelope05Kraft({ width = 320, cardContent }: FourFlapProps) {
  return (
    <FourFlapStage
      width={width}
      cardContent={cardContent}
      bg="#3d2b18"
      cardBg="#f7ecd9"
      colors={{
        tp: "#a07d59",
        lft: "#b8926b",
        rgt: "#9a7450",
        btm: "#8a6744",
      }}
      sticker={
        <>
          <div
            className="absolute left-0 right-0 pointer-events-none"
            style={{
              top: "46%",
              height: 3,
              background:
                "repeating-linear-gradient(90deg, #d9c59c 0 5px, #8a6744 5px 9px)",
              zIndex: 20,
              boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              left: "60%",
              top: "44%",
              width: 34,
              height: 22,
              background: "#efe2c6",
              clipPath:
                "polygon(18% 0, 100% 0, 100% 100%, 18% 100%, 0 50%)",
              zIndex: 21,
              transform: "rotate(-4deg)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          />
        </>
      }
    />
  );
}

/* =====================================================================
 * V6 — Asimetrik (high contrast dark flaps + cream pocket)
 * ===================================================================== */
export function Envelope06Diagonal({
  width = 320,
  cardContent,
}: FourFlapProps) {
  return (
    <FourFlapStage
      width={width}
      cardContent={cardContent}
      bg="#0a0a0a"
      cardBg="#ffffff"
      colors={{
        tp: "#2a2824",
        lft: "#e8e4df",
        rgt: "#1f1d1a",
        btm: "#d0ccc5",
      }}
    />
  );
}

/* =====================================================================
 * V7 — Posta Pulu (stamp in top-right + postmark)
 * ===================================================================== */
export function Envelope07Postal({
  width = 320,
  cardContent,
}: FourFlapProps) {
  return (
    <FourFlapStage
      width={width}
      cardContent={cardContent}
      bg="#1f1d1a"
      cardBg="#fdfaf0"
      colors={{
        tp: "#e9e2ce",
        lft: "#f4ede1",
        rgt: "#e2dbc6",
        btm: "#d4ccb3",
      }}
      sticker={
        <>
          <div
            className="absolute pointer-events-none"
            style={{
              top: "8%",
              right: "6%",
              width: 34,
              height: 42,
              background: "#b85450",
              border: "2px dashed #fff",
              zIndex: 21,
              transform: "rotate(4deg)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
            }}
          />
          <div
            className="absolute pointer-events-none flex items-center justify-center"
            style={{
              top: "6%",
              left: "8%",
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "2px solid rgba(40,40,40,0.45)",
              transform: "rotate(-10deg)",
              color: "rgba(40,40,40,0.45)",
              fontFamily: "monospace",
              fontSize: 7,
              textAlign: "center",
              lineHeight: 1.1,
              zIndex: 21,
            }}
          >
            <div>
              DAVETY
              <br />
              ★
              <br />
              2026
            </div>
          </div>
        </>
      }
    />
  );
}

/* =====================================================================
 * V8 — Kurdela (ribbon strip across middle + bow at center)
 * ===================================================================== */
export function Envelope08Ribbon({
  width = 320,
  cardContent,
}: FourFlapProps) {
  const ribbon = "#a83a4f";
  return (
    <FourFlapStage
      width={width}
      cardContent={cardContent}
      bg="#2a1418"
      cardBg="#fdf4f5"
      colors={{
        tp: "#ddd1ba",
        lft: "#ebe0c8",
        rgt: "#d5c9ae",
        btm: "#c7ba9d",
      }}
      seal={
        <div
          className="flex items-center justify-center"
          style={{
            width: 46,
            height: 30,
            background: `linear-gradient(to bottom, ${ribbon}, #7a2739)`,
            borderRadius: 3,
            boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
          }}
        />
      }
      sticker={
        <div
          className="absolute pointer-events-none"
          style={{
            left: "50%",
            top: 0,
            bottom: 0,
            width: 28,
            transform: "translateX(-50%)",
            background: `linear-gradient(to right, ${ribbon}, #c8526a 45%, ${ribbon})`,
            zIndex: 20,
            boxShadow: "inset 1px 0 3px rgba(0,0,0,0.15)",
          }}
        />
      }
    />
  );
}

/* =====================================================================
 * V9 — Monogram (dark navy + gold D seal)
 * ===================================================================== */
export function Envelope09Monogram({
  width = 320,
  cardContent,
}: FourFlapProps) {
  return (
    <FourFlapStage
      width={width}
      cardContent={cardContent}
      bg="#0d0c0a"
      cardBg="#f9f3e4"
      colors={{
        tp: "#262320",
        lft: "#322e28",
        rgt: "#1d1b17",
        btm: "#141210",
      }}
      seal={
        <div
          className="flex items-center justify-center"
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            border: "2px solid #d4b886",
            color: "#d4b886",
            fontFamily: "Merienda, serif",
            fontStyle: "italic",
            fontSize: 30,
            lineHeight: 1,
            background: "rgba(212,184,134,0.06)",
            textShadow: "0 1px 2px rgba(0,0,0,0.5)",
          }}
        >
          D
        </div>
      }
    />
  );
}

/* =====================================================================
 * V10 — Hava Postası (red/blue stripe border)
 * ===================================================================== */
export function Envelope10AirMail({
  width = 320,
  cardContent,
}: FourFlapProps) {
  return (
    <FourFlapStage
      width={width}
      cardContent={cardContent}
      bg="#1a1a1a"
      cardBg="#ffffff"
      colors={{
        tp: "#f0f0f0",
        lft: "#fafafa",
        rgt: "#e8e8e8",
        btm: "#dcdcdc",
      }}
      sticker={
        <>
          {/* Striped border */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              padding: 6,
              background:
                "repeating-linear-gradient(45deg, #cc2030 0 8px, #ffffff 8px 16px, #1d4a8f 16px 24px, #ffffff 24px 32px)",
              WebkitMask:
                "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              zIndex: 25,
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              top: "12%",
              left: "12%",
              fontFamily: "monospace",
              fontSize: 9,
              fontWeight: 700,
              color: "#cc2030",
              letterSpacing: 2,
              zIndex: 26,
            }}
          >
            PAR AVION
          </div>
        </>
      }
    />
  );
}

/* =====================================================================
 * V11 — Dört Kanat (original reference: black + orange wax seal)
 * Exact structure from user's OnChain Win reference.
 * ===================================================================== */
export function Envelope11FourFlap({
  width = 320,
  cardContent,
}: FourFlapProps) {
  return (
    <FourFlapStage
      width={width}
      cardContent={cardContent}
      bg="#000000"
      cardBg="#ffffff"
      colors={{
        tp: "#262626",
        lft: "#171717",
        rgt: "#262626",
        btm: "#171717",
      }}
      seal={
        <PillSeal
          letter="D"
          color="#f97316"
          dark="#c2410c"
          text="#9a3412"
          border="#7c2d12"
        />
      }
    />
  );
}

/* =====================================================================
 * Registry
 * ===================================================================== */
export const ENVELOPE_VARIANTS: {
  id: string;
  name: string;
  Component: (props: FourFlapProps) => ReactNode;
}[] = [
  { id: "classic", name: "Klasik V", Component: Envelope01Classic },
  { id: "horizontal", name: "Modern Yatay", Component: Envelope02Horizontal },
  { id: "wax-seal", name: "Mum Mühürü", Component: Envelope03WaxSeal },
  { id: "window", name: "Pencereli", Component: Envelope04Window },
  { id: "kraft", name: "Kraft + İp", Component: Envelope05Kraft },
  { id: "diagonal", name: "Asimetrik", Component: Envelope06Diagonal },
  { id: "postal", name: "Posta Pulu", Component: Envelope07Postal },
  { id: "ribbon", name: "Kurdela", Component: Envelope08Ribbon },
  { id: "monogram", name: "Monogram", Component: Envelope09Monogram },
  { id: "air-mail", name: "Hava Postası", Component: Envelope10AirMail },
  { id: "four-flap", name: "Dört Kanat", Component: Envelope11FourFlap },
];
