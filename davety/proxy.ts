import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { prisma } from "./src/lib/prisma";

const intlMiddleware = createMiddleware(routing);

/**
 * Canonical hostnames that we treat as the davetyolla.com app itself.
 * Anything else is treated as a host-mapped custom domain and goes
 * through the customDomain lookup flow.
 *
 * Set CANONICAL_HOSTS to a comma-separated list, defaults below cover
 * production, www, vercel previews, and localhost.
 */
// Module-level parse — middleware her request'te çalıştığı için
// env split + map allocation'ı bir kez yapılır.
// (server-hoist-static-io / js-cache-function-results)
const CANONICAL_HOSTS = (() => {
  const env = process.env.CANONICAL_HOSTS?.split(",").map((s) => s.trim());
  const list =
    env && env.length > 0
      ? env
      : ["davetyolla.com", "www.davetyolla.com", "uygundavet.com", "localhost"];
  return new Set(list.map((h) => h.toLowerCase()));
})();

function isCanonicalHost(host: string): boolean {
  const lower = host.toLowerCase().split(":")[0];
  if (CANONICAL_HOSTS.has(lower)) return true;
  if (lower.endsWith(".vercel.app")) return true;
  if (lower.endsWith(".davetyolla.com")) return true;
  return false;
}

export default async function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  // Custom domain resolver. When the request host is not one of our
  // canonical app hosts, we look it up in the InvitationDesign table
  // and rewrite the URL to /davetiyem/[slug] so the existing public render
  // page handles the request. We rewrite (not redirect) so the user
  // keeps seeing their own domain in the address bar.
  if (host && !isCanonicalHost(host) && request.nextUrl.pathname === "/") {
    const lower = host.toLowerCase().split(":")[0];
    try {
      const design = await prisma.invitationDesign.findUnique({
        where: { customDomain: lower },
        select: { slug: true, vanityPath: true, status: true },
      });
      if (design && design.status !== "archived") {
        const target = design.vanityPath ?? design.slug;
        const url = request.nextUrl.clone();
        url.pathname = `/${routing.defaultLocale}/davetiyem/${target}`;
        return NextResponse.rewrite(url);
      }
    } catch (err) {
      console.error("[proxy] custom domain lookup failed:", err);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
