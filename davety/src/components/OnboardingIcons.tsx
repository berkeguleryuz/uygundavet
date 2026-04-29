"use client";

import { motion } from "framer-motion";

const SIZE = 72;

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function CelebrateIcon() {
  const sparks = [
    { x: 50, y: 18, c: "#f4b860", d: 0 },
    { x: 76, y: 30, c: "#e8a39a", d: 0.15 },
    { x: 82, y: 56, c: "#9bb7d4", d: 0.3 },
    { x: 24, y: 30, c: "#c9b3e0", d: 0.45 },
    { x: 18, y: 56, c: "#a4cfa1", d: 0.6 },
  ];
  return (
    <Frame>
      <motion.circle
        cx="50"
        cy="58"
        r="22"
        fill="#fef3c7"
        stroke="#d97706"
        strokeWidth="2.5"
        initial={{ scale: 0.85 }}
        animate={{ scale: [0.85, 1, 0.85] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "50px 58px" }}
      />
      <motion.path
        d="M40 56 Q44 62 50 62 Q56 62 60 56"
        stroke="#d97706"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      <circle cx="43" cy="52" r="1.6" fill="#d97706" />
      <circle cx="57" cy="52" r="1.6" fill="#d97706" />
      {sparks.map((s, i) => (
        <motion.g key={i}>
          <motion.circle
            cx={s.x}
            cy={s.y}
            r="2.2"
            fill={s.c}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.2, 0],
              y: [0, -8, -16],
            }}
            transition={{
              duration: 1.6,
              delay: s.d,
              repeat: Infinity,
              repeatDelay: 0.8,
            }}
          />
        </motion.g>
      ))}
    </Frame>
  );
}

export function PencilIcon() {
  return (
    <Frame>
      <motion.path
        d="M22 78 L62 38"
        stroke="#cbd5e1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="2 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 1, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.g
        animate={{ x: [0, 40, 40, 0], y: [0, -40, -40, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="14" y="70" width="22" height="8" rx="1.5" fill="#fcd34d" stroke="#92400e" strokeWidth="1.6" transform="rotate(-45 25 74)" />
        <polygon points="8,76 16,72 16,80" fill="#1f2937" stroke="#1f2937" strokeWidth="1.2" transform="rotate(-45 12 76)" />
        <rect x="32" y="70" width="6" height="8" rx="1" fill="#f87171" stroke="#92400e" strokeWidth="1.4" transform="rotate(-45 35 74)" />
      </motion.g>
    </Frame>
  );
}

export function CursorClickIcon() {
  return (
    <Frame>
      <motion.circle
        cx="50"
        cy="50"
        r="6"
        fill="none"
        stroke="#6366f1"
        strokeWidth="2"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.8, 2.4], opacity: [0.8, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
        style={{ transformOrigin: "50px 50px" }}
      />
      <motion.circle
        cx="50"
        cy="50"
        r="6"
        fill="none"
        stroke="#6366f1"
        strokeWidth="2"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.8, 2.4], opacity: [0.8, 0] }}
        transition={{ duration: 1.4, delay: 0.5, repeat: Infinity, ease: "easeOut" }}
        style={{ transformOrigin: "50px 50px" }}
      />
      <motion.g
        animate={{ scale: [1, 0.85, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "50px 50px" }}
      >
        <path
          d="M42 38 L42 66 L50 58 L56 70 L60 68 L54 56 L64 56 Z"
          fill="#1f2937"
          stroke="#f8fafc"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </motion.g>
    </Frame>
  );
}

export function InfoIcon() {
  return (
    <Frame>
      <motion.circle
        cx="50"
        cy="50"
        r="26"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2"
        initial={{ scale: 1, opacity: 0.5 }}
        animate={{ scale: [1, 1.25], opacity: [0.5, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        style={{ transformOrigin: "50px 50px" }}
      />
      <motion.circle
        cx="50"
        cy="50"
        r="22"
        fill="#dbeafe"
        stroke="#3b82f6"
        strokeWidth="2.5"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "50px 50px" }}
      />
      <motion.circle
        cx="50"
        cy="40"
        r="2.6"
        fill="#1d4ed8"
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      />
      <motion.path
        d="M50 47 L50 62"
        stroke="#1d4ed8"
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      />
    </Frame>
  );
}

export function TypographyIcon() {
  const letters = [
    { ch: "A", x: 22, y: 60, d: 0 },
    { ch: "a", x: 50, y: 60, d: 0.15 },
    { ch: "g", x: 76, y: 60, d: 0.3 },
  ];
  return (
    <Frame>
      <motion.line
        x1="14"
        y1="74"
        x2="86"
        y2="74"
        stroke="#cbd5e1"
        strokeWidth="1.6"
        strokeDasharray="3 3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8 }}
      />
      {letters.map((l) => (
        <motion.text
          key={l.ch}
          x={l.x}
          y={l.y}
          textAnchor="middle"
          fontFamily="Georgia, serif"
          fontSize="36"
          fontWeight="700"
          fill="#1f2937"
          initial={{ opacity: 0, y: l.y - 8 }}
          animate={{
            opacity: [0, 1, 1, 1, 0],
            y: [l.y - 8, l.y, l.y, l.y, l.y - 8],
          }}
          transition={{
            duration: 3,
            delay: l.d,
            repeat: Infinity,
            repeatDelay: 0.4,
          }}
        >
          {l.ch}
        </motion.text>
      ))}
      <motion.rect
        x="14"
        y="32"
        width="72"
        height="2"
        rx="1"
        fill="#6366f1"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: [0, 1, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "14px 33px" }}
      />
    </Frame>
  );
}

export function SpacingIcon() {
  return (
    <Frame>
      <motion.rect
        x="22"
        y="20"
        width="56"
        height="16"
        rx="3"
        fill="#fde68a"
        stroke="#92400e"
        strokeWidth="1.5"
        animate={{ y: [20, 14, 20] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.rect
        x="22"
        y="64"
        width="56"
        height="16"
        rx="3"
        fill="#bfdbfe"
        stroke="#1d4ed8"
        strokeWidth="1.5"
        animate={{ y: [64, 70, 64] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.g
        animate={{ scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "50px 50px" }}
      >
        <path
          d="M50 40 L50 60"
          stroke="#1f2937"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M44 44 L50 38 L56 44"
          stroke="#1f2937"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M44 56 L50 62 L56 56"
          stroke="#1f2937"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </motion.g>
    </Frame>
  );
}

export function getOnboardingIcon(step: number) {
  switch (step) {
    case 0:
      return <CelebrateIcon />;
    case 1:
      return <PencilIcon />;
    case 2:
      return <CursorClickIcon />;
    case 3:
      return <InfoIcon />;
    case 4:
      return <TypographyIcon />;
    case 5:
      return <SpacingIcon />;
    default:
      return null;
  }
}
