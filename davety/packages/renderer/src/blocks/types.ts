import type { Block, BlockStyle, BlockType, Theme } from "@davety/schema";
import type { ComponentType, CSSProperties } from "react";

export interface BlockViewProps<T = unknown> {
  block: Block<T>;
  theme: Theme;
  /** Optional hook for editor — called when a text slot is clicked */
  onFieldSelect?: (fieldId: string) => void;
  /** When true the block is rendered in the editor (yellow highlights allowed) */
  editable?: boolean;
}

export interface BlockRegistryEntry<T = unknown> {
  type: BlockType;
  View: ComponentType<BlockViewProps<T>>;
  defaultData: T;
  defaultStyle: BlockStyle;
  /** i18n key for friendly name in editor UI */
  labelKey: string;
}

export function styleToCss(style: BlockStyle): CSSProperties {
  const fontStyle: CSSProperties = {};
  if (style.bold) fontStyle.fontWeight = 700;
  if (style.italic) fontStyle.fontStyle = "italic";
  const decorations: string[] = [];
  if (style.underline) decorations.push("underline");
  if (style.strike) decorations.push("line-through");
  if (decorations.length) fontStyle.textDecoration = decorations.join(" ");
  return {
    fontFamily: style.fontFamily ? `"${style.fontFamily}"` : undefined,
    fontSize: style.fontSize ? `${style.fontSize}px` : undefined,
    color: style.color,
    textAlign: style.align,
    paddingTop: style.paddingTop,
    paddingBottom: style.paddingBottom,
    ...fontStyle,
  };
}

export function fieldStyle(block: Block<unknown>, fieldId: string): CSSProperties {
  const override = block.style.fieldOverrides?.[fieldId];
  if (!override) return {};
  return {
    fontFamily: override.fontFamily ? `"${override.fontFamily}"` : undefined,
    fontSize: override.fontSize ? `${override.fontSize}px` : undefined,
    color: override.color,
    fontWeight: override.bold ? 700 : undefined,
    fontStyle: override.italic ? "italic" : undefined,
    textDecoration:
      override.underline || override.strike
        ? [override.underline && "underline", override.strike && "line-through"]
            .filter(Boolean)
            .join(" ")
        : undefined,
  };
}
