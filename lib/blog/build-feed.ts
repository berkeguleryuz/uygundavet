import { Feed } from "feed";
import { getFeedPosts } from "@/lib/blog/queries";
import { renderMarkdownToHtml } from "@/lib/blog/markdown";

export async function buildFeed(): Promise<Feed> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://uygundavet.com";
  const feed = new Feed({
    title: "Uygun Davet Blog",
    description: "Dijital davetiye, LCV, düğün hazırlık ve daha fazlası.",
    id: siteUrl,
    link: siteUrl,
    language: "tr",
    image: `${siteUrl}/logo-gold.png`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `© ${new Date().getFullYear()} Uygun Davet`,
    feedLinks: {
      rss: `${siteUrl}/feed.xml`,
      atom: `${siteUrl}/atom.xml`,
      json: `${siteUrl}/feed.json`,
    },
    author: { name: "Uygun Davet", link: siteUrl },
  });

  const posts = await getFeedPosts(50);
  for (const post of posts) {
    const html = await renderMarkdownToHtml(post.content);
    feed.addItem({
      title: post.title,
      id: `${siteUrl}/blog/${post.slug}`,
      link: `${siteUrl}/blog/${post.slug}`,
      description: post.excerpt,
      content: html,
      date: post.publishedAt ?? post.createdAt,
      image: post.coverImage?.url,
      author: [{ name: post.authorName }],
      category: post.tags.map((t) => ({ name: t })),
    });
  }
  return feed;
}
