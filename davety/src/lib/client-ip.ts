/**
 * Best-effort client IP extraction for rate-limit keys and abuse logging.
 *
 * Reads the standard forwarded headers in priority order. We intentionally
 * do NOT use `request.ip` because it is not reliable behind Vercel/CF
 * edge in all runtimes.
 *
 * Returns "unknown" when no header is present so the rate-limit key is
 * still stable (instead of falling back to per-request keys that bypass
 * the limit). For local dev this means all localhost requests share one
 * bucket, which is fine.
 */
export function getClientIp(req: Request): string {
  const headers = req.headers;
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const cfConnecting = headers.get("cf-connecting-ip");
  if (cfConnecting) return cfConnecting.trim();
  return "unknown";
}
