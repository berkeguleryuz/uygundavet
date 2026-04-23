"use client";

import { useEffect, useState, type CSSProperties } from "react";

export interface InvitationCardProps {
  brideName?: string;
  groomName?: string;
  subtitle?: string;
  description?: string;
  /** ISO date string (yyyy-MM-dd) */
  weddingDate?: string;
  /** "HH:mm" */
  weddingTime?: string;
  venueName?: string;
  venueAddress?: string;
  locale?: "tr" | "en" | "de";
  accent?: string;
  bg?: string;
  /** Use gold accent on dark bg when true. */
  decorative?: "daisy" | "rose" | "gold" | "none";
  style?: CSSProperties;
  showCountdown?: boolean;
  /** Width/height in px */
  width?: number;
  height?: number;
}

function useCountdown(targetIso: string | null) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    if (!targetIso) return;
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [targetIso]);
  if (!targetIso || now === null) return null;
  const target = new Date(targetIso).getTime();
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  return { d, h, m, s };
}

const MONTHS_TR = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];
const DAYS_TR = [
  "Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi",
];

function formatDateParts(
  iso: string | undefined,
  locale: "tr" | "en" | "de"
): { dayName: string; day: string; month: string; year: string } | null {
  if (!iso) return null;
  const d = new Date(`${iso}T00:00:00`);
  if (isNaN(d.getTime())) return null;
  if (locale === "tr") {
    return {
      dayName: DAYS_TR[d.getDay()],
      day: String(d.getDate()).padStart(2, "0"),
      month: MONTHS_TR[d.getMonth()],
      year: String(d.getFullYear()),
    };
  }
  return {
    dayName: d.toLocaleDateString(locale === "de" ? "de-DE" : "en-US", {
      weekday: "long",
    }),
    day: String(d.getDate()).padStart(2, "0"),
    month: d.toLocaleDateString(locale === "de" ? "de-DE" : "en-US", {
      month: "long",
    }),
    year: String(d.getFullYear()),
  };
}

/**
 * Full portrait wedding invitation card. Shows names, subtitle, description,
 * live countdown, date breakdown, optional venue. Dimensions default to 360×680
 * matching the reference "w-360 portrait" mobile card.
 */
