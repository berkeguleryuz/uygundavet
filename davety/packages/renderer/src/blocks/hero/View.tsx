import type { HeroData, HeroVariant } from "@davety/schema";
import { alignClasses, fieldStyle, styleToCss, type BlockViewProps } from "../types";
import { buildImgProps } from "../../media";
import { parseInlineDecorations } from "../../decorations/inline";

/**
 * Hero — branches on data.variant so each design sample from the homepage
 * grid materialises into the editor with the visual structure the user
 * picked (arch / photo / floral crown / monogram, etc.) while keeping all
 * fields (brideName, groomName, subtitle, description) editable.
 */
export function HeroView(props: BlockViewProps<HeroData>) {
  const variant: HeroVariant = props.block.data.variant ?? "classic";

  switch (variant) {
    case "arch":
      return <ArchVariant {...props} />;
    case "photo-top":
      return <PhotoTopVariant {...props} />;
    case "photo-full":
      return <PhotoFullVariant {...props} />;
    case "floral-crown":
      return <FloralCrownVariant {...props} />;
    case "monogram-circle":
      return <MonogramCircleVariant {...props} />;
    case "bold-type":
      return <BoldTypeVariant {...props} />;
    case "botanical-frame":
      return <BotanicalFrameVariant {...props} />;
    case "classic":
    default:
      return <ClassicVariant {...props} />;
  }
}

/* ─── Helpers ─── */

function selectableProps(
  editable: boolean | undefined,
  onFieldSelect: ((id: string) => void) | undefined,
  id: string
) {
  return editable && onFieldSelect
    ? {
        "data-field-id": id,
        onClick: (e: React.MouseEvent) => {
          e.stopPropagation();
          onFieldSelect(id);
        },
        className: "cursor-pointer hover:bg-yellow-100/30 rounded px-2",
      }
    : { className: "" };
}

function AndSpacer({ accent, second }: { accent?: string; second?: string }) {
  // Single-celebrant events (birthday, business launch) carry an empty
  // groomName. Hiding the spacer in that case avoids the awkward "Mira
  // & " ghost row a few users hit on doğum günü templates.
  if (second !== undefined && !second.trim()) return null;
  return (
    <div className="opacity-70 text-[0.8em] italic" style={{ color: accent }}>
      &amp;
    </div>
  );
}

/** Renders the second name only when it carries content; mirror of the
 *  AndSpacer guard so the layout collapses cleanly for single-celebrant
 *  events. */
function SecondName({
  name,
  className,
  style,
}: {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  if (!name?.trim()) return null;
  return (
    <div className={className} style={style}>
      {name}
    </div>
  );
}


function MediaBackdrop({ data }: { data: HeroData }) {
  if (data.media?.url) {
    return data.media.mediaType === "video" ? (
      <video
        src={data.media.url}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
      />
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        {...buildImgProps(data.media)}
        alt=""
        className="w-full h-full object-cover"
      />
    );
  }
  if (data.photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={data.photoUrl}
        alt=""
        className="w-full h-full object-cover"
        draggable={false}
      />
    );
  }
  return null;
}

/* ─── Classic ─── */
function ClassicVariant({
  block,
  editable,
  onFieldSelect,
}: BlockViewProps<HeroData>) {
  const { brideName, groomName, subtitle, description } = block.data;
  return (
    <section className="relative overflow-hidden" style={styleToCss(block.style)}>
      <div className={`relative px-8 py-14 flex flex-col gap-3 ${alignClasses(block.style.align)}`}>
        <div
          {...selectableProps(editable, onFieldSelect, "coupleNames")}
          style={fieldStyle(block, "coupleNames")}
        >
          <div>{brideName}</div>
          <AndSpacer accent={block.data.accent} second={groomName} />
          <SecondName name={groomName} />
        </div>
        {subtitle ? (
          <h2
            {...selectableProps(editable, onFieldSelect, "subtitle")}
            className={`text-2xl font-sans ${selectableProps(editable, onFieldSelect, "subtitle").className}`}
            style={fieldStyle(block, "subtitle")}
          >
            {parseInlineDecorations(subtitle)}
          </h2>
        ) : null}
        {description ? (
          <p
            {...selectableProps(editable, onFieldSelect, "description")}
            className={`max-w-md text-base font-sans ${selectableProps(editable, onFieldSelect, "description").className}`}
            style={fieldStyle(block, "description")}
          >
            {parseInlineDecorations(description)}
          </p>
        ) : null}
      </div>
    </section>
  );
}

