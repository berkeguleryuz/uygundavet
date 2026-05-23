"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import type { MDXEditorMethods } from "@mdxeditor/editor";
import { BlogEditorForm, type EditorState } from "./BlogEditorForm";
import { AiAssistantPanel } from "./AiAssistantPanel";

const MdxEditorClient = dynamic(
  () => import("./MdxEditorClient").then((m) => m.MdxEditorClient),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[60vh] flex items-center justify-center opacity-50">
        ...
      </div>
    ),
  },
);

type InitialPost = Partial<Omit<EditorState, "tags">> & {
  _id?: string;
  content?: string;
  tags?: string[] | string;
};

type Props = {
  initial?: InitialPost;
};

export function BlogEditor({ initial }: Props) {
  const t = useTranslations("Blog");
  const router = useRouter();
  const editorRef = useRef<MDXEditorMethods>(null);

  const [state, setState] = useState<EditorState>({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    excerpt: initial?.excerpt ?? "",
    tags: Array.isArray(initial?.tags)
      ? initial.tags.join(", ")
      : (initial?.tags ?? ""),
    coverImage: initial?.coverImage ?? null,
    status: initial?.status ?? "draft",
    seo: {
      title: initial?.seo?.title ?? "",
      description: initial?.seo?.description ?? "",
      ogImageUrl: initial?.seo?.ogImageUrl ?? "",
    },
    aiGenerated: initial?.aiGenerated ?? false,
  });

  const [content, setContent] = useState(initial?.content ?? "");
  const [saving, setSaving] = useState(false);

  async function save(publishMode: "draft" | "published") {
    setSaving(true);
    try {
      const payload = {
        ...state,
        content,
        status: publishMode,
        tags: state.tags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const url = initial?._id
        ? `/api/clodron/blog/${initial._id}`
        : `/api/clodron/blog`;
      const method = initial?._id ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        toast.error("Kaydedilemedi");
        return;
      }
      const data = await res.json();
      toast.success(publishMode === "published" ? t("published") : t("draft"));
      if (!initial?._id && data._id) {
        router.push(`/clodron/blog/${data._id}/duzenle`);
      }
    } catch {
      toast.error("Kaydedilemedi");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-orbitron">{t("editorTitle")}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => save("draft")}
            disabled={saving}
            className="px-5 py-2 rounded bg-white/10 hover:bg-white/20"
          >
            {t("saveDraft")}
          </button>
          <button
            onClick={() => save("published")}
            disabled={saving}
            className="px-6 py-2 rounded-tl-[1.5rem] bg-[#d5d1ad] text-[#252224] font-orbitron"
          >
            {t("publish")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-6">
        <div>
          <BlogEditorForm state={state} setState={setState} />
        </div>
        <div className="bg-white/5 rounded-lg overflow-hidden">
          <MdxEditorClient
            ref={editorRef}
            markdown={content}
            onChange={setContent}
          />
        </div>
        <div>
          <AiAssistantPanel
            title={state.title}
            content={content}
            onFullPost={(md) => {
              setContent(md);
              editorRef.current?.setMarkdown(md);
              setState((p) => ({ ...p, aiGenerated: true }));
            }}
            onAppendContent={(md) => {
              const next = content ? `${content}\n\n${md}` : md;
              setContent(next);
              editorRef.current?.setMarkdown(next);
              setState((p) => ({ ...p, aiGenerated: true }));
            }}
            onTitle={(title) =>
              setState((p) => ({ ...p, title, aiGenerated: true }))
            }
            onExcerpt={(excerpt) =>
              setState((p) => ({ ...p, excerpt, aiGenerated: true }))
            }
            onSeoDescription={(desc) =>
              setState((p) => ({
                ...p,
                seo: { ...p.seo, description: desc },
                aiGenerated: true,
              }))
            }
            onAiUsed={() => setState((p) => ({ ...p, aiGenerated: true }))}
          />
        </div>
      </div>
    </div>
  );
}
