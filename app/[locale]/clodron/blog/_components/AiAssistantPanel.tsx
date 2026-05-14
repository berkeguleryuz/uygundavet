"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import type { AiAction } from "@/lib/blog/ai-prompts";

type Props = {
  title: string;
  content: string;
  onFullPost: (markdown: string) => void;
  onAppendContent: (markdown: string) => void;
  onTitle: (title: string) => void;
  onExcerpt: (excerpt: string) => void;
  onSeoDescription: (desc: string) => void;
  onAiUsed: () => void;
};

export function AiAssistantPanel(props: Props) {
  const t = useTranslations("Blog");
  const [remaining, setRemaining] = useState(30);
  const [showFullPostPanel, setShowFullPostPanel] = useState(false);
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [targetLength, setTargetLength] = useState<"short" | "standard" | "long">("standard");
  const [loading, setLoading] = useState<AiAction | null>(null);

  const loadUsage = useCallback(async () => {
    try {
      const res = await fetch("/api/clodron/blog/ai/usage");
      const data = await res.json();
      setRemaining(data.remaining ?? 0);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadUsage();
  }, [loadUsage]);

  async function callAi(action: AiAction, context: Record<string, unknown>): Promise<string | null> {
    setLoading(action);
    try {
      const res = await fetch("/api/clodron/blog/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, context }),
      });
      if (res.status === 429) {
        toast.error(t("aiRateLimitError"));
        return null;
      }
      const data = await res.json();
      if (!res.ok) {
        toast.error("AI hata");
        return null;
      }
      if (typeof data.remaining === "number") setRemaining(data.remaining);
      props.onAiUsed();
      return data.output as string;
    } catch {
      toast.error("AI hata");
      return null;
    } finally {
      setLoading(null);
    }
  }

  async function handleFullPost() {
    const output = await callAi("full-post", {
      topic,
      keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean),
      targetLength,
    });
    if (output) {
      props.onFullPost(output);
      setShowFullPostPanel(false);
    }
  }

  async function handleTitleSuggest() {
    const output = await callAi("title-suggest", { topic: topic || props.title });
    if (output) {
      const lines = output.split("\n").map((l) => l.trim()).filter(Boolean);
      const chosen = window.prompt("Öneriler:\n\n" + lines.join("\n\n") + "\n\nBirini kopyala:");
      if (chosen) props.onTitle(chosen);
    }
  }

  async function handleIntro() {
    const output = await callAi("intro", { title: props.title });
    if (output) props.onAppendContent(output);
  }

  async function handleH2Outline() {
    const output = await callAi("h2-outline", { title: props.title });
    if (output) props.onAppendContent(output);
  }

  async function handleMetaDescription() {
    const output = await callAi("meta-description", { title: props.title, existingContent: props.content });
    if (output) props.onSeoDescription(output);
  }

  async function handleExcerpt() {
    const output = await callAi("excerpt", { existingContent: props.content });
    if (output) props.onExcerpt(output);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-orbitron text-sm">{t("aiAssistant")}</h3>
        <span className="text-xs opacity-60">{t("aiRemaining", { n: remaining })}</span>
      </div>

      {!showFullPostPanel ? (
        <button
          onClick={() => setShowFullPostPanel(true)}
          className="w-full px-4 py-3 rounded bg-[#d5d1ad] text-[#252224] font-medium text-sm hover:opacity-90"
        >
          {t("aiFullPost")}
        </button>
      ) : (
        <div className="space-y-2 p-3 rounded bg-white/5 border border-white/10">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={t("aiTopicLabel")}
            className="w-full px-3 py-2 rounded bg-white/10 text-sm"
          />
          <input
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder={t("aiKeywordsLabel")}
            className="w-full px-3 py-2 rounded bg-white/10 text-sm"
          />
          <select
            value={targetLength}
            onChange={(e) => setTargetLength(e.target.value as "short" | "standard" | "long")}
            className="w-full px-3 py-2 rounded bg-white/10 text-sm"
          >
            <option value="short">{t("aiLengthShort")}</option>
            <option value="standard">{t("aiLengthStandard")}</option>
            <option value="long">{t("aiLengthLong")}</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={handleFullPost}
              disabled={loading === "full-post"}
              className="flex-1 px-3 py-2 rounded bg-[#d5d1ad] text-[#252224] text-sm"
            >
              {loading === "full-post" ? "..." : t("aiGenerate")}
            </button>
            <button onClick={() => setShowFullPostPanel(false)} className="px-3 py-2 rounded bg-white/10 text-sm">
              X
            </button>
          </div>
        </div>
      )}

      <button onClick={handleTitleSuggest} disabled={loading !== null} className="w-full px-4 py-2 rounded bg-white/5 hover:bg-white/10 text-sm text-left">
        {loading === "title-suggest" ? "..." : t("aiTitleSuggest")}
      </button>
      <button onClick={handleIntro} disabled={loading !== null} className="w-full px-4 py-2 rounded bg-white/5 hover:bg-white/10 text-sm text-left">
        {loading === "intro" ? "..." : t("aiIntro")}
      </button>
      <button onClick={handleH2Outline} disabled={loading !== null} className="w-full px-4 py-2 rounded bg-white/5 hover:bg-white/10 text-sm text-left">
        {loading === "h2-outline" ? "..." : t("aiH2Outline")}
      </button>
      <button onClick={handleMetaDescription} disabled={loading !== null} className="w-full px-4 py-2 rounded bg-white/5 hover:bg-white/10 text-sm text-left">
        {loading === "meta-description" ? "..." : t("aiMetaDescription")}
      </button>
      <button onClick={handleExcerpt} disabled={loading !== null} className="w-full px-4 py-2 rounded bg-white/5 hover:bg-white/10 text-sm text-left">
        {loading === "excerpt" ? "..." : t("aiExcerpt")}
      </button>
    </div>
  );
}
