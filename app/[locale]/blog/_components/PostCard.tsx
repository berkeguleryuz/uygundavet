import Link from "next/link";
import Image from "next/image";

type Props = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: { url: string; alt: string; width: number; height: number } | null;
  publishedAt: string | Date | null;
  readingTimeMinutes: number;
  tags: string[];
};

export function PostCard({ slug, title, excerpt, coverImage, publishedAt, readingTimeMinutes, tags }: Props) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="group flex flex-col rounded-2xl bg-white/5 overflow-hidden hover:bg-white/10 transition-colors"
    >
      {coverImage && (
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={coverImage.url}
            alt={coverImage.alt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform"
          />
        </div>
      )}
      <div className="p-5 flex flex-col gap-3">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 rounded-full bg-[#d5d1ad]/10 text-[#d5d1ad]">
                {tag}
              </span>
            ))}
          </div>
        )}
        <h3 className="font-orbitron text-lg text-[#d5d1ad] line-clamp-2">{title}</h3>
        <p className="text-sm opacity-80 line-clamp-3 font-space-grotesk">{excerpt}</p>
        <div className="text-xs opacity-60 mt-auto pt-2 border-t border-white/10 flex gap-3">
          {publishedAt && <span>{new Date(publishedAt).toLocaleDateString("tr-TR")}</span>}
          <span>{readingTimeMinutes} dk okuma</span>
        </div>
      </div>
    </Link>
  );
}
