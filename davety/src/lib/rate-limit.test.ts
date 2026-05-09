import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { __getRateLimitBucketCountForTest, rateLimit } from "./rate-limit.ts";

describe("rateLimit cleanup", () => {
  it("prunes stale transient keys during normal rate limit calls", async () => {
    for (let i = 0; i < 2000; i += 1) {
      await rateLimit({
        key: `transient:${i}`,
        limit: 1,
        windowSeconds: 0,
      });
    }

    assert.equal(__getRateLimitBucketCountForTest(), 1);
  });
});
