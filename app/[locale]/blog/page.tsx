import type { Metadata } from "next";
import Link from "next/link";
import { listPublishedPosts } from "@/lib/blog/queries";
import { PostCard } from "./_components/PostCard";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Dijital davetiye, LCV, düğün hazırlık ve daha fazlası hakkında Uygun Davet blog yazıları.",
};

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Number(sp.page ?? "1");
  const { items, totalPages } = await listPublishedPosts({ page });

  return (
    <main className="min-h-screen bg-[#252224] text-white px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="font-orbitron text-5xl md:text-6xl text-[#d5d1ad] tracking-tight">Blog</h1>
          <p className="mt-4 text-lg opacity-80 font-space-grotesk max-w-2xl">
            Dijital davetiye, LCV, düğün organizasyonu ve daha fazlası hakkında rehberler.
          </p>
        </header>

        {items.length === 0 ? (
          <p className="opacity-60">Henüz yayınlanmış yazı yok.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p) => (
              <PostCard
                key={String(p._id)}
                slug={p.slug}
                title={p.title}
                excerpt={p.excerpt}
                coverImage={p.coverImage}
                publishedAt={p.publishedAt}
                readingTimeMinutes={p.readingTimeMinutes}
                tags={p.tags}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex gap-3 mt-12 justify-center items-center">
            {page > 1 && (
              <Link href={`/blog?page=${page - 1}`} className="px-5 py-2 rounded bg-white/10 hover:bg-white/20">
                Önceki
              </Link>
            )}
            <span className="px-5 py-2 opacity-60">
              {page} / {totalPages}
            </span>
            {page < totalPages && (
              <Link href={`/blog?page=${page + 1}`} className="px-5 py-2 rounded bg-white/10 hover:bg-white/20">
                Sonraki
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
