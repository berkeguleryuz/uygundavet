"use client";

import { motion } from "framer-motion";
import { t } from "../_lib/i18n";
import { SunIcon } from "../_icons/SunIcon";

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
      className="relative bg-[#4a403a]/40 backdrop-blur-sm rounded-[1.25rem] border border-[#f4a900]/20 p-5 overflow-hidden"
    >
      {/* Wax-seal-like accent at top-right */}
      <div
        aria-hidden
        className="absolute -top-3 -right-3 w-14 h-14 rounded-full bg-gradient-to-br from-[#c1666b] to-[#8a3e43] shadow-lg flex items-center justify-center opacity-30"
      >
        <SunIcon size={16} className="text-[#f4a900]" />
      </div>

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-[#f4a900]/20 border border-[#f4a900]/40 flex items-center justify-center shrink-0">
            <span className="font-merienda text-xs text-[#f4a900] font-bold">
              {authorName[0]?.toUpperCase()}
            </span>
          </div>
          <p className="font-sans text-xs uppercase tracking-[0.15em] text-[#d4b896] font-bold">
            {authorName}
          </p>
        </div>
        {pending && (
          <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-[#c1666b]/20 border border-[#c1666b]/35 px-2.5 py-0.5 text-[10px] font-sans text-[#e69397] z-10">
            <SunIcon size={10} />
            {t("memoryPendingBadge")}
          </span>
        )}
      </div>

      <p className="font-merienda text-[15px] text-[#faf5ec]/85 leading-[1.7] pl-11">
        &ldquo;{message}&rdquo;
      </p>

      <p className="font-sans text-[10px] text-[#d4b896]/40 mt-2 pl-11 tracking-wide">
        {getRelativeDate(createdAt)}
      </p>
    </motion.div>
  );
}
