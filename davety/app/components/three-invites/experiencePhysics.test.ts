import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getInviteExperienceState } from "./experiencePhysics.ts";

describe("getInviteExperienceState", () => {
  it("starts closed with the invitation hidden", () => {
    const state = getInviteExperienceState(0);

    assert.equal(state.phase, "closed");
    assert.equal(state.invitation.visible, false);
    assert.equal(state.opener, 0);
  });

  it("opens the scene before revealing the invitation", () => {
    const state = getInviteExperienceState(1.2);

    assert.equal(state.phase, "opening");
    assert.ok(state.opener > 0.35);
    assert.equal(state.invitation.visible, false);
  });

  it("keeps the invitation movement vertical and readable after reveal", () => {
    const state = getInviteExperienceState(3.6);

    assert.equal(state.phase, "revealing");
    assert.equal(state.invitation.visible, true);
    assert.ok(state.invitation.lift > 0.9);
    assert.equal(state.invitation.forward, 0);
    assert.ok(Math.abs(state.invitation.rotationY) < 0.04);
  });

  it("settles with minimal wobble", () => {
    const state = getInviteExperienceState(6);

    assert.equal(state.phase, "settled");
    assert.equal(state.invitation.visible, true);
    assert.ok(Math.abs(state.invitation.wobble) < 0.02);
  });
});
