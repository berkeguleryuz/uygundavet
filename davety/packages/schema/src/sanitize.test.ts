import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { sanitizeSvgMarkup } from "./sanitize.ts";

describe("sanitizeSvgMarkup", () => {
  it("removes executable svg content while preserving safe drawing markup", () => {
    const dirty = `<svg viewBox="0 0 10 10" onload="alert(1)">
      <script>alert(1)</script>
      <foreignObject><div>bad</div></foreignObject>
      <path d="M0 0L10 10" onclick="alert(1)" href="javascript:alert(1)" stroke="currentColor" />
    </svg>`;

    const clean = sanitizeSvgMarkup(dirty);

    assert.match(clean, /<svg/);
    assert.match(clean, /<path/);
    assert.doesNotMatch(clean, /script/i);
    assert.doesNotMatch(clean, /foreignObject/i);
    assert.doesNotMatch(clean, /onload|onclick/i);
    assert.doesNotMatch(clean, /javascript:/i);
  });
});
