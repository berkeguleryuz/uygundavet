import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { BlogPost } from "@/models/BlogPost";
import { ensureDb, listAllPosts, findUniqueSlug } from "@/lib/blog/queries";
import { normalizeSlug } from "@/lib/blog/slug";
import { calculateReadingTime } from "@/lib/blog/reading-time";
import { stripEmDash } from "@/lib/blog/strip-em-dash";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") ?? "1");
    const status = searchParams.get("status") as "draft" | "published" | null;
    const result = await listAllPosts({ page, status: status ?? undefined });
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json(
      { error: msg },
      { status: msg === "Unauthorized" ? 401 : msg === "Forbidden" ? 403 : 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    await ensureDb();
    const body = await req.json();
    const baseSlug = body.slug
      ? normalizeSlug(body.slug)
      : normalizeSlug(body.title ?? "");
    const slug = await findUniqueSlug(baseSlug);
    const content = stripEmDash(body.content ?? "");
    const readingTimeMinutes = calculateReadingTime(content);
    const publishedAt =
      body.status === "published"
        ? body.publishedAt
          ? new Date(body.publishedAt)
          : new Date()
        : null;
    const post = await BlogPost.create({
      slug,
      title: stripEmDash(body.title ?? ""),
      excerpt: stripEmDash(body.excerpt ?? ""),
      content,
      coverImage: body.coverImage ?? null,
      status: body.status ?? "draft",
      publishedAt,
      authorId: session.user.id,
      authorName: session.user.name ?? "Uygun Davet",
      tags: Array.isArray(body.tags) ? body.tags : [],
      seo: body.seo ?? {},
      aiGenerated: Boolean(body.aiGenerated),
      readingTimeMinutes,
    });
    return NextResponse.json(post.toObject(), { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json(
      { error: msg },
      { status: msg === "Unauthorized" ? 401 : msg === "Forbidden" ? 403 : 500 }
    );
  }
}
