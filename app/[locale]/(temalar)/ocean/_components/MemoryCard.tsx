"use client";

import { motion } from "framer-motion";
import { t } from "../_lib/i18n";
import { WaveIcon } from "../_icons/WaveIcon";

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
      className="relative bg-[#1a2332]/55 backdrop-blur-sm rounded-[1.25rem] border border-[#a8dadc]/15 p-5 overflow-hidden"
    >
      {/* Subtle wave edge */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-3 opacity-40">
        <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0 6 Q 25 0 50 6 T 100 6 L 100 10 L 0 10 Z" fill="#2d8b8b" fillOpacity="0.35" />
        </svg>
      </div>

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-[#2d8b8b]/25 border border-[#a8dadc]/30 flex items-center justify-center shrink-0">
            <span className="font-sans text-xs text-[#a8dadc] font-bold">
              {authorName[0]?.toUpperCase()}
            </span>
          </div>
          <p className="font-sans text-xs uppercase tracking-[0.18em] text-[#a8dadc] font-semibold">
            {authorName}
          </p>
        </div>
        {pending && (
          <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-[#2d8b8b]/20 border border-[#a8dadc]/30 px-2.5 py-0.5 text-[10px] font-sans text-[#a8dadc]">
            <WaveIcon size={10} />
            {t("memoryPendingBadge")}
          </span>
        )}
      </div>

      <p className="font-merienda text-[15px] text-[#f1faee]/80 leading-[1.7] pl-11">
        &ldquo;{message}&rdquo;
      </p>

      <p className="font-sans text-[10px] text-[#f1faee]/30 mt-2 pl-11 tracking-wide">
        {getRelativeDate(createdAt)}
      </p>
    </motion.div>
  );
}
