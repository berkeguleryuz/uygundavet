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

interface Memory {
  _id: string;
  authorName: string;
  message: string;
  createdAt: string;
  pending?: boolean;
}

const inputClass =
  "w-full h-12 rounded-lg border border-[#1a1a2e]/10 bg-transparent px-4 text-sm text-[#1a1a2e] placeholder:text-[#a09ba6] focus:border-[#b49a7c] focus:outline-none focus:ring-1 focus:ring-[#b49a7c]/20 transition-all font-sans";

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-12 h-px bg-[#b49a7c] mb-6" />
        <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#a09ba6] mb-3">
          {t("memoryPageLabel")}
        </p>
        <h1 className="font-merienda text-3xl md:text-4xl text-[#1a1a2e]">
          {brideFirst} & {groomFirst}
        </h1>
        <p className="font-sans text-sm text-[#6d6a75] mt-3 leading-relaxed max-w-md">
          {t("memoryPageSubtitle")}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="bg-white rounded-2xl border border-[#1a1a2e]/[0.06] shadow-sm p-6 md:p-8">
          <h3 className="font-merienda text-lg text-[#1a1a2e] mb-5">
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

            <div className="bg-[#b49a7c]/5 border border-[#b49a7c]/10 rounded-lg px-4 py-3">
              <p className="font-sans text-xs text-[#b49a7c] leading-relaxed">
                {t("memoryApprovalNotice")}
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-lg bg-[#1a1a2e] text-white font-semibold font-sans text-sm transition-all hover:bg-[#1a1a2e]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t("memorySubmitting")}
                </>
              ) : (
                <>
                  <SendIcon className="size-3.5" size={14} />
                  {t("memorySubmitButton")}
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-[#b49a7c]/30 border-t-[#b49a7c] rounded-full animate-spin" />
        </div>
      ) : memories.length > 0 ? (
        <div className="space-y-0">
          <div className="flex items-center gap-3 mb-6">
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#a09ba6] shrink-0">
              {t("memoryMessagesHeading")} &middot; {memories.length}
            </p>
            <div className="h-px flex-1 bg-[#1a1a2e]/[0.06]" />
          </div>

          <div>
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
            <div className="w-14 h-14 rounded-full bg-[#b49a7c]/5 border border-[#b49a7c]/10 flex items-center justify-center mx-auto mb-4">
              <QuoteIcon className="size-6 text-[#a09ba6]" size={24} />
            </div>
            <p className="font-sans text-sm text-[#6d6a75]">
              {t("memoryEmptyTitle")}
            </p>
            <p className="font-sans text-xs text-[#a09ba6]">
              {t("memoryEmptySubtitle")}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
