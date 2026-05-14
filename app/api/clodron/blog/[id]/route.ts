import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { BlogPost } from "@/models/BlogPost";
import { calculateReadingTime } from "@/lib/blog/reading-time";
import { stripEmDash } from "@/lib/blog/strip-em-dash";
import { normalizeSlug } from "@/lib/blog/slug";
import { findUniqueSlug, ensureDb } from "@/lib/blog/queries";

const updateSchema = z
  .object({
    title: z.string().min(1).max(200),
    slug: z.string().max(80),
    excerpt: z.string().min(1).max(300),
    content: z.string().min(1),
    coverImage: z
      .object({
        url: z.string().url(),
        alt: z.string().max(200),
        width: z.number().int().positive(),
        height: z.number().int().positive(),
      })
      .nullable(),
    status: z.enum(["draft", "published"]),
    publishedAt: z.string().datetime(),
    tags: z.array(z.string().max(50)).max(20),
    seo: z.object({
      title: z.string().max(200).optional(),
      description: z.string().max(300).optional(),
      ogImageUrl: z.string().url().optional(),
    }),
    aiGenerated: z.boolean(),
  })
  .partial();

function handleError(err: unknown, ctx: string) {
  if (err instanceof Error && err.message === "Unauthorized")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (err instanceof Error && err.message === "Forbidden")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  console.error(`[clodron/blog/[id] ${ctx}]`, err);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await ensureDb();
    const post = await BlogPost.findById(id).lean();
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch (err) {
    return handleError(err, "GET");
  }
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const json = await req.json();
    const parsed = updateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
    }
    const body = parsed.data;
    await ensureDb();
    const existing = await BlogPost.findById(id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

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
      if (base) existing.slug = await findUniqueSlug(base);
    }
    if (body.status !== undefined) {
      const wasPublished = existing.status === "published";
      existing.status = body.status;
      if (body.status === "published" && !wasPublished) {
        existing.publishedAt = body.publishedAt ? new Date(body.publishedAt) : new Date();
      }
    }
    await existing.save();
    return NextResponse.json(existing.toObject());
  } catch (err) {
    return handleError(err, "PATCH");
  }
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await ensureDb();
    await BlogPost.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleError(err, "DELETE");
  }
}
