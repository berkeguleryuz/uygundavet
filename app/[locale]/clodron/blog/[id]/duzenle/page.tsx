import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { BlogPost, type IBlogPost } from "@/models/BlogPost";
import { ensureDb } from "@/lib/blog/queries";
import { requireAdmin } from "@/lib/admin-auth";
import { BlogEditor } from "../../_components/BlogEditor";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) notFound();
  await ensureDb();
  const post = await BlogPost.findById(id).lean<IBlogPost>();
  if (!post) notFound();

  const initial = {
    _id: String(post._id),
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage,
    status: post.status,
    seo: {
      title: post.seo?.title ?? "",
      description: post.seo?.description ?? "",
      ogImageUrl: post.seo?.ogImageUrl ?? "",
    },
    aiGenerated: post.aiGenerated,
    tags: post.tags,
  };

  return <BlogEditor initial={initial} />;
}