/* ─── Arch ─── */
function ArchVariant({
  block,
  editable,
  onFieldSelect,
}: BlockViewProps<HeroData>) {
  const { brideName, groomName, subtitle, description, accent } = block.data;
  // The arch silhouette is drawn by the outer invitation container
  // (see getCardShapeStyle in InvitationView) — adding an inner arch
  // overlay creates a layered/nested look and squeezes the text, so we
  // intentionally keep this variant typography-only.
  return (
    <section className="relative overflow-hidden" style={styleToCss(block.style)}>
      <div className={`relative px-10 pt-10 pb-12 flex flex-col gap-2 ${alignClasses(block.style.align)}`}>
        <div
          className="text-5xl italic opacity-40 mb-2"
          style={{ fontFamily: "Merienda, serif", color: accent }}
        >
          {brideName[0]}
          {groomName?.trim() ? <>&nbsp;|&nbsp; {groomName[0]}</> : null}
        </div>
        {subtitle ? (
          <div
            {...selectableProps(editable, onFieldSelect, "subtitle")}
            className="text-[10px] uppercase tracking-[0.3em] opacity-70"
            style={fieldStyle(block, "subtitle")}
          >
            {parseInlineDecorations(subtitle)}
          </div>
        ) : null}
        <div
          {...selectableProps(editable, onFieldSelect, "coupleNames")}
          className="text-2xl font-medium"
          style={fieldStyle(block, "coupleNames")}
        >
          <div>{brideName}</div>
          <AndSpacer accent={accent} second={groomName} />
          <SecondName name={groomName} />
        </div>
        {description ? (
          <p
            {...selectableProps(editable, onFieldSelect, "description")}
            className="max-w-md text-sm mt-3"
            style={fieldStyle(block, "description")}
          >
            {parseInlineDecorations(description)}
          </p>
        ) : null}
      </div>
    </section>
  );
}

