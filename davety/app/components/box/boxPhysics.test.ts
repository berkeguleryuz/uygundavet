import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getBoxRevealState } from "./boxPhysics.ts";

describe("getBoxRevealState", () => {
  it("keeps the invitation hidden while the gift box is still closed", () => {
    const state = getBoxRevealState(0);

    assert.equal(state.phase, "closed");
    assert.equal(state.card.visible, false);
    assert.equal(state.card.lift, 0);
    assert.ok(state.lid.angle < 0.05);
  });

  it("opens the lid before allowing the invitation to leave the box", () => {
    const state = getBoxRevealState(1.05);

    assert.equal(state.phase, "opening");
    assert.equal(state.card.visible, false);
    assert.ok(state.lid.angle > 1.15);
    assert.ok(state.lid.angle < 2.25);
  });

  it("raises and tilts the invitation only after the lid has cleared the opening", () => {
    const state = getBoxRevealState(2.45);

    assert.equal(state.phase, "emerging");
    assert.equal(state.card.visible, true);
    assert.ok(state.card.lift > 1.1);
    assert.ok(state.card.forward < 0.02);
    assert.ok(Math.abs(state.card.tilt) < 0.08);
  });

  it("does not move forward until the card bottom clears the box rim", () => {
    const boxTop = 1.12;
    const cardBaseY = 0.42;
    const cardHalfHeight = 1.04;
    const state = getBoxRevealState(2.25);
    const cardBottom = cardBaseY + state.card.lift - cardHalfHeight;

    assert.ok(cardBottom < boxTop);
    assert.ok(state.card.forward < 0.02);
  });

  it("settles the lid and invitation into their final readable positions", () => {
    const state = getBoxRevealState(4.6);

    assert.equal(state.phase, "settled");
    assert.equal(state.card.visible, true);
    assert.ok(Math.abs(state.lid.angle - 2.18) < 0.06);
    assert.ok(Math.abs(state.card.lift - 1.78) < 0.08);
    assert.ok(Math.abs(state.card.forward - 1.68) < 0.06);
    assert.ok(Math.abs(state.card.tilt - 0.02) < 0.05);
  });
});
