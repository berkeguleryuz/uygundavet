import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    h1: [...(defaultSchema.attributes?.h1 ?? []), "id"],
    h2: [...(defaultSchema.attributes?.h2 ?? []), "id"],
    h3: [...(defaultSchema.attributes?.h3 ?? []), "id"],
    h4: [...(defaultSchema.attributes?.h4 ?? []), "id"],
    h5: [...(defaultSchema.attributes?.h5 ?? []), "id"],
    h6: [...(defaultSchema.attributes?.h6 ?? []), "id"],
    a: [...(defaultSchema.attributes?.a ?? []), ["href", /^#/, /^https?:/, /^mailto:/]],
  },
};

export function PostContent({ markdown }: { markdown: string }) {
  return (
    <article className="prose prose-invert prose-lg max-w-none prose-headings:font-orbitron prose-headings:text-[#d5d1ad] prose-a:text-[#d5d1ad] prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-strong:text-white prose-code:text-[#d5d1ad] prose-blockquote:border-[#d5d1ad]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }], [rehypeSanitize, sanitizeSchema]]}
      >
        {markdown}
      </ReactMarkdown>
    </article>
  );
}
