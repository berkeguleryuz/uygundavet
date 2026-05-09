/**
 * In-memory sliding-window rate limiter.
 *
 * Per-process only. Good enough to stop a single client from hammering
 * a route on a single Next.js instance. For horizontally scaled
 * deployments swap this for Redis (Upstash) or a Postgres-backed
 * implementation. The function signature is intentionally async so
 * that swap is non-breaking for callers.
 *
 * Buckets self-prune every call (we only keep timestamps within the
 * window). For high-throughput keys this stays bounded; for low-
 * throughput keys we also clear the bucket when it empties.
 */

interface Bucket {
  hits: number[];
  windowMs: number;
}

const BUCKETS = new Map<string, Bucket>();

export interface RateLimitInput {
  key: string;
  limit: number;
  windowSeconds: number;
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfter: number;
}

export async function rateLimit(
  input: RateLimitInput
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowMs = input.windowSeconds * 1000;
  const cutoff = now - windowMs;
  maybeCleanupRateLimit(now);

  let bucket = BUCKETS.get(input.key);
  if (!bucket) {
    bucket = { hits: [], windowMs };
    BUCKETS.set(input.key, bucket);
  } else {
    bucket.windowMs = windowMs;
  }

  while (bucket.hits.length > 0 && bucket.hits[0] <= cutoff) {
    bucket.hits.shift();
  }

  if (bucket.hits.length >= input.limit) {
    const oldest = bucket.hits[0];
    const retryAfter = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return { ok: false, remaining: 0, retryAfter };
  }

  bucket.hits.push(now);
  if (bucket.hits.length === 0) {
    BUCKETS.delete(input.key);
  }

  return {
    ok: true,
    remaining: input.limit - bucket.hits.length,
    retryAfter: 0,
  };
}

/**
 * Best-effort cleanup of stale buckets so the Map does not grow
 * unbounded for transient keys. Runs lazily on every Nth call.
 */
let callCount = 0;
const CLEANUP_INTERVAL = 1000;

export function maybeCleanupRateLimit(now = Date.now()): void {
  callCount += 1;
  if (callCount % CLEANUP_INTERVAL !== 0) return;
  for (const [key, bucket] of BUCKETS) {
    const newest = bucket.hits[bucket.hits.length - 1] ?? 0;
    if (bucket.hits.length === 0 || newest <= now - bucket.windowMs) {
      BUCKETS.delete(key);
    }
  }
}

export function __getRateLimitBucketCountForTest(): number {
  return BUCKETS.size;
}
