"use client";

import type { EnvelopeTheme } from "@davety/schema";
import type { WeddingEnvelopeProps } from "./WeddingEnvelope";
import { darken } from "./WeddingEnvelope";
import { ENVELOPE_PRESETS } from "./envelopePresets";

/** Auto-derive a tone-matched lining background from the envelope color
 *  when the user hasn't explicitly chosen one. Keeps each preset's lining
 *  visually harmonious with its envelope/flap palette instead of falling
 *  back to a flat dark sepia for everything. */
export function deriveLiningBg(envelopeColor: string | undefined): string {
  if (!envelopeColor) return "#3a2a1c";
  return darken(envelopeColor, 0.55);
}

/**
 * Combine a serialized envelope theme (saved in doc) with the JSX-rich
 * preset it points to. Preset contributes decorations (twine, wax seal,
 * window cutout) and any colors/lining it sets, then the user's explicit
 * theme overrides take precedence so the editor's color pickers and
 * stamp inputs always win.
 */
export function resolveEnvelopeProps(
  envTheme: EnvelopeTheme | undefined
): Partial<WeddingEnvelopeProps> {
  const preset = envTheme?.presetId
    ? ENVELOPE_PRESETS.find((p) => p.id === envTheme.presetId)
    : undefined;

  // IMPORTANT: strip preset.cardProps before spreading. The preset bundles
  // a placeholder invitation styling (accent / bg / decorative) used when
  // showing the envelope in the /envelopes playground. In our editor the
  // user already has a real invitation design — we never want the
  // envelope choice to retroactively change their card colors. cardRender
  // overrides on consumers also helps, but defense-in-depth here.
  const { cardProps: _stripCardProps, ...presetProps } = preset?.props ?? {};
  void _stripCardProps;

  const stampEnabled = envTheme?.stampEnabled ?? true;
  const stampLabel = envTheme?.stampLabel?.trim() ?? "";
  const stampImage = envTheme?.stampImage;
  const userStamp =
    stampEnabled && (stampLabel || stampImage)
      ? {
          color: envTheme?.stampColor ?? "#b85450",
          label: stampLabel || undefined,
          image: stampImage,
          borderStyle: "dashed" as const,
        }
      : stampEnabled
        ? presetProps.stamp ?? {
            color: envTheme?.stampColor ?? "#b85450",
            borderStyle: "dashed" as const,
          }
        : null;

  const finalEnvelopeColor =
    envTheme?.color ?? presetProps.envelopeColor;

  // Lining: user choice > derived from envelope. We intentionally skip
  // preset.liningBg (which was hardcoded to near-black for most presets)
  // so every theme gets a tone-matched warm lining by default. The user
  // can still pick any color from the side panel to override.
  const finalLiningBg =
    envTheme?.liningBg ?? deriveLiningBg(finalEnvelopeColor);

  // Flap defaults to envelope color for a unified, more elegant silhouette.
  // User override always wins; preset's own flapColor is ignored unless
  // the user has explicitly customised it (presets historically used
  // mismatched two-tone defaults that read busy in the canvas).
  const finalFlapColor = envTheme?.flapColor ?? finalEnvelopeColor;

  return {
    ...presetProps,
    envelopeColor: finalEnvelopeColor,
    flapColor: finalFlapColor,
    liningPattern:
      (envTheme?.liningPattern as WeddingEnvelopeProps["liningPattern"]) ??
      presetProps.liningPattern,
    liningBg: finalLiningBg,
    stamp: userStamp,
  };
}
