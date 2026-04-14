"use client";

import { motion } from "framer-motion";
import { t } from "../_lib/i18n";

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
      className="bg-[#1c1a1b] rounded-2xl border border-white/[0.07] p-5 relative group"
    >
      <div className="absolute top-4 right-5 font-merienda text-3xl text-[#d5d1ad]/[0.06] leading-none select-none">
        &ldquo;
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-[#d5d1ad]/10 border border-[#d5d1ad]/15 flex items-center justify-center shrink-0">
            <span className="font-merienda text-xs text-[#d5d1ad]/60">
              {authorName[0]?.toUpperCase()}
            </span>
          </div>
          <p className="font-sans text-sm font-medium text-[#d5d1ad]">
            {authorName}
          </p>
        </div>
        {pending && (
          <span className="shrink-0 inline-flex items-center rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10px] font-sans text-amber-400/80">
            {t("memoryPendingBadge")}
          </span>
        )}
      </div>

      <p className="font-sans text-sm text-white/75 mt-3 leading-[1.7] pl-11">
        {message}
      </p>

      <p className="font-sans text-[10px] text-white/35 mt-3 pl-11">
        {getRelativeDate(createdAt)}
      </p>
    </motion.div>
  );
}
