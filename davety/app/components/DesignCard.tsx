"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import type { DesignCardShape, DesignSample } from "./designSamples";
import { shapeFor } from "./designSamples";

/** CSS for each card silhouette. Keep in lockstep with `shapeCss` in
 *  the renderer package, when one moves, the other must follow so the
 *  gallery preview and the editor canvas always agree on the look. */
function cardShapeCss(shape: DesignCardShape): CSSProperties {
  switch (shape) {
    case "arch":
      return {
        borderTopLeftRadius: "50% 32px",
        borderTopRightRadius: "50% 32px",
      };
    case "tall-arch":
      return {
        borderTopLeftRadius: "50% 60px",
        borderTopRightRadius: "50% 60px",
      };
    case "rounded":
      return {
        borderTopLeftRadius: "24px",
        borderTopRightRadius: "24px",
      };
    case "peaked":
      return {
        clipPath: "polygon(0% 7%, 50% 0%, 100% 7%, 100% 100%, 0% 100%)",
      };
    case "chevron":
      return {
        clipPath: "polygon(0% 0%, 50% 6%, 100% 0%, 100% 100%, 0% 100%)",
      };
    case "tag":
      return {
        clipPath:
          "polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%, 0 16px)",
      };
    case "flat":
    default:
      return {};
  }
}

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
      {/* Outer frame, padded background, the actual invitation sits in
          the middle so the gallery card mirrors how the invitation will
          look in the editor / public view (with shape + shadow). */}
      <div className="relative p-6 rounded-2xl border border-border bg-[#f5f1e7] shadow-sm">
        {/* Theme name pill, top-left, on the frame */}
        <div
          className="absolute top-2 left-2 z-10 px-2.5 py-1 rounded-full bg-white/95 border border-border text-[10px] font-medium tracking-wide text-foreground shadow-sm"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          {design.name}
        </div>

        {/* Category pill, top-right, on the frame */}
        <div
          className="absolute top-2 right-2 z-10 px-2.5 py-1 rounded-full bg-foreground text-background text-[10px] font-medium tracking-wide shadow-sm"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          {categoryLabel(design.category)}
        </div>

        {/* Real invitation card preview (matches editor/public render).
            Arch shape applied to the outer container when layout is
            arch, same look as the live invitation. */}
        <InvitationPreview design={design} />

        {/* Optional zarf / box indicator, bottom-left, on the frame */}
        <div
          className="absolute bottom-2 left-2 z-10 flex items-center gap-1.5"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          <OptionChip icon={<EnvelopeIcon />} label="Zarf" />
          <OptionChip icon={<BoxIcon />} label="Kutu" />
        </div>
      </div>

      {/* Actions, favorite + Tasarla */}
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
  templatePosition = "top",
}: {
  design: DesignSample;
  children: React.ReactNode;
  innerClassName?: string;
  /** Where the asset SVG should sit. `"top"` (default) → above the
   *  names; `"bottom"` → flourish under the names; `"none"` → suppress
   *  (e.g. when the layout already crowds the corners). */
  templatePosition?: "top" | "bottom" | "none";
}) {
  // Apply the card silhouette decided by the sample (or its layout-based
  // default). Only the top edge varies; sides and bottom stay flat. The
  // editor canvas pulls from the same vocabulary so gallery + canvas
  // always show the same outer dress.
  const shape = shapeFor(design);
  const baseRadius =
    shape === "peaked" || shape === "chevron" || shape === "tag"
      ? {} // clip-path handles the silhouette; no border-radius needed
      : { borderRadius: "6px" };
  return (
    <div
      className="relative w-full overflow-hidden border border-border shadow-md"
      style={{
        aspectRatio: "3 / 4",
        background: design.bg,
        color: design.textColor,
        ...baseRadius,
        ...cardShapeCss(shape),
      }}
    >
      {design.decorationTemplate && templatePosition !== "none" ? (
        <TemplateOverlay
          assetKey={design.decorationTemplate}
          color={design.accent}
          position={templatePosition}
        />
      ) : null}
      <div className={innerClassName ?? "absolute inset-0"}>{children}</div>
    </div>
  );
}

/** SVG asset overlay that recolors via CSS `mask-image`. The asset
 *  itself uses `currentColor` strokes on a transparent background;
 *  using it as a mask lets the underlying `background-color` (set to
 *  the design's accent) show through, so each sample's top flourish
 *  inherits its theme palette automatically. */
