import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ENVELOPE_CARD_LAYOUT } from "./envelopeGeometry.ts";
import { getEnvelopeRevealState } from "./envelopePhysics.ts";

describe("getEnvelopeRevealState", () => {
  it("starts with the front closed and the invitation hidden", () => {
    const state = getEnvelopeRevealState(0);

    assert.equal(state.phase, "front");
    assert.ok(state.envelope.rotationY < 0.02);
    assert.ok(state.flap.angle < 0.02);
    assert.equal(state.card.visible, false);
  });

  it("flips the envelope before opening the back flap", () => {
    const state = getEnvelopeRevealState(0.8);

    assert.equal(state.phase, "flipping");
    assert.ok(state.envelope.rotationY > 1.0);
    assert.ok(state.envelope.rotationY < Math.PI);
    assert.ok(state.flap.angle < 0.02);
    assert.equal(state.card.visible, false);
  });

  it("opens the flap before releasing the invitation", () => {
    const state = getEnvelopeRevealState(1.75);

    assert.equal(state.phase, "opening");
    assert.ok(Math.abs(state.envelope.rotationY - Math.PI) < 0.08);
    assert.ok(state.flap.angle > 1.1);
    assert.equal(state.card.visible, false);
  });

  it("keeps the card moving vertically inside the pocket", () => {
    const state = getEnvelopeRevealState(2.7);
    const cardBottom =
      ENVELOPE_CARD_LAYOUT.cardBaseY +
      state.card.lift -
      ENVELOPE_CARD_LAYOUT.cardHeight / 2;

    assert.equal(state.phase, "emerging");
    assert.equal(state.card.visible, true);
    assert.ok(cardBottom < ENVELOPE_CARD_LAYOUT.pocketRimY);
    assert.equal(state.card.forward, 0);
  });

  it("settles with the invitation readable in front of the open envelope", () => {
    const state = getEnvelopeRevealState(5.2);
    const cardBottom =
      ENVELOPE_CARD_LAYOUT.cardBaseY +
      state.card.lift -
      ENVELOPE_CARD_LAYOUT.cardHeight / 2;

    assert.equal(state.phase, "settled");
    assert.equal(state.card.visible, true);
    assert.ok(Math.abs(state.envelope.rotationY - Math.PI) < 0.04);
    assert.ok(Math.abs(state.flap.angle - 2.86) < 0.08);
    assert.ok(Math.abs(state.card.lift - ENVELOPE_CARD_LAYOUT.cardFinalLift) < 0.08);
    assert.ok(cardBottom <= ENVELOPE_CARD_LAYOUT.pocketRimY - 0.08);
    assert.equal(state.card.forward, 0);
    assert.ok(Math.abs(state.card.tilt - 0.018) < 0.04);
  });
});
