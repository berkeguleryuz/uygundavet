"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, BookOpen, Send } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useWedding } from "../_lib/context";
import { ScrollReveal } from "./ScrollReveal";
import { MemoryCard } from "./MemoryCard";
import { OrnamentalDivider } from "./OrnamentalDivider";
import { t } from "../_lib/i18n";

interface Memory {
  _id: string;
  authorName: string;
  message: string;
  createdAt: string;
  pending?: boolean;
}

const inputClass =
  "w-full h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:border-[#d5d1ad]/50 focus:outline-none transition-all font-sans";

export function MemoryForm() {
  const wedding = useWedding();
  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authorName, setAuthorName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMemories = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/public/rsvp/${wedding.inviteCode}/memories`
      );
      if (!res.ok) return;
      const data = await res.json();
      setMemories(
        (data.memories || []).map((m: Memory) => ({ ...m, pending: false }))
      );
    } catch {
    } finally {
      setIsLoading(false);
    }
  }, [wedding.inviteCode]);

  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authorName.trim()) {
      toast.error(t("memoryNameRequired"));
      return;
    }
    if (!message.trim()) {
      toast.error(t("memoryMessageRequired"));
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(
        `/api/public/rsvp/${wedding.inviteCode}/memories`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            authorName: authorName.trim(),
            message: message.trim(),
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || t("memoryErrorToast"));
      }

      const newMemory: Memory = {
        _id: `pending-${Date.now()}`,
        authorName: authorName.trim(),
        message: message.trim(),
        createdAt: new Date().toISOString(),
        pending: true,
      };

      setMemories((prev) => [newMemory, ...prev]);
      setAuthorName("");
      setMessage("");
      toast.success(t("memorySuccessToast"));
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : t("memoryErrorToast")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      <ScrollReveal className="text-center">
        <OrnamentalDivider className="mb-6" />
        <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#d5d1ad]/40 mb-3">
          {t("memoryPageLabel")}
        </p>
        <h1 className="font-merienda text-3xl md:text-4xl text-[#d5d1ad]">
          {brideFirst} & {groomFirst}
        </h1>
        <p className="font-sans text-sm text-white/35 mt-3 max-w-md mx-auto leading-relaxed">
          {t("memoryPageSubtitle")}
        </p>
      </ScrollReveal>

      <ScrollReveal>
        <div className="bg-[#1c1a1b] rounded-2xl border border-white/[0.07] p-6 md:p-8">
          <h3 className="font-merienda text-lg text-[#d5d1ad]/80 mb-5">
            {t("memoryFormHeading")}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder={t("memoryNamePlaceholder")}
              className={inputClass}
            />

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("memoryMessagePlaceholder")}
              rows={4}
              className={cn(inputClass, "h-auto py-3 resize-none")}
            />

            <div className="bg-[#d5d1ad]/[0.04] border border-[#d5d1ad]/10 rounded-xl px-4 py-3">
              <p className="font-sans text-xs text-[#d5d1ad]/70 leading-relaxed">
                {t("memoryApprovalNotice")}
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-[#d5d1ad] text-[#252224] font-semibold font-sans text-sm transition-all hover:bg-[#d5d1ad]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {t("memorySubmitting")}
                </>
              ) : (
                <>
                  <Send className="size-3.5" />
                  {t("memorySubmitButton")}
                </>
              )}
            </button>
          </form>
        </div>
      </ScrollReveal>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 text-[#d5d1ad]/50 animate-spin" />
        </div>
      ) : memories.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.05]" />
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-white/35 shrink-0">
              {t("memoryMessagesHeading")} · {memories.length}
            </p>
            <div className="h-px flex-1 bg-white/[0.05]" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {memories.map((memory) => (
              <MemoryCard
                key={memory._id}
                authorName={memory.authorName}
                message={memory.message}
                createdAt={memory.createdAt}
                pending={memory.pending}
              />
            ))}
          </div>
        </div>
      ) : (
        <ScrollReveal>
          <div className="text-center py-16 space-y-3">
            <div className="w-14 h-14 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
              <BookOpen className="size-6 text-white/10" />
            </div>
            <p className="font-sans text-sm text-white/30">
              {t("memoryEmptyTitle")}
            </p>
            <p className="font-sans text-xs text-white/15">
              {t("memoryEmptySubtitle")}
            </p>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
