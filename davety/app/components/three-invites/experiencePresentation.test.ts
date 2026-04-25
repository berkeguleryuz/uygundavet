import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  BOOK_PAGE_REVEAL,
  EXPERIENCE_PRESENTATION,
  getCardBaseYForScene,
} from "./experiencePresentation.ts";

describe("EXPERIENCE_PRESENTATION", () => {
  it("keeps the 3D object seamless with the page instead of inside a framed stage", () => {
    assert.equal(EXPERIENCE_PRESENTATION.canvasHasFrame, false);
    assert.equal(EXPERIENCE_PRESENTATION.hasSharedGround, false);
    assert.equal(EXPERIENCE_PRESENTATION.hasSharedPedestal, false);
  });

  it("keeps the invitation reveal vertical for physical pocket/object exits", () => {
    assert.equal(EXPERIENCE_PRESENTATION.cardForwardMotion, 0);
  });

  it("starts the book invitation on the page plane instead of below the book", () => {
    assert.equal(getCardBaseYForScene("book"), BOOK_PAGE_REVEAL.cardBaseY);
    assert.ok(BOOK_PAGE_REVEAL.cardBaseY > -0.45);
    assert.equal(BOOK_PAGE_REVEAL.startsAsFlatPageRotationX, -Math.PI / 2);
    assert.equal(BOOK_PAGE_REVEAL.settlesUprightRotationX, 0);
  });
});
