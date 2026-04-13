"use client";

import { motion } from "framer-motion";

interface MemoryCardProps {
  authorName: string;
  message: string;
  createdAt: string;
  pending?: boolean;
}

function getRelativeDate(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "Az önce";
  if (diffMin < 60) return `${diffMin} dakika önce`;
  if (diffHour < 24) return `${diffHour} saat önce`;
  if (diffDay < 7) return `${diffDay} gün önce`;
  if (diffDay < 30) return `${Math.floor(diffDay / 7)} hafta önce`;
  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function MemoryCard({
  authorName,
  message,
  createdAt,
  pending,
}: MemoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1c1a1b] rounded-2xl border border-white/10 p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-chakra text-sm uppercase tracking-wider text-[#d5d1ad]">
          {authorName}
        </p>
        {pending && (
          <span className="shrink-0 inline-flex items-center rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-sans font-medium text-amber-400">
            Onay Bekliyor
          </span>
        )}
      </div>

      <p className="font-sans text-sm text-white/70 mt-2 leading-relaxed">
        {message}
      </p>

      <p className="font-sans text-xs text-white/25 mt-3">
        {getRelativeDate(createdAt)}
      </p>
    </motion.div>
  );
}
