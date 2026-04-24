"use client";

import { useState } from "react";
import type { DesignSample } from "./designSamples";

interface Props {
  design: DesignSample;
  initialFavorite?: boolean;
  onToggleFavorite?: (id: string, next: boolean) => void;
  onDesign?: (design: DesignSample) => void;
}

export function DesignCard({
  design,
  initialFavorite = false,
  onToggleFavorite,
  onDesign,
}: Props) {
  const [favorite, setFavorite] = useState(initialFavorite);

  return (
    <article className="group flex flex-col">
      <div className="relative">
        {/* Theme name pill — top-left */}
        <div
          className="absolute top-2 left-2 z-10 px-2.5 py-1 rounded-full bg-white/95 border border-border text-[10px] font-medium tracking-wide text-foreground shadow-sm"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          {design.name}
        </div>

        {/* Category pill — top-right */}
        <div
          className="absolute top-2 right-2 z-10 px-2.5 py-1 rounded-full bg-foreground text-background text-[10px] font-medium tracking-wide shadow-sm"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          {categoryLabel(design.category)}
        </div>

        {/* Static invitation card preview (printable front) */}
        <InvitationPreview design={design} />

        {/* Optional zarf / box indicator — bottom-left */}
        <div
          className="absolute bottom-2 left-2 z-10 flex items-center gap-1.5"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          <OptionChip icon={<EnvelopeIcon />} label="Zarf" />
          <OptionChip icon={<BoxIcon />} label="Kutu" />
        </div>
      </div>

      {/* Actions — favorite + Tasarla */}
      <div
        className="mt-2 flex items-stretch gap-2 text-sm"
        style={{ fontFamily: "Space Grotesk, sans-serif" }}
      >
        <button
          onClick={() => {
            const next = !favorite;
            setFavorite(next);
            onToggleFavorite?.(design.id, next);
          }}
          className="shrink-0 w-11 h-11 flex items-center justify-center rounded-full bg-white border border-border hover:border-foreground/40 transition-colors cursor-pointer"
          aria-label="Favorilere ekle"
          aria-pressed={favorite}
        >
          <HeartIcon filled={favorite} />
        </button>
        <button
          onClick={() => onDesign?.(design)}
          className="flex-1 h-11 px-4 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors cursor-pointer"
        >
          Tasarla
        </button>
      </div>
    </article>
  );
}

function categoryLabel(cat: DesignSample["category"]): string {
  switch (cat) {
    case "wedding":
      return "Düğün";
    case "engagement":
      return "Nikah";
    case "circumcision":
      return "Sünnet";
    case "birthday":
      return "Doğum Günü";
    case "business":
      return "İş Açılış";
  }
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? "#e11d48" : "none"}
      stroke={filled ? "#e11d48" : "currentColor"}
      strokeWidth={filled ? 0 : 1.6}
      style={{ color: "#6b6866", transition: "all 0.15s" }}
    >
      <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0112 6.5 5.5 5.5 0 0121.5 12c-2.5 4.5-9.5 9-9.5 9z" />
    </svg>
  );
}

/* ─── Invitation preview (printable card front) ─────────────────────────
   Renders the full invitation card face based on design.layout. All
   variants live in this file so changes to theming/typography stay in
   one place. Real-render (editor canvas) uses the same layout switch. */
function InvitationPreview({ design }: { design: DesignSample }) {
  switch (design.layout) {
    case "arch":
      return <ArchLayout design={design} />;
    case "photo-top":
      return <PhotoTopLayout design={design} />;
    case "photo-full":
      return <PhotoFullLayout design={design} />;
    case "floral-crown":
      return <FloralCrownLayout design={design} />;
    case "monogram-circle":
      return <MonogramCircleLayout design={design} />;
    case "bold-type":
      return <BoldTypeLayout design={design} />;
    case "botanical-frame":
      return <BotanicalFrameLayout design={design} />;
    case "classic":
    default:
      return <ClassicLayout design={design} />;
  }
}

/* ─── Shared primitives ─── */
function CardShell({
  design,
  children,
  innerClassName,
}: {
  design: DesignSample;
  children: React.ReactNode;
  innerClassName?: string;
}) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-md border border-border shadow-sm"
      style={{
        aspectRatio: "3 / 4",
        background: design.bg,
        color: design.textColor,
      }}
    >
      <div className={innerClassName ?? "absolute inset-0"}>{children}</div>
    </div>
  );
}

function CoupleNames({
  design,
  size = "md",
}: {
  design: DesignSample;
  size?: "sm" | "md" | "lg";
}) {
  const cls =
    size === "sm"
      ? "text-sm md:text-base"
      : size === "lg"
      ? "text-xl md:text-2xl lg:text-3xl"
      : "text-lg md:text-xl lg:text-2xl";
  return (
    <div className="leading-[0.95] font-medium" style={{ fontFamily: "Merienda, serif" }}>
      <div className={cls}>{design.sampleBride}</div>
      <div
        className="my-1 text-xs md:text-sm italic opacity-60"
        style={{ color: design.accent }}
      >
        &amp;
      </div>
      <div className={cls}>{design.sampleGroom}</div>
    </div>
  );
}

