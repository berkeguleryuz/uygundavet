import { NextResponse } from "next/server";

/**
 * Eski print endpoint'i — yeni Next.js page'e (`/davetiyem/[slug]/print`)
 * kalıcı redirect. Yeni sayfa public render ile AYNI InvitationView'ı
 * kullanıyor, bire bir görsel tutarlılık. Bu route geriye uyumluluk için
 * korunuyor (eski paylaşım linkleri bozulmasın).
 */
type Params = Promise<{ slug: string }>;

export async function GET(_: Request, ctx: { params: Params }) {
  const { slug } = await ctx.params;
  return NextResponse.redirect(
    new URL(
      `/davetiyem/${encodeURIComponent(slug)}/print`,
      process.env.NEXT_PUBLIC_DAVETIYE_URL ?? "http://localhost:3050",
    ),
    { status: 308 },
  );
}
