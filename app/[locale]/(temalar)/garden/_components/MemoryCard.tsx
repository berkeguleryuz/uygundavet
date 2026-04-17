"use client";

import { motion } from "framer-motion";
import { t } from "../_lib/i18n";
import { LeafIcon } from "../_icons/LeafIcon";

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

  if (diffSec < 60) return t("memoryTimeJustNow");
  if (diffMin < 60) return `${diffMin} ${t("memoryTimeMinutes")}`;
  if (diffHour < 24) return `${diffHour} ${t("memoryTimeHours")}`;
  if (diffDay < 7) return `${diffDay} ${t("memoryTimeDays")}`;
  if (diffDay < 30) return `${Math.floor(diffDay / 7)} ${t("memoryTimeWeeks")}`;
  return date.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

export function MemoryCard({ authorName, message, createdAt, pending }: MemoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-[#f5f3ed]/5 rounded-[1.5rem] border border-[#f9a620]/15 p-5 pl-6"
    >
      <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full bg-gradient-to-b from-[#f9a620] via-[#4a7c59] to-[#b7472a]" />

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-[#f9a620]/15 border border-[#f9a620]/30 flex items-center justify-center shrink-0">
            <span className="font-merienda text-xs text-[#f9a620] font-bold">
              {authorName[0]?.toUpperCase()}
            </span>
          </div>
          <p className="font-sans text-xs uppercase tracking-[0.12em] text-[#f5f3ed]/75 font-semibold">
            {authorName}
          </p>
        </div>
        {pending && (
          <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-[#b7472a]/15 border border-[#b7472a]/30 px-2.5 py-0.5 text-[10px] font-sans text-[#e38a6e]">
            <LeafIcon size={10} className="rotate-[-20deg]" />
            {t("memoryPendingBadge")}
          </span>
        )}
      </div>

      <p className="font-sans text-sm text-[#f5f3ed]/65 italic leading-[1.8] pl-11">
        &ldquo;{message}&rdquo;
      </p>

      <p className="font-sans text-[10px] text-[#f5f3ed]/30 mt-2 pl-11">
        {getRelativeDate(createdAt)}
      </p>
    </motion.div>
  );
}