function SubtitleLine({ design }: { design: DesignSample }) {
  return (
    <div
      className="text-[8px] md:text-[9px] uppercase tracking-[0.35em] opacity-70"
      style={{ fontFamily: "Space Grotesk, sans-serif" }}
    >
      {design.subtitle}
    </div>
  );
}

function DateRow({ design }: { design: DesignSample }) {
  const isDark = isDarkColor(design.bg);
  return (
    <div
      className="flex items-center gap-2 text-[9px] md:text-[10px] uppercase tracking-[0.25em]"
      style={{
        fontFamily: "Space Grotesk, sans-serif",
        color: isDark ? `${design.textColor}cc` : `${design.textColor}aa`,
      }}
    >
      <span>15</span>
      <span className="opacity-40">·</span>
      <span>AĞUSTOS</span>
      <span className="opacity-40">·</span>
      <span>2026</span>
    </div>
  );
}

/* ─── Classic — simple framed card ─── */
function ClassicLayout({ design }: { design: DesignSample }) {
  return (
    <CardShell design={design}>
      <div
        className="absolute inset-3 md:inset-4 rounded-sm pointer-events-none"
        style={{ border: `1px solid ${design.accent}55` }}
      />
      <DecorOrnament position="top" kind={design.decorative} color={design.accent} />
      <DecorOrnament position="bottom" kind={design.decorative} color={design.accent} />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 md:px-7 py-10 md:py-12">
        <SubtitleLine design={design} />
        <div className="mt-3 md:mt-4">
          <CoupleNames design={design} />
        </div>
        <div className="mt-3 md:mt-4 h-px w-10" style={{ background: `${design.accent}aa` }} />
        <div className="mt-2 md:mt-3">
          <DateRow design={design} />
        </div>
      </div>
    </CardShell>
  );
}

/* ─── Arch — cathedral/arched frame behind the names ─── */
function ArchLayout({ design }: { design: DesignSample }) {
  return (
    <CardShell design={design}>
      {/* Arched frame */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 130"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M 18 115 L 18 45 Q 18 10 50 10 Q 82 10 82 45 L 82 115 Z"
          fill="none"
          stroke={design.accent}
          strokeWidth="0.5"
          opacity="0.55"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 21 113 L 21 46 Q 21 13 50 13 Q 79 13 79 46 L 79 113 Z"
          fill="none"
          stroke={design.accent}
          strokeWidth="0.25"
          opacity="0.35"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <DecorOrnament position="bottom" kind={design.decorative} color={design.accent} />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 md:px-10 pt-8 md:pt-12 pb-10">
        <div
          className="text-[20px] md:text-2xl font-semibold italic mb-2 opacity-60"
          style={{ fontFamily: "Merienda, serif", color: design.accent }}
        >
          {design.sampleBride[0]} &nbsp;|&nbsp; {design.sampleGroom[0]}
        </div>
        <SubtitleLine design={design} />
        <div className="mt-3">
          <CoupleNames design={design} size="sm" />
        </div>
        <div className="mt-3 h-px w-8" style={{ background: `${design.accent}aa` }} />
        <div className="mt-2">
          <DateRow design={design} />
        </div>
      </div>
    </CardShell>
  );
}

/* ─── Photo top — photo occupies the top ~55% ─── */
function PhotoTopLayout({ design }: { design: DesignSample }) {
  return (
    <CardShell design={design}>
      {/* Photo band */}
      <div
        className="absolute top-0 left-0 right-0 h-[55%] overflow-hidden"
        style={{ background: `${design.accent}33` }}
      >
        {design.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={design.photoUrl}
            alt=""
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-widest"
            style={{ color: design.accent, fontFamily: "Space Grotesk, sans-serif" }}
          >
            Fotoğraf
          </div>
        )}
        <div
          className="absolute inset-x-0 bottom-0 h-10"
          style={{ background: `linear-gradient(to bottom, transparent, ${design.bg})` }}
        />
      </div>
      <div
        className="absolute top-[54%] left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center"
        style={{ background: design.bg, border: `1px solid ${design.accent}55` }}
      >
        <span
          className="text-xs font-semibold italic"
          style={{ fontFamily: "Merienda, serif", color: design.accent }}
        >
          {design.sampleBride[0]}&amp;{design.sampleGroom[0]}
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 pt-10 pb-6 px-5 flex flex-col items-center text-center">
        <SubtitleLine design={design} />
        <div className="mt-2">
          <CoupleNames design={design} size="sm" />
        </div>
        <div className="mt-2 h-px w-8" style={{ background: `${design.accent}aa` }} />
        <div className="mt-2">
          <DateRow design={design} />
        </div>
      </div>
    </CardShell>
  );
}

