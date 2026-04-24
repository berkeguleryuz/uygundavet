"use client";

import type { ReactNode } from "react";
import {
  MonogramSeal,
  PillSeal,
  WaxSeal,
  type WeddingEnvelopeProps,
} from "./WeddingEnvelope";

/**
 * 16 envelope variants. All share the same flip+open+slide flow.
 * Each preset customises visual details:
 *   - envelope colors
 *   - flap lining pattern
 *   - decorative stickers (stamp, ribbon, twine, border, window)
 *   - back-flap seal (wax, monogram, pill)
 *   - card theme
 */

export interface EnvelopePreset {
  id: string;
  name: string;
  props: Partial<WeddingEnvelopeProps>;
}

/* ─── Shared decoration helpers ─────────────────────────────────────── */

function PostalStamp() {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        top: "10%",
        right: "8%",
        width: 50,
        height: 60,
        background: "#b85450",
        border: "2px dashed #fff",
        transform: "rotate(4deg)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        zIndex: 5,
      }}
    />
  );
}

function Postmark() {
  return (
    <div
      className="absolute pointer-events-none flex items-center justify-center"
      style={{
        top: "14%",
        right: "25%",
        width: 56,
        height: 56,
        borderRadius: "50%",
        border: "2px solid rgba(40,40,40,0.4)",
        transform: "rotate(-10deg)",
        color: "rgba(40,40,40,0.4)",
        fontFamily: "monospace",
        fontSize: 8,
        textAlign: "center",
        lineHeight: 1.1,
        zIndex: 5,
      }}
    >
      <div>
        DAVETY
        <br />★<br />
        2026
      </div>
    </div>
  );
}

function VerticalRibbon({ color = "#a83a4f" }: { color?: string }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: "50%",
        top: 0,
        bottom: 0,
        width: 32,
        transform: "translateX(-50%)",
        background: `linear-gradient(to right, ${color}, #c8526a 50%, ${color})`,
        boxShadow: "inset 2px 0 4px rgba(0,0,0,0.2)",
        zIndex: 3,
      }}
    />
  );
}

function KraftTwine() {
  return (
    <>
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: "50%",
          height: 3,
          background:
            "repeating-linear-gradient(90deg, #d9c59c 0 5px, #8a6744 5px 9px)",
          zIndex: 3,
          boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          left: "58%",
          top: "47%",
          width: 40,
          height: 26,
          background: "#efe2c6",
          clipPath: "polygon(18% 0, 100% 0, 100% 100%, 18% 100%, 0 50%)",
          transform: "rotate(-4deg)",
          zIndex: 4,
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
        }}
      />
    </>
  );
}

function AirmailBorder() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        padding: 7,
        background:
          "repeating-linear-gradient(45deg, #cc2030 0 10px, #ffffff 10px 20px, #1d4a8f 20px 30px, #ffffff 30px 40px)",
        WebkitMask:
          "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        zIndex: 6,
      }}
    />
  );
}

function ParAvion() {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        top: "12%",
        left: "12%",
        fontFamily: "monospace",
        fontSize: 10,
        fontWeight: 700,
        color: "#cc2030",
        letterSpacing: 2,
        zIndex: 7,
      }}
    >
      PAR AVION
    </div>
  );
}

function WindowCutout() {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: "12%",
        right: "12%",
        top: "45%",
        height: "25%",
        background: "rgba(255,255,255,0.55)",
        border: "1px solid rgba(0,0,0,0.12)",
        borderRadius: 2,
        zIndex: 4,
      }}
    />
  );
}

function KraftTexture() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0 2px, transparent 2px 7px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 7px)",
        zIndex: 2,
      }}
    />
  );
}

/* ─── 16 base presets (flat) — katlı variants derived below ─────────── */