/* ─── Photo top ─── */
function PhotoTopVariant({
  block,
  editable,
  onFieldSelect,
}: BlockViewProps<HeroData>) {
  const { brideName, groomName, subtitle, description, accent } = block.data;
  return (
    <section className="relative overflow-hidden" style={styleToCss(block.style)}>
      <div className="relative h-48 md:h-56 bg-black/5 overflow-hidden">
        <MediaBackdrop data={block.data} />
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-b from-transparent to-[color:var(--bg,#fff)]" />
      </div>
      <div className={`relative px-8 py-10 flex flex-col gap-2 ${alignClasses(block.style.align)}`}>
        <div
          className="size-12 rounded-full -mt-16 flex items-center justify-center border shadow-sm"
          style={{
            background: "var(--bg, white)",
            borderColor: `${accent}55`,
            color: accent,
            fontFamily: "Merienda, serif",
          }}
        >
          {brideName[0]}
          {groomName?.trim() ? <>&amp;{groomName[0]}</> : null}
        </div>
        {subtitle ? (
          <div
            {...selectableProps(editable, onFieldSelect, "subtitle")}
            className="text-[11px] uppercase tracking-[0.3em] opacity-70 mt-2"
            style={fieldStyle(block, "subtitle")}
          >
            {parseInlineDecorations(subtitle)}
          </div>
        ) : null}
        <div
          {...selectableProps(editable, onFieldSelect, "coupleNames")}
          className="text-2xl font-medium"
          style={fieldStyle(block, "coupleNames")}
        >
          <div>{brideName}</div>
          <AndSpacer accent={accent} second={groomName} />
          <SecondName name={groomName} />
        </div>
        {description ? (
          <p
            {...selectableProps(editable, onFieldSelect, "description")}
            className="max-w-md text-sm mt-2"
            style={fieldStyle(block, "description")}
          >
            {parseInlineDecorations(description)}
          </p>
        ) : null}
      </div>
    </section>
  );
}

/* ─── Photo full ─── */
const DEFAULT_PHOTO_FULL =
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80";

function PhotoFullVariant({
  block,
  editable,
  onFieldSelect,
}: BlockViewProps<HeroData>) {
  const { brideName, groomName, subtitle, description } = block.data;
  // Drop block.style.color from the root so the white-on-photo treatment
  // isn't repainted with the doc's accent (which is usually dark and
  // becomes unreadable against the photo backdrop).
  const { color: _omit, ...rootStyle } = styleToCss(block.style);
  void _omit;
  // If the block has no explicit photo/media, fall back to a bright
  // default wedding image so the gradient overlay isn't painting over
  // black emptiness.
  const hasMedia = !!(block.data.media?.url || block.data.photoUrl);
  const data = hasMedia
    ? block.data
    : { ...block.data, photoUrl: DEFAULT_PHOTO_FULL };
  return (
    <section
      className="relative overflow-hidden min-h-[420px] text-white"
      style={rootStyle}
    >
      <div className="absolute inset-0">
        <MediaBackdrop data={data} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/45 to-black/80" />
      </div>
      <div className={`relative px-8 pb-12 pt-40 flex flex-col gap-2 ${alignClasses(block.style.align)}`}>
        {subtitle ? (
          <div
            {...selectableProps(editable, onFieldSelect, "subtitle")}
            className="text-[11px] uppercase tracking-[0.3em] opacity-90"
            style={fieldStyle(block, "subtitle")}
          >
            {parseInlineDecorations(subtitle)}
          </div>
        ) : null}
        <div
          {...selectableProps(editable, onFieldSelect, "coupleNames")}
          className="text-3xl md:text-4xl font-medium"
          style={fieldStyle(block, "coupleNames")}
        >
          <div>{brideName}</div>
          {groomName?.trim() ? (
            <>
              <div className="text-sm italic my-1 opacity-80">&amp;</div>
              <div>{groomName}</div>
            </>
          ) : null}
        </div>
        {description ? (
          <p
            {...selectableProps(editable, onFieldSelect, "description")}
            className="max-w-md text-sm mt-3 opacity-90"
            style={fieldStyle(block, "description")}
          >
            {parseInlineDecorations(description)}
          </p>
        ) : null}
      </div>
    </section>
  );
}

/* ─── Floral crown ─── */
function FloralCrownVariant({
  block,
  editable,
  onFieldSelect,
}: BlockViewProps<HeroData>) {
  const { brideName, groomName, subtitle, description, accent } = block.data;
  return (
    <section className="relative overflow-hidden" style={styleToCss(block.style)}>
      <svg
        className="absolute top-6 left-1/2 -translate-x-1/2 w-[75%]"
        viewBox="0 0 120 30"
        aria-hidden
      >
        <g stroke={accent ?? "currentColor"} strokeWidth="0.8" fill="none" opacity="0.9">
          <path d="M 5 22 Q 30 2 60 12 Q 90 22 115 8" />
        </g>
        <g fill={accent ?? "currentColor"} opacity="0.9">
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
      <div className={`relative px-8 py-16 pt-24 flex flex-col gap-2 ${alignClasses(block.style.align)}`}>
        {subtitle ? (
          <div
            {...selectableProps(editable, onFieldSelect, "subtitle")}
            className="text-[11px] uppercase tracking-[0.3em] opacity-70"
            style={fieldStyle(block, "subtitle")}
          >
            {parseInlineDecorations(subtitle)}
          </div>
        ) : null}
        <div
          {...selectableProps(editable, onFieldSelect, "coupleNames")}
          className="text-2xl md:text-3xl font-medium"
          style={fieldStyle(block, "coupleNames")}
        >
          <div>{brideName}</div>
          <AndSpacer accent={accent} second={groomName} />
          <SecondName name={groomName} />
        </div>
        {description ? (
          <p
            {...selectableProps(editable, onFieldSelect, "description")}
            className="max-w-md text-sm mt-3"
            style={fieldStyle(block, "description")}
          >
            {parseInlineDecorations(description)}
          </p>
        ) : null}
      </div>
    </section>
  );
}

/* ─── Monogram circle ─── */
function MonogramCircleVariant({
  block,
  editable,
  onFieldSelect,
}: BlockViewProps<HeroData>) {
  const { brideName, groomName, subtitle, description, accent } = block.data;
  return (
    <section className="relative overflow-hidden" style={styleToCss(block.style)}>
      <div className={`relative px-8 py-14 flex flex-col gap-3 ${alignClasses(block.style.align)}`}>
        <div
          className="relative w-28 h-28 rounded-full flex items-center justify-center"
          style={{ border: `1px solid ${accent ?? "currentColor"}` }}
        >
          <div
            className="absolute inset-2 rounded-full"
            style={{ border: `1px solid ${accent ?? "currentColor"}55` }}
          />
          <div
            className="text-2xl italic"
            style={{ fontFamily: "Merienda, serif", color: accent }}
          >
            {brideName[0]}
            {groomName?.trim() ? (
              <>
                {" "}
                <span className="mx-1 opacity-50">·</span> {groomName[0]}
              </>
            ) : null}
          </div>
        </div>
        {subtitle ? (
          <div
            {...selectableProps(editable, onFieldSelect, "subtitle")}
            className="text-[11px] uppercase tracking-[0.3em] opacity-70 mt-2"
            style={fieldStyle(block, "subtitle")}
          >
            {parseInlineDecorations(subtitle)}
          </div>
        ) : null}
        <div
          {...selectableProps(editable, onFieldSelect, "coupleNames")}
          className="text-2xl font-medium"
          style={fieldStyle(block, "coupleNames")}
        >
          <div>{brideName}</div>
          <AndSpacer accent={accent} second={groomName} />
          <SecondName name={groomName} />
        </div>
        {description ? (
          <p
            {...selectableProps(editable, onFieldSelect, "description")}
            className="max-w-md text-sm mt-2"
            style={fieldStyle(block, "description")}
          >
            {parseInlineDecorations(description)}
          </p>
        ) : null}
      </div>
    </section>
  );
}

/* ─── Bold type ─── */
function BoldTypeVariant({
  block,
  editable,
  onFieldSelect,
}: BlockViewProps<HeroData>) {
  const { brideName, groomName, subtitle, description, accent } = block.data;
  const align = block.style.align ?? "left";
  return (
    <section className="relative overflow-hidden" style={styleToCss(block.style)}>
      <div className={`relative px-6 py-14 flex flex-col gap-3 ${alignClasses(align)}`}>
        {subtitle ? (
          <div
            {...selectableProps(editable, onFieldSelect, "subtitle")}
            className="text-[11px] uppercase tracking-[0.35em] opacity-70"
            style={fieldStyle(block, "subtitle")}
          >
            {parseInlineDecorations(subtitle)}
          </div>
        ) : null}
        <div
          {...selectableProps(editable, onFieldSelect, "coupleNames")}
          className="leading-[0.85]"
          style={{
            ...fieldStyle(block, "coupleNames"),
            textAlign: align === "justify" ? "center" : align,
          }}
        >
          <div className="text-4xl md:text-6xl font-semibold tracking-tight">
            {brideName}
          </div>
          {groomName?.trim() ? (
            <>
              <div
                className="text-lg italic my-2 opacity-70"
                style={{ color: accent }}
              >
                &amp;
              </div>
              <div className="text-4xl md:text-6xl font-semibold tracking-tight">
                {groomName}
              </div>
            </>
          ) : null}
        </div>
        {description ? (
          <p
            {...selectableProps(editable, onFieldSelect, "description")}
            className="max-w-md text-sm mt-4"
            style={fieldStyle(block, "description")}
          >
            {parseInlineDecorations(description)}
          </p>
        ) : null}
      </div>
    </section>
  );
}

/* ─── Botanical frame ─── */
function BotanicalFrameVariant({
  block,
  editable,
  onFieldSelect,
}: BlockViewProps<HeroData>) {
  const { brideName, groomName, subtitle, description, accent } = block.data;
  return (
    <section className="relative overflow-hidden" style={styleToCss(block.style)}>
      {(["left", "right"] as const).map((side) => (
        <svg
          key={side}
          className={`absolute ${side === "left" ? "left-2" : "right-2"} top-4 bottom-4 w-8`}
          viewBox="0 0 20 120"
          preserveAspectRatio="none"
          aria-hidden
        >
          <g stroke={accent ?? "currentColor"} strokeWidth="0.6" fill="none" opacity="0.7">
            <path d="M 10 0 L 10 120" />
            {[10, 28, 46, 64, 82, 100].map((y, i) => (
              <g key={i}>
                <path d={`M 10 ${y} Q 4 ${y - 3} 2 ${y - 7}`} />
                <path d={`M 10 ${y} Q 16 ${y + 3} 18 ${y + 7}`} />
              </g>
            ))}
          </g>
        </svg>
      ))}
      <div className={`relative px-14 py-14 flex flex-col gap-2 ${alignClasses(block.style.align)}`}>
        {subtitle ? (
          <div
            {...selectableProps(editable, onFieldSelect, "subtitle")}
            className="text-[11px] uppercase tracking-[0.3em] opacity-70"
            style={fieldStyle(block, "subtitle")}
          >
            {parseInlineDecorations(subtitle)}
          </div>
        ) : null}
        <div
          {...selectableProps(editable, onFieldSelect, "coupleNames")}
          className="text-2xl md:text-3xl font-medium"
          style={fieldStyle(block, "coupleNames")}
        >
          <div>{brideName}</div>
          <AndSpacer accent={accent} second={groomName} />
          <SecondName name={groomName} />
        </div>
        {description ? (
          <p
            {...selectableProps(editable, onFieldSelect, "description")}
            className="max-w-md text-sm mt-3"
            style={fieldStyle(block, "description")}
          >
            {parseInlineDecorations(description)}
          </p>
        ) : null}
      </div>
    </section>
  );
}
