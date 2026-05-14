import { JsonLd } from "@/app/components/JsonLd";

type Props = {
  title: string;
  excerpt: string;
  slug: string;
  coverImageUrl?: string;
  publishedAt: string;
  updatedAt: string;
  authorName: string;
  siteUrl: string;
};

export function BlogJsonLd(p: Props) {
  const url = `${p.siteUrl}/blog/${p.slug}`;
  const blogPosting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    description: p.excerpt,
    image: p.coverImageUrl,
    datePublished: p.publishedAt,
    dateModified: p.updatedAt,
    author: { "@type": "Person", name: p.authorName },
    publisher: {
      "@type": "Organization",
      name: "Uygun Davet",
      logo: { "@type": "ImageObject", url: `${p.siteUrl}/logo-gold.png` },
    },
    mainEntityOfPage: url,
    url,
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Anasayfa", item: p.siteUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${p.siteUrl}/blog` },
      { "@type": "ListItem", position: 3, name: p.title, item: url },
    ],
  };
  return <JsonLd data={[blogPosting, breadcrumb]} />;
}
