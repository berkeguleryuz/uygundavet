import type { CtaData } from "@davety/schema";
import type { CSSProperties } from "react";
import { alignClasses, fieldStyle, styleToCss, type BlockViewProps } from "../types";

/** Pick a readable text color (black or white) for a given hex bg.
 *  Earlier the button used `bg-current/90 text-white`, but field-level
 *  style overrides set `color` on the button — Tailwind's `text-white`
 *  loses to inline style and the label collapses into the background
 *  (kullanıcının "buton + yazı aynı renk oldu" şikayeti). Calculating
 *  contrast keeps the label legible whatever bg the user picks. */
function readableOn(bg: string | undefined): string {
  const hex = (bg ?? "").trim().replace("#", "");
  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;
  if (full.length !== 6 || !/^[0-9a-f]{6}$/i.test(full)) return "#ffffff";
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  // Relative luminance — middle-of-the-range threshold flips text.
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.55 ? "#1a1a1a" : "#ffffff";
}

/** Merge field-level overrides into a button-shaped style: the user's
 *  chosen color drives the background, and we pin the text color to
 *  whichever of black/white reads cleanly against it. The font/size
 *  bits from `fieldStyle` are kept. */
function buttonStyleFor(
  block: BlockViewProps<CtaData>["block"],
): CSSProperties {
  const labelStyle = fieldStyle(block, "label");
  const bg =
    typeof labelStyle.color === "string" ? labelStyle.color : undefined;
  return {
    ...labelStyle,
    background: bg ?? "currentColor",
    color: readableOn(bg),
  };
}

export function CtaView({
  block,
  editable,
  onFieldSelect,
}: BlockViewProps<CtaData>) {
  const rootStyle = styleToCss(block.style);
  const { label, href } = block.data;

  const click = (id: string) =>
    editable && onFieldSelect
      ? {
          "data-field-id": id,
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            onFieldSelect(id);
          },
          className: "cursor-pointer hover:bg-yellow-100/30 rounded px-1",
        }
      : {};

  const buttonStyle = buttonStyleFor(block);

  return (
    <section
      className={`px-6 py-8 flex flex-col ${alignClasses(block.style.align)}`}
      style={rootStyle}
    >
      {href && !editable ? (
        <a
          href={href}
          className="inline-block rounded-full px-8 py-3 font-chakra uppercase tracking-[0.2em] text-xs hover:opacity-90"
          style={buttonStyle}
        >
          {label}
        </a>
      ) : (
        <button
          {...click("label")}
          className="inline-block rounded-full px-8 py-3 font-chakra uppercase tracking-[0.2em] text-xs"
          style={buttonStyle}
        >
          {label}
        </button>
      )}
    </section>
  );
}