/* ─── Photo full — photo fills card with overlay text ─── */
function PhotoFullLayout({ design }: { design: DesignSample }) {
  return (
    <CardShell design={design}>
      <div className="absolute inset-0 overflow-hidden">
        {design.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={design.photoUrl}
            alt=""
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : null}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.75) 100%)",
          }}
        />
      </div>
      <div className="absolute inset-0 flex flex-col justify-end text-center px-5 pb-8 text-white">
        <div
          className="text-[8px] md:text-[9px] uppercase tracking-[0.35em] opacity-80"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          {design.subtitle}
        </div>
        <div className="mt-2 leading-tight" style={{ fontFamily: "Merienda, serif" }}>
          <div className="text-xl md:text-2xl font-medium">
            {design.sampleBride}
          </div>
          <div className="text-xs italic my-0.5 opacity-80">&amp;</div>
          <div className="text-xl md:text-2xl font-medium">
            {design.sampleGroom}
          </div>
        </div>
        <div className="mt-3 mx-auto h-px w-10 bg-white/60" />
        <div
          className="mt-2 flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.25em]"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          <span>15</span>
          <span className="opacity-60">·</span>
          <span>AĞUSTOS</span>
          <span className="opacity-60">·</span>
          <span>2026</span>
        </div>
      </div>
    </CardShell>
  );
}

/* ─── Floral crown — arc of florals across top ─── */
function FloralCrownLayout({ design }: { design: DesignSample }) {
  return (
    <CardShell design={design}>
      {/* Crown */}
      <svg
        className="absolute top-4 md:top-5 left-1/2 -translate-x-1/2 w-[75%]"
        viewBox="0 0 120 30"
        aria-hidden
      >
        <g stroke={design.accent} strokeWidth="0.8" fill="none" opacity="0.9">
          <path d="M 5 22 Q 30 2 60 12 Q 90 22 115 8" />
        </g>
        <g fill={design.accent} opacity="0.9">
          {[
            [12, 20, 2],
            [24, 12, 2.6],
            [36, 8, 2],
            [50, 10, 3.2],
            [60, 12, 2.2],
            [72, 14, 3],
            [86, 18, 2.4],
            [100, 14, 3.2],
            [112, 9, 2],
          ].map((d, i) => (
            <circle key={i} cx={d[0]} cy={d[1]} r={d[2]} />
          ))}
        </g>
        <g fill="none" stroke={design.accent} strokeWidth="0.4" opacity="0.55">
          <path d="M 36 8 L 34 2 M 50 10 L 49 2 M 72 14 L 73 4 M 100 14 L 101 3" />
        </g>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-7 pt-14 pb-10">
        <SubtitleLine design={design} />
        <div className="mt-3">
          <CoupleNames design={design} />
        </div>
        <div className="mt-3 h-px w-10" style={{ background: `${design.accent}aa` }} />
        <div className="mt-2">
          <DateRow design={design} />
        </div>
      </div>
      <DecorOrnament position="bottom" kind={design.decorative} color={design.accent} />
    </CardShell>
  );
}

/* ─── Monogram circle — big ring with initials, names below ─── */
function MonogramCircleLayout({ design }: { design: DesignSample }) {
  return (
    <CardShell design={design}>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <div
          className="relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center"
          style={{ border: `1px solid ${design.accent}` }}
        >
          <div
            className="absolute inset-2 rounded-full"
            style={{ border: `1px solid ${design.accent}55` }}
          />
          <div
            className="text-xl md:text-2xl italic"
            style={{ fontFamily: "Merienda, serif", color: design.accent }}
          >
            {design.sampleBride[0]}
            <span className="mx-1 opacity-50">·</span>
            {design.sampleGroom[0]}
          </div>
        </div>
        <div className="mt-4">
          <SubtitleLine design={design} />
        </div>
        <div className="mt-2">
          <CoupleNames design={design} size="sm" />
        </div>
        <div className="mt-3 h-px w-10" style={{ background: `${design.accent}aa` }} />
        <div className="mt-2">
          <DateRow design={design} />
        </div>
      </div>
    </CardShell>
  );
}

