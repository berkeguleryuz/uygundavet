import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, incrementViewCount } from "@/lib/blog/queries";
import { extractHeadings } from "@/lib/blog/markdown";
import { PostContent } from "../_components/PostContent";
import { TableOfContents } from "../_components/TableOfContents";
import { ReadingProgress } from "../_components/ReadingProgress";
import { ShareButtons } from "../_components/ShareButtons";
import { BlogJsonLd } from "../_components/BlogJsonLd";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Bulunamadı" };
  return {
    title: post.seo?.title ?? post.title,
    description: post.seo?.description ?? post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage?.url ? [{ url: post.coverImage.url }] : undefined,
      publishedTime: post.publishedAt?.toString(),
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  incrementViewCount(slug).catch(() => {});

  const headings = extractHeadings(post.content);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://uygundavet.com";

  return (
    <main className="min-h-screen bg-[#252224] text-white">
      <ReadingProgress />
      <BlogJsonLd
        title={post.title}
        excerpt={post.excerpt}
        slug={post.slug}
        coverImageUrl={post.coverImage?.url}
        publishedAt={post.publishedAt ? new Date(post.publishedAt).toISOString() : ""}
        updatedAt={new Date(post.updatedAt).toISOString()}
        authorName={post.authorName}
        siteUrl={siteUrl}
      />

      {post.coverImage && (
        <div className="relative w-full max-h-[60vh] aspect-video">
          <Image
            src={post.coverImage.url}
            alt={post.coverImage.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#252224] via-[#252224]/40 to-transparent" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12">
        <aside>
          <TableOfContents headings={headings} />
        </aside>

        <div>
          <Link href="/blog" className="text-sm opacity-60 hover:opacity-100">
            Bloga geri dön
          </Link>

          <header className="mt-4 mb-8">
            <h1 className="font-orbitron text-4xl md:text-6xl text-[#d5d1ad] tracking-tight leading-tight">
              {post.title}
            </h1>
            <div className="mt-6 flex flex-wrap gap-4 text-sm opacity-70">
              {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString("tr-TR")}</span>}
              <span>{post.readingTimeMinutes} dk okuma</span>
              <span>{post.authorName}</span>
            </div>
            {post.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs px-3 py-1 rounded-full bg-[#d5d1ad]/10 text-[#d5d1ad]">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <PostContent markdown={post.content} />

          <footer className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <ShareButtons title={post.title} url={`${siteUrl}/blog/${post.slug}`} />
            <Link
              href="/"
              className="px-6 py-3 rounded-tl-[1.5rem] bg-[#d5d1ad] text-[#252224] font-orbitron tracking-[0.1em]"
            >
              Davetiyemi Oluştur
            </Link>
          </footer>
        </div>
      </div>
    </main>
  );
}
