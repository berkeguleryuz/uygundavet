import type { DecorationData } from "@davety/schema";
import { findDecoration } from "../../decorations/catalog";
import { styleToCss, type BlockViewProps } from "../types";

export function DecorationView({
  block,
}: BlockViewProps<DecorationData>) {
  const rootStyle = styleToCss(block.style);
  const { iconKey, sizePx, color, align = "center" } = block.data;
  const icon = findDecoration(iconKey);

  if (!icon) return null;

  const size = sizePx ?? 64;
  const justify =
    align === "left"
      ? "flex-start"
      : align === "right"
        ? "flex-end"
        : "center";

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
