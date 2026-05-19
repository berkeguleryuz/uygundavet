import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { BlogPost } from "@/models/BlogPost";
import { listAllPosts, findUniqueSlug, ensureDb } from "@/lib/blog/queries";
import { normalizeSlug } from "@/lib/blog/slug";
import { calculateReadingTime } from "@/lib/blog/reading-time";
import { stripEmDash } from "@/lib/blog/strip-em-dash";
import { deriveExcerpt } from "@/lib/blog/excerpt";

const coverImageSchema = z
  .object({
    url: z.string().url(),
    alt: z.string().max(200).default(""),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  })
  .nullable();

const createSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().max(80).optional().default(""),
  excerpt: z.string().max(300).optional().default(""),
  content: z.string().min(1),
  coverImage: coverImageSchema.optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  publishedAt: z.string().datetime().optional(),
  tags: z.array(z.string().max(50)).max(20).default([]),
  seo: z
    .object({
      title: z.string().max(200).optional().default(""),
      description: z.string().max(300).optional().default(""),
      ogImageUrl: z.literal("").or(z.string().url()).optional().default(""),
    })
    .default({}),
  aiGenerated: z.boolean().default(false),
});

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") ?? "1");
    const status = searchParams.get("status") as "draft" | "published" | null;
    const result = await listAllPosts({ page, status: status ?? undefined });
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (err instanceof Error && err.message === "Forbidden")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error("[clodron/blog GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const json = await req.json();
    const parsed = createSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
    }
    const body = parsed.data;
    await ensureDb();
    const baseSlug = body.slug ? normalizeSlug(body.slug) : normalizeSlug(body.title);
    if (!baseSlug) return NextResponse.json({ error: "Title or slug required" }, { status: 400 });
    const slug = await findUniqueSlug(baseSlug);
    const content = stripEmDash(body.content);
    const readingTimeMinutes = calculateReadingTime(content);
    const excerpt = stripEmDash(
      body.excerpt.trim() ? body.excerpt : deriveExcerpt(content)
    );
    const publishedAt =
      body.status === "published" ? (body.publishedAt ? new Date(body.publishedAt) : new Date()) : null;
    const post = await BlogPost.create({
      slug,
      title: stripEmDash(body.title),
      excerpt,
      content,
      coverImage: body.coverImage ?? null,
      status: body.status,
      publishedAt,
      authorId: session.user.id,
      authorName: session.user.name || "Uygun Davet",
      tags: body.tags,
      seo: body.seo,
      aiGenerated: body.aiGenerated,
      readingTimeMinutes,
    });
    return NextResponse.json(post.toObject(), { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (err instanceof Error && err.message === "Forbidden")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error("[clodron/blog POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
