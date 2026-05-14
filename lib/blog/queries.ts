import mongoose from "mongoose";
import { BlogPost, type IBlogPost } from "@/models/BlogPost";

async function ensureDb() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!);
  }
}

export async function listPublishedPosts(opts: { page?: number; limit?: number } = {}) {
  await ensureDb();
  const page = opts.page ?? 1;
  const limit = opts.limit ?? 12;
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    BlogPost.find({ status: "published" }).sort({ publishedAt: -1 }).skip(skip).limit(limit).lean(),
    BlogPost.countDocuments({ status: "published" }),
  ]);
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getPostBySlug(slug: string): Promise<IBlogPost | null> {
  await ensureDb();
  return BlogPost.findOne({ slug, status: "published" }).lean<IBlogPost>();
}

export async function getAllPublishedSlugs(): Promise<Array<{ slug: string; updatedAt: Date; publishedAt: Date | null }>> {
  await ensureDb();
  return BlogPost.find({ status: "published" }).select("slug updatedAt publishedAt").lean();
}

export async function getFeedPosts(limit = 50) {
  await ensureDb();
  return BlogPost.find({ status: "published" }).sort({ publishedAt: -1 }).limit(limit).lean();
}

export async function listAllPosts(opts: { page?: number; limit?: number; status?: "draft" | "published" } = {}) {
  await ensureDb();
  const page = opts.page ?? 1;
  const limit = opts.limit ?? 20;
  const skip = (page - 1) * limit;
  const filter = opts.status ? { status: opts.status } : {};
  const [items, total] = await Promise.all([
    BlogPost.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    BlogPost.countDocuments(filter),
  ]);
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function incrementViewCount(slug: string) {
  await ensureDb();
  await BlogPost.updateOne({ slug }, { $inc: { viewCount: 1 } });
}

export async function findUniqueSlug(base: string): Promise<string> {
  await ensureDb();
  let candidate = base;
  let counter = 2;
  while (await BlogPost.exists({ slug: candidate })) {
    candidate = `${base}-${counter}`;
    counter += 1;
  }
  return candidate;
}
