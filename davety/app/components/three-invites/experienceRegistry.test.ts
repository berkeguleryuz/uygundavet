import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  getInviteExperienceByRoute,
  INVITE_EXPERIENCE_ROUTES,
  INVITE_EXPERIENCES,
} from "./experienceRegistry.ts";

describe("INVITE_EXPERIENCES", () => {
  it("defines the curated set of 3D invitation routes with unique paths", () => {
    assert.equal(INVITE_EXPERIENCES.length, 3);
    assert.equal(new Set(INVITE_EXPERIENCE_ROUTES).size, 3);
    assert.ok(INVITE_EXPERIENCE_ROUTES.includes("book"));
    assert.ok(INVITE_EXPERIENCE_ROUTES.includes("curtain"));
  });

  it("returns route configs with a title, template slug, and scene kind", () => {
    const book = getInviteExperienceByRoute("book");

    assert.equal(book.route, "book");
    assert.equal(book.templateSlug, "book-3d-invite");
    assert.equal(book.sceneKind, "book");
    assert.ok(book.title.length > 8);
    assert.ok(book.description.length > 20);
  });
});