/* ─── Bold type — oversized names ─── */
function BoldTypeLayout({ design }: { design: DesignSample }) {
  return (
    <CardShell design={design}>
      <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-6">
        <div
          className="text-[9px] uppercase tracking-[0.35em] opacity-70"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          {design.subtitle}
        </div>
        <div
          className="text-left leading-[0.85]"
          style={{ fontFamily: "Merienda, serif" }}
        >
          <div className="text-2xl md:text-4xl font-semibold tracking-tight">
            {design.sampleBride}
          </div>
          <div
            className="text-sm md:text-lg italic my-1 opacity-70"
            style={{ color: design.accent }}
          >
            &amp;
          </div>
          <div className="text-2xl md:text-4xl font-semibold tracking-tight">
            {design.sampleGroom}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <DateRow design={design} />
          <span
            className="text-[9px] uppercase tracking-[0.35em]"
            style={{ fontFamily: "Space Grotesk, sans-serif", color: design.accent }}
          >
            ◆
          </span>
        </div>
      </div>
    </CardShell>
  );
}

/* ─── Botanical frame — leaves along vertical edges ─── */
function BotanicalFrameLayout({ design }: { design: DesignSample }) {
  return (
    <CardShell design={design}>
      <svg
        className="absolute left-2 top-4 bottom-4 w-6"
        viewBox="0 0 20 120"
        preserveAspectRatio="none"
        aria-hidden
      >
        <g stroke={design.accent} strokeWidth="0.6" fill="none" opacity="0.75">
          <path d="M 10 0 L 10 120" />
          {[10, 28, 46, 64, 82, 100].map((y, i) => (
            <g key={i}>
              <path d={`M 10 ${y} Q 4 ${y - 3} 2 ${y - 7}`} />
              <path d={`M 10 ${y} Q 16 ${y + 3} 18 ${y + 7}`} />
            </g>
          ))}
        </g>
      </svg>
      <svg
        className="absolute right-2 top-4 bottom-4 w-6"
        viewBox="0 0 20 120"
        preserveAspectRatio="none"
        aria-hidden
      >
        <g stroke={design.accent} strokeWidth="0.6" fill="none" opacity="0.75">
          <path d="M 10 0 L 10 120" />
          {[10, 28, 46, 64, 82, 100].map((y, i) => (
            <g key={i}>
              <path d={`M 10 ${y} Q 4 ${y - 3} 2 ${y - 7}`} />
              <path d={`M 10 ${y} Q 16 ${y + 3} 18 ${y + 7}`} />
            </g>
          ))}
        </g>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-10 md:px-12 py-10">
        <SubtitleLine design={design} />
        <div className="mt-3">
          <CoupleNames design={design} />
        </div>
        <div className="mt-3 h-px w-10" style={{ background: `${design.accent}aa` }} />
        <div className="mt-2">
          <DateRow design={design} />
        </div>
      </div>
    </CardShell>
  );
}

/** Abstract corner ornaments — driven by design.decorative. */
function DecorOrnament({
  position,
  kind,
  color,
}: {
  position: "top" | "bottom";
  kind: DesignSample["decorative"];
  color: string;
}) {
  if (kind === "none") return null;

  const wrap = `absolute ${
    position === "top" ? "top-5 md:top-7" : "bottom-5 md:bottom-7"
  } left-1/2 -translate-x-1/2 w-14 md:w-16 opacity-80 pointer-events-none`;

  if (kind === "rose" || kind === "gold") {
    return (
      <svg
        viewBox="0 0 64 20"
        className={wrap}
        style={{
          transform: `translateX(-50%) ${
            position === "bottom" ? "rotate(180deg)" : ""
          }`,
        }}
      >
        <g stroke={color} strokeWidth="0.9" fill="none">
          <path d="M 4 14 Q 20 4 32 10 Q 44 14 60 4" />
          <circle cx="32" cy="10" r="1.6" fill={color} />
          <circle cx="18" cy="8" r="0.9" fill={color} opacity="0.6" />
          <circle cx="46" cy="12" r="0.9" fill={color} opacity="0.6" />
        </g>
      </svg>
    );
  }
  // daisy fallback — dotted arc
  return (
    <svg
      viewBox="0 0 64 18"
      className={wrap}
      style={{
        transform: `translateX(-50%) ${
          position === "bottom" ? "rotate(180deg)" : ""
        }`,
      }}
    >
      <g fill={color}>
        {[8, 16, 24, 32, 40, 48, 56].map((x, i) => (
          <circle key={i} cx={x} cy={10} r={i === 3 ? 2 : 1.2} opacity={0.8} />
        ))}
      </g>
    </svg>
  );
}

function OptionChip({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 border border-border text-[9px] text-muted-foreground shadow-sm">
      <span className="inline-flex items-center justify-center">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function EnvelopeIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
      <rect
        x="1.5"
        y="3.5"
        width="13"
        height="9"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M 2 4 L 8 9 L 14 4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
      <rect
        x="2"
        y="4"
        width="12"
        height="10"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M 2 7 L 14 7 M 8 4 L 8 14" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function isDarkColor(hex: string): boolean {
  const h = hex.replace("#", "");
  if (h.length !== 6) return false;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
}
