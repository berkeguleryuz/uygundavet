"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useWedding } from "../_lib/context";
import { ScrollReveal } from "./ScrollReveal";
import { MemoryCard } from "./MemoryCard";

interface Memory {
  _id: string;
  authorName: string;
  message: string;
  createdAt: string;
  pending?: boolean;
}

const inputClass =
  "w-full h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/20 focus:border-[#d5d1ad]/50 focus:outline-none transition-all font-sans";

export function MemoryForm() {
  const wedding = useWedding();

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
      // silently fail on fetch
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
      toast.error("Lütfen adınızı girin.");
      return;
    }

    if (!message.trim()) {
      toast.error("Lütfen bir mesaj yazın.");
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
        throw new Error(data?.error || "Bir hata oluştu");
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
      toast.success("Mesajınız kaydedildi!");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Bir hata oluştu. Tekrar deneyin."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <ScrollReveal>
        <form
          onSubmit={handleSubmit}
          className="bg-[#1c1a1b] rounded-2xl border border-white/10 p-6 space-y-4"
        >
          <h3 className="font-chakra text-xs uppercase tracking-wider text-[#d5d1ad]">
            Anı Bırakın
          </h3>

          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Adınızı girin"
            className={inputClass}
          />

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Mesajınızı yazın..."
            rows={4}
            className={cn(inputClass, "h-auto py-3 resize-none")}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-xl bg-[#d5d1ad] text-[#252224] font-semibold font-sans text-sm transition-all hover:bg-[#d5d1ad]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Gönderiliyor...
              </>
            ) : (
              "Gönder"
            )}
          </button>
        </form>
      </ScrollReveal>

      {/* Memories List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 text-[#d5d1ad]/50 animate-spin" />
        </div>
      ) : memories.length > 0 ? (
        <div className="space-y-4">
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
      ) : (
        <ScrollReveal>
          <div className="text-center py-12 space-y-3">
            <BookOpen className="size-10 text-white/10 mx-auto" />
            <p className="font-sans text-sm text-white/30">
              Henüz bir anı yazılmadı
            </p>
            <p className="font-sans text-xs text-white/15">
              İlk anıyı yazan siz olun!
            </p>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