export function InvitationCard({
  brideName = "Havva",
  groomName = "İbrahim",
  subtitle = "Aşkın Başladığı Gün",
  description = "Kalplerimizin sonsuza kadar bir olduğu bu özel günde, sevincimizi sizinle paylaşmak istiyoruz.",
  weddingDate = "2026-09-01",
  weddingTime = "22:00",
  venueName,
  venueAddress,
  locale = "tr",
  accent = "#4a5533",
  bg = "#fdfbf4",
  decorative = "daisy",
  style,
  showCountdown = true,
  width = 360,
  height = 680,
}: InvitationCardProps) {
  const targetIso = weddingDate && weddingTime
    ? `${weddingDate}T${weddingTime}:00`
    : null;
  const cd = useCountdown(targetIso);
  const dp = formatDateParts(weddingDate, locale);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width,
        height,
        background: bg,
        color: accent,
        borderRadius: 8,
        boxShadow: "0 12px 32px -8px rgba(0,0,0,0.3)",
        ...style,
      }}
    >
      {/* Inner gold border frame (like reference) */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: 10,
          left: 10,
          right: 10,
          bottom: 10,
          border: `1px solid ${accent}`,
          opacity: 0.3,
          borderRadius: 4,
        }}
      />

      <div className="relative z-10 flex flex-col h-full px-8 pt-10 pb-8 items-center text-center">
        {/* Top script title */}
        <div
          className="text-2xl italic leading-tight"
          style={{ fontFamily: "Merienda, serif", color: accent }}
        >
          {brideName}
        </div>
        <div
          className="text-base italic leading-none opacity-75 my-1"
          style={{ fontFamily: "Merienda, serif", color: accent }}
        >
          &
        </div>
        <div
          className="text-2xl italic leading-tight"
          style={{ fontFamily: "Merienda, serif", color: accent }}
        >
          {groomName}
        </div>

        {/* Ornament — floral SVG centerpiece */}
        <div className="my-4">
          <FloralOrnament accent={accent} width={Math.min(width * 0.5, 170)} />
        </div>

        {/* Divider with dot */}
        <div className="flex items-center justify-center gap-2 w-full my-2">
          <div className="flex-1 h-px" style={{ background: accent, opacity: 0.35 }} />
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: accent, opacity: 0.7 }}
          />
          <div className="flex-1 h-px" style={{ background: accent, opacity: 0.35 }} />
        </div>

        {/* Subtitle */}
        <div
          className="mt-3 text-lg"
          style={{ fontFamily: "Merienda, serif", color: accent }}
        >
          {subtitle}
        </div>

        {/* Description */}
        <div
          className="mt-2 text-sm leading-relaxed opacity-85 max-w-[85%]"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          {description}
        </div>

        {/* Countdown */}
        {showCountdown && cd ? (
          <div
            className="mt-5 grid grid-cols-4 gap-3 w-full"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            <CountBox n={cd.d} label="Gün" accent={accent} />
            <CountBox n={cd.h} label="Saat" accent={accent} />
            <CountBox n={cd.m} label="Dakika" accent={accent} />
            <CountBox n={cd.s} label="Saniye" accent={accent} />
          </div>
        ) : null}

        <div className="flex-1 min-h-4" />

        {/* Date row */}
        {dp ? (
          <div
            className="flex items-center justify-between gap-2 w-full"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            <div className="flex-1 text-sm opacity-75">{dp.dayName}</div>
            <div
              className="h-10 w-px opacity-30"
              style={{ background: accent }}
            />
            <div className="flex-1">
              <div
                className="text-xl leading-none"
                style={{ fontFamily: "Merienda, serif" }}
              >
                {dp.day}
              </div>
              <div
                className="text-sm leading-none mt-1 italic"
                style={{ fontFamily: "Merienda, serif" }}
              >
                {dp.month}
              </div>
              <div className="text-[10px] opacity-70 mt-1">{dp.year}</div>
            </div>
            <div
              className="h-10 w-px opacity-30"
              style={{ background: accent }}
            />
            <div className="flex-1 text-sm opacity-85">{weddingTime}</div>
          </div>
        ) : null}

        {/* Venue */}
        {venueName ? (
          <div className="mt-4 text-center">
            <div
              className="text-base italic"
              style={{ fontFamily: "Merienda, serif" }}
            >
              {venueName}
            </div>
            {venueAddress ? (
              <div
                className="text-[11px] opacity-70 mt-1"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {venueAddress}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Corner ornaments */}
      <CornerOrnament pos="tl" accent={accent} />
      <CornerOrnament pos="tr" accent={accent} />
      <CornerOrnament pos="bl" accent={accent} />
      <CornerOrnament pos="br" accent={accent} />

      {/* Background decorative cluster (very subtle) */}
      {decorative !== "none" ? (
        <DecorationCluster kind={decorative} accent={accent} />
      ) : null}
    </div>
  );
}

/* Floral centerpiece ornament (like reference) */
function FloralOrnament({
  accent,
  width = 160,
}: {
  accent: string;
  width?: number;
}) {
  return (
    <svg
      width={width}
      height={width * 0.45}
      viewBox="0 0 200 90"
      style={{ opacity: 0.85 }}
    >
      <g fill="none" stroke={accent} strokeWidth="0.9" strokeLinecap="round">
        {/* Central flower */}
        <g transform="translate(100, 45)">
          <path d="M 0 -14 Q -8 -18 -14 -10 Q -18 0 -10 8 Q 0 12 8 6 Q 14 -4 6 -12 Q 2 -14 0 -14 Z" fill={accent} fillOpacity="0.08" />
          <path d="M 0 -10 Q -6 -12 -10 -6 Q -12 2 -6 6 Q 2 8 6 2" />
          <circle r="2.5" fill={accent} fillOpacity="0.6" />
          <circle r="0.8" cx="1" cy="-2" fill={accent} />
          <circle r="0.8" cx="-2" cy="1" fill={accent} />
          <circle r="0.8" cx="2" cy="2" fill={accent} />
        </g>

        {/* Left spray */}
        <g transform="translate(65, 45)">
          <path d="M 0 0 Q -10 -6 -22 -10 Q -28 -14 -30 -18" />
          <path d="M 0 0 Q -8 -2 -18 -2" />
          <path d="M 0 0 Q -12 4 -24 4" />
          <ellipse cx="-25" cy="-14" rx="3" ry="1.5" transform="rotate(-20 -25 -14)" fill={accent} fillOpacity="0.35" />
          <ellipse cx="-15" cy="-2" rx="2.5" ry="1.2" transform="rotate(-10 -15 -2)" fill={accent} fillOpacity="0.35" />
          <ellipse cx="-20" cy="6" rx="2.5" ry="1.2" transform="rotate(15 -20 6)" fill={accent} fillOpacity="0.35" />
          <circle cx="-32" cy="-20" r="1" fill={accent} />
          <circle cx="-30" cy="-6" r="1" fill={accent} />
          <circle cx="-28" cy="8" r="1" fill={accent} />
        </g>

        {/* Right spray (mirror) */}
        <g transform="translate(135, 45) scale(-1, 1)">
          <path d="M 0 0 Q -10 -6 -22 -10 Q -28 -14 -30 -18" />
          <path d="M 0 0 Q -8 -2 -18 -2" />
          <path d="M 0 0 Q -12 4 -24 4" />
          <ellipse cx="-25" cy="-14" rx="3" ry="1.5" transform="rotate(-20 -25 -14)" fill={accent} fillOpacity="0.35" />
          <ellipse cx="-15" cy="-2" rx="2.5" ry="1.2" transform="rotate(-10 -15 -2)" fill={accent} fillOpacity="0.35" />
          <ellipse cx="-20" cy="6" rx="2.5" ry="1.2" transform="rotate(15 -20 6)" fill={accent} fillOpacity="0.35" />
          <circle cx="-32" cy="-20" r="1" fill={accent} />
          <circle cx="-30" cy="-6" r="1" fill={accent} />
          <circle cx="-28" cy="8" r="1" fill={accent} />
        </g>

        {/* Baseline with star */}
        <line x1="30" y1="75" x2="90" y2="75" />
        <line x1="110" y1="75" x2="170" y2="75" />
        <circle cx="100" cy="75" r="1.5" fill={accent} />
      </g>
    </svg>
  );
}

/* Corner ornaments — tiny floral flourish at each corner */
function CornerOrnament({
  pos,
  accent,
}: {
  pos: "tl" | "tr" | "bl" | "br";
  accent: string;
}) {
  const base = "absolute pointer-events-none";
  const posStyle =
    pos === "tl"
      ? "top-2 left-2"
      : pos === "tr"
      ? "top-2 right-2 scale-x-[-1]"
      : pos === "bl"
      ? "bottom-2 left-2 scale-y-[-1]"
      : "bottom-2 right-2 scale-[-1]";
  return (
    <svg
      className={`${base} ${posStyle}`}
      width="28"
      height="28"
      viewBox="0 0 30 30"
      style={{ opacity: 0.5 }}
    >
      <g fill="none" stroke={accent} strokeWidth="0.7" strokeLinecap="round">
        <path d="M 2 16 Q 6 12 10 14 Q 14 18 18 14" />
        <path d="M 2 16 Q 4 10 8 8" />
        <circle cx="8" cy="8" r="1" fill={accent} />
        <circle cx="14" cy="18" r="0.6" fill={accent} />
      </g>
    </svg>
  );
}

function CountBox({
  n,
  label,
  accent,
}: {
  n: number;
  label: string;
  accent: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="text-2xl font-medium leading-none tabular-nums"
        style={{ color: accent }}
      >
        {String(n).padStart(2, "0")}
      </div>
      <div className="text-[10px] opacity-70 mt-1">{label}</div>
    </div>
  );
}

function DecorationCluster({
  kind,
  accent,
}: {
  kind: "daisy" | "rose" | "gold";
  accent: string;
}) {
  const common = {
    className: "absolute top-0 right-0 pointer-events-none",
    style: { width: "55%", height: "42%" },
  } as const;

  if (kind === "daisy") {
    return (
      <svg viewBox="0 0 200 240" {...common} preserveAspectRatio="xMaxYMin meet">
        <defs>
          <radialGradient id="daisyCenter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbe06a" />
            <stop offset="100%" stopColor="#e0a42e" />
          </radialGradient>
        </defs>
        {daisyPositions.map((p, i) => (
          <g key={i} transform={`translate(${p.x},${p.y}) scale(${p.s})`}>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <ellipse
                key={a}
                rx="5"
                ry="14"
                cx="0"
                cy="-11"
                fill="#ffffff"
                stroke="#e8e3d2"
                strokeWidth="0.5"
                transform={`rotate(${a})`}
              />
            ))}
            <circle r="5" fill="url(#daisyCenter)" />
          </g>
        ))}
        {leafPositions.map((p, i) => (
          <path
            key={`l${i}`}
            d="M 0 0 Q 8 -4 16 0 Q 8 4 0 0 Z"
            fill="#6b7a3a"
            opacity="0.55"
            transform={`translate(${p.x},${p.y}) rotate(${p.r})`}
          />
        ))}
      </svg>
    );
  }

  if (kind === "rose") {
    return (
      <svg viewBox="0 0 200 240" {...common} preserveAspectRatio="xMaxYMin meet">
        {rosePositions.map((p, i) => (
          <g key={i} transform={`translate(${p.x},${p.y}) scale(${p.s})`}>
            <circle r="14" fill="#d88189" opacity="0.95" />
            <circle r="10" fill="#c26470" />
            <circle r="6" fill="#a94a58" />
            <circle r="2.5" fill="#7a2d3a" />
          </g>
        ))}
      </svg>
    );
  }

  // gold
  return (
    <svg viewBox="0 0 200 240" {...common} preserveAspectRatio="xMaxYMin meet">
      <g stroke={accent} strokeWidth="1.2" fill="none" opacity="0.7">
        <path d="M 100 60 Q 160 80 180 140 Q 140 160 100 120 Q 80 90 100 60 Z" />
        <path d="M 130 40 Q 160 60 170 100" />
        <path d="M 110 100 Q 140 120 155 150" />
        <circle cx="100" cy="60" r="3" fill={accent} />
        <circle cx="180" cy="140" r="3" fill={accent} />
        <circle cx="130" cy="40" r="2" fill={accent} />
      </g>
    </svg>
  );
}

const daisyPositions = [
  { x: 170, y: 20, s: 1 },
  { x: 135, y: 45, s: 0.85 },
  { x: 175, y: 70, s: 0.9 },
  { x: 145, y: 105, s: 1.1 },
  { x: 180, y: 125, s: 0.8 },
  { x: 155, y: 165, s: 0.95 },
  { x: 185, y: 185, s: 0.85 },
  { x: 125, y: 200, s: 0.75 },
  { x: 100, y: 150, s: 0.7 },
  { x: 115, y: 85, s: 0.75 },
];
const leafPositions = [
  { x: 100, y: 40, r: -30 },
  { x: 130, y: 75, r: 20 },
  { x: 110, y: 120, r: -15 },
  { x: 150, y: 145, r: 45 },
  { x: 95, y: 180, r: -40 },
];
const rosePositions = [
  { x: 170, y: 25, s: 1 },
  { x: 130, y: 55, s: 0.8 },
  { x: 175, y: 80, s: 0.9 },
  { x: 145, y: 115, s: 1.1 },
  { x: 180, y: 140, s: 0.85 },
  { x: 115, y: 155, s: 0.7 },
  { x: 160, y: 180, s: 0.9 },
  { x: 130, y: 210, s: 0.75 },
];
