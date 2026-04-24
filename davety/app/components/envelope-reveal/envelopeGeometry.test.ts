import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  ENVELOPE_CARD_LAYOUT,
  ENVELOPE_RENDER_DEPTHS,
  hasPhysicalEnvelopeDepthOrder,
} from "./envelopeGeometry.ts";

describe("envelope render layering", () => {
  it("keeps the open flap behind the invitation while the pocket masks the card bottom", () => {
    assert.equal(hasPhysicalEnvelopeDepthOrder(), true);
  });

  it("sizes the invitation large enough while keeping its bottom below the pocket rim", () => {
    const cardWidthRatio = ENVELOPE_CARD_LAYOUT.cardWidth / ENVELOPE_CARD_LAYOUT.envelopeWidth;
    const finalBottom =
      ENVELOPE_CARD_LAYOUT.cardBaseY +
      ENVELOPE_CARD_LAYOUT.cardFinalLift -
      ENVELOPE_CARD_LAYOUT.cardHeight / 2;

    assert.ok(cardWidthRatio >= 0.5);
    assert.ok(finalBottom <= ENVELOPE_CARD_LAYOUT.pocketRimY - 0.08);
    assert.ok(ENVELOPE_RENDER_DEPTHS.pocketZ < ENVELOPE_RENDER_DEPTHS.cardZ - 0.025);
  });
});
