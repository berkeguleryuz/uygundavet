import type { ReactNode } from "react";
import { findDecoration } from "./catalog";

/**
 * Inline decoration marker scanner.
 *
 * Scans `text` for `{{iconKey}}` tokens (e.g. `{{heart}}`, `{{rose}}`) and
 * returns a ReactNode array that mixes plain text fragments with inline
 * SVG icons. Unknown keys are left as-is so the user sees what they typed
 * and can correct the spelling.
 *
 * The icon inherits its colour from the surrounding text via
 * `stroke="currentColor"` unless `color` is provided. Size defaults to
 * `1em` so it scales with the surrounding font-size.
 */
const MARKER_RE = /\{\{([a-z0-9-]+)\}\}/gi;

export interface ParseInlineOptions {
  /** Override stroke colour. Defaults to `currentColor`. */
  color?: string;
  /** Override icon size. Defaults to `1.4em` so the icon reads as
   *  comparable in weight to surrounding glyphs without overpowering the
   *  line. */
  size?: number | string;
  /** Stroke width in viewBox units. Defaults to 1.8 — heavier than the
   *  decoration-block default so the icon stays legible at body-text
   *  sizes. */
  strokeWidth?: number;
}

export function parseInlineDecorations(
  text: string | null | undefined,
  opts: ParseInlineOptions = {},
): ReactNode {
  if (!text) return text ?? "";
  if (!text.includes("{{")) return text;

  const parts: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  MARKER_RE.lastIndex = 0;

  while ((m = MARKER_RE.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const key = m[1];
    const icon = findDecoration(key);
    if (icon) {
      parts.push(
        <svg
          key={`${m.index}-${key}`}
          viewBox="0 0 24 24"
          width={opts.size ?? "1.4em"}
          height={opts.size ?? "1.4em"}
          fill="none"
          stroke={opts.color ?? "currentColor"}
          strokeWidth={opts.strokeWidth ?? 1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{
            display: "inline-block",
            verticalAlign: "-0.3em",
            margin: "0 0.2em",
          }}
          dangerouslySetInnerHTML={{ __html: icon.svg }}
        />,
      );
    } else {
      parts.push(m[0]);
    }
    last = m.index + m[0].length;
  }

  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

/** True if `text` contains any inline decoration marker. */
export function hasInlineDecorations(text: string | null | undefined): boolean {
  return !!text && text.includes("{{") && MARKER_RE.test(text);
}
