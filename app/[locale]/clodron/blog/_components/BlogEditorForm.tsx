"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import { normalizeSlug } from "@/lib/blog/slug";

export type EditorState = {
  title: string;
  slug: string;
  excerpt: string;
  tags: string;
  coverImage: { url: string; alt: string; width: number; height: number } | null;
  status: "draft" | "published";
  seo: { title: string; description: string; ogImageUrl: string };
  aiGenerated: boolean;
};

type Props = {
  state: EditorState;
  setState: Dispatch<SetStateAction<EditorState>>;
};

export function BlogEditorForm({ state, setState }: Props) {
  const t = useTranslations("Blog");
  const [slugTouched, setSlugTouched] = useState(() => state.slug.trim() !== "");

  async function handleCoverUpload(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/clodron/blog/upload-image", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        toast.error("Yüklenemedi");
        return;
      }
      const data = (await res.json()) as {
        url: string;
        width: number;
        height: number;
      };
      setState((prev) => ({
        ...prev,
        coverImage: {
          url: data.url,
          alt: prev.coverImage?.alt ?? "",
          width: data.width,
          height: data.height,
        },
      }));
    } catch {
      toast.error("Yüklenemedi");
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm opacity-70">{t("title")}</label>
        <input
          value={state.title}
          onChange={(e) => {
            const title = e.target.value;
            setState((p) => ({
              ...p,
              title,
              slug: slugTouched ? p.slug : normalizeSlug(title),
            }));
          }}
          placeholder={t("titlePlaceholder")}
          className="w-full mt-1 px-3 py-2 rounded bg-white/5 border border-white/10"
        />
      </div>

      <div>
        <label className="text-sm opacity-70">{t("slugLabel")}</label>
        <input
          value={state.slug}
          onChange={(e) => {
            setSlugTouched(true);
            setState((p) => ({ ...p, slug: e.target.value }));
          }}
          className="w-full mt-1 px-3 py-2 rounded bg-white/5 border border-white/10"
        />
      </div>

      <div>
        <label className="text-sm opacity-70">{t("excerptLabel")}</label>
        <textarea
          value={state.excerpt}
          onChange={(e) => setState((p) => ({ ...p, excerpt: e.target.value }))}
          rows={3}
          className="w-full mt-1 px-3 py-2 rounded bg-white/5 border border-white/10"
        />
        <div className="text-xs opacity-50 mt-1">
          {state.excerpt.length} / 160 {t("excerptHint")}
        </div>
      </div>

      <div>
        <label className="text-sm opacity-70">{t("tagsLabel")}</label>
        <input
          value={state.tags}
          onChange={(e) => setState((p) => ({ ...p, tags: e.target.value }))}
          placeholder={t("tagsHint")}
          className="w-full mt-1 px-3 py-2 rounded bg-white/5 border border-white/10"
        />
      </div>

      <div>
        <label className="text-sm opacity-70">{t("coverImageLabel")}</label>
        {state.coverImage && (
          <div className="mt-2 relative w-full aspect-video rounded overflow-hidden">
            <Image
              src={state.coverImage.url}
              alt={state.coverImage.alt}
              fill
              sizes="280px"
              className="object-cover"
            />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleCoverUpload(file);
          }}
          className="mt-2 text-sm"
        />
        {state.coverImage && (
          <input
            value={state.coverImage.alt}
            onChange={(e) =>
              setState((p) => ({
                ...p,
                coverImage: p.coverImage
                  ? { ...p.coverImage, alt: e.target.value }
                  : null,
              }))
            }
            placeholder={t("altTextLabel")}
            className="w-full mt-2 px-3 py-2 rounded bg-white/5 border border-white/10"
          />
        )}
      </div>

      <details>
        <summary className="text-sm opacity-70 cursor-pointer">
          {t("seoSection")}
        </summary>
        <div className="mt-2 space-y-2">
          <input
            value={state.seo.title}
            onChange={(e) =>
              setState((p) => ({
                ...p,
                seo: { ...p.seo, title: e.target.value },
              }))
            }
            placeholder={t("seoTitle")}
            className="w-full px-3 py-2 rounded bg-white/5 border border-white/10"
          />
          <textarea
            value={state.seo.description}
            onChange={(e) =>
              setState((p) => ({
                ...p,
                seo: { ...p.seo, description: e.target.value },
              }))
            }
            placeholder={t("seoDescription")}
            rows={2}
            className="w-full px-3 py-2 rounded bg-white/5 border border-white/10"
          />
        </div>
      </details>
    </div>
  );
}
