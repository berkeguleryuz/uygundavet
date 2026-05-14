import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { BlogPost } from "@/models/BlogPost";
import { calculateReadingTime } from "@/lib/blog/reading-time";
import { stripEmDash } from "@/lib/blog/strip-em-dash";
import { normalizeSlug } from "@/lib/blog/slug";
import { ensureDb, findUniqueSlug } from "@/lib/blog/queries";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    await ensureDb();
    const { id } = await ctx.params;
    const post = await BlogPost.findById(id).lean();
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json(
      { error: msg },
      { status: msg === "Unauthorized" ? 401 : msg === "Forbidden" ? 403 : 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    await ensureDb();
    const { id } = await ctx.params;
    const body = await req.json();
    const existing = await BlogPost.findById(id);
    if (!existing)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (body.title !== undefined) existing.title = stripEmDash(body.title);
    if (body.excerpt !== undefined) existing.excerpt = stripEmDash(body.excerpt);
    if (body.content !== undefined) {
      existing.content = stripEmDash(body.content);
      existing.readingTimeMinutes = calculateReadingTime(existing.content);
    }
    if (body.coverImage !== undefined) existing.coverImage = body.coverImage;
    if (body.tags !== undefined) existing.tags = body.tags;
    if (body.seo !== undefined) existing.seo = body.seo;
    if (body.aiGenerated !== undefined) existing.aiGenerated = body.aiGenerated;
    if (body.slug !== undefined && body.slug !== existing.slug) {
      const base = normalizeSlug(body.slug);
      existing.slug = await findUniqueSlug(base);
    }
    if (body.status !== undefined) {
      const wasPublished = existing.status === "published";
      existing.status = body.status;
      if (body.status === "published" && !wasPublished) {
        existing.publishedAt = body.publishedAt
          ? new Date(body.publishedAt)
          : new Date();
      }
    }
    await existing.save();
    return NextResponse.json(existing.toObject());
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json(
      { error: msg },
      { status: msg === "Unauthorized" ? 401 : msg === "Forbidden" ? 403 : 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    await ensureDb();
    const { id } = await ctx.params;
    await BlogPost.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json(
      { error: msg },
      { status: msg === "Unauthorized" ? 401 : msg === "Forbidden" ? 403 : 500 }
    );
  }
}
