import { NextResponse } from "next/server";

/**
 * Consistent API error helpers. Use across route handlers so error
 * responses share the same shape and never leak stack traces or
 * internal details to clients.
 *
 * Format: `{ error: string, code?: string, issues?: unknown }`
 */

export interface ApiErrorBody {
  error: string;
  code?: string;
  issues?: unknown;
}

export function apiError(
  message: string,
  status: number,
  extras?: { code?: string; issues?: unknown; headers?: Record<string, string> }
) {
  const body: ApiErrorBody = {
    error: message,
    ...(extras?.code ? { code: extras.code } : {}),
    ...(extras?.issues !== undefined ? { issues: extras.issues } : {}),
  };
  return NextResponse.json(body, {
    status,
    ...(extras?.headers ? { headers: extras.headers } : {}),
  });
}

export const errors = {
  unauthorized: () => apiError("Unauthorized", 401, { code: "UNAUTHORIZED" }),
  forbidden: () => apiError("Forbidden", 403, { code: "FORBIDDEN" }),
  notFound: (what = "Not found") => apiError(what, 404, { code: "NOT_FOUND" }),
  invalid: (issues?: unknown) =>
    apiError("Invalid body", 400, { code: "INVALID", issues }),
  conflict: (message = "Conflict") =>
    apiError(message, 409, { code: "CONFLICT" }),
  tooLarge: (message = "Too large") =>
    apiError(message, 413, { code: "TOO_LARGE" }),
  rateLimited: (retryAfter: number) =>
    apiError("Rate limited", 429, {
      code: "RATE_LIMITED",
      headers: { "Retry-After": String(retryAfter) },
    }),
  unsupported: (message: string) =>
    apiError(message, 415, { code: "UNSUPPORTED" }),
  unavailable: (message: string) =>
    apiError(message, 503, { code: "UNAVAILABLE" }),
  internal: () => apiError("Internal server error", 500, { code: "INTERNAL" }),
};

/**
 * Wraps an async route handler so any thrown error becomes a clean 500
 * with no stack trace leakage. Logs the error server-side with a request
 * marker so we can correlate without exposing internals.
 */
export function withErrorHandler<T extends (...args: never[]) => Promise<Response>>(
  fn: T
): T {
  return (async (...args: never[]) => {
    try {
      return await fn(...args);
    } catch (err) {
      console.error("[api] unhandled error:", err);
      return errors.internal();
    }
  }) as T;
}
