import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSanitize, { defaultSchema, type Options as SanitizeSchema } from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import GithubSlugger from "github-slugger";

const sanitizeSchema: SanitizeSchema = {
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

export async function renderMarkdownToHtml(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: "wrap" })
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeStringify)
    .process(markdown);
  return String(file);
}

export function extractHeadings(markdown: string): Array<{ id: string; text: string; level: 2 | 3 }> {
  const headings: Array<{ id: string; text: string; level: 2 | 3 }> = [];
  const slugger = new GithubSlugger();
  const withoutCodeFences = markdown.replace(/```[\s\S]*?```/g, "");
  const regex = /^(#{2,3})\s+(.+)$/gm;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(withoutCodeFences)) !== null) {
    const level = match[1].length === 2 ? 2 : 3;
    const text = match[2].trim();
    const id = slugger.slug(text);
    headings.push({ id, text, level });
  }
  return headings;
}
