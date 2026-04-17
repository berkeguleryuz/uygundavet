"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useWedding } from "../_lib/context";
import { MemoryCard } from "./MemoryCard";
import { t } from "../_lib/i18n";
import { SendIcon } from "../_icons/SendIcon";
import { QuoteIcon } from "../_icons/QuoteIcon";
import { WaveIcon } from "../_icons/WaveIcon";

interface Memory {
  _id: string;
  authorName: string;
  message: string;
  createdAt: string;
  pending?: boolean;
}

const inputClassDark =
  "w-full h-12 rounded-xl border border-[#a8dadc]/20 bg-[#0d1620]/60 px-4 text-sm text-[#f1faee] placeholder:text-[#f1faee]/30 focus:border-[#a8dadc] focus:outline-none focus:ring-2 focus:ring-[#a8dadc]/25 transition-all font-sans";

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
      const res = await fetch(`/api/public/rsvp/${wedding.inviteCode}/memories`);
      if (!res.ok) return;
      const data = await res.json();
      setMemories((data.memories || []).map((m: Memory) => ({ ...m, pending: false })));
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
      const res = await fetch(`/api/public/rsvp/${wedding.inviteCode}/memories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorName: authorName.trim(), message: message.trim() }),
      });

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
      toast.error(err instanceof Error ? err.message : t("memoryErrorToast"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="h-px w-10 bg-[#a8dadc]/40" />
          <WaveIcon size={18} className="text-[#a8dadc]" />
          <div className="h-px w-10 bg-[#a8dadc]/40" />
        </div>
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#a8dadc] mb-3 font-semibold">
          {t("memoryPageLabel")}
        </p>
        <h1 className="font-merienda text-4xl md:text-5xl text-[#f1faee]">
          {brideFirst} &amp; {groomFirst}
        </h1>
        <p className="font-sans text-sm text-[#f1faee]/55 mt-3 leading-relaxed max-w-md mx-auto">
          {t("memoryPageSubtitle")}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="bg-[#1a2332]/50 backdrop-blur-sm rounded-[1.5rem] border border-[#a8dadc]/20 p-6 md:p-8">
          <h3 className="font-merienda text-xl text-[#f1faee] mb-5">
            {t("memoryFormHeading")}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder={t("memoryNamePlaceholder")}
              className={inputClassDark}
            />

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("memoryMessagePlaceholder")}
              rows={4}
              className={cn(inputClassDark, "h-auto py-3 resize-none")}
            />

            <div className="bg-[#2d8b8b]/15 border border-[#2d8b8b]/30 rounded-xl px-4 py-3 flex items-start gap-2.5">
              <WaveIcon size={14} className="text-[#a8dadc] mt-0.5 shrink-0" />
              <p className="font-sans text-xs text-[#a8dadc] leading-relaxed">
                {t("memoryApprovalNotice")}
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-[#2d8b8b] text-[#f1faee] font-bold font-sans text-sm tracking-[0.15em] uppercase transition-all hover:bg-[#3aa0a0] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#f1faee]/30 border-t-[#f1faee] rounded-full animate-spin" />
                  {t("memorySubmitting")}
                </>
              ) : (
                <>
                  <SendIcon size={14} />
                  {t("memorySubmitButton")}
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-[#a8dadc]/30 border-t-[#a8dadc] rounded-full animate-spin" />
        </div>
      ) : memories.length > 0 ? (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <p className="font-sans text-xs tracking-[0.25em] uppercase text-[#a8dadc]/60 shrink-0 font-semibold">
              {t("memoryMessagesHeading")} &middot; {memories.length}
            </p>
            <div className="h-px flex-1 bg-[#a8dadc]/15" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center py-16 space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#2d8b8b]/15 border border-[#a8dadc]/25 flex items-center justify-center mx-auto mb-4">
              <QuoteIcon size={24} className="text-[#a8dadc]/60" />
            </div>
            <p className="font-sans text-sm text-[#f1faee]/55">
              {t("memoryEmptyTitle")}
            </p>
            <p className="font-sans text-xs text-[#f1faee]/30">
              {t("memoryEmptySubtitle")}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
