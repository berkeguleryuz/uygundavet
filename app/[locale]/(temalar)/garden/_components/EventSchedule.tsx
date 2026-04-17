"use client";

import { motion } from "framer-motion";
import { LeafIcon } from "../_icons/LeafIcon";

interface ScheduleItem {
  time: string;
  label: string;
}

const defaultSchedule: ScheduleItem[] = [
  { time: "17:00", label: "Karşılama" },
  { time: "18:00", label: "Nikah Töreni" },
  { time: "19:00", label: "Yemek" },
  { time: "21:00", label: "Parti & Dans" },
];

const leafColors = ["text-[#4a7c59]", "text-[#f9a620]", "text-[#b7472a]", "text-[#8ea68a]"];

interface EventScheduleProps {
  schedule?: { time: string; label: string }[];
  dark?: boolean;
}

export function EventSchedule({ schedule: propSchedule, dark = false }: EventScheduleProps) {
  const schedule = propSchedule && propSchedule.length > 0 ? propSchedule : defaultSchedule;

  return (
    <div className="w-full">
      <div className="relative">
        {/* Vertical vine stem */}
        <div
          className={`absolute top-0 bottom-0 left-[10px] w-px ${dark ? "bg-[#f9a620]/25" : "bg-[#4a7c59]/30"}`}
          aria-hidden
        />

        {schedule.map((item, index) => (
          <motion.div
            key={`${item.time}-${index}`}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="flex items-start gap-5 relative pb-7 last:pb-0"
          >
            <div
              className={`shrink-0 w-[22px] h-[22px] rounded-full border ${dark ? "bg-[#1f2a22] border-[#f9a620]/40" : "bg-[#f5f3ed] border-[#4a7c59]/40"} flex items-center justify-center relative z-10`}
            >
              <LeafIcon
                size={12}
                className={`${leafColors[index % leafColors.length]} rotate-[-20deg]`}
              />
            </div>

            <div className="flex-1 flex items-baseline gap-4 md:gap-6">
              <p
                className={`font-merienda text-base tabular-nums shrink-0 ${dark ? "text-[#f9a620]" : "text-[#4a7c59]"}`}
              >
                {item.time}
              </p>
              <div className={`h-px flex-1 ${dark ? "bg-[#f5f3ed]/15" : "bg-[#4a7c59]/15"} relative top-[-2px]`} />
              <p
                className={`font-sans text-sm tracking-wide ${dark ? "text-[#f5f3ed]/85" : "text-[#2b3628]"}`}
              >
                {item.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
