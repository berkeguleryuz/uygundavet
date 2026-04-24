export const ENVELOPE_RENDER_DEPTHS = {
  backBaseZ: -0.055,
  cardZ: -0.136,
  pocketZ: -0.18,
  flapZ: -0.064,
} as const;

export const ENVELOPE_CARD_LAYOUT = {
  envelopeWidth: 3.25,
  pocketRimY: 0.31,
  cardWidth: 1.64,
  cardHeight: 2.36,
  cardDepth: 0.04,
  cardBaseY: -0.56,
  cardFinalLift: 1.82,
} as const;

export function hasPhysicalEnvelopeDepthOrder(depths = ENVELOPE_RENDER_DEPTHS) {
  return depths.pocketZ < depths.cardZ && depths.cardZ < depths.flapZ;
}