function TemplateOverlay({
  assetKey,
  color,
  position,
}: {
  assetKey: string;
  color: string;
  position: "top" | "bottom";
}) {
  // Doğrudan `/assets/templates/...` yerine sanitize eden API route'u
  // kullanıyoruz. Asset dosyalarının bir kısmında sabit harfler ya da
  // tarihler (S · E, EST. 2026) gömülü ve CSS `mask-image` bunları
  // mask'e dahil ediyor, endpoint metin node'larını temizleyip
  // ulaştırıyor.
  const url = `/api/decorations/clean/${assetKey}.svg`;
  const placement =
    position === "top"
      ? "top-2 left-1/2 -translate-x-1/2"
      : "bottom-3 left-1/2 -translate-x-1/2";
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute ${placement} w-[36%] aspect-square opacity-70 z-[1]`}
      style={{
        backgroundColor: color,
        WebkitMaskImage: `url(${url})`,
        maskImage: `url(${url})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
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
  // Single-celebrant categories (birthday, business) ship with an empty
  // sampleGroom, collapse the "&" + second name so the gallery card
  // doesn't render a ghost ampersand under the name.
  const hasSecond = !!design.sampleGroom?.trim();
  return (
    <div className="leading-[0.95] font-medium" style={{ fontFamily: "Merienda, serif" }}>
      <div className={cls}>{design.sampleBride}</div>
      {hasSecond ? (
        <>
          <div
            className="my-1 text-xs md:text-sm italic opacity-60"
            style={{ color: design.accent }}
          >
            &amp;
          </div>
          <div className={cls}>{design.sampleGroom}</div>
        </>
      ) : null}
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

/** Hero description line, mirrors the renderer's HeroView default copy. Short
 *  single-line truncation so the thumbnail still feels like an invitation
 *  with words on it but doesn't overwhelm the limited card height. */
function HeroDescription({ design }: { design: DesignSample }) {
  return (
    <p
      className="text-[8px] md:text-[9px] italic leading-snug max-w-[22ch] truncate"
      style={{
        fontFamily: "Merienda, serif",
        color: `${design.textColor}99`,
      }}
    >
      Sizi aramızda görmekten mutluluk duyarız.
    </p>
  );
}

/** Inline decoration block, mirrors the editor's `decoration` block that
 *  sits between the hero and the countdown. If the design carries a
 *  `decorationTemplate`, we render the asset SVG via CSS `mask-image`
 *  recoloured with the accent (same way the gallery's TemplateOverlay
 *  works), so the gallery card and the live invitation share the exact
 *  same flourish. Otherwise we fall back to the abstract rings glyph. */
function InlineDecoration({ design, size = 28 }: { design: DesignSample; size?: number }) {
  if (design.decorationTemplate) {
    const url = `/api/decorations/clean/${design.decorationTemplate}.svg`;
    return (
      <div
        aria-hidden
        style={{
          width: size * 1.6,
          height: size,
          backgroundColor: design.accent,
          WebkitMaskImage: `url(${url})`,
          maskImage: `url(${url})`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          opacity: 0.85,
        }}
      />
    );
  }
  return <RingsDecoration color={design.accent} size={size} />;
}

/** Two interlocking rings, the hero decoration the editor renders right
 *  below the subtitle. Coloured with the design's accent so each card's
 *  ornament inherits its palette. */
function RingsDecoration({ color, size = 26 }: { color: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size * 0.55}
      viewBox="0 0 60 33"
      aria-hidden
      style={{ display: "block" }}
    >
      <g fill="none" stroke={color} strokeWidth="1.4">
        <circle cx="22" cy="16.5" r="11" />
        <circle cx="38" cy="16.5" r="11" />
      </g>
      <g fill="none" stroke={color} strokeWidth="0.8" opacity="0.7">
        <path d="M 30 6 Q 32 4 30 2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** Countdown row, four cells with placeholder values that match the
 *  editor's default countdown look (big serif numbers + tiny labels). */
function CountdownRow({
  design,
  size = "md",
}: {
  design: DesignSample;
  size?: "sm" | "md";
}) {
  const isDark = isDarkColor(design.bg);
  const numCls = size === "sm" ? "text-[14px]" : "text-[16px] md:text-[18px]";
  const labelCls =
    size === "sm" ? "text-[6px]" : "text-[6px] md:text-[7px]";
  const cells: [string, string][] = [
    ["91", "GÜN"],
    ["17", "SAAT"],
    ["57", "DAK"],
    ["39", "SAN"],
  ];
  return (
    <div className="flex items-end gap-2 md:gap-3">
      {cells.map(([n, l], i) => (
        <div key={`${l}-${i}`} className="flex flex-col items-center leading-none">
          <span
            className={`${numCls} font-medium`}
            style={{ fontFamily: "Merienda, serif", color: design.accent }}
          >
            {n}
          </span>
          <span
            className={`${labelCls} mt-0.5 uppercase tracking-[0.18em]`}
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              color: isDark ? `${design.textColor}99` : `${design.textColor}88`,
            }}
          >
            {l}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Date + time line used under the countdown, mirrors what the editor
 *  shows just above the families block. */
function DateTimeLine({ design }: { design: DesignSample }) {
  const isDark = isDarkColor(design.bg);
  return (
    <div
      className="text-[8px] md:text-[9px] tracking-[0.18em]"
      style={{
        fontFamily: "Space Grotesk, sans-serif",
        color: isDark ? `${design.textColor}cc` : `${design.textColor}aa`,
      }}
    >
      15.08.2026 <span className="opacity-50">·</span> 19:00
    </div>
  );
}

/** Families row, two columns with section titles + placeholder lines.
 *  Matches the FamiliesView the editor renders below the countdown. The
 *  category-aware titles come from buildDesignDoc; we replicate the same
 *  mapping here so the thumbnail labels never lie. */
function FamiliesRow({ design }: { design: DesignSample }) {
  const titles = familyTitlesForCategory(design.category);
  // Always render both columns. The category-aware titles already cover
  // single-celebrant events (sünnet → "Çocuğun Ailesi"/"Akrabalar",
  // birthday → "Aile"/"Yakınlar", iş → "Ev Sahibi"/"Sponsorlar"); a
  // missing groom name is just a missing celebrant, not a missing
  // family. Hiding the right column made circumcision/birthday/business
  // cards lopsided, so we keep both visible.
  return (
    <div
      className="grid grid-cols-2 gap-3 md:gap-4 w-full max-w-[180px] mt-1"
      style={{ fontFamily: "Space Grotesk, sans-serif" }}
    >
      <FamilyColumn title={titles.bride} accent={design.accent} text={design.textColor} />
      <FamilyColumn title={titles.groom} accent={design.accent} text={design.textColor} />
    </div>
  );
}

function FamilyColumn({
  title,
  accent,
  text,
}: {
  title: string;
  accent: string;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center text-center leading-tight">
      <div
        className="text-[8px] md:text-[9px] italic underline decoration-1 underline-offset-2"
        style={{ fontFamily: "Merienda, serif", color: accent }}
      >
        {title}
      </div>
      <div
        className="text-[7px] md:text-[8px] mt-1 opacity-55"
        style={{ color: text }}
      >
        Anne · Baba
      </div>
    </div>
  );
}

/** Local copy of the category → family-title map used by buildDesignDoc.
 *  Kept here (instead of imported) so the gallery card stays a leaf
 *  client component without dragging in the server-only doc builder. */
function familyTitlesForCategory(
  category: DesignSample["category"],
): { bride: string; groom: string } {
  switch (category) {
    case "circumcision":
      return { bride: "Çocuğun Ailesi", groom: "Akrabalar" };
    case "birthday":
      return { bride: "Aile", groom: "Yakınlar" };
    case "business":
      return { bride: "Ev Sahibi", groom: "Sponsorlar" };
    case "engagement":
    case "wedding":
    default:
      return { bride: "Gelinin Ailesi", groom: "Damadın Ailesi" };
  }
}

/* ─── Classic, simple centered card. Inner border frame intentionally
   removed: the live invitation render doesn't draw it, so the gallery
   was over-promising. The decorative top/bottom ornament still maps to
   a real {{...}} marker injected in buildDesignDoc. */
function ClassicLayout({ design }: { design: DesignSample }) {
  return (
    <CardShell design={design} templatePosition="none">
      <div className="absolute inset-0 flex flex-col items-center justify-start text-center gap-1.5 md:gap-2 px-4 md:px-5 pt-6 md:pt-7 pb-3">
        <CoupleNames design={design} size="sm" />
        <SubtitleLine design={design} />
        <HeroDescription design={design} />
        <InlineDecoration design={design} size={22} />
        <CountdownRow design={design} size="sm" />
        <DateTimeLine design={design} />
        <FamiliesRow design={design} />
      </div>
    </CardShell>
  );
}

/* ─── Arch, silhouette only; no inner frame (the outer card shape
   already provides the arch). The inner SVG used to draw a second arched
   line inside the card, but that frame doesn't render in the actual
   invitation editor/public view, so the gallery would over-promise. */
function ArchLayout({ design }: { design: DesignSample }) {
  return (
    <CardShell design={design} templatePosition="none">
      <div className="absolute inset-0 flex flex-col items-center justify-start text-center gap-1.5 px-5 md:px-7 pt-6 md:pt-9 pb-3">
        <div
          className="text-[14px] md:text-base font-semibold italic opacity-55"
          style={{ fontFamily: "Merienda, serif", color: design.accent }}
        >
          {design.sampleBride[0]}
          {design.sampleGroom?.trim() ? (
            <>&nbsp;|&nbsp; {design.sampleGroom[0]}</>
          ) : null}
        </div>
        <CoupleNames design={design} size="sm" />
        <SubtitleLine design={design} />
        <InlineDecoration design={design} size={20} />
        <CountdownRow design={design} size="sm" />
        <DateTimeLine design={design} />
        <FamiliesRow design={design} />
      </div>
    </CardShell>
  );
}

/* ─── Photo top, photo occupies the top ~55%, monogram bridges the
   photo/text boundary, text section lives strictly in the bottom 45%.
   Earlier the text container was pinned to bottom:0 and grew upward,
   which pushed the subtitle behind the photo's bottom edge whenever the
   content was tall (subtitle + 2 names + date). Pinning to top:55%
   instead keeps the layout aligned with the editor's PhotoTopVariant. */
function PhotoTopLayout({ design }: { design: DesignSample }) {
  return (
    <CardShell design={design} templatePosition="bottom">
      <div
        className="absolute top-0 left-0 right-0 h-[55%] overflow-hidden"
        style={{ background: `${design.accent}33` }}
      >
        {design.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={design.photoUrl}
            alt=""
            loading="lazy"
            decoding="async"
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
      {/* Monogram centered on the photo/text boundary (top of monogram
          sits 24px above the 55% line so its midpoint lands on it). */}
      <div
        className="absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center z-10"
        style={{
          top: "calc(55% - 1.5rem)",
          background: design.bg,
          border: `1px solid ${design.accent}55`,
        }}
      >
        <span
          className="text-xs font-semibold italic"
          style={{ fontFamily: "Merienda, serif", color: design.accent }}
        >
          {design.sampleBride[0]}
          {design.sampleGroom?.trim() ? <>&amp;{design.sampleGroom[0]}</> : null}
        </span>
      </div>
      <div
        className="absolute inset-x-0 bottom-0 pt-7 pb-4 px-4 flex flex-col items-center text-center gap-1.5"
        style={{ top: "55%" }}
      >
        <CoupleNames design={design} size="sm" />
        <SubtitleLine design={design} />
        <CountdownRow design={design} size="sm" />
        <DateTimeLine design={design} />
        <FamiliesRow design={design} />
      </div>
    </CardShell>
  );
}

/* ─── Photo full, photo fills card with overlay text ─── */
function PhotoFullLayout({ design }: { design: DesignSample }) {
  return (
    <CardShell design={design} templatePosition="none">
      <div className="absolute inset-0 overflow-hidden">
        {design.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={design.photoUrl}
            alt=""
            loading="lazy"
            decoding="async"
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
      <div className="absolute inset-0 flex flex-col justify-end items-center text-center gap-1.5 px-4 pb-5 text-white">
        <div className="leading-tight" style={{ fontFamily: "Merienda, serif" }}>
          <div className="text-lg md:text-xl font-medium">
            {design.sampleBride}
          </div>
          {design.sampleGroom?.trim() ? (
            <>
              <div className="text-xs italic my-0.5 opacity-80">&amp;</div>
              <div className="text-lg md:text-xl font-medium">
                {design.sampleGroom}
              </div>
            </>
          ) : null}
        </div>
        <div
          className="text-[8px] md:text-[9px] uppercase tracking-[0.35em] opacity-80"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          {design.subtitle}
        </div>
        <RingsDecoration color="#ffffff" size={20} />
        {/* Countdown over photo, white-tinted to read against the gradient. */}
        <div className="flex items-end gap-2 md:gap-3">
          {[
            ["91", "GÜN"],
            ["17", "SAAT"],
            ["57", "DAK"],
            ["39", "SAN"],
          ].map(([n, l], i) => (
            <div key={`${l}-${i}`} className="flex flex-col items-center leading-none">
              <span
                className="text-[14px] md:text-[15px] font-medium"
                style={{ fontFamily: "Merienda, serif" }}
              >
                {n}
              </span>
              <span
                className="text-[6px] mt-0.5 uppercase tracking-[0.18em] opacity-80"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {l}
              </span>
            </div>
          ))}
        </div>
        <div
          className="text-[8px] md:text-[9px] tracking-[0.18em] opacity-85"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          15.08.2026 <span className="opacity-60">·</span> 19:00
        </div>
      </div>
    </CardShell>
  );
}

/* ─── Floral crown, arc of florals across top ─── */
function FloralCrownLayout({ design }: { design: DesignSample }) {
  return (
    <CardShell design={design} templatePosition="none">
      {/* Crown */}
      <svg
        className="absolute top-3 md:top-4 left-1/2 -translate-x-1/2 w-[70%]"
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
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-start text-center gap-1.5 px-4 md:px-5 pt-10 md:pt-12 pb-3">
        <CoupleNames design={design} size="sm" />
        <SubtitleLine design={design} />
        <HeroDescription design={design} />
        <InlineDecoration design={design} size={20} />
        <CountdownRow design={design} size="sm" />
        <DateTimeLine design={design} />
        <FamiliesRow design={design} />
      </div>
    </CardShell>
  );
}

/* ─── Monogram circle, big ring with initials, names below ─── */
function MonogramCircleLayout({ design }: { design: DesignSample }) {
  return (
    <CardShell design={design} templatePosition="none">
      <div className="absolute inset-0 flex flex-col items-center justify-start text-center gap-1.5 px-4 pt-5 pb-3">
        <div
          className="relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center"
          style={{ border: `1px solid ${design.accent}` }}
        >
          <div
            className="absolute inset-1 rounded-full"
            style={{ border: `1px solid ${design.accent}55` }}
          />
          <div
            className="text-sm md:text-base italic"
            style={{ fontFamily: "Merienda, serif", color: design.accent }}
          >
            {design.sampleBride[0]}
            {design.sampleGroom?.trim() ? (
              <>
                <span className="mx-1 opacity-50">·</span>
                {design.sampleGroom[0]}
              </>
            ) : null}
          </div>
        </div>
        <CoupleNames design={design} size="sm" />
        <SubtitleLine design={design} />
        <CountdownRow design={design} size="sm" />
        <DateTimeLine design={design} />
        <FamiliesRow design={design} />
      </div>
    </CardShell>
  );
}

/* ─── Bold type, oversized names ─── */
function BoldTypeLayout({ design }: { design: DesignSample }) {
  return (
    <CardShell design={design} templatePosition="none">
      <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-5 gap-2">
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
          <div className="text-xl md:text-3xl font-semibold tracking-tight">
            {design.sampleBride}
          </div>
          {design.sampleGroom?.trim() ? (
            <>
              <div
                className="text-xs md:text-base italic my-1 opacity-70"
                style={{ color: design.accent }}
              >
                &amp;
              </div>
              <div className="text-xl md:text-3xl font-semibold tracking-tight">
                {design.sampleGroom}
              </div>
            </>
          ) : null}
        </div>
        <div className="flex items-center justify-center -my-1">
          <InlineDecoration design={design} size={20} />
        </div>
        <div className="flex flex-col items-start gap-1.5">
          <CountdownRow design={design} size="sm" />
          <DateTimeLine design={design} />
        </div>
        <div className="flex items-start justify-between gap-2">
          <FamiliesRow design={design} />
          <span
            className="text-[9px] uppercase tracking-[0.35em] mt-1"
            style={{ fontFamily: "Space Grotesk, sans-serif", color: design.accent }}
          >
            ◆
          </span>
        </div>
      </div>
    </CardShell>
  );
}

/* ─── Botanical frame, leaves along vertical edges ─── */
function BotanicalFrameLayout({ design }: { design: DesignSample }) {
  return (
    <CardShell design={design} templatePosition="none">
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
      <div className="absolute inset-0 flex flex-col items-center justify-start text-center gap-1.5 px-9 md:px-10 pt-7 md:pt-9 pb-3">
        <CoupleNames design={design} size="sm" />
        <SubtitleLine design={design} />
        <HeroDescription design={design} />
        <InlineDecoration design={design} size={20} />
        <CountdownRow design={design} size="sm" />
        <DateTimeLine design={design} />
        <FamiliesRow design={design} />
      </div>
    </CardShell>
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
