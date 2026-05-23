import Link from "next/link";
import { listPublishedPosts } from "@/lib/blog/queries";
import { PostCard } from "@/app/[locale]/blog/_components/PostCard";

export async function SectionBlogPreview() {
  const { items } = await listPublishedPosts({ page: 1, limit: 3 });
  if (items.length === 0) return null;

  return (
    <section className="px-6 py-20 bg-[#252224]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
          <div>
            <h2 className="font-orbitron text-4xl md:text-5xl text-[#d5d1ad]">Son Yazılar</h2>
            <p className="mt-3 opacity-70 font-space-grotesk">
              Düğün hazırlığı ve dijital davetiye rehberleri.
            </p>
          </div>
          <Link
            href="/blog"
            className="px-6 py-3 rounded-tl-[1.5rem] bg-[#d5d1ad] text-[#252224] font-orbitron tracking-[0.1em]"
          >
            Tüm Yazılar
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      </div>
    </section>
  );
}
