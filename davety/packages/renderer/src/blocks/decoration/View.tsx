import type { DecorationData } from "@davety/schema";
import { findDecoration } from "../../decorations/catalog";
import { styleToCss, type BlockViewProps } from "../types";

/**
 * Renders one of two flavours:
 *  1. Inline catalog icon — when `iconKey` resolves to an entry in
 *     `DECORATION_ICONS`. Single-path line icon, sized in px.
 *  2. Inline SVG template — when `svgRaw` is set, the markup is inlined so
 *     `currentColor` recolours every path. Width is sized in px (height
 *     auto) for consistent layout.
 */
export function DecorationView({ block }: BlockViewProps<DecorationData>) {
  const rootStyle = styleToCss(block.style);
  const { iconKey, svgRaw, sizePx, color, align = "center" } = block.data;

  const justify =
    align === "left"
      ? "flex-start"
      : align === "right"
        ? "flex-end"
        : "center";

  // Raw SVG template branch — strip the outer <svg ...> wrapper if present
  // so we can re-emit it with our own width/colour, otherwise inline as-is.
  if (svgRaw) {
    const size = sizePx ?? 220;
    return (
      <div
        className="px-2 py-6 flex"
        style={{
          ...rootStyle,
          justifyContent: justify,
          color: color ?? "currentColor",
        }}
      >
        <div
          style={{ width: size, lineHeight: 0 }}
          dangerouslySetInnerHTML={{ __html: normaliseTemplateSvg(svgRaw) }}
        />
      </div>
    );
  }

  if (!iconKey) return null;
  const icon = findDecoration(iconKey);
  if (!icon) return null;

  const size = sizePx ?? 64;
  return (
    <div
      className="px-2 py-6 flex"
      style={{ ...rootStyle, justifyContent: justify }}
    >
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke={color ?? "currentColor"}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: icon.svg }}
      />
    </div>
  );
}

/** Strip XML prolog and force the SVG to be width="100%" height="auto" so
 *  it scales fluidly into the wrapper div the renderer sets a fixed width
 *  on. The viewBox in the source file already carries the aspect ratio. */
function normaliseTemplateSvg(raw: string): string {
  let s = raw.replace(/<\?xml[^?]*\?>\s*/i, "");
  s = s.replace(
    /<svg([^>]*)>/i,
    (_match, attrs) => {
      const cleaned = String(attrs)
        .replace(/\s(width|height)="[^"]*"/g, "")
        .trim();
      return `<svg ${cleaned} width="100%" height="auto" style="display:block">`;
    },
  );
  return s;
}
