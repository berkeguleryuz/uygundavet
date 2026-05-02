import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/src/lib/prisma";
import { verifyInvitationPassword } from "@/src/lib/password";
import { rateLimit } from "@/src/lib/rate-limit";
import { getClientIp } from "@/src/lib/client-ip";

const unlockSchema = z.object({
  password: z.string().min(1).max(200),
});

type Params = Promise<{ slug: string }>;

const COOKIE_PREFIX = "dyl_unlock_";
const COOKIE_TTL_SECONDS = 60 * 60 * 24 * 30;

/**
 * Verifies the password supplied by a recipient and, on success, writes
 * an HttpOnly cookie that grants access to the public render page for
 * the next 30 days.
 *
 * Rate limited per-IP to slow down brute force. After 10 attempts in
 * 10 minutes the route returns 429 regardless of whether the password
 * is correct.
 */
export async function POST(req: Request, ctx: { params: Params }) {
  const { slug } = await ctx.params;
  const ip = getClientIp(req);

  const limited = await rateLimit({
    key: `unlock:${ip}:${slug}`,
    limit: 10,
    windowSeconds: 600,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Çok fazla deneme. Biraz bekle." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = unlockSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const design = await prisma.invitationDesign.findFirst({
    where: { OR: [{ slug }, { vanityPath: slug }] },
    select: { id: true, passwordHash: true, slug: true },
  });
  if (!design || !design.passwordHash) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const ok = await verifyInvitationPassword(
    parsed.data.password,
    design.passwordHash
  );
  if (!ok) {
    return NextResponse.json(
      { error: "Yanlış şifre." },
      { status: 401 }
    );
  }

  const cookieName = `${COOKIE_PREFIX}${design.id}`;
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookieName, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_TTL_SECONDS,
  });
  return res;
}

export const UNLOCK_COOKIE_PREFIX = COOKIE_PREFIX;
