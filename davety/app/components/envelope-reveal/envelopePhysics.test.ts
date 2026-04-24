import { describe, it } from "node:test";
import assert from "node:assert/strict";
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

  it("keeps the card inside the pocket until its bottom clears the rim", () => {
    const state = getEnvelopeRevealState(2.7);
    const rimY = 0.34;
    const cardBaseY = -0.24;
    const cardHalfHeight = 1.06;
    const cardBottom = cardBaseY + state.card.lift - cardHalfHeight;

    assert.equal(state.phase, "emerging");
    assert.equal(state.card.visible, true);
    assert.ok(cardBottom < rimY);
    assert.ok(state.card.forward < 0.02);
  });

  it("settles with the invitation readable in front of the open envelope", () => {
    const state = getEnvelopeRevealState(5.2);

    assert.equal(state.phase, "settled");
    assert.equal(state.card.visible, true);
    assert.ok(Math.abs(state.envelope.rotationY - Math.PI) < 0.04);
    assert.ok(Math.abs(state.flap.angle - 2.24) < 0.08);
    assert.ok(Math.abs(state.card.lift - 1.72) < 0.08);
    assert.ok(Math.abs(state.card.forward - 1.08) < 0.08);
    assert.ok(Math.abs(state.card.tilt - 0.03) < 0.06);
  });
});