const BASE_PRESETS: EnvelopePreset[] = [
  // ── Original 11 ─────────────────────────────────────────────────────
  {
    id: "classic-v",
    name: "Klasik V",
    props: {
      envelopeColor: "#f5eedb",
      liningPattern: "daisy",
      liningBg: "#1f1c17",
      cardProps: {
        accent: "#6b5a42",
        bg: "#fdfbf4",
        decorative: "daisy",
      },
    },
  },
  {
    id: "modern-yatay",
    name: "Modern Yatay",
    props: {
      envelopeColor: "#ebe4d6",
      liningPattern: "none",
      liningBg: "#2a2620",
      cardProps: {
        accent: "#4a4033",
        bg: "#fdfcf7",
        decorative: "none",
      },
    },
  },
  {
    id: "mum-muhuru",
    name: "Mum Mühürü",
    props: {
      envelopeColor: "#f3eadc",
      liningPattern: "rose",
      liningBg: "#2a1216",
      flapSeal: <WaxSeal letter="D" color="#b82a3a" dark="#6b1520" size={52} />,
      cardProps: {
        accent: "#8b3a4b",
        bg: "#fdf2f4",
        decorative: "rose",
      },
    },
  },
  {
    id: "pencereli",
    name: "Pencereli",
    props: {
      envelopeColor: "#eee7d3",
      liningPattern: "daisy",
      liningBg: "#1a1612",
      frontExtra: <WindowCutout />,
      cardProps: {
        accent: "#3d3a2e",
        bg: "#fefcf4",
        decorative: "daisy",
      },
    },
  },
  {
    id: "kraft-ip",
    name: "Kraft + İp",
    props: {
      envelopeColor: "#b8926b",
      liningPattern: "gold",
      liningBg: "#2a1d10",
      frontExtra: (
        <>
          <KraftTexture />
          <KraftTwine />
        </>
      ),
      backExtra: <KraftTexture />,
      cardProps: {
        accent: "#3a2815",
        bg: "#f7ecd9",
        decorative: "gold",
      },
    },
  },
  {
    id: "asimetrik",
    name: "Asimetrik",
    props: {
      envelopeColor: "#e8e4df",
      liningPattern: "chevron",
      liningBg: "#1f1d1a",
      cardProps: {
        accent: "#1a1a1a",
        bg: "#ffffff",
        decorative: "none",
      },
    },
  },
  {
    id: "posta-pulu",
    name: "Posta Pulu",
    props: {
      envelopeColor: "#f6f2e8",
      liningPattern: "daisy",
      liningBg: "#1e1c17",
      frontExtra: (
        <>
          <PostalStamp />
          <Postmark />
        </>
      ),
      cardProps: {
        accent: "#6b5a42",
        bg: "#fdfbf4",
        decorative: "daisy",
      },
    },
  },
  {
    id: "kurdela",
    name: "Kurdela",
    props: {
      envelopeColor: "#f0e8db",
      liningPattern: "rose",
      liningBg: "#2a1418",
      frontExtra: <VerticalRibbon color="#a83a4f" />,
      backExtra: <VerticalRibbon color="#a83a4f" />,
      cardProps: {
        accent: "#8b3a4b",
        bg: "#fdf4f5",
        decorative: "rose",
      },
    },
  },
  {
    id: "monogram",
    name: "Monogram",
    props: {
      envelopeColor: "#1d1b17",
      liningPattern: "gold",
      liningBg: "#0d0c0a",
      flapSeal: <MonogramSeal letter="D" size={60} />,
      cardProps: {
        accent: "#d4b886",
        bg: "#141210",
        decorative: "gold",
      },
    },
  },
  {
    id: "hava-postasi",
    name: "Hava Postası",
    props: {
      envelopeColor: "#ffffff",
      liningPattern: "chevron",
      liningBg: "#1d4a8f",
      frontBorder: <AirmailBorder />,
      frontExtra: <ParAvion />,
      cardProps: {
        accent: "#1d4a8f",
        bg: "#ffffff",
        decorative: "none",
      },
    },
  },
  {
    id: "dort-kanat",
    name: "Dört Kanat",
    props: {
      envelopeColor: "#1a1a1a",
      liningPattern: "none",
      liningBg: "#000000",
      flapSeal: <PillSeal letter="D" size={46} />,
      cardProps: {
        accent: "#f97316",
        bg: "#1a1a1a",
        decorative: "gold",
      },
    },
  },
  // ── Newer 5 ─────────────────────────────────────────────────────────
  {
    id: "klasik-papatya",
    name: "Klasik Papatya",
    props: {
      envelopeColor: "#f5f1e8",
      liningPattern: "daisy",
      liningBg: "#1f1c17",
      cardProps: {
        accent: "#4a5533",
        bg: "#fdfbf4",
        decorative: "daisy",
      },
    },
  },
  {
    id: "altin-gece",
    name: "Altın Gece",
    props: {
      envelopeColor: "#e8e0d0",
      liningPattern: "gold",
      liningBg: "#1a1612",
      flapSeal: <MonogramSeal letter="D" size={58} />,
      cardProps: {
        accent: "#d4b886",
        bg: "#161310",
        decorative: "gold",
      },
    },
  },
  {
    id: "gul-bahcesi",
    name: "Gül Bahçesi",
    props: {
      envelopeColor: "#f8ece9",
      liningPattern: "rose",
      liningBg: "#2a1216",
      flapSeal: <WaxSeal letter="D" color="#c26470" dark="#7a2d3a" size={50} />,
      cardProps: {
        accent: "#8b3a4b",
        bg: "#fdf2f4",
        decorative: "rose",
      },
    },
  },
  {
    id: "minimal",
    name: "Minimal",
    props: {
      envelopeColor: "#ffffff",
      liningPattern: "none",
      liningBg: "#1a1a1a",
      cardProps: {
        accent: "#1a1a1a",
        bg: "#fafafa",
        decorative: "none",
      },
    },
  },
  {
    id: "kraft-lux",
    name: "Kraft Lüks",
    props: {
      envelopeColor: "#c5a278",
      liningPattern: "gold",
      liningBg: "#2a1d10",
      flapSeal: <WaxSeal letter="D" color="#d4b886" dark="#6b5230" size={48} />,
      cardProps: {
        accent: "#3a2815",
        bg: "#f7ecd9",
        decorative: "gold",
      },
    },
  },
];

/**
 * 32 total presets = 16 flat + 16 shaded ("Katlı") derivatives.
 * Katlı versions share visuals + decorations with their flat counterparts,
 * differing only in backStyle which renders the 4 V-seam triangles visibly.
 */
export const ENVELOPE_PRESETS: EnvelopePreset[] = [
  ...BASE_PRESETS,
  ...BASE_PRESETS.map<EnvelopePreset>((p) => ({
    id: `${p.id}-katli`,
    name: `${p.name} (Katlı)`,
    props: { ...p.props, backStyle: "shaded" },
  })),
];
